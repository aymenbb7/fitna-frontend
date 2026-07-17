import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bgDarker text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300">
            لوحة تحكم المشرف (Admin Dashboard)
          </h1>
          <div className="space-x-4 space-x-reverse">
            <button 
              onClick={() => navigate('/')} 
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
            >
              الرئيسية
            </button>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition"
            >
              تسجيل خروج
            </button>
          </div>
        </div>

        <div className="bg-bgPurple p-6 rounded-2xl shadow-xl border border-white/5">
          <h2 className="text-xl font-bold mb-4">مرحباً، {user?.full_name || 'المشرف'}</h2>
          <p className="text-gray-400 mb-6">
            أنت مسجل الدخول بصلاحيات: <span className="text-accentGold font-bold">{user?.role}</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bgDark p-6 rounded-xl border border-white/5">
              <h3 className="font-bold text-lg mb-2">إدارة المستخدمين</h3>
              <p className="text-sm text-gray-500">قريباً...</p>
            </div>
            <div className="bg-bgDark p-6 rounded-xl border border-white/5">
              <h3 className="font-bold text-lg mb-2">إدارة الوحدات</h3>
              <p className="text-sm text-gray-500">قريباً...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
