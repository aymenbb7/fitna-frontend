import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-bgDarker flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-bgPurple p-10 rounded-3xl shadow-2xl border border-white/5 text-center">
        <h2 className="text-3xl font-black text-white mb-6">نسيت كلمة المرور؟</h2>
        
        <p className="text-gray-300 font-bold mb-8 leading-relaxed">
          للحصول على مساعدة في استعادة حسابك، يرجى التواصل مع المشرف المسؤول عن برنامجك عبر واتساب.
        </p>

        <a 
          href="https://wa.me/213795375422" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-4 bg-[#25D366] text-white font-black rounded-xl text-lg hover:scale-[1.02] transition shadow-lg flex items-center justify-center gap-3 mb-6 hover:bg-[#1DA851]"
        >
          <MessageCircle size={24} />
          تواصل عبر واتساب
        </a>

        <Link to="/login" className="text-gray-400 hover:text-white flex items-center justify-center gap-2 font-bold transition">
          <ArrowRight size={20} /> عودة إلى تسجيل الدخول
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
