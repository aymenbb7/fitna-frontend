import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Globe, MessageCircle } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const Layout = () => {
  const { t, i18n } = useTranslation();
  const { settings } = React.useContext(SettingsContext);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const handleLanguageToggle = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
    setMobileMenuOpen(false);
  };

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ fontFamily: settings.fontFamily || 'Cairo, sans-serif' }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-bgDark/90 backdrop-blur-md border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" onClick={handleHomeClick} className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300 drop-shadow-[0_0_10px_rgba(245,197,24,0.5)]">فطنة</a>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              <a href="/" onClick={handleHomeClick} className="text-gray-300 hover:text-accentGold font-bold cursor-pointer transition-colors">{t('nav.home')}</a>
              <button onClick={() => handleNavClick('programs')} className="text-gray-300 hover:text-accentGold font-bold cursor-pointer transition-colors">{t('nav.programs')}</button>
              <button onClick={() => handleNavClick('about')} className="text-gray-300 hover:text-accentGold font-bold cursor-pointer transition-colors">{t('nav.about')}</button>
              <button onClick={() => handleNavClick('contact')} className="text-gray-300 hover:text-accentGold font-bold cursor-pointer transition-colors">{t('nav.contact')}</button>
            </div>

            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              <button onClick={handleLanguageToggle} className="p-2 text-gray-400 hover:text-accentGold rounded-full transition-colors">
                <Globe size={20} />
              </button>
              <Link to="/login" className="px-6 py-2 bg-accentGold text-bgDark font-black rounded-lg shadow-[0_0_15px_rgba(245,197,24,0.4)] hover:shadow-[0_0_25px_rgba(245,197,24,0.6)] transition-all">
                {t('nav.login')}
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-400 hover:text-accentGold p-2">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-bgDarker border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" onClick={handleHomeClick} className="block px-3 py-2 text-gray-300 hover:text-accentGold font-bold cursor-pointer">{t('nav.home')}</a>
              <button onClick={() => handleNavClick('programs')} className="block px-3 py-2 text-gray-300 hover:text-accentGold font-bold w-full text-start cursor-pointer">{t('nav.programs')}</button>
              <button onClick={() => handleNavClick('about')} className="block px-3 py-2 text-gray-300 hover:text-accentGold font-bold w-full text-start cursor-pointer">{t('nav.about')}</button>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-accentGold font-black drop-shadow-[0_0_8px_rgba(245,197,24,0.5)]">{t('nav.login')}</Link>
              <button onClick={handleLanguageToggle} className="block px-3 py-2 text-gray-400 hover:text-accentGold w-full text-start font-bold">
                {i18n.language === 'ar' ? 'English' : 'عربي'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Floating WhatsApp */}
      <a 
        href={`https://wa.me/${settings.contact.whatsapp.replace('+', '')}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300"
      >
        <MessageCircle size={28} />
      </a>

      {/* Footer */}
      <footer className="bg-bgDarker text-white pt-16 pb-8 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Column 1: Brand */}
            <div>
              <h3 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300 drop-shadow-[0_0_10px_rgba(245,197,24,0.3)]">منصة فطنة</h3>
              <p className="text-gray-400 font-bold mb-6">نُعدّهم للحياة، لا للامتحانات</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:text-[#E1306C] hover:bg-white/20 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:text-[#1877F2] hover:bg-white/20 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:text-[#00f2fe] hover:bg-white/20 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.16-3.44-3.37-3.65-5.71-.24-1.79.15-3.69 1.07-5.16 1.17-1.87 3.28-3.09 5.49-3.23 1.25-.09 2.52.12 3.64.63l-.06 4.13c-.93-.4-2-.48-2.98-.24-1.16.27-2.15 1.09-2.58 2.2-.42 1.06-.31 2.33.3 3.27.67 1.05 1.91 1.68 3.15 1.58 1.35-.09 2.52-1.01 2.84-2.31.14-.58.18-1.18.17-1.77V.02z" />
                  </svg>
                </a>
                <a href={`https://wa.me/${settings.contact.whatsapp.replace('+', '')}`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:text-[#25D366] hover:bg-[#25D366]/20 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 0C5.399 0 0 5.405 0 12.04c0 2.121.554 4.195 1.611 6.015L.302 23.364l5.485-1.44a11.96 11.96 0 006.244 1.737h.005c6.626 0 12.029-5.4 12.029-12.038C24.062 5.407 18.66 0 12.031 0zm0 21.65h-.004a9.98 9.98 0 01-5.093-1.39l-.365-.217-3.784.992.997-3.687-.238-.38A9.973 9.973 0 012 12.04c0-5.526 4.49-10.024 10.034-10.024 5.527 0 10.03 4.497 10.03 10.023 0 5.529-4.502 10.012-10.033 10.012zM17.544 14.15c-.302-.15-1.785-.88-2.062-.982-.276-.1-.478-.15-.68.15-.201.303-.78 1.026-.957 1.233-.177.208-.354.233-.655.083-1.637-.813-2.946-1.89-4.053-3.753-.11-.186.113-.174.407-.76.076-.151.038-.283-.02-.435-.058-.15-.68-1.642-.931-2.25-.245-.591-.493-.51-.68-.52h-.581c-.201 0-.528.075-.805.378-.276.303-1.055 1.03-1.055 2.511 0 1.482 1.08 2.915 1.23 3.118.15.202 2.128 3.25 5.155 4.553.72.31 1.28.496 1.716.635.723.23 1.382.197 1.9.12.584-.087 1.785-.73 2.037-1.436.251-.707.251-1.31.176-1.436-.075-.127-.277-.202-.578-.354z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xl font-black mb-6 text-white border-b border-white/10 pb-2 inline-block">روابط سريعة</h4>
              <ul className="space-y-3 font-bold text-gray-400">
                <li><a href="/" onClick={handleHomeClick} className="hover:text-accentGold transition-colors cursor-pointer">الرئيسية</a></li>
                <li><button onClick={() => handleNavClick('programs')} className="hover:text-accentGold transition-colors cursor-pointer">البرامج</button></li>
                <li><button onClick={() => handleNavClick('about')} className="hover:text-accentGold transition-colors cursor-pointer">من نحن</button></li>
                <li><button onClick={() => handleNavClick('contact')} className="hover:text-accentGold transition-colors cursor-pointer">تواصل معنا</button></li>
              </ul>
            </div>

            {/* Column 3: Programs */}
            <div>
              <h4 className="text-xl font-black mb-6 text-white border-b border-white/10 pb-2 inline-block">البرامج</h4>
              <ul className="space-y-3 font-bold text-gray-400">
                <li><Link to="/modules/quran" onClick={() => window.scrollTo(0, 0)} className="hover:text-accentGold transition-colors">التعليم القرآني</Link></li>
                <li><Link to="/modules/memory" onClick={() => window.scrollTo(0, 0)} className="hover:text-accentGold transition-colors">الذاكرة الخارقة</Link></li>
                <li><Link to="/modules/soroban" onClick={() => window.scrollTo(0, 0)} className="hover:text-accentGold transition-colors">الحساب الذهني (السوروبان)</Link></li>
                <li><Link to="/modules/problem-solving" onClick={() => window.scrollTo(0, 0)} className="hover:text-accentGold transition-colors">حل المشكلات</Link></li>
                <li><Link to="/modules/health" onClick={() => window.scrollTo(0, 0)} className="hover:text-accentGold transition-colors">الصحة واللياقة</Link></li>
                <li><Link to="/modules/history" onClick={() => window.scrollTo(0, 0)} className="hover:text-accentGold transition-colors">التاريخ والحضارة</Link></li>
                <li><Link to="/modules/languages" onClick={() => window.scrollTo(0, 0)} className="hover:text-accentGold transition-colors">اللغات</Link></li>
                <li><Link to="/modules/talents" onClick={() => window.scrollTo(0, 0)} className="hover:text-accentGold transition-colors">المواهب والإبداع</Link></li>
                <li><Link to="/modules/psychology" onClick={() => window.scrollTo(0, 0)} className="hover:text-accentGold transition-colors">علم النفس</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="text-xl font-black mb-6 text-white border-b border-white/10 pb-2 inline-block">تواصل معنا</h4>
              <ul className="space-y-4 font-bold text-gray-400">
                <li className="flex items-center gap-3">
                  <span className="text-xl">📧</span>
                  <a href={`mailto:${settings.contact.email}`} className="hover:text-white transition-colors" dir="ltr">{settings.contact.email}</a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">📞</span>
                  <a href={`https://wa.me/${settings.contact.whatsapp.replace('+', '')}`} className="hover:text-white transition-colors" dir="ltr">{settings.contact.whatsapp}</a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <span>{settings.contact.address}</span>
                </li>
              </ul>
              <a href={`https://wa.me/${settings.contact.whatsapp.replace('+', '')}`} className="mt-6 inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1DA851] transition-colors shadow-lg">
                <MessageCircle size={20} />
                راسلنا على واتساب
              </a>
            </div>

          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-gray-500 font-bold bg-bgDarker">
            جميع الحقوق محفوظة © 2026 منصة فطنة
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
