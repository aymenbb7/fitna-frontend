import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Settings, Save, Shield, Palette, Mail, LayoutTemplate, Send, Key, Check, X, AlertCircle, Phone, Clock } from 'lucide-react';
import api from '../../api/axios';
import { toast } from '../../utils/toast';

export const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('branding');
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('fitna_theme') || 'luxury');

  const [settings, setSettings] = useState({
    site_name: '',
    logo_url: '',
    site_primary_color: '#F5C518',
    site_secondary_color: '#7C3AED',
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_use_tls: true,
    
    landing_hero_title: '',
    landing_hero_subtitle: '',
    landing_hero_button_text: '',
    landing_hero_button_url: '',
    landing_about_title: '',
    landing_about_text: '',
    landing_programs_json: '[]',
    landing_features_json: '[]',
    landing_stats_json: '[]',
    landing_testimonials_json: '[]',
    landing_faq_json: '[]',
    landing_features_title: 'التعلم أصبح أكثر متعة!',
    landing_features_subtitle: '',
    landing_stats_title: 'إنجازاتنا بالأرقام',
    landing_programs_title: 'برامجنا الممتعة ✨',
    landing_how_it_works_title: 'كيف تعمل المنصة؟',
    landing_testimonials_title: 'ماذا يقولون عنا؟',
    landing_faq_title: 'الأسئلة الشائعة',
    landing_cta_title: '',
    landing_cta_text: '',
    landing_cta_button_text: '',
    landing_cta_button_url: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    footer_text: '',
    footer_desc: '',
    social_facebook: '',
    social_instagram: '',
    social_tiktok: '',
    social_whatsapp: ''
  });

  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [regsLoading, setRegsLoading] = useState(false);

  const fetchPendingRegistrations = async () => {
    try {
      setRegsLoading(true);
      const res = await api.get('/admin/users/');
      const pending = res.data.filter(u => u.role === 'STUDENT' && !u.is_approved);
      setRegistrations(pending);
    } catch (err) {
      console.error("Failed to load registrations");
    } finally {
      setRegsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'registrations') {
      fetchPendingRegistrations();
    }
  }, [activeTab]);

  const handleApproveRegistration = async (id, name) => {
    if (!window.confirm(`هل أنت متأكد من قبول تسجيل ${name}؟`)) return;
    try {
      setLoading(true);
      await api.post(`/admin/users/${id}/update/`, { is_approved: true });
      toast.success("تم قبول التسجيل بنجاح وتفعيل حساب الطالب.");
      fetchPendingRegistrations();
    } catch (err) {
      toast.error("حدث خطأ أثناء قبول التسجيل.");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRegistration = async (id, name) => {
    if (!window.confirm(`هل أنت متأكد من رفض وحذف طلب تسجيل ${name}؟ هذا الإجراء نهائي.`)) return;
    try {
      setLoading(true);
      await api.delete(`/admin/users/${id}/`);
      toast.success("تم رفض وحذف الطلب بنجاح.");
      fetchPendingRegistrations();
    } catch (err) {
      toast.error("حدث خطأ أثناء رفض الطلب.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('fitna_theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/site-settings/');
        const data = res.data || {};
        // Safely merge DB data with current state, converting nulls to empty strings
        setSettings(prev => {
          const merged = { ...prev };
          for (const key in data) {
            merged[key] = data[key] !== null ? data[key] : '';
          }
          return merged;
        });
      } catch (err) {
        console.error("Failed to load settings");
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await api.post('/admin/site-settings/', { ...settings, action: 'update' });
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) return toast.error("أدخل بريد إلكتروني لاختبار الإرسال");
    try {
      setLoading(true);
      const res = await api.post('/admin/site-settings/', { action: 'test_email', email: testEmail });
      toast.success(res.data.message || "تم إرسال بريد الاختبار بنجاح!");
    } catch (err) {
      toast.error(err.response?.data?.error || "فشل إرسال بريد الاختبار. تأكد من صحة إعدادات SMTP.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'branding', label: 'المظهر والهوية', icon: Palette },
    { id: 'landing', label: 'الصفحة الرئيسية', icon: LayoutTemplate },
    { id: 'email', label: 'إعدادات البريد (SMTP)', icon: Mail },
    { id: 'registrations', label: 'طلبات التسجيل الجديدة', icon: Shield },
  ];

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="إعدادات المنصة" 
        description="إدارة المظهر، الصفحة الرئيسية، طلبات التسجيل، وإعدادات البريد الإلكتروني"
        actionLabel={activeTab !== 'registrations' ? "حفظ الإعدادات" : undefined}
        actionIcon={activeTab !== 'registrations' ? Save : undefined}
        onAction={activeTab !== 'registrations' ? handleSaveSettings : undefined}
        loading={loading}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <Card noPadding className="sticky top-24 overflow-hidden">
            <div className="p-4 space-y-2 bg-bgPurple">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold ${
                      isActive 
                        ? 'bg-accentGold text-bgDark' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <Card className="min-h-[60vh]">
            <h3 className="text-2xl font-black text-white mb-8 border-b border-white/10 pb-4">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>

            {activeTab === 'branding' && (
              <div className="space-y-8 max-w-3xl">
                <div className="bg-bgDark p-6 rounded-2xl border border-white/10 space-y-6">
                  <h3 className="text-xl font-black text-accentGold border-b border-white/10 pb-4">إعدادات الهوية البصرية (Branding)</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">اسم المنصة (Site Name)</label>
                    <input type="text" name="site_name" value={settings.site_name || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accentGold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">رابط الشعار (Logo URL)</label>
                    <input type="url" name="logo_url" value={settings.logo_url || ''} onChange={handleChange} placeholder="https://example.com/logo.png" className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">اللون الأساسي (Primary Color)</label>
                      <input type="color" name="site_primary_color" value={settings.site_primary_color || '#1A0A4B'} onChange={handleChange} className="w-full h-12 rounded-xl cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">اللون الثانوي (Secondary Color)</label>
                      <input type="color" name="site_secondary_color" value={settings.site_secondary_color || '#F5C518'} onChange={handleChange} className="w-full h-12 rounded-xl cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-4">اختيار القالب (السمة البصرية)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'luxury', name: 'فاخر ذهبي (الافتراضي)' },
                      { id: 'professional', name: 'أزرق احترافي (الشركات)' },
                      { id: 'kids', name: 'ملون تفاعلي (للأطفال)' },
                      { id: 'ocean', name: 'أعماق المحيط (أزرق غامق)' },
                      { id: 'nature', name: 'الطبيعة الخضراء (هادئ)' },
                      { id: 'sunset', name: 'غروب الشمس (برتقالي/وردي)' },
                      { id: 'cyberpunk', name: 'سايبر بانك (نيون/أسود)' },
                      { id: 'midnight', name: 'منتصف الليل (أرجواني غامق)' },
                      { id: 'coffee', name: 'قهوة داكنة (بني مريح)' },
                      { id: 'rose', name: 'وردي ناعم (عصري)' },
                    ].map(theme => (
                      <label key={theme.id} className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${currentTheme === theme.id ? 'border-accentGold bg-accentGold/10 scale-[1.02] shadow-[0_0_20px_rgba(245,197,24,0.15)]' : 'border-white/10 bg-bgDark hover:border-white/20'}`}>
                        <input 
                          type="radio" 
                          name="theme" 
                          value={theme.id} 
                          checked={currentTheme === theme.id}
                          onChange={(e) => setCurrentTheme(e.target.value)}
                          className="hidden"
                        />
                        <div className="w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0" style={{ borderColor: currentTheme === theme.id ? '#F5C518' : '#4b5563' }}>
                          {currentTheme === theme.id && <div className="w-3 h-3 rounded-full bg-accentGold"></div>}
                        </div>
                        <span className="text-white font-bold text-lg">{theme.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'landing' && (
              <div className="space-y-8 max-w-3xl">
                <div className="bg-bgDark p-6 rounded-2xl border border-white/10 space-y-6">
                  <h3 className="text-xl font-black text-accentGold border-b border-white/10 pb-4">قسم البداية (Hero Section)</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">العنوان الرئيسي (Hero Title)</label>
                    <input type="text" name="landing_hero_title" value={settings.landing_hero_title || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accentGold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">النص الفرعي (Hero Subtitle)</label>
                    <textarea rows="3" name="landing_hero_subtitle" value={settings.landing_hero_subtitle || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors"></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">نص الزر الرئيسي</label>
                      <input type="text" name="landing_hero_button_text" value={settings.landing_hero_button_text || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">رابط الزر (URL)</label>
                      <input type="text" name="landing_hero_button_url" value={settings.landing_hero_button_url || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr" />
                    </div>
                  </div>
                </div>

                <div className="bg-bgDark p-6 rounded-2xl border border-white/10 space-y-6">
                  <h3 className="text-xl font-black text-accentGold border-b border-white/10 pb-4">قسم من نحن (About Section)</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">عنوان القسم</label>
                    <input type="text" name="landing_about_title" value={settings.landing_about_title || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accentGold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">النص التفصيلي</label>
                    <textarea rows="4" name="landing_about_text" value={settings.landing_about_text || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors"></textarea>
                  </div>
                </div>

                <div className="bg-bgDark p-6 rounded-2xl border border-white/10 space-y-6">
                  <h3 className="text-xl font-black text-accentGold border-b border-white/10 pb-4">المحتوى الديناميكي (Advanced JSON & Titles)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-white/10 pb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">عنوان قسم البرامج</label>
                      <input type="text" name="landing_programs_title" value={settings.landing_programs_title || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accentGold transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">عنوان قسم الإحصائيات</label>
                      <input type="text" name="landing_stats_title" value={settings.landing_stats_title || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accentGold transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">عنوان قسم الميزات (App Preview)</label>
                      <input type="text" name="landing_features_title" value={settings.landing_features_title || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accentGold transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">نص قسم الميزات</label>
                      <input type="text" name="landing_features_subtitle" value={settings.landing_features_subtitle || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accentGold transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">عنوان كيف تعمل المنصة</label>
                      <input type="text" name="landing_how_it_works_title" value={settings.landing_how_it_works_title || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accentGold transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">عنوان آراء العملاء</label>
                      <input type="text" name="landing_testimonials_title" value={settings.landing_testimonials_title || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accentGold transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">عنوان الأسئلة الشائعة</label>
                      <input type="text" name="landing_faq_title" value={settings.landing_faq_title || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accentGold transition-colors" />
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-4 pt-2">هنا يمكنك إدخال البيانات بصيغة JSON لبناء الأقسام المتقدمة كالبرامج والميزات.</p>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">البرامج (Programs JSON)</label>
                    <textarea rows="3" name="landing_programs_json" value={settings.landing_programs_json || '[]'} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">المميزات (Features JSON)</label>
                    <textarea rows="3" name="landing_features_json" value={settings.landing_features_json || '[]'} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">الإحصائيات (Stats JSON)</label>
                    <textarea rows="3" name="landing_stats_json" value={settings.landing_stats_json || '[]'} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">آراء العملاء (Testimonials JSON)</label>
                    <textarea rows="3" name="landing_testimonials_json" value={settings.landing_testimonials_json || '[]'} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">الأسئلة الشائعة (FAQ JSON)</label>
                    <textarea rows="3" name="landing_faq_json" value={settings.landing_faq_json || '[]'} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr font-mono text-sm"></textarea>
                  </div>
                </div>

                <div className="bg-bgDark p-6 rounded-2xl border border-white/10 space-y-6">
                  <h3 className="text-xl font-black text-accentGold border-b border-white/10 pb-4">قسم اتخاذ القرار (CTA Section)</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">عنوان الـ CTA</label>
                    <input type="text" name="landing_cta_title" value={settings.landing_cta_title || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accentGold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">نص الـ CTA</label>
                    <textarea rows="3" name="landing_cta_text" value={settings.landing_cta_text || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors"></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">نص زر الـ CTA</label>
                      <input type="text" name="landing_cta_button_text" value={settings.landing_cta_button_text || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">رابط زر الـ CTA</label>
                      <input type="text" name="landing_cta_button_url" value={settings.landing_cta_button_url || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-bgDark p-6 rounded-2xl border border-white/10 space-y-6">
                  <h3 className="text-xl font-black text-accentGold border-b border-white/10 pb-4">معلومات الاتصال (Contact Info)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">البريد الإلكتروني للاتصال</label>
                      <input type="email" name="contact_email" value={settings.contact_email || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">رقم الهاتف</label>
                      <input type="text" name="contact_phone" value={settings.contact_phone || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">عنوان المقر</label>
                    <textarea rows="2" name="contact_address" value={settings.contact_address || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors"></textarea>
                  </div>
                </div>

                <div className="bg-bgDark p-6 rounded-2xl border border-white/10 space-y-6">
                  <h3 className="text-xl font-black text-accentGold border-b border-white/10 pb-4">التذييل والروابط الاجتماعية (Footer & Social)</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">نص حقوق الطبع والنشر (Footer Text)</label>
                    <input type="text" name="footer_text" value={settings.footer_text || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-accentGold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">وصف مختصر للشركة (Footer Description)</label>
                    <textarea rows="2" name="footer_desc" value={settings.footer_desc || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors"></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">Facebook URL</label>
                      <input type="url" name="social_facebook" value={settings.social_facebook || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">Instagram URL</label>
                      <input type="url" name="social_instagram" value={settings.social_instagram || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">TikTok URL</label>
                      <input type="url" name="social_tiktok" value={settings.social_tiktok || ''} onChange={handleChange} className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">WhatsApp Number (للشات)</label>
                      <input type="text" name="social_whatsapp" value={settings.social_whatsapp || ''} onChange={handleChange} placeholder="+213xxxxxxxxx" className="w-full bg-bgPurple border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-8 max-w-2xl">
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-300 text-sm font-bold flex gap-3">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <p>تُستخدم هذه الإعدادات لإرسال إشعارات البريد الإلكتروني، واستعادة كلمة المرور، والفواتير للطلاب. يتم تشفير كلمة المرور في قاعدة البيانات لحمايتها.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">خادم البريد (SMTP Host)</label>
                    <input 
                      type="text" 
                      name="smtp_host"
                      value={settings.smtp_host || ''}
                      onChange={handleChange}
                      placeholder="smtp.gmail.com"
                      className="w-full bg-bgDark border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">المنفذ (Port)</label>
                    <input 
                      type="number" 
                      name="smtp_port"
                      value={settings.smtp_port || 587}
                      onChange={handleChange}
                      className="w-full bg-bgDark border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr" 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-gray-400 mb-2">اسم المستخدم (البريد الإلكتروني)</label>
                    <input 
                      type="email" 
                      name="smtp_username"
                      value={settings.smtp_username || ''}
                      onChange={handleChange}
                      placeholder="your-email@gmail.com"
                      className="w-full bg-bgDark border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr" 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-gray-400 mb-2">كلمة المرور (App Password)</label>
                    <div className="relative">
                      <input 
                        type="password" 
                        name="smtp_password"
                        value={settings.smtp_password || ''}
                        onChange={handleChange}
                        className="w-full bg-bgDark border border-white/10 rounded-xl py-3 px-4 pr-12 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr tracking-widest" 
                      />
                      <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-bgDark p-4 rounded-xl border border-white/5">
                  <input 
                    type="checkbox" 
                    id="smtp_use_tls"
                    name="smtp_use_tls"
                    checked={settings.smtp_use_tls}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-600 bg-bgDark text-accentGold focus:ring-accentGold focus:ring-offset-bgPurple" 
                  />
                  <label htmlFor="smtp_use_tls" className="text-sm font-bold text-gray-300 cursor-pointer select-none">
                    استخدام تشفير TLS (موصى به لمعظم الخوادم مثل Gmail)
                  </label>
                </div>

                <div className="border-t border-white/10 pt-8 mt-8">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Send size={20} className="text-accentGold" />
                    اختبار الإرسال
                  </h4>
                  <div className="flex gap-4">
                    <input 
                      type="email" 
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="أدخل بريدك لاختبار الإرسال..."
                      className="flex-1 bg-bgDark border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accentGold transition-colors text-left dir-ltr" 
                    />
                    <Button 
                      onClick={handleTestEmail} 
                      disabled={loading || !testEmail}
                      variant="primary" 
                      className="whitespace-nowrap px-8"
                    >
                      {loading ? 'جاري الإرسال...' : 'إرسال اختبار'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'registrations' && (
              <div className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-300 text-sm font-bold flex gap-3">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <p>تظهر هنا طلبات التسجيل المقدمة من الطلاب عبر الصفحات العامة للأقسام. قبول الطلب سيقوم بتفعيل حساب الطالب فورياً وإرسال إشعارات الترحيب.</p>
                </div>

                {regsLoading ? (
                  <div className="p-12 text-center text-gray-400">جاري تحميل طلبات التسجيل...</div>
                ) : registrations.length === 0 ? (
                  <div className="p-16 text-center border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center">
                    <Shield className="w-16 h-16 text-white/20 mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">لا توجد طلبات تسجيل معلقة</h4>
                    <p className="text-gray-400 text-sm">سيظهر الطلاب المسجلون حديثاً والذين ينتظرون التفعيل هنا.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registrations.map((reg) => (
                      <div key={reg.id} className="bg-bgDark p-6 rounded-3xl border border-white/5 hover:border-white/10 transition flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accentGold/20 flex items-center justify-center text-accentGold font-bold">
                              {reg.full_name ? reg.full_name.substring(0, 2).toUpperCase() : 'ST'}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg">{reg.full_name}</h4>
                              <p className="text-sm text-gray-400">{reg.email}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400 pt-1">
                            {reg.phone_number && (
                              <span className="flex items-center gap-1">
                                <Phone size={14} /> {reg.phone_number}
                              </span>
                            )}
                            {reg.age && (
                              <span className="flex items-center gap-1">
                                <Clock size={14} /> العمر: {reg.age} سنة
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <AlertCircle size={14} /> طلب انضمام: {new Date(reg.date_joined).toLocaleDateString('ar-DZ')}
                            </span>
                          </div>
                          
                          {reg.enrolled_modules && reg.enrolled_modules.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {reg.enrolled_modules.map((m) => (
                                <Badge key={m.slug} variant="primary">
                                  {m.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3 self-end md:self-center">
                          <Button
                            onClick={() => handleApproveRegistration(reg.id, reg.full_name)}
                            disabled={loading}
                            variant="primary"
                            className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2"
                          >
                            <Check size={16} />
                            قبول التسجيل
                          </Button>
                          <Button
                            onClick={() => handleRejectRegistration(reg.id, reg.full_name)}
                            disabled={loading}
                            variant="danger"
                            className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 font-bold px-6 py-2.5 rounded-xl flex items-center gap-2"
                          >
                            <X size={16} />
                            رفض الطلب
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
