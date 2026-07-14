import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Globe, MessageCircle } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const Layout = () => {
  const { t, i18n } = useTranslation();
  const { settings } = React.useContext(SettingsContext);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-black text-primary">فطنة</Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              <Link to="/" className="text-gray-700 hover:text-primary font-medium">{t('nav.home')}</Link>
              <a href="#programs" className="text-gray-700 hover:text-primary font-medium">{t('nav.programs')}</a>
              <a href="#about" className="text-gray-700 hover:text-primary font-medium">{t('nav.about')}</a>
              <a href="#contact" className="text-gray-700 hover:text-primary font-medium">{t('nav.contact')}</a>
            </div>

            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              <button onClick={toggleLanguage} className="p-2 text-gray-500 hover:text-primary rounded-full">
                <Globe size={20} />
              </button>
              <Link to="/login" className="px-6 py-2 bg-primary text-white font-medium rounded-lg shadow-sm hover:bg-primary-dark transition-colors">
                {t('nav.login')}
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-500 hover:text-primary p-2">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-gray-700 font-medium">{t('nav.home')}</Link>
              <a href="#programs" className="block px-3 py-2 text-gray-700 font-medium">{t('nav.programs')}</a>
              <a href="#about" className="block px-3 py-2 text-gray-700 font-medium">{t('nav.about')}</a>
              <Link to="/login" className="block px-3 py-2 text-primary font-medium">{t('nav.login')}</Link>
              <button onClick={toggleLanguage} className="block px-3 py-2 text-gray-500 w-full text-start">
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-3xl font-black mb-4">فطنة</h3>
            <p className="text-gray-400">{t('hero.subtitle')}</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">{t('nav.contact')}</h4>
            <p className="text-gray-400 mb-2">{settings.contact.email}</p>
            <p className="text-gray-400 mb-2" dir="ltr">{settings.contact.whatsapp}</p>
            <p className="text-gray-400">{settings.contact.address}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          {t('footer.copyright')}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
