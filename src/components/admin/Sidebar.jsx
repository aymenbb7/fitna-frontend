import React, { useContext, useState, useEffect } from 'react';
import { SidebarItem } from './SidebarItem';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  BookOpen, 
  Layers, 
  Bell, 
  LineChart, 
  Settings, 
  LogOut,
  DollarSign,
  Palette
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export const Sidebar = ({ isMobileOpen, setMobileOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('fitna_theme') || 'luxury');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('fitna_theme', currentTheme);
  }, [currentTheme]);

    const allMenuItems = [
      { icon: LayoutDashboard, label: 'لوحة التحكم', path: '/dashboard/admin', roles: ['SUPER_ADMIN', 'MODULE_ADMIN'] },
      { icon: Users, label: 'الطلاب', path: '/dashboard/admin/students', roles: ['SUPER_ADMIN', 'MODULE_ADMIN'] },
      { icon: ShieldCheck, label: 'مشرفي الوحدات', path: '/dashboard/admin/module-admins', roles: ['SUPER_ADMIN'] },
      { icon: BookOpen, label: 'الوحدات الدراسية', path: '/dashboard/admin/modules', roles: ['SUPER_ADMIN'] },
      { icon: BookOpen, label: 'محتوى وحداتي', path: '/dashboard/admin/my-modules', roles: ['MODULE_ADMIN'] },
      { icon: DollarSign, label: 'الإيرادات', path: '/dashboard/admin/revenue', roles: ['SUPER_ADMIN'] },
      { icon: Bell, label: 'الإشعارات', path: '/dashboard/admin/notifications', roles: ['SUPER_ADMIN', 'MODULE_ADMIN'] },
      { icon: Settings, label: 'الإعدادات', path: '/dashboard/admin/settings', roles: ['SUPER_ADMIN'] },
    ];

    const menuItems = allMenuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 z-50 h-screen w-64 bg-bgPurple border-l border-white/5 shadow-2xl flex flex-col
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/5 flex items-center justify-center">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300">
            فطنة
          </h2>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4">
          {user?.role === 'SUPER_ADMIN' && (
            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center text-sm font-bold text-gray-400 mb-2">
                <Palette className="w-4 h-4 ml-2" />
                مظهر المنصة
              </div>
              <select
                value={currentTheme}
                onChange={(e) => setCurrentTheme(e.target.value)}
                className="w-full bg-bgDark border border-white/10 rounded-lg py-1.5 px-3 text-white text-sm focus:outline-none focus:border-accentGold"
              >
                <option value="luxury">أرجواني فاخر (الافتراضي)</option>
                <option value="professional">أزرق احترافي</option>
                <option value="kids">ألوان الأطفال</option>
                <option value="ocean">محيط عميق (أزرق)</option>
                <option value="nature">طبيعة (أخضر)</option>
                <option value="sunset">غروب (أرجواني/برتقالي)</option>
                <option value="cyberpunk">سايبربانك (أسود/نيون)</option>
                <option value="midnight">منتصف الليل (أسود)</option>
                <option value="coffee">قهوة دافئة (بني)</option>
                <option value="rose">ورد أحمر داكن</option>
              </select>
            </div>
          )}

          <button 
            onClick={() => {
              logout();
            }}
            className="w-full flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold"
          >
            <LogOut className="w-5 h-5 ml-3" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
};
