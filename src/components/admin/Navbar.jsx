import React, { useContext } from 'react';
import { Bell, Search, Menu, UserCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export const Navbar = ({ onMenuClick }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-40 bg-bgDarker/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:flex items-center relative">
          <Search className="w-5 h-5 absolute right-3 text-gray-500" />
          <input 
            type="text" 
            placeholder="بحث..." 
            className="bg-bgDark border border-white/10 rounded-xl py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-accentGold w-64 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5" />
          {/* Notification dot placeholder */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-bgDarker"></span>
        </button>
        
        <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-left hidden sm:block">
            <p className="text-sm font-bold text-white leading-none mb-1 text-right">{user?.full_name || 'Admin User'}</p>
            <p className="text-xs text-accentGold font-bold text-right">{user?.role || 'SUPER_ADMIN'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-accentGold/20 border border-accentGold/50 flex items-center justify-center text-accentGold">
            <UserCircle className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
};
