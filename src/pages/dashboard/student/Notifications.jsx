import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Mail, Clock } from 'lucide-react';
import api from '../../../api/axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/notifications/');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.post('/auth/notifications/read/');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">جاري تحميل الإشعارات...</div>;
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">الإشعارات</h2>
          <p className="text-gray-400">تاريخ وسجل الإشعارات الخاصة بك.</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="px-4 py-2 bg-accentGold/10 text-accentGold hover:bg-accentGold hover:text-bgDark transition rounded-xl font-bold flex items-center gap-2"
          >
            <CheckCircle size={18} />
            تحديد الكل كمقروء
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="p-12 border border-white/5 bg-bgDark rounded-3xl text-center text-gray-500 flex flex-col items-center">
            <Bell size={48} className="mb-4 text-white/10" />
            <p className="font-bold text-lg">لا توجد إشعارات حالياً.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id} 
              className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center gap-4 transition-all ${
                !n.is_read ? 'bg-bgPurple border-accentGold/30' : 'bg-bgDark border-white/5 hover:border-white/10'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${!n.is_read ? 'bg-accentGold text-bgDark' : 'bg-white/5 text-gray-400'}`}>
                {n.type === 'NEW_CONTENT' ? <Mail size={20} /> : <Bell size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-2 gap-2">
                  <h4 className={`font-bold text-lg ${!n.is_read ? 'text-white' : 'text-gray-300'}`}>{n.title}</h4>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg shrink-0">
                    <Clock size={14} />
                    {new Date(n.created_at).toLocaleString('ar-DZ')}
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">{n.message}</p>
                <div className="text-xs text-accentGold/80 font-bold">
                  {n.sender_name ? `المُرسل: ${n.sender_name}` : ''}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
