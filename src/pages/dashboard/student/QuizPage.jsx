import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle2, XCircle } from 'lucide-react';

const QuizPage = () => {
  const { slug, quizId } = useParams();
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins

  // Mock quiz data
  const quiz = {
    title: 'اختبار الأسبوع الأول',
    questions: [
      { id: 1, text: 'ما هو الهدف الأساسي من هذا البرنامج؟', options: ['الحفظ فقط', 'تطوير المهارات الحياتية', 'النجاح في المدرسة', 'لا شيء مما سبق'], correct: 1 },
      { id: 2, text: 'كم عدد الجلسات الموصى بها أسبوعياً؟', options: ['جلسة واحدة', 'جلستان', 'ثلاث جلسات', 'يومياً'], correct: 1 },
    ]
  };

  useEffect(() => {
    let timer;
    if (started && !finished && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !finished) {
      handleFinish();
    }
    return () => clearInterval(timer);
  }, [started, finished, timeLeft]);

  const handleSelect = (idx) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: idx });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setFinished(true);
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Link to={`/dashboard/student/modules/${slug}`} className="self-start text-gray-400 hover:text-white flex items-center gap-2 mb-8">
          <ArrowRight size={20} /> عودة للمحتوى
        </Link>
        <div className="bg-bgPurple p-12 rounded-3xl border border-white/5 max-w-lg w-full">
          <h2 className="text-3xl font-black text-white mb-4">{quiz.title}</h2>
          <p className="text-gray-400 font-bold mb-8">أنت على وشك بدء الاختبار. لديك 15 دقيقة لإتمامه.</p>
          <button 
            onClick={() => setStarted(true)}
            className="w-full py-4 bg-accentGold text-bgDark font-black rounded-xl text-xl hover:scale-105 transition shadow-[0_0_15px_rgba(245,197,24,0.3)]"
          >
            بدء الاختبار الآن
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const score = calculateScore();
    const percent = Math.round((score / quiz.questions.length) * 100);
    const passed = percent >= 50;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-bgPurple p-12 rounded-3xl border border-white/5 max-w-lg w-full">
          {passed ? (
            <CheckCircle2 className="w-24 h-24 text-green-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]" />
          ) : (
            <XCircle className="w-24 h-24 text-red-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(248,113,113,0.4)]" />
          )}
          <h2 className="text-3xl font-black text-white mb-2">النتيجة النهائية</h2>
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300 mb-6">
            {score} / {quiz.questions.length}
          </div>
          <p className="text-gray-400 font-bold mb-8 text-lg">
            {passed ? 'أحسنت! أداء ممتاز.' : 'حاول مرة أخرى لمراجعة المفاهيم.'}
          </p>
          <Link 
            to={`/dashboard/student/modules/${slug}`}
            className="w-full py-4 bg-white/10 text-white border border-white/20 font-bold rounded-xl inline-block hover:bg-white/20 transition"
          >
            العودة للمحتوى
          </Link>
        </div>
      </div>
    );
  }

  const q = quiz.questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-white">{quiz.title}</h2>
        <div className="flex items-center gap-2 bg-bgPurple px-4 py-2 rounded-lg border border-white/10 text-accentGold font-bold font-mono text-xl">
          <Clock size={20} /> {formatTime(timeLeft)}
        </div>
      </div>

      <div className="bg-bgPurple p-8 rounded-3xl border border-white/5 shadow-2xl">
        <div className="text-gray-400 font-bold mb-4">سؤال {currentQuestion + 1} من {quiz.questions.length}</div>
        <h3 className="text-2xl font-bold text-white mb-8">{q.text}</h3>

        <div className="space-y-4 mb-10">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-right p-4 rounded-xl border-2 transition-all font-bold text-lg ${
                selectedAnswers[currentQuestion] === idx 
                  ? 'border-accentGold bg-accentGold/10 text-accentGold'
                  : 'border-white/5 bg-bgDark text-gray-300 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              {opt}
            </button>
          ))}
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
            disabled={selectedAnswers[currentQuestion] === undefined}
            className="px-8 py-3 rounded-xl bg-white text-bgDark font-black hover:bg-gray-200 transition disabled:opacity-50"
          >
            {currentQuestion === quiz.questions.length - 1 ? 'إنهاء الاختبار' : 'التالي'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
