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
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl hover:bg-white/20 transition-colors">📸</a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl hover:bg-white/20 transition-colors">📘</a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl hover:bg-white/20 transition-colors">🎵</a>
                <a href={`https://wa.me/${settings.contact.whatsapp.replace('+', '')}`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl hover:bg-[#25D366] transition-colors">💬</a>
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
                <li><Link to="/modules/quran" className="hover:text-accentGold transition-colors">التعليم القرآني</Link></li>
                <li><Link to="/modules/memory" className="hover:text-accentGold transition-colors">الذاكرة الخارقة</Link></li>
                <li><Link to="/modules/soroban" className="hover:text-accentGold transition-colors">الحساب الذهني</Link></li>
                <li><Link to="/modules/problem-solving" className="hover:text-accentGold transition-colors">البرمجة والذكاء الاصطناعي</Link></li>
                <li><Link to="/modules/languages" className="hover:text-accentGold transition-colors">اللغة الإنجليزية</Link></li>
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
