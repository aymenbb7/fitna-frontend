import React from 'react';
import { Bell, Award, BookOpen } from 'lucide-react';

const Notifications = () => {
  const notifs = [
    { id: 1, title: 'درس جديد متاح', desc: 'تمت إضافة درس جديد في وحدة الذاكرة الخارقة.', time: 'منذ ساعتين', icon: <BookOpen size={20} />, unread: true },
    { id: 2, title: 'نتائج الاختبار', desc: 'لقد حصلت على 10/10 في اختبار الحساب الذهني الأخير. أحسنت!', time: 'أمس', icon: <Award size={20} />, unread: false },
    { id: 3, title: 'تذكير بموعد الجلسة', desc: 'الجلسة المباشرة ستبدأ غداً على الساعة 18:00.', time: 'منذ يومين', icon: <Bell size={20} />, unread: false },
  ];

  return (
    <div>
      <h2 className="text-3xl font-black mb-8 text-white">الإشعارات</h2>
      
      <div className="space-y-4">
        {notifs.map(n => (
          <div key={n.id} className={`p-6 rounded-2xl border flex items-start gap-4 transition-all cursor-pointer ${n.unread ? 'bg-bgPurple border-accentGold/50' : 'bg-bgDark border-white/5 hover:border-white/10'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${n.unread ? 'bg-accentGold text-bgDark' : 'bg-white/5 text-gray-400'}`}>
              {n.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className={`font-bold ${n.unread ? 'text-white' : 'text-gray-300'}`}>{n.title}</h4>
                <span className="text-xs font-bold text-gray-500">{n.time}</span>
              </div>
              <p className="text-gray-400 text-sm">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
