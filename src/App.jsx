import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/public/Home';
import ModulePage from './pages/public/ModulePage';
import TrialPage from './pages/public/TrialPage';

// Placeholder for Login
const Login = () => <div className="p-20 text-center text-2xl">Login Page (Phase 2)</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="modules/:slug" element={<ModulePage />} />
          <Route path="modules/:slug/trial" element={<TrialPage />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
