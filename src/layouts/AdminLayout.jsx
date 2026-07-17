import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/admin/Sidebar';
import { Navbar } from '../components/admin/Navbar';

const AdminLayout = () => {
  const [isMobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bgDarker text-white font-sans flex" dir="rtl">
      {/* Left Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:mr-64 min-w-0 transition-all duration-300">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
