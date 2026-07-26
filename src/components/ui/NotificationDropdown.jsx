import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import api from '../../api/axios';

export const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/auth/notifications/');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllAsRead = async () => {
    try {
      await api.post('/auth/notifications/read/');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-bgDarker"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-bgDark border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden" style={{ right: 'auto', left: '-100px' }}>
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-white">الإشعارات</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-accentGold hover:text-yellow-300 transition-colors flex items-center"
              >
                <Check className="w-3 h-3 mr-1" />
                تحديد الكل كمقروء
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                لا توجد إشعارات حالياً
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 border-b border-white/5 transition-colors ${!n.is_read ? 'bg-white/5' : 'hover:bg-white/5'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-white">{n.title}</h4>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap mr-2">
                      {new Date(n.created_at).toLocaleDateString('ar-DZ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{n.message}</p>
                  <p className="text-[10px] text-accentGold/70">
                    {n.sender_name ? `المرسل: ${n.sender_name}` : ''}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
