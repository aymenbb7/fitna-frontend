import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Video, FileText, Mic, Image as ImageIcon, PlayCircle, CheckSquare } from 'lucide-react';

const ModuleContent = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState('sessions');

  const tabs = [
    { id: 'sessions', label: 'جلسات', icon: <Video size={18} /> },
    { id: 'docs', label: 'وثائق', icon: <FileText size={18} /> },
    { id: 'videos', label: 'فيديوهات', icon: <PlayCircle size={18} /> },
    { id: 'audio', label: 'رسائل صوتية', icon: <Mic size={18} /> },
    { id: 'images', label: 'صور', icon: <ImageIcon size={18} /> },
    { id: 'quizzes', label: 'اختبارات', icon: <CheckSquare size={18} /> },
  ];

  return (
    <div className="pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/dashboard/student" className="text-gray-400 hover:text-white transition p-2 bg-bgPurple rounded-full border border-white/5">
          <ArrowRight size={20} />
        </Link>
        <h2 className="text-3xl font-black text-white">محتوى البرنامج ({slug})</h2>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-8 hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition whitespace-nowrap border ${
              activeTab === tab.id 
                ? 'bg-accentGold text-bgDark border-accentGold shadow-[0_0_15px_rgba(245,197,24,0.3)]' 
                : 'bg-bgPurple text-gray-400 border-white/10 hover:bg-white/5 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-bgPurple rounded-3xl border border-white/5 p-6 md:p-8 min-h-[400px]">
        {activeTab === 'sessions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-bgDark p-4 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-white/10 transition group cursor-pointer">
                <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center text-accentGold group-hover:scale-110 transition">
                  <Video size={28} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">الجلسة {i}: مقدمة أساسية</h4>
                  <p className="text-sm text-gray-400">المدة: 45 دقيقة</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-bgDark p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center hover:border-white/10 transition group cursor-pointer">
                <FileText size={40} className="text-blue-400 mb-3 group-hover:-translate-y-1 transition" />
                <h4 className="text-white font-bold mb-1">ملخص الدرس {i}.pdf</h4>
                <p className="text-xs text-gray-500">2.4 MB</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to={`/dashboard/student/modules/${slug}/quiz/1`} className="bg-bgDark p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:border-accentGold/50 transition group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accentGold/10 rounded-xl flex items-center justify-center text-accentGold">
                  <CheckSquare size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">اختبار الأسبوع الأول</h4>
                  <p className="text-sm text-gray-400">10 أسئلة • 15 دقيقة</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/5 text-white font-bold rounded-lg group-hover:bg-accentGold group-hover:text-bgDark transition">ابدأ</button>
            </Link>
          </div>
        )}

        {['videos', 'audio', 'images'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="font-bold text-lg">لا يوجد محتوى حالياً في هذا القسم.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleContent;
