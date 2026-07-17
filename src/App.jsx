import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public
import Layout from './components/Layout';
import Home from './pages/public/Home';
import ModulePage from './pages/public/ModulePage';
import TrialPage from './pages/public/TrialPage';

// Auth
import LoginPage from './pages/auth/LoginPage';
import SetPasswordPage from './pages/auth/SetPasswordPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Student Dashboard
import StudentLayout from './components/dashboard/StudentLayout';
import MyModules from './pages/dashboard/student/MyModules';
import ModuleContent from './pages/dashboard/student/ModuleContent';
import QuizPage from './pages/dashboard/student/QuizPage';
import Notifications from './pages/dashboard/student/Notifications';
import Profile from './pages/dashboard/student/Profile';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Revenue from './pages/admin/Revenue';
import Students from './pages/admin/Students';
import ModuleAdmins from './pages/admin/ModuleAdmins';
import AdminNotifications from './pages/admin/AdminNotifications';
import Modules from './pages/admin/Modules';
import Categories from './pages/admin/Categories';
import Analytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with standard layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="modules/:slug" element={<ModulePage />} />
            <Route path="modules/:slug/trial" element={<TrialPage />} />
          </Route>

          {/* Auth Routes (No layout) */}
          <Route path="login" element={<LoginPage />} />
          <Route path="set-password" element={<SetPasswordPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />

          {/* Admin Dashboard Routes */}
          <Route 
            path="/dashboard/admin" 
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'MODULE_ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="module-admins" element={<ModuleAdmins />} />
            <Route path="modules" element={<Modules />} />
            <Route path="categories" element={<Categories />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Student Dashboard Routes */}
          <Route 
            path="/dashboard/student" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MyModules />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="modules/:slug" element={<ModuleContent />} />
            <Route path="modules/:slug/quiz/:quizId" element={<QuizPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
