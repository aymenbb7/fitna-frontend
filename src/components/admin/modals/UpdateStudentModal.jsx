import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import api from '../../../api/axios';

export const UpdateStudentModal = ({ isOpen, onClose, student, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && student) {
      setFullName(student.full_name || '');
      setUsername(student.username || '');
      setEmail(student.email || '');
      setPhone(student.phone || '');
      setIsActive(student.is_active);
      setError(null);
    }
  }, [isOpen, student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post(`/admin/users/${student.id}/update/`, {
        full_name: fullName,
        username,
        email,
        phone,
        is_active: isActive
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ أثناء حفظ التعديلات.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-bgDarker border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">تعديل بيانات الطالب - {student?.full_name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm font-bold">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">الاسم الكامل</label>
            <input 
              type="text" 
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold" 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">اسم المستخدم</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">البريد الإلكتروني</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">رقم الهاتف</label>
            <input 
              type="text" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold" 
            />
          </div>

          <div>
            <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
              <input 
                type="checkbox" 
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="form-checkbox h-5 w-5 text-accentGold border-white/10 rounded focus:ring-accentGold focus:ring-offset-bgDarker bg-bgDark"
              />
              <span className="text-white font-bold">الحساب نشط (تفعيل / إيقاف)</span>
            </label>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button type="button" variant="secondary" className="flex-1 justify-center" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
