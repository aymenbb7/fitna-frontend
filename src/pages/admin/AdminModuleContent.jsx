import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { BookOpen, FolderPlus, Plus, ChevronDown, ChevronRight, Video, FileText, Mic, Image as ImageIcon, PlayCircle, Trash2, Edit, CheckSquare } from 'lucide-react';
import api, { getMediaUrl } from '../../api/axios';
import { AddResourceModal } from '../../components/admin/modals/AddResourceModal';
import { UpdateModuleModal } from '../../components/admin/modals/UpdateModuleModal';

const AdminModuleContent = () => {
  const { slug } = useParams();
  const [module, setModule] = useState(null);
  const [sections, setSections] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [activeLesson, setActiveLesson] = useState(null);
  const [showQuizzes, setShowQuizzes] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Assuming GET /api/v1/modules/<slug>/ returns module detail
      const modRes = await api.get(`/modules/${slug}/`);
      setModule(modRes.data);
      
      // Fetch sections (nested with lessons)
      const secRes = await api.get(`/modules/${slug}/sections/`);
      setSections(secRes.data);
      
      const quizRes = await api.get(`/modules/${slug}/quizzes/`);
      setQuizzes(quizRes.data);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSection = async () => {
    const title = window.prompt("اسم القسم الجديد:");
    if (!title) return;
    try {
      await api.post(`/modules/${slug}/sections/`, { title });
      fetchData();
    } catch (err) {
      alert("حدث خطأ أثناء إضافة القسم");
    }
  };

  const handleAddLesson = async (sectionId) => {
    const title = window.prompt("اسم الدرس الجديد:");
    if (!title) return;
    try {
      await api.post(`/modules/${slug}/lessons/`, { title, section: sectionId });
      fetchData();
    } catch (err) {
      alert("حدث خطأ أثناء إضافة الدرس");
    }
  };

  const toggleLessonPreview = async (e, lesson) => {
    e.stopPropagation();
    try {
      await api.patch(`/modules/${slug}/lessons/${lesson.id}/`, { is_preview: !lesson.is_preview });
      fetchData();
    } catch (err) {
      alert("حدث خطأ أثناء تعديل حالة التجربة المجانية");
    }
  };

  const handleDeleteSection = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("هل أنت متأكد من حذف هذا القسم وكل ما يحتويه؟")) return;
    try {
      await api.delete(`/modules/${slug}/sections/${id}/`);
      if (activeLesson?.section === id) setActiveLesson(null);
      fetchData();
    } catch (err) {
      alert("خطأ أثناء الحذف");
    }
  };

  const handleDeleteLesson = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("هل أنت متأكد من حذف هذا الدرس وكل محتواه؟")) return;
    try {
      await api.delete(`/modules/${slug}/lessons/${id}/`);
      if (activeLesson?.id === id) setActiveLesson(null);
      fetchData();
    } catch (err) {
      alert("خطأ أثناء الحذف");
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-400 font-bold">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/admin/modules" className="text-gray-400 hover:text-white transition p-2 bg-bgPurple rounded-full border border-white/5">
            <ChevronRight size={20} />
          </Link>
          <h2 className="text-3xl font-black text-white">المحتوى: {module?.name}</h2>
        </div>
        <Button variant="secondary" onClick={() => setIsUpdateModalOpen(true)} className="flex items-center gap-2 w-fit">
          <Edit size={18} />
          إعدادات الوحدة
        </Button>
      </div>
      
      <UpdateModuleModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        module={module}
        onSuccess={() => { fetchData(); setIsUpdateModalOpen(false); }}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar for Sections & Lessons */}
        <div className="lg:col-span-1 bg-bgPurple rounded-3xl border border-white/5 p-6 h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen size={20} className="text-accentGold" />
              المنهج الدراسي
            </h3>
            <button onClick={handleAddSection} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-accentGold hover:bg-accentGold hover:text-bgDark transition">
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {sections.length === 0 ? (
              <div className="text-center p-6 text-gray-500 text-sm border border-dashed border-white/10 rounded-xl">
                لا توجد أقسام بعد. أضف القسم الأول للبدء.
              </div>
            ) : (
              sections.map(section => (
                <div key={section.id} className="bg-bgDark rounded-xl border border-white/5 overflow-hidden transition hover:border-white/10">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer select-none group"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedSections[section.id] ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                      <span className="font-bold text-white">{section.title}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={(e) => { e.stopPropagation(); handleAddLesson(section.id); }} className="text-green-400 hover:text-green-300" title="إضافة درس">
                        <Plus size={16} />
                      </button>
                      <button onClick={(e) => handleDeleteSection(e, section.id)} className="text-red-400 hover:text-red-300" title="حذف القسم">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {expandedSections[section.id] && (
                    <div className="border-t border-white/5 bg-black/20 p-2 space-y-1">
                      {section.lessons?.length === 0 ? (
                        <div className="text-center p-4 text-gray-500 text-xs">لا توجد دروس في هذا القسم.</div>
                      ) : (
                        section.lessons?.map(lesson => (
                          <div 
                            key={lesson.id}
                            onClick={() => { setActiveLesson({ ...lesson, section_id: section.id }); setShowQuizzes(false); }}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition group ${activeLesson?.id === lesson.id && !showQuizzes ? 'bg-accentGold/10 border border-accentGold/30 text-accentGold' : 'hover:bg-white/5 text-gray-300'}`}
                          >
                            <span className="text-sm font-bold truncate pr-2">{lesson.title}</span>
                            <div className="flex items-center gap-2">
                              {lesson.is_preview && <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">مجاني</span>}
                              <button onClick={(e) => toggleLessonPreview(e, lesson)} className="text-yellow-400/50 hover:text-yellow-400 opacity-0 group-hover:opacity-100 transition shrink-0" title="تفعيل/إلغاء التجربة المجانية">
                                <PlayCircle size={14} />
                              </button>
                              <button onClick={(e) => handleDeleteLesson(e, lesson.id)} className="text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition shrink-0" title="حذف الدرس">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <div 
              onClick={() => { setShowQuizzes(true); setActiveLesson(null); }}
              className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition group border ${showQuizzes ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-bgDark border-white/5 hover:border-white/10 text-white'}`}
            >
              <div className="flex items-center gap-3">
                <CheckSquare size={18} className={showQuizzes ? 'text-yellow-400' : 'text-gray-400'} />
                <span className="font-bold">الاختبارات ({quizzes.length})</span>
              </div>
              <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition" />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 bg-bgPurple rounded-3xl border border-white/5 p-6 h-[70vh] flex flex-col">
          {showQuizzes ? (
            <div className="flex-1 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6 shrink-0">
                <div>
                  <h3 className="text-2xl font-black text-white mb-1">الاختبارات</h3>
                  <p className="text-sm text-gray-400">إدارة اختبارات الوحدة التدريبية</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {quizzes.length === 0 ? (
                  <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-bgDark">
                    <p className="text-gray-500 mb-4">لا توجد اختبارات في هذه الوحدة.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quizzes.map(q => (
                      <div key={q.id} className="bg-bgDark p-6 rounded-xl border border-white/5 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-white mb-1">{q.title}</h4>
                          <p className="text-xs text-gray-400">الأسئلة: {q.questions?.length || 0} | الحد الأدنى: {q.passing_score}%</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${q.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {q.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : !activeLesson ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <FolderPlus size={64} className="mb-4 text-white/10" />
              <p className="text-lg font-bold">اختر درساً من القائمة لعرض وإدارة محتوياته</p>
              <p className="text-sm mt-2">يمكنك إضافة فيديوهات، ملفات PDF، تسجيلات صوتية، صور والمزيد.</p>
            </div>
          ) : (
            <LessonContentManager lesson={activeLesson} moduleSlug={slug} refreshTree={fetchData} />
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component for managing a specific lesson's content
const QuizBuilder = ({ lesson, moduleSlug }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null); // null = list view
  const [editingQuiz, setEditingQuiz] = useState(null); // null = not editing quiz header
  const [editingQuestion, setEditingQuestion] = useState(null); // null = not editing a question
  const [loading, setLoading] = useState(false);

  // Quiz form state
  const emptyQuizForm = { title: '', description: '', time_limit_minutes: 0, passing_score: 70, is_active: true };
  const [quizForm, setQuizForm] = useState(emptyQuizForm);

  // Question form state
  const emptyQForm = {
    text: '', question_type: 'MCQ', points: 1, explanation: '',
    choices: [
      { text: '', is_correct: false },
      { text: '', is_correct: false },
      { text: '', is_correct: false },
      { text: '', is_correct: false },
    ]
  };
  const [questionForm, setQuestionForm] = useState(emptyQForm);
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/modules/${moduleSlug}/quizzes/`);
      const lessonQuizzes = res.data.filter(q => q.lesson === lesson.id);
      setQuizzes(lessonQuizzes);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchQuestions = async (quizId) => {
    setQuestionsLoading(true);
    try {
      const res = await api.get(`/modules/${moduleSlug}/quizzes/${quizId}/questions/`);
      setQuestions(res.data);
    } catch (err) { console.error(err); }
    finally { setQuestionsLoading(false); }
  };

  useEffect(() => { fetchQuizzes(); }, [lesson.id]);

  useEffect(() => {
    if (activeQuiz) fetchQuestions(activeQuiz.id);
  }, [activeQuiz]);

  const handleCreateQuiz = async () => {
    if (!quizForm.title.trim()) return alert('أدخل عنوان الاختبار');
    try {
      await api.post(`/modules/${moduleSlug}/quizzes/`, { ...quizForm, lesson: lesson.id });
      setQuizForm(emptyQuizForm);
      setEditingQuiz(null);
      fetchQuizzes();
    } catch (err) { alert('خطأ أثناء إنشاء الاختبار'); }
  };

  const handleUpdateQuiz = async () => {
    try {
      await api.patch(`/modules/${moduleSlug}/quizzes/${editingQuiz.id}/`, quizForm);
      setEditingQuiz(null);
      fetchQuizzes();
      setActiveQuiz(prev => ({ ...prev, ...quizForm }));
    } catch (err) { alert('خطأ أثناء التحديث'); }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الاختبار؟')) return;
    try {
      await api.delete(`/modules/${moduleSlug}/quizzes/${id}/`);
      if (activeQuiz?.id === id) setActiveQuiz(null);
      fetchQuizzes();
    } catch (err) { alert('خطأ أثناء الحذف'); }
  };

  const handleSetCorrectChoice = (index) => {
    setQuestionForm(prev => ({
      ...prev,
      choices: prev.choices.map((c, i) => ({ ...c, is_correct: i === index }))
    }));
  };

  const handleChoiceText = (index, text) => {
    setQuestionForm(prev => ({
      ...prev,
      choices: prev.choices.map((c, i) => i === index ? { ...c, text } : c)
    }));
  };

  const handleCreateQuestion = async () => {
    const { text, choices, question_type, points, explanation } = questionForm;
    if (!text.trim()) return alert('أدخل نص السؤال');
    if (choices.some(c => !c.text.trim())) return alert('أدخل نص جميع الخيارات');
    if (!choices.some(c => c.is_correct)) return alert('اختر الإجابة الصحيحة');
    try {
      const qRes = await api.post(`/modules/${moduleSlug}/quizzes/${activeQuiz.id}/questions/`, {
        text, question_type, points, explanation, display_order: questions.length
      });
      const qId = qRes.data.id;
      // Create 4 choices via the answer choices endpoint
      await Promise.all(choices.map((c, i) =>
        api.post(`/modules/${moduleSlug}/quizzes/${activeQuiz.id}/questions/${qId}/choices/`, {
          text: c.text, is_correct: c.is_correct, display_order: i
        })
      ));
      setQuestionForm(emptyQForm);
      setEditingQuestion(null);
      fetchQuestions(activeQuiz.id);
    } catch (err) { console.error(err); alert('خطأ أثناء إضافة السؤال'); }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm('حذف هذا السؤال؟')) return;
    try {
      await api.delete(`/modules/${moduleSlug}/quizzes/${activeQuiz.id}/questions/${qId}/`);
      fetchQuestions(activeQuiz.id);
    } catch (err) { alert('خطأ أثناء الحذف'); }
  };

  // ==== QUIZ LIST VIEW ====
  if (!activeQuiz && !editingQuiz) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <span className="text-gray-400 text-sm font-bold">اختبارات هذا الدرس ({quizzes.length})</span>
          <button
            onClick={() => { setQuizForm(emptyQuizForm); setEditingQuiz('new'); }}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl font-bold text-sm hover:bg-yellow-500 hover:text-bgDark transition"
          >
            <Plus size={16} /> إنشاء اختبار جديد
          </button>
        </div>
        {loading ? (
          <div className="text-center p-8 text-gray-500">جاري التحميل...</div>
        ) : quizzes.length === 0 ? (
          <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-bgDark flex-1 flex flex-col items-center justify-center">
            <CheckSquare size={40} className="text-white/10 mb-4" />
            <p className="text-gray-500 mb-4">لا توجد اختبارات لهذا الدرس.</p>
            <button onClick={() => { setQuizForm(emptyQuizForm); setEditingQuiz('new'); }} className="px-6 py-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl font-bold text-sm hover:bg-yellow-500 hover:text-bgDark transition">إنشاء اختبار</button>
          </div>
        ) : (
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
            {quizzes.map(q => (
              <div key={q.id} className="bg-bgDark p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-white">{q.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${q.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{q.is_active ? 'نشط' : 'مسودة'}</span>
                  </div>
                  <p className="text-xs text-gray-500">{q.passing_score}% للنجاح · {q.time_limit_minutes > 0 ? `${q.time_limit_minutes} دقيقة` : 'بدون حد زمني'}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition shrink-0">
                  <button onClick={() => setActiveQuiz(q)} className="px-3 py-1.5 bg-accentGold/10 text-accentGold border border-accentGold/20 rounded-lg text-xs font-bold hover:bg-accentGold hover:text-bgDark transition">الأسئلة</button>
                  <button onClick={() => { setEditingQuiz(q); setQuizForm({ title: q.title, description: q.description, time_limit_minutes: q.time_limit_minutes, passing_score: q.passing_score, is_active: q.is_active }); }} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition"><Edit size={14} /></button>
                  <button onClick={() => handleDeleteQuiz(q.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==== QUIZ FORM (Create / Edit) ====
  if (editingQuiz) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6 shrink-0">
          <button onClick={() => setEditingQuiz(null)} className="text-gray-400 hover:text-white transition"><ChevronRight size={20} /></button>
          <h4 className="font-black text-white text-lg">{editingQuiz === 'new' ? 'إنشاء اختبار جديد' : 'تعديل الاختبار'}</h4>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
          <div>
            <label className="block text-xs text-gray-400 font-bold mb-1">عنوان الاختبار *</label>
            <input value={quizForm.title} onChange={e => setQuizForm(p => ({...p, title: e.target.value}))} placeholder="مثال: اختبار الوحدة الأولى" className="w-full bg-bgDark border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:border-accentGold/50 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 font-bold mb-1">وصف الاختبار (اختياري)</label>
            <textarea value={quizForm.description} onChange={e => setQuizForm(p => ({...p, description: e.target.value}))} rows={2} placeholder="وصف مختصر..." className="w-full bg-bgDark border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:border-accentGold/50 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 font-bold mb-1">الحد الزمني (دقائق) · 0 = بدون حد</label>
              <input type="number" min="0" value={quizForm.time_limit_minutes} onChange={e => setQuizForm(p => ({...p, time_limit_minutes: parseInt(e.target.value)}))} className="w-full bg-bgDark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accentGold/50 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 font-bold mb-1">درجة النجاح (%)</label>
              <input type="number" min="0" max="100" value={quizForm.passing_score} onChange={e => setQuizForm(p => ({...p, passing_score: parseInt(e.target.value)}))} className="w-full bg-bgDark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accentGold/50 text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setQuizForm(p => ({...p, is_active: !p.is_active}))} className={`w-12 h-6 rounded-full transition relative shrink-0 ${quizForm.is_active ? 'bg-green-500' : 'bg-white/10'}`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${quizForm.is_active ? 'left-6' : 'left-0.5'}`} />
            </button>
            <span className="text-sm text-gray-300 font-bold">{quizForm.is_active ? 'مرئي للطلاب' : 'مخفي (مسودة)'}</span>
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t border-white/5 shrink-0 mt-4">
          <button onClick={() => setEditingQuiz(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition text-sm">إلغاء</button>
          <button onClick={editingQuiz === 'new' ? handleCreateQuiz : handleUpdateQuiz} className="flex-1 py-3 rounded-xl bg-accentGold text-bgDark font-black hover:brightness-110 transition text-sm">{editingQuiz === 'new' ? 'إنشاء الاختبار' : 'حفظ التغييرات'}</button>
        </div>
      </div>
    );
  }

  // ==== QUESTIONS VIEW (inside a quiz) ====
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <button onClick={() => { setActiveQuiz(null); setEditingQuestion(null); }} className="text-gray-400 hover:text-white transition"><ChevronRight size={20} /></button>
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-white">{activeQuiz.title}</h4>
          <p className="text-xs text-gray-500">{questions.length} أسئلة · {activeQuiz.passing_score}% للنجاح</p>
        </div>
        <button onClick={() => { setEditingQuestion('new'); setQuestionForm(emptyQForm); }} className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl font-bold text-xs hover:bg-yellow-500 hover:text-bgDark transition shrink-0">
          <Plus size={14} /> إضافة سؤال
        </button>
      </div>

      {/* New / Edit Question Form */}
      {editingQuestion && (
        <div className="bg-bgDark rounded-xl border border-accentGold/20 p-4 mb-4 shrink-0 space-y-3">
          <h5 className="font-bold text-accentGold text-sm mb-2">سؤال جديد</h5>
          <div>
            <label className="block text-xs text-gray-400 font-bold mb-1">نص السؤال *</label>
            <textarea value={questionForm.text} onChange={e => setQuestionForm(p => ({...p, text: e.target.value}))} rows={2} placeholder="أدخل نص السؤال..." className="w-full bg-bgPurple border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:border-accentGold/50 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {questionForm.choices.map((choice, i) => (
              <div key={i} className={`flex items-center gap-2 p-2 rounded-xl border transition cursor-pointer ${choice.is_correct ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 bg-bgPurple'}`} onClick={() => handleSetCorrectChoice(i)}>
                <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${choice.is_correct ? 'border-green-400 bg-green-400' : 'border-white/20'}`}>
                  {choice.is_correct && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <input
                  value={choice.text}
                  onChange={e => handleChoiceText(i, e.target.value)}
                  onClick={e => e.stopPropagation()}
                  placeholder={`الخيار ${i + 1}`}
                  className="flex-1 bg-transparent text-white placeholder-gray-600 focus:outline-none text-xs font-bold"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">انقر على الخيار لتحديده كالإجابة الصحيحة</p>
          <div>
            <label className="block text-xs text-gray-400 font-bold mb-1">شرح الإجابة (يظهر بعد التقديم - اختياري)</label>
            <input value={questionForm.explanation} onChange={e => setQuestionForm(p => ({...p, explanation: e.target.value}))} placeholder="اشرح لماذا هذه الإجابة صحيحة..." className="w-full bg-bgPurple border border-white/10 rounded-xl p-2 text-white placeholder-gray-600 focus:outline-none focus:border-accentGold/50 text-xs" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setEditingQuestion(null)} className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition text-xs">إلغاء</button>
            <button onClick={handleCreateQuestion} className="flex-1 py-2 rounded-lg bg-accentGold text-bgDark font-black hover:brightness-110 transition text-xs">إضافة السؤال</button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {questionsLoading ? (
          <div className="text-center p-8 text-gray-500">جاري التحميل...</div>
        ) : questions.length === 0 ? (
          <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-bgDark text-gray-500">
            <p>لا توجد أسئلة في هذا الاختبار بعد.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, index) => (
              <div key={q.id} className="bg-bgDark p-4 rounded-xl border border-white/5 group hover:border-white/10 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-accentGold font-bold bg-accentGold/10 px-2 py-0.5 rounded-full">س{index + 1}</span>
                      <span className="text-xs text-gray-500">{q.points} نقاط</span>
                    </div>
                    <p className="text-white font-bold text-sm mb-3">{q.text}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.choices?.map(c => (
                        <div key={c.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${c.is_correct ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/3 text-gray-400'}`}>
                          {c.is_correct && <span>✓</span>} {c.text}
                        </div>
                      ))}
                    </div>
                    {q.explanation && <p className="text-xs text-gray-500 mt-2 italic">💡 {q.explanation}</p>}
                  </div>
                  <button onClick={() => handleDeleteQuestion(q.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition opacity-0 group-hover:opacity-100 shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const LessonContentManager = ({ lesson, moduleSlug, refreshTree }) => {
  const [activeTab, setActiveTab] = useState('videos');
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const tabs = [
    { id: 'videos', label: 'فيديوهات مسجلة', icon: <PlayCircle size={16} /> },
    { id: 'documents', label: 'ملفات PDF', icon: <FileText size={16} /> },
    { id: 'sessions', label: 'حصص مباشرة', icon: <Video size={16} /> },
    { id: 'voice_messages', label: 'صوتيات', icon: <Mic size={16} /> },
    { id: 'photos', label: 'صور', icon: <ImageIcon size={16} /> },
    { id: 'quizzes', label: 'الاختبارات', icon: <CheckSquare size={16} /> },
  ];

  useEffect(() => {
    if (activeTab !== 'quizzes') fetchContent();
  }, [lesson.id, activeTab]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      if (activeTab === 'videos') endpoint = `/modules/${moduleSlug}/videos/`;
      if (activeTab === 'documents') endpoint = `/modules/${moduleSlug}/documents/`;
      if (activeTab === 'sessions') endpoint = `/modules/${moduleSlug}/sessions/`;
      if (activeTab === 'voice_messages') endpoint = `/modules/${moduleSlug}/voice/`;
      if (activeTab === 'photos') endpoint = `/modules/${moduleSlug}/photos/`;

      const res = await api.get(endpoint);
      setContent(res.data.filter(item => item.lesson === lesson.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    let endpoint = '';
    if (activeTab === 'videos') endpoint = `/modules/${moduleSlug}/videos/${id}/`;
    if (activeTab === 'documents') endpoint = `/modules/${moduleSlug}/documents/${id}/`;
    if (activeTab === 'sessions') endpoint = `/modules/${moduleSlug}/sessions/${id}/`;
    if (activeTab === 'voice_messages') endpoint = `/modules/${moduleSlug}/voice/${id}/`;
    if (activeTab === 'photos') endpoint = `/modules/${moduleSlug}/photos/${id}/`;
    try {
      await api.delete(endpoint);
      fetchContent();
    } catch (err) {
      alert("خطأ أثناء الحذف");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h3 className="text-2xl font-black text-white mb-1">{lesson.title}</h3>
          <p className="text-sm text-gray-400">إدارة موارد وملفات هذا الدرس</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await api.patch(`/modules/${moduleSlug}/lessons/${lesson.id}/`, { is_preview: !lesson.is_preview });
                lesson.is_preview = !lesson.is_preview;
                refreshTree();
              } catch (err) {
                alert("خطأ أثناء التحديث");
              }
            }}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 border ${
              lesson.is_preview
                ? 'bg-green-500/20 text-green-400 border-green-500/50'
                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {lesson.is_preview ? '✓ متاح كتجربة مجانية' : 'متاح للتجربة المجانية'}
          </button>
          {activeTab !== 'quizzes' && (
            <Button onClick={() => setShowAddModal(true)} variant="primary" className="gap-2">
              <Plus size={18} /> إضافة مورد
            </Button>
          )}
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-4 mb-4 shrink-0 hide-scrollbar border-b border-white/5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-accentGold/10 text-accentGold border border-accentGold/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'quizzes' ? (
          <QuizBuilder lesson={lesson} moduleSlug={moduleSlug} />
        ) : loading ? (
          <div className="text-center p-8 text-gray-500">جاري التحميل...</div>
        ) : content.length === 0 ? (
          <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-bgDark">
            <p className="text-gray-500 mb-4">لا توجد موارد من هذا النوع في هذا الدرس.</p>
            <Button onClick={() => setShowAddModal(true)} variant="secondary" className="mx-auto">إضافة الآن</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.map(item => (
              <div key={item.id} className="bg-bgDark p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                    {activeTab === 'videos' && <PlayCircle size={20} className="text-blue-400" />}
                    {activeTab === 'documents' && <FileText size={20} className="text-red-400" />}
                    {activeTab === 'sessions' && <Video size={20} className="text-green-400" />}
                    {activeTab === 'voice_messages' && <Mic size={20} className="text-purple-400" />}
                    {activeTab === 'photos' && <ImageIcon size={20} className="text-yellow-400" />}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-white text-sm truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {activeTab === 'videos' 
                        ? (item.telegram_link || 'لا يوجد رابط تيليغرام')
                        : (getMediaUrl(item.document_file || item.file_url || item.session_link || item.audio_file || item.audio_url || item.image_file || item.photo_url) || 'رابط غير متوفر')
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => handleDeleteResource(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddResourceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          fetchContent();
          refreshTree();
        }}
        moduleSlug={moduleSlug}
        lessonId={lesson.id}
        activeTab={activeTab}
      />
    </div>
  );
};

export default AdminModuleContent;
