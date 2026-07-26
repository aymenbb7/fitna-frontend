import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import api from '../../../api/axios';

export const UpdateModuleAdminModal = ({ isOpen, onClose, admin, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedModules, setSelectedModules] = useState([]);
  
  const [availableModules, setAvailableModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchModules();
      if (admin) {
        setFullName(admin.full_name || '');
        setUsername(admin.username || '');
        setEmail(admin.email || '');
        setPhone(admin.phone || '');
        setIsActive(admin.is_active);
        setSelectedModules(admin.managed_modules?.map(m => m.slug) || []);
      }
      setError(null);
    }
  }, [isOpen, admin]);

  const fetchModules = async () => {
    try {
      const res = await api.get('/admin/modules/');
      setAvailableModules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post(`/admin/users/${admin.id}/update/`, {
        full_name: fullName,
        username,
        email,
        phone,
        is_active: isActive,
        modules: selectedModules
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
          <h3 className="text-xl font-bold text-white">تعديل بيانات المشرف - {admin?.full_name}</h3>
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
            <label className="block text-sm font-bold text-gray-400 mb-1">الوحدات المخصصة</label>
            <div className="bg-bgDark border border-white/10 rounded-xl p-4 max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
              {availableModules.map(m => (
                <label key={m.id} className="flex items-center space-x-3 space-x-reverse cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <input 
                    type="checkbox"
                    checked={selectedModules.includes(m.slug)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedModules([...selectedModules, m.slug]);
                      } else {
                        setSelectedModules(selectedModules.filter(slug => slug !== m.slug));
                      }
                    }}
                    className="form-checkbox h-5 w-5 text-accentGold border-gray-600 rounded focus:ring-accentGold focus:ring-offset-bgDark bg-bgDarker"
                  />
                  <span className="text-white text-sm font-medium">{m.name}</span>
                </label>
              ))}
              {availableModules.length === 0 && (
                <p className="text-sm text-gray-500 text-center">لا توجد وحدات متاحة</p>
              )}
            </div>
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
