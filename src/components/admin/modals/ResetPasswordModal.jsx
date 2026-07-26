import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { RefreshCw, Copy, CheckCircle } from 'lucide-react';
import api from '../../../api/axios';

export const ResetPasswordModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generatePassword();
      setSuccess(false);
      setError(null);
      setCopied(false);
    }
  }, [isOpen]);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  const handleCopy = () => {
    const text = `تم إعادة تعيين كلمة مرور الحساب (منصة فطنة):\n\nالبريد الإلكتروني: ${user?.email}\nكلمة المرور الجديدة: ${password}\n\nيرجى تغيير كلمة المرور بعد تسجيل الدخول.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post(`/admin/users/${user.id}/reset-password/`, {
        password
      });
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ أثناء إعادة تعيين كلمة المرور.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-bgDarker border border-white/10 rounded-2xl w-full max-w-md p-6 max-h-[85vh] overflow-y-auto">
        
        {success ? (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">تم تعيين كلمة مرور جديدة بنجاح!</h3>
            
            <div className="bg-bgDark p-4 rounded-xl text-left border border-white/10 mt-4 relative">
              <p className="text-sm text-gray-400 mb-1">كلمة المرور الجديدة:</p>
              <p className="text-white font-bold font-mono text-lg">{password}</p>
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
              <h3 className="text-xl font-bold text-white">إعادة تعيين كلمة مرور المستخدم</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <p className="text-gray-400 text-sm mb-6">
              سيتم توليد كلمة مرور جديدة للمستخدم <span className="text-white font-bold">{user?.full_name}</span>.
            </p>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm font-bold">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">كلمة المرور الجديدة</label>
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

              <div className="flex gap-4 mt-8">
                <Button type="button" variant="secondary" className="flex-1 justify-center" onClick={onClose}>
                  إلغاء
                </Button>
                <Button type="submit" variant="primary" className="flex-1 justify-center" disabled={loading}>
                  {loading ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
