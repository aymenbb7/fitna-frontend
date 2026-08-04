import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import api from '../../../api/axios';
import { toast } from '../../../utils/toast';

export const UpdateStudentModal = ({ isOpen, onClose, student, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchModules();
    }
  }, [isOpen]);

  const fetchModules = async () => {
    try {
      const res = await api.get('/admin/modules/');
      setModules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen && student) {
      setFullName(student.full_name || '');
      setUsername(student.username || '');
      setEmail(student.email || '');
      setPhone(student.phone || '');
      setIsActive(student.is_active);
      setSelectedModules(student.enrollments ? student.enrollments.map(e => e.module.slug) : []);
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
        is_active: isActive,
        module_slugs: selectedModules
      });
      toast.success("تم حفظ التعديلات بنجاح");
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || "حدث خطأ أثناء حفظ التعديلات.");
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

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">الدورات المسجل بها</label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
              {modules.map(mod => (
                <label key={mod.slug} className="flex items-center space-x-3 space-x-reverse cursor-pointer bg-bgDark border border-white/10 p-3 rounded-xl hover:border-accentGold/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedModules.includes(mod.slug)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedModules([...selectedModules, mod.slug]);
                      else setSelectedModules(selectedModules.filter(s => s !== mod.slug));
                    }}
                    className="form-checkbox h-5 w-5 text-accentGold border-white/10 rounded focus:ring-accentGold focus:ring-offset-bgDark bg-bgDarker"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-bold">{mod.name}</span>
                    <span className="text-xs text-gray-400">{mod.price > 0 ? \`\${mod.price} د.ج\` : 'مجاني'}</span>
                  </div>
                </label>
              ))}
              {modules.length === 0 && (
                <div className="text-gray-400 text-sm text-center py-4">جاري تحميل الدورات...</div>
              )}
            </div>
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
