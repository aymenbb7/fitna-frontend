import React, { useContext } from 'react';
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
  LogOut 
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export const Sidebar = ({ isMobileOpen, setMobileOpen }) => {
  const { logout } = useContext(AuthContext);

  const menuItems = [
    { icon: LayoutDashboard, label: 'لوحة التحكم', path: '/dashboard/admin' },
    { icon: Users, label: 'الطلاب', path: '/dashboard/admin/students' },
    { icon: ShieldCheck, label: 'مشرفي الوحدات', path: '/dashboard/admin/module-admins' },
    { icon: BookOpen, label: 'الوحدات الدراسية', path: '/dashboard/admin/modules' },
    { icon: Layers, label: 'التصنيفات', path: '/dashboard/admin/categories' },
    { icon: Bell, label: 'الإشعارات', path: '/dashboard/admin/notifications' },
    { icon: LineChart, label: 'الإحصائيات', path: '/dashboard/admin/analytics' },
    { icon: Settings, label: 'الإعدادات', path: '/dashboard/admin/settings' },
  ];

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

        <div className="p-4 border-t border-white/5">
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
