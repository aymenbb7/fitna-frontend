import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public
import Layout from './components/Layout';
import Home from './pages/public/Home';
import ModulePage from './pages/public/ModulePage';
import TrialPage from './pages/public/TrialPage';
import SorobanLanding from './pages/public/SorobanLanding';

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

// Admin Dashboard
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Revenue from './pages/admin/Revenue';
import Students from './pages/admin/Students';
import ModuleAdmins from './pages/admin/ModuleAdmins';
import AdminNotifications from './pages/admin/AdminNotifications';
import Modules from './pages/admin/Modules';
import AdminModuleContent from './pages/admin/AdminModuleContent';
import Analytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/AdminSettings';
import ModuleAdminModules from './pages/admin/ModuleAdminModules';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with standard layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="modules/soroban" element={<SorobanLanding />} />
            <Route path="modules/سوروبان" element={<SorobanLanding />} />
            <Route path="modules/:slug" element={<ModulePage />} />
            <Route path="modules/:slug/trial" element={<TrialPage />} />
            <Route path="modules/:slug/trial/quiz/:quizId" element={<QuizPage />} />
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
            <Route path="module-admins" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><ModuleAdmins /></ProtectedRoute>} />
            <Route path="modules" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><Modules /></ProtectedRoute>} />
            <Route path="my-modules" element={<ProtectedRoute allowedRoles={['MODULE_ADMIN']}><ModuleAdminModules /></ProtectedRoute>} />
            <Route path="modules/:slug/content" element={<AdminModuleContent />} />
            <Route path="revenue" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><Revenue /></ProtectedRoute>} />
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
