import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';
import { PlayCircle, Award, BookOpen } from 'lucide-react';

const MyModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's enrolled modules
    api.get('/modules/')
      .then(res => setModules(res.data))
      .catch(err => {
        console.error("Failed to load modules:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-12 text-gray-400">جاري التحميل...</div>;

  return (
    <div>
      <h2 className="text-3xl font-black mb-8 text-white">وحداتي</h2>
      
      {modules.length === 0 ? (
        <div className="bg-bgPurple p-12 rounded-3xl border border-white/5 text-center">
          <BookOpen className="w-20 h-20 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-300 mb-6">أنت لست مسجلاً في أي وحدة بعد.</h3>
          <Link to="/" className="px-8 py-3 bg-accentGold text-bgDark font-bold rounded-xl hover:scale-105 transition inline-block">تصفح الوحدات</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <div key={i} className="bg-bgPurple border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all shadow-lg flex flex-col">
              {mod.cover_image_url ? (
                <img src={mod.cover_image_url} alt={mod.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-800" style={{ backgroundColor: mod.color_primary || '#1565C0' }}>
                  <Award className="w-16 h-16 text-white/50" />
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-black text-white mb-4">{mod.name}</h3>
                
                <div className="mb-4 space-y-2 flex-1">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>المدرب:</span>
                    <span className="text-white font-bold">{mod.admin_name || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>تاريخ التسجيل:</span>
                    <span className="text-white font-bold">{mod.enrolled_at ? new Date(mod.enrolled_at).toLocaleDateString('ar-DZ') : '-'}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm font-bold text-gray-400 mb-2">
                    <span>نسبة التقدم</span>
                    <span className="text-white">{mod.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-bgDark rounded-full h-3 overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-accentGold to-yellow-400 transition-all duration-1000" style={{ width: `${mod.progress || 0}%` }} />
                  </div>
                </div>

                <Link 
                  to={`/dashboard/student/modules/${mod.slug}`}
                  className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition"
                >
                  <PlayCircle size={20} /> مواصلة التعلم
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyModules;
