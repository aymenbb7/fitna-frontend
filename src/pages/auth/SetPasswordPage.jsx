import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Lock, CheckCircle2 } from 'lucide-react';

const SetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة.');
      return;
    }
    if (password.length < 8) {
      setError('يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/set-password/', { token, new_password: password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error(err);
      setError('الرابط غير صالح أو منتهي الصلاحية. يرجى التواصل مع الإدارة.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-bgDarker flex flex-col justify-center items-center p-4 text-white text-center">
        <h2 className="text-3xl font-black mb-4">الرابط مفقود</h2>
        <p className="text-gray-400">يرجى التأكد من الدخول عبر الرابط المرسل إلى بريدك الإلكتروني.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgDarker flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-bgPurple p-8 rounded-3xl shadow-2xl border border-white/5">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300 mb-2">إعداد كلمة المرور</h2>
          <p className="text-gray-400 font-bold">أدخل كلمة مرور قوية لحسابك الجديد</p>
        </div>

        {success ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]" />
            <h3 className="text-2xl font-black text-white mb-2">تم الحفظ بنجاح!</h3>
            <p className="text-gray-400 font-bold">سيتم تحويلك إلى صفحة الدخول...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl font-bold text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-300 font-bold mb-2">كلمة المرور الجديدة</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  type="password" 
                  dir="ltr"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bgDark border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white text-left focus:border-accentGold focus:outline-none transition" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-2">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  type="password" 
                  dir="ltr"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-bgDark border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white text-left focus:border-accentGold focus:outline-none transition" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accentGold text-bgDark font-black py-4 rounded-xl text-lg hover:scale-[1.02] transition shadow-[0_0_15px_rgba(245,197,24,0.3)] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SetPasswordPage;
