import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public (Loaded statically for instant homepage mount)
import Layout from './components/Layout';
import Home from './pages/public/Home';

// Lazy-loaded pages to split bundle and optimize load time
const ModulePage = lazy(() => import('./pages/public/ModulePage'));
const TrialPage = lazy(() => import('./pages/public/TrialPage'));
const SorobanLanding = lazy(() => import('./pages/public/SorobanLanding'));

// Auth
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SetPasswordPage = lazy(() => import('./pages/auth/SetPasswordPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));

// Student Dashboard
const StudentLayout = lazy(() => import('./components/dashboard/StudentLayout'));
const MyModules = lazy(() => import('./pages/dashboard/student/MyModules'));
const ModuleContent = lazy(() => import('./pages/dashboard/student/ModuleContent'));
const QuizPage = lazy(() => import('./pages/dashboard/student/QuizPage'));
const Notifications = lazy(() => import('./pages/dashboard/student/Notifications'));
const Profile = lazy(() => import('./pages/dashboard/student/Profile'));

// Admin Dashboard
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Revenue = lazy(() => import('./pages/admin/Revenue'));
const Students = lazy(() => import('./pages/admin/Students'));
const ModuleAdmins = lazy(() => import('./pages/admin/ModuleAdmins'));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'));
const Modules = lazy(() => import('./pages/admin/Modules'));
const AdminModuleContent = lazy(() => import('./pages/admin/AdminModuleContent'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const ModuleAdminModules = lazy(() => import('./pages/admin/ModuleAdminModules'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0D0B2B] text-white font-sans">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-accentGold border-t-transparent rounded-full animate-spin"></div>
      <div className="text-xl font-bold text-gray-300">جاري التحميل...</div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
