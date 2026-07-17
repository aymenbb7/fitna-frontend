import React from 'react';
import { NavLink } from 'react-router-dom';

export const SidebarItem = ({ icon: Icon, label, path, onClick }) => {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      end={path === '/dashboard/admin'} // Exactly match dashboard to avoid always active
      className={({ isActive }) =>
        `flex items-center px-4 py-3 rounded-xl transition-all font-bold ${
          isActive
            ? 'bg-accentGold text-bgDark shadow-[0_0_15px_rgba(245,197,24,0.3)]'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`
      }
    >
      <Icon className="w-5 h-5 ml-3" />
      <span>{label}</span>
    </NavLink>
  );
};
