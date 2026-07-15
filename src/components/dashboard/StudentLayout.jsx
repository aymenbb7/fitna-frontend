import React, { useState, useContext } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BookOpen, Bell, User, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';

const StudentLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { to: "/dashboard/student", icon: <LayoutDashboard size={20} />, label: "برامجي", exact: true },
    { to: "/dashboard/student/notifications", icon: <Bell size={20} />, label: "الإشعارات" },
    { to: "/dashboard/student/profile", icon: <User size={20} />, label: "الملف الشخصي" },
  ];

  return (
    <div className="min-h-screen bg-bgDarker flex flex-col md:flex-row text-white font-sans">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-bgDark p-4 border-b border-white/5 relative z-30">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300">فطنة</h1>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-300 hover:text-white transition">
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 right-0 z-20 w-64 bg-bgPurple border-l border-white/5 
        transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 hidden md:block">
          <Link to="/" className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300 drop-shadow-md">
            منصة فطنة
          </Link>
        </div>

        <div className="p-6 border-b border-white/5 md:border-t text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accentPurple rounded-full mx-auto mb-4 border-2 border-accentGold flex items-center justify-center text-3xl overflow-hidden">
            {user?.profile_picture ? (
              <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>🧑‍🎓</span>
            )}
          </div>
          <h3 className="font-bold text-lg">{user?.full_name || 'طالب فطنة'}</h3>
          <span className="text-xs text-gray-400 font-bold bg-white/5 px-3 py-1 rounded-full mt-2 inline-block">طالب</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link, i) => (
            <NavLink 
              key={i} 
              to={link.to} 
              end={link.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive ? 'bg-white/10 text-accentGold border border-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-400/10 rounded-xl font-bold transition"
          >
            <LogOut size={20} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-bgDarker relative">
        {/* Subtle grid background to match dark gamified theme but minimal */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="p-4 md:p-8 relative z-10 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
