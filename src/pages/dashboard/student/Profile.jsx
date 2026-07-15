import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Camera, Save } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setSuccess('تم تحديث البيانات بنجاح!');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <h2 className="text-3xl font-black mb-8 text-white">الملف الشخصي</h2>
      
      <div className="bg-bgPurple p-8 rounded-3xl border border-white/5 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 bg-bgDark rounded-full border-2 border-white/10 flex items-center justify-center text-4xl overflow-hidden group-hover:border-accentGold transition">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>🧑‍🎓</span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <Camera className="text-white" />
              </div>
            </div>
            <span className="text-sm text-gray-400 font-bold mt-3">تغيير الصورة</span>
          </div>

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl font-bold text-sm text-center">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 font-bold mb-2">الاسم الكامل</label>
              <input 
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full bg-bgDark border border-white/5 rounded-xl p-3 text-white focus:border-accentGold focus:outline-none transition" 
              />
            </div>
            <div>
              <label className="block text-gray-400 font-bold mb-2">اسم المستخدم</label>
              <input 
                name="username"
                value={formData.username}
                onChange={handleChange}
                dir="ltr"
                className="w-full bg-bgDark border border-white/5 rounded-xl p-3 text-white text-left focus:border-accentGold focus:outline-none transition" 
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 font-bold mb-2">البريد الإلكتروني</label>
            <input 
              name="email"
              value={formData.email}
              disabled
              dir="ltr"
              className="w-full bg-bgDark border border-white/5 rounded-xl p-3 text-gray-500 text-left cursor-not-allowed" 
            />
          </div>

          <div className="pt-6 border-t border-white/5">
            <h3 className="text-xl font-bold text-white mb-6">تغيير كلمة المرور</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 font-bold mb-2">كلمة المرور الحالية</label>
                <input 
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  dir="ltr"
                  className="w-full bg-bgDark border border-white/5 rounded-xl p-3 text-white text-left focus:border-accentGold focus:outline-none transition" 
                />
              </div>
              <div>
                <label className="block text-gray-400 font-bold mb-2">كلمة المرور الجديدة</label>
                <input 
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  dir="ltr"
                  className="w-full bg-bgDark border border-white/5 rounded-xl p-3 text-white text-left focus:border-accentGold focus:outline-none transition" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-accentGold text-bgDark font-black rounded-xl hover:scale-105 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
