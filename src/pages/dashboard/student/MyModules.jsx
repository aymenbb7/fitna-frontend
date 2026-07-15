import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';
import { PlayCircle, Award, BookOpen } from 'lucide-react';

const MyModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's enrolled modules
    api.get('/dashboard/student/modules/')
      .then(res => setModules(res.data))
      .catch(err => {
        console.error(err);
        // Fallback for demo
        setModules([
          { slug: 'quran', name: 'التعليم القرآني', progress: 45, next_session: 'تلاوة وحفظ - سورة النبأ', color: '#1B5E20' },
          { slug: 'memory', name: 'الذاكرة الخارقة', progress: 12, next_session: 'تقنيات الربط الذهني', color: '#1565C0' }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-12 text-gray-400">جاري التحميل...</div>;

  return (
    <div>
      <h2 className="text-3xl font-black mb-8 text-white">برامجي</h2>
      
      {modules.length === 0 ? (
        <div className="bg-bgPurple p-12 rounded-3xl border border-white/5 text-center">
          <BookOpen className="w-20 h-20 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-300 mb-6">لست مسجلاً في أي برنامج حالياً.</h3>
          <Link to="/" className="px-8 py-3 bg-accentGold text-bgDark font-bold rounded-xl hover:scale-105 transition inline-block">تصفح البرامج</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod, i) => (
            <div key={i} className="bg-bgPurple border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white">{mod.name}</h3>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: mod.color || '#1565C0' }}>
                  <Award className="text-white" />
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm font-bold text-gray-400 mb-2">
                  <span>نسبة التقدم</span>
                  <span className="text-white">{mod.progress}%</span>
                </div>
                <div className="w-full bg-bgDark rounded-full h-3 overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-accentGold to-yellow-400 transition-all duration-1000" style={{ width: `${mod.progress}%` }} />
                </div>
              </div>

              {mod.next_session && (
                <div className="bg-bgDark p-4 rounded-xl border border-white/5 mb-6">
                  <div className="text-xs text-gray-400 font-bold mb-1">الدرس القادم</div>
                  <div className="text-white font-bold">{mod.next_session}</div>
                </div>
              )}

              <Link 
                to={`/dashboard/student/modules/${mod.slug}`}
                className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition"
              >
                <PlayCircle size={20} /> متابعة التعلم
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyModules;
