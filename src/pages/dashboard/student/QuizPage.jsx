import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../api/axios';
import { ArrowRight, Clock, CheckCircle2, XCircle } from 'lucide-react';

const QuizPage = () => {
  const { slug, quizId } = useParams();
  const navigate = useNavigate();
  const isTrial = window.location.pathname.includes('/trial/');
  
  const [quizData, setQuizData] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { question_id: [choice_ids] }
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); 
  
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initial fetch could check if they already completed or just show start screen
  useEffect(() => {
    // We could fetch quiz info here before starting, but we can also just start it when they click
    // However we need title/description. For now, we wait for them to click "Start"
  }, [slug, quizId]);

  useEffect(() => {
    let timer;
    if (started && !finished && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (started && timeLeft === 0 && !finished && quizData?.time_limit_minutes > 0) {
      handleFinish(); // time's up
    }
    return () => clearInterval(timer);
  }, [started, finished, timeLeft, quizData]);

  const handleStart = async () => {
    try {
      setLoading(true);
      setError('');
      const endpoint = isTrial 
        ? `/modules/${slug}/quizzes/${quizId}/public_start/`
        : `/modules/${slug}/quizzes/${quizId}/start/`;
        
      const res = isTrial ? await api.get(endpoint) : await api.post(endpoint);
      
      if (!isTrial) {
        setAttemptId(res.data.attempt_id);
      }
      setQuizData(res.data.quiz);
      if (res.data.quiz.time_limit_minutes > 0) {
        setTimeLeft(res.data.quiz.time_limit_minutes * 60);
      } else {
        setTimeLeft(-1); // no limit
      }
      setStarted(true);
    } catch (err) {
      setError(err.response?.data?.error || "تعذر بدء الاختبار. تأكد من أنك لم تتجاوز عدد المحاولات المسموح بها.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionId, choiceId, type) => {
    const current = selectedAnswers[questionId] || [];
    if (type === 'MCQ' || type === 'TRUE_FALSE') {
      setSelectedAnswers({ ...selectedAnswers, [questionId]: [choiceId] });
    } else if (type === 'MULTI') {
      if (current.includes(choiceId)) {
        setSelectedAnswers({ ...selectedAnswers, [questionId]: current.filter(c => c !== choiceId) });
      } else {
        setSelectedAnswers({ ...selectedAnswers, [questionId]: [...current, choiceId] });
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setFinished(true);
    try {
      setLoading(true);
      const answersList = Object.keys(selectedAnswers).map(qId => ({
        question_id: parseInt(qId),
        choice_ids: selectedAnswers[qId]
      }));
      
      const endpoint = isTrial 
        ? `/modules/${slug}/quizzes/${quizId}/public_submit/`
        : `/modules/${slug}/quizzes/${quizId}/submit/`;
        
      const payload = isTrial 
        ? { answers: answersList }
        : { attempt_id: attemptId, answers: answersList };
        
      const res = await api.post(endpoint, payload);
      setResultData(res.data);
    } catch (err) {
      setError("حدث خطأ أثناء إرسال الإجابات.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (sec) => {
    if (sec < 0) return "--:--";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <Link 
          to={isTrial ? `/modules/${slug}/trial` : `/dashboard/student/modules/${slug}`} 
          className="self-start text-gray-400 hover:text-white flex items-center gap-2 mb-8"
        >
          <ArrowRight size={20} /> {isTrial ? 'العودة للتجربة المجانية' : 'العودة للمنهج'}
        </Link>
        <div className="bg-bgPurple p-12 rounded-3xl border border-white/5 max-w-lg w-full">
          <h2 className="text-3xl font-black text-white mb-4">بدء الاختبار</h2>
          <p className="text-gray-400 font-bold mb-4">بمجرد الضغط على زر البدء، سيبدأ حساب الوقت.</p>
          {error && <div className="text-red-400 bg-red-400/10 p-3 rounded-lg mb-4">{error}</div>}
          <button 
            onClick={handleStart}
            disabled={loading}
            className="w-full py-4 bg-accentGold text-bgDark font-black rounded-xl text-xl hover:scale-105 transition shadow-[0_0_15px_rgba(245,197,24,0.3)] disabled:opacity-50"
          >
            {loading ? "جاري التحميل..." : "ابدأ الاختبار"}
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    if (loading) {
      return <div className="text-center p-12 text-white font-bold">جاري تصحيح الإجابات...</div>;
    }
    
    if (!resultData) {
      return <div className="text-center p-12 text-red-400 font-bold">{error}</div>;
    }

    // Normalize score: student flow returns `score`, trial flow returns `score_percentage`
    const score = resultData.score ?? resultData.score_percentage;
    const { passed, total_points_earned, total_points_possible } = resultData;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="bg-bgPurple p-12 rounded-3xl border border-white/5 max-w-lg w-full">
          {passed ? (
            <CheckCircle2 className="w-24 h-24 text-green-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]" />
          ) : (
            <XCircle className="w-24 h-24 text-red-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(248,113,113,0.4)]" />
          )}
          <h2 className="text-3xl font-black text-white mb-2">النتيجة النهائية</h2>
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300 mb-2">
            {typeof score === 'number' ? score.toFixed(1) : '0.0'}%
          </div>
          <p className="text-gray-400 font-bold mb-2">
            النقاط: {total_points_earned} من {total_points_possible}
          </p>
          <p className="text-white font-bold mb-8 text-lg">
            {passed ? '🎉 مبروك! لقد اجتزت الاختبار بنجاح.' : '😔 للأسف لم تجتز الاختبار. لا تستسلم!'}
          </p>
          {isTrial ? (
            <Link 
              to={`/modules/${slug}/trial`}
              className="w-full py-4 bg-accentGold text-bgDark font-black rounded-xl inline-block hover:brightness-110 transition mb-3"
            >
              العودة للتجربة المجانية
            </Link>
          ) : (
            <Link 
              to={`/dashboard/student/modules/${slug}`}
              className="w-full py-4 bg-white/10 text-white border border-white/20 font-bold rounded-xl inline-block hover:bg-white/20 transition"
            >
              العودة للمنهج
            </Link>
          )}
          {isTrial && (
            <Link 
              to={`/modules/${slug}`}
              className="w-full py-4 bg-white/10 text-white border border-white/20 font-bold rounded-xl inline-block hover:bg-white/20 transition"
            >
              سجّل الآن في البرنامج 🚀
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!quizData?.questions || quizData.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="bg-bgPurple p-12 rounded-3xl border border-white/5 max-w-lg w-full">
          <h2 className="text-3xl font-black text-white mb-4">لا توجد أسئلة</h2>
          <p className="text-gray-400 font-bold mb-8">هذا الاختبار لا يحتوي على أي أسئلة حالياً.</p>
          <Link 
            to={isTrial ? `/modules/${slug}/trial` : `/dashboard/student/modules/${slug}`}
            className="w-full py-4 bg-white/10 text-white border border-white/20 font-bold rounded-xl inline-block hover:bg-white/20 transition"
          >
            العودة
          </Link>
        </div>
      </div>
    );
  }

  const q = quizData.questions[currentQuestion];
  const qId = q.id;
  const currentSelection = selectedAnswers[qId] || [];

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-white">{quizData.title}</h2>
        {timeLeft >= 0 && (
          <div className="flex items-center gap-2 bg-bgPurple px-4 py-2 rounded-lg border border-white/10 text-accentGold font-bold font-mono text-xl">
            <Clock size={20} /> {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="bg-bgPurple p-8 rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-400 font-bold">السؤال {currentQuestion + 1} من {quizData.questions.length}</div>
          <div className="text-accentGold text-sm font-bold bg-accentGold/10 px-3 py-1 rounded-full">{q.points} نقاط</div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed">{q.text}</h3>

        <div className="space-y-4 mb-10">
          {q.choices.map((opt) => {
            const isSelected = currentSelection.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(qId, opt.id, q.question_type)}
                className={`w-full text-right p-4 rounded-xl border-2 transition-all font-bold text-lg ${
                  isSelected
                    ? 'border-accentGold bg-accentGold/10 text-accentGold'
                    : 'border-white/5 bg-bgDark text-gray-300 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {opt.text}
              </button>
            )
          })}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-white/5">
          <button 
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 rounded-lg text-gray-400 font-bold hover:text-white disabled:opacity-30 transition"
          >
            السابق
          </button>
          <button 
            onClick={handleNext}
            disabled={currentSelection.length === 0}
            className="px-8 py-3 rounded-xl bg-white text-bgDark font-black hover:bg-gray-200 transition disabled:opacity-50"
          >
            {currentQuestion === quizData.questions.length - 1 ? 'إنهاء الاختبار' : 'التالي'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
