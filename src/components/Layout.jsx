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
    <div className="min-h-screen flex flex-col font-sans">
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
      <footer className="bg-bgDarker text-white py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300 drop-shadow-[0_0_10px_rgba(245,197,24,0.3)]">فطنة</h3>
            <p className="text-gray-400">{t('hero.subtitle')}</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4 text-gray-100">{t('nav.contact')}</h4>
            <p className="text-gray-400 mb-2">{settings.contact.email}</p>
            <p className="text-gray-400 mb-2" dir="ltr">{settings.contact.whatsapp}</p>
            <p className="text-gray-400">{settings.contact.address}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 text-center text-gray-500 font-bold">
          {t('footer.copyright')}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
