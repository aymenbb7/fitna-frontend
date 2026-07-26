import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { RefreshCw, Copy, CheckCircle } from 'lucide-react';
import api from '../../../api/axios';

export const AddModuleAdminModal = ({ isOpen, onClose, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedModules, setSelectedModules] = useState([]);
  
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [createdAdmin, setCreatedAdmin] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchModules();
      setFullName('');
      setEmail('');
      generatePassword();
      setSelectedModules([]);
      setCreatedAdmin(null);
      setError(null);
      setCopied(false);
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

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/admin/module-admins/create/', {
        full_name: fullName,
        email,
        password,
        modules: selectedModules
      });
      setCreatedAdmin({
        ...res.data.admin,
        password
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ أثناء إنشاء الحساب.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!createdAdmin) return;
    const text = `معلومات حساب مشرف الوحدة الجديد (منصة فطنة):\n\nالاسم: ${createdAdmin.full_name}\nالبريد الإلكتروني: ${createdAdmin.email}\nكلمة المرور المؤقتة: ${createdAdmin.password}\n\nيرجى تغيير كلمة المرور عند تسجيل الدخول لأول مرة.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-bgDarker border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
        
        {createdAdmin ? (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">تم إنشاء حساب المشرف بنجاح!</h3>
            
            <div className="bg-bgDark p-4 rounded-xl text-left border border-white/10 mt-4 relative">
              <p className="text-sm text-gray-400 mb-1">البريد الإلكتروني:</p>
              <p className="text-white font-bold mb-3">{createdAdmin.email}</p>
              
              <p className="text-sm text-gray-400 mb-1">كلمة المرور المؤقتة:</p>
              <p className="text-white font-bold font-mono">{createdAdmin.password}</p>
            </div>
            
            <div className="flex gap-4 mt-6">
              <Button 
                variant="secondary" 
                className="flex-1 justify-center" 
                onClick={handleCopy}
              >
                {copied ? 'تم النسخ!' : 'نسخ معلومات الدخول'}
                {!copied && <Copy className="w-4 h-4 mr-2" />}
              </Button>
              <Button 
                variant="primary" 
                className="flex-1 justify-center" 
                onClick={onClose}
              >
                إغلاق
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">إضافة مشرف وحدة جديد</h3>
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
                <label className="block text-sm font-bold text-gray-400 mb-1">كلمة المرور المؤقتة</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="flex-1 bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold font-mono" 
                    required
                  />
                  <Button type="button" variant="secondary" onClick={generatePassword} title="توليد كلمة مرور جديدة">
                    <RefreshCw className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">تعيين الوحدات المسؤولة (اختياري)</label>
                <select 
                  multiple
                  value={selectedModules}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setSelectedModules(values);
                  }}
                  className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold min-h-[100px]"
                >
                  {modules.map(m => (
                    <option key={m.slug} value={m.slug}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">اضغط Ctrl لتحديد أكثر من وحدة</p>
              </div>

              <div className="flex gap-4 mt-8">
                <Button type="button" variant="secondary" className="flex-1 justify-center" onClick={onClose}>
                  إلغاء
                </Button>
                <Button type="submit" variant="primary" className="flex-1 justify-center" disabled={loading}>
                  {loading ? 'جاري الإرسال...' : 'إضافة المشرف'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
