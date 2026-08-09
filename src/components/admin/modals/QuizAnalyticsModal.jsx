import React, { useState, useEffect } from 'react';
import { X, Users, CheckCircle, XCircle, Clock, BarChart } from 'lucide-react';
import api from '../../../api/axios';

export const QuizAnalyticsModal = ({ isOpen, onClose, moduleSlug, quiz }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && quiz) {
      fetchAnalytics();
    }
  }, [isOpen, quiz]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/modules/${moduleSlug}/quizzes/${quiz.id}/results/`);
      setData(res.data);
    } catch (err) {
      setError("حدث خطأ أثناء جلب الإحصائيات.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div className="bg-bgDark rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-black text-xl text-white">إحصائيات الاختبار</h3>
            <p className="text-gray-400 text-sm">{quiz?.title}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
            <X size={20} className="text-gray-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-gray-400 font-bold">جاري التحميل...</div>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center font-bold">
              {error}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-bgPurple p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                  <Users size={24} className="text-blue-400 mb-2" />
                  <div className="text-2xl font-black text-white">{data.student_results.length}</div>
                  <div className="text-xs text-gray-500 font-bold">عدد المحاولات</div>
                </div>
                <div className="bg-bgPurple p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                  <CheckCircle size={24} className="text-green-400 mb-2" />
                  <div className="text-2xl font-black text-white">
                    {data.student_results.length > 0
                      ? Math.round((data.student_results.filter(r => r.passed).length / data.student_results.length) * 100)
                      : 0}%
                  </div>
                  <div className="text-xs text-gray-500 font-bold">نسبة النجاح</div>
                </div>
                <div className="bg-bgPurple p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                  <BarChart size={24} className="text-yellow-400 mb-2" />
                  <div className="text-2xl font-black text-white">
                    {data.student_results.length > 0
                      ? Math.round(data.student_results.reduce((acc, r) => acc + r.score, 0) / data.student_results.length)
                      : 0}%
                  </div>
                  <div className="text-xs text-gray-500 font-bold">متوسط الدرجات</div>
                </div>
                <div className="bg-bgPurple p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                  <Clock size={24} className="text-purple-400 mb-2" />
                  <div className="text-2xl font-black text-white">
                    {data.student_results.length > 0
                      ? Math.round(data.student_results.reduce((acc, r) => acc + r.time_taken_seconds, 0) / data.student_results.length / 60)
                      : 0}د
                  </div>
                  <div className="text-xs text-gray-500 font-bold">متوسط الوقت</div>
                </div>
              </div>

              {/* Questions Stats */}
              <div>
                <h4 className="font-black text-lg text-white mb-4">أداء الأسئلة</h4>
                <div className="space-y-3">
                  {data.question_stats.length === 0 ? (
                    <div className="text-gray-500 text-sm">لا توجد إحصائيات للأسئلة.</div>
                  ) : (
                    data.question_stats.map((q, idx) => {
                      const successRate = q.total_answers > 0 ? Math.round((q.correct_answers / q.total_answers) * 100) : 0;
                      return (
                        <div key={q.question_id} className="bg-bgPurple p-4 rounded-xl border border-white/5">
                          <p className="text-sm text-white font-bold mb-2">س{idx + 1}: {q.text}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${successRate >= 50 ? 'bg-green-400' : 'bg-red-400'}`}
                                style={{ width: `${successRate}%` }}
                              />
                            </div>
                            <span className="text-xs font-black text-gray-400 min-w-12 text-left">{successRate}% صواب</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Students Results */}
              <div>
                <h4 className="font-black text-lg text-white mb-4">نتائج الطلاب</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400">
                        <th className="pb-2 font-bold">الطالب</th>
                        <th className="pb-2 font-bold">النتيجة</th>
                        <th className="pb-2 font-bold">الحالة</th>
                        <th className="pb-2 font-bold">المحاولة</th>
                        <th className="pb-2 font-bold">الوقت المستغرق</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.student_results.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-4 text-center text-gray-500">لا توجد نتائج بعد.</td>
                        </tr>
                      ) : (
                        data.student_results.map((r, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 font-bold text-white">{r.name}</td>
                            <td className="py-3 text-gray-300">{r.score}%</td>
                            <td className="py-3">
                              {r.passed ? (
                                <span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full text-xs font-bold">ناجح</span>
                              ) : (
                                <span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full text-xs font-bold">راسب</span>
                              )}
                            </td>
                            <td className="py-3 text-gray-500">{r.attempt_number}</td>
                            <td className="py-3 text-gray-500">{Math.round(r.time_taken_seconds / 60)}د و {Math.round(r.time_taken_seconds % 60)}ث</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
