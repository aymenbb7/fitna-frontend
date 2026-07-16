import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ArrowRight, Lock, User } from 'lucide-react';
import api from '../../api/axios';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    // Send the identifier as 'username'. The backend's UnifiedAuthBackend will handle checking if it's an email or username.
    const credentials = { username: identifier, password };
    console.log("[LoginPage] Starting login process with credentials:", { username: identifier, password: '***HIDDEN***' });

    try {
      console.log("[LoginPage] Calling POST /auth/login/");
      const res = await api.post('/auth/login/', credentials);
      console.log("[LoginPage] LOGIN RESPONSE STATUS:", res.status);
      console.log("[LoginPage] LOGIN RESPONSE DATA:", res.data);
      
      const { access, refresh, user } = res.data;
      
      console.log("[LoginPage] Calling AuthContext.login()...");
      login(user, access, refresh);
      console.log("[LoginPage] Tokens should now be in localStorage.");
      console.log("[LoginPage] localStorage.accessToken:", localStorage.getItem('accessToken'));
      console.log("[LoginPage] localStorage.refreshToken:", localStorage.getItem('refreshToken'));
      console.log("[LoginPage] sessionStorage (all):", Object.keys(sessionStorage));
      console.log("[LoginPage] cookies:", document.cookie);

      console.log(`[LoginPage] Evaluating role redirect. Backend role: '${user?.role}'`);
      
      // Role based redirect (matching uppercase backend choices)
      if (user?.role === 'STUDENT' || user?.role === 'student') {
        console.log(`[LoginPage] Frontend comparison: '${user?.role}' === 'STUDENT'. Match!`);
        console.log(`[LoginPage] Triggering: navigate('/dashboard/student') at LoginPage.jsx:45`);
        navigate('/dashboard/student');
      } else if (user?.role === 'MODULE_ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'superadmin') {
        console.log(`[LoginPage] Frontend comparison: '${user?.role}' matches ADMIN condition.`);
        console.log(`[LoginPage] Triggering: navigate('/dashboard/admin') at LoginPage.jsx:49`);
        navigate('/dashboard/admin');
      } else {
        console.log(`[LoginPage] Frontend comparison: '${user?.role}' did not match any roles! Redirecting to /`);
        console.log(`[LoginPage] Triggering: navigate('/') at LoginPage.jsx:53`);
        navigate('/');
      }
    } catch (err) {
      console.log("[LoginPage] EXCEPTION during login:", err.message);
      console.error(err);
      setError('بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgDarker flex flex-col justify-center items-center p-4">
      <Link to="/" className="absolute top-8 right-8 text-gray-400 hover:text-white flex items-center gap-2 font-bold transition">
        <ArrowRight size={20} /> العودة للرئيسية
      </Link>

      <div className="w-full max-w-md bg-bgPurple p-8 rounded-3xl shadow-2xl border border-white/5">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300 drop-shadow-md mb-2">تسجيل الدخول</h2>
          <p className="text-gray-400 font-bold">أهلاً بك مجدداً في منصة فطنة</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 font-bold text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
          <div>
            <label className="block text-gray-300 font-bold mb-2">اسم المستخدم أو البريد الإلكتروني</label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                dir="ltr"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-bgDark border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white text-left focus:border-accentGold focus:outline-none transition" 
                placeholder="username / email"
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-2">كلمة المرور</label>
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
                autoComplete="new-password"
              />
            </div>
            <div className="mt-2 text-left">
              <Link to="/forgot-password" className="text-sm text-accentGold hover:underline font-bold">نسيت كلمة المرور؟</Link>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accentGold text-bgDark font-black py-4 rounded-xl text-lg hover:scale-[1.02] transition shadow-[0_0_15px_rgba(245,197,24,0.3)] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
