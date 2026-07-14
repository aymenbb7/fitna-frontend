import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { SettingsContext } from '../../context/SettingsContext';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { BookOpen, Users, Star, ArrowLeft } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();
  const { settings } = React.useContext(SettingsContext);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    // Fetch modules from API (or mock if backend unavailable for some reason)
    api.get('/modules/')
      .then(res => setModules(res.data))
      .catch(err => {
        console.error(err);
        // Fallback mock
        setModules([
          { slug: 'quran', name: 'قسم التعليم القرآني', description: 'حفظ وتجويد', icon: '🕌', color_primary: '#1B5E20' },
          { slug: 'memory', name: 'الذاكرة الخارقة', description: 'تطوير الحفظ', icon: '🧠', color_primary: '#1565C0' },
        ]);
      });
  }, []);

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative h-[90vh] bg-gradient-to-br from-primary to-primary-dark overflow-hidden flex items-center justify-center text-white">
        {/* Floating background symbols */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-20 right-20 text-6xl opacity-10"
        >
          ∞
        </motion.div>
        <motion.div 
          animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} 
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-40 left-20 text-8xl opacity-10"
        >
          ∑
        </motion.div>

        <div className="z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black mb-6"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl font-light mb-10 text-blue-100"
          >
            {t('hero.subtitle')}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="#programs" className="px-8 py-4 bg-accent text-white font-bold rounded-xl text-xl hover:bg-orange-600 transition shadow-lg">
              {t('hero.discover')}
            </a>
            <Link to="/login" className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white font-bold rounded-xl text-xl hover:bg-white/20 transition">
              {t('nav.login')}
            </Link>
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 w-full bg-black/20 backdrop-blur-md py-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 flex justify-around text-center">
            <div>
              <div className="text-3xl font-bold">{settings.stats.students}+</div>
              <div className="text-sm text-blue-200">طالب مسجل</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{settings.stats.modules}</div>
              <div className="text-sm text-blue-200">برامج متخصصة</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{settings.stats.satisfaction}%</div>
              <div className="text-sm text-blue-200">نسبة الرضا</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-8 text-gray-900">{t('nav.about')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-16">
            {settings.about}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-blue-50 rounded-2xl">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">بيئة تفاعلية</h3>
              <p className="text-gray-600">نركز على التفاعل والمشاركة لبناء مهارات حقيقية.</p>
            </div>
            <div className="p-8 bg-orange-50 rounded-2xl">
              <Star className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">محتوى متميز</h3>
              <p className="text-gray-600">مناهج مصممة بعناية لتناسب الفئة العمرية 14-18 سنة.</p>
            </div>
            <div className="p-8 bg-green-50 rounded-2xl">
              <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">متابعة مستمرة</h3>
              <p className="text-gray-600">تقييمات دورية واختبارات لقياس مستوى التقدم.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Modules Section */}
      <section id="programs" className="py-24 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900">{t('modules.title')}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((mod) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={mod.slug} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group"
              >
                <div 
                  className="h-2 absolute top-0 w-full" 
                  style={{ backgroundColor: mod.color_primary }}
                />
                <div className="p-8">
                  <div className="text-5xl mb-6">{mod.icon}</div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: mod.color_primary }}>{mod.name}</h3>
                  <p className="text-gray-600 mb-8 min-h-[3rem]">{mod.description}</p>
                  
                  <div className="flex gap-4">
                    <Link 
                      to={`/modules/${mod.slug}`} 
                      className="flex-1 py-3 text-center text-white font-bold rounded-lg transition"
                      style={{ backgroundColor: mod.color_primary }}
                    >
                      التفاصيل
                    </Link>
                  </div>
                </div>
                {/* Subtle background symbol */}
                <div className="absolute -bottom-4 -left-4 text-8xl opacity-[0.03] rotate-12 pointer-events-none transition-transform group-hover:scale-110">
                  {mod.icon}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16">{t('how_it_works.title')}</h2>
          <div className="flex flex-col md:flex-row justify-between items-center relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10" />
            {[
              { num: 1, text: t('how_it_works.step1') },
              { num: 2, text: t('how_it_works.step2') },
              { num: 3, text: t('how_it_works.step3') },
              { num: 4, text: t('how_it_works.step4') }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center bg-white p-4 mb-8 md:mb-0 w-full md:w-1/4">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-lg border-4 border-white">
                  {step.num}
                </div>
                <div className="font-bold text-lg text-gray-800 text-center">{step.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="py-24 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16">ماذا يقولون عنا؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "أم أحمد", role: "ولية أمر", text: "لاحظت تغييراً كبيراً في شخصية ابني بعد انضمامه لبرنامج حل المشكلات." },
              { name: "ياسين", role: "طالب (16 سنة)", text: "البرامج هنا مختلفة تماماً عن المدرسة، نتعلم أشياء تفيدنا في حياتنا." },
              { name: "أ. محمد", role: "أستاذ رياضيات", text: "طريقة تقديم المعلومات في فطنة مبتكرة وتجعل التعلم ممتعاً." }
            ].map((test, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4 text-yellow-400">
                  <Star fill="currentColor" />
                  <Star fill="currentColor" />
                  <Star fill="currentColor" />
                  <Star fill="currentColor" />
                  <Star fill="currentColor" />
                </div>
                <p className="text-gray-600 mb-6 italic">"{test.text}"</p>
                <div>
                  <div className="font-bold">{test.name}</div>
                  <div className="text-sm text-gray-500">{test.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16">الأسئلة الشائعة</h2>
          <div className="space-y-4">
            {[
              { q: "هل هناك شهادات معتمدة؟", a: "نعم، يحصل الطالب على شهادة إتمام بعد اجتياز متطلبات كل برنامج بنجاح." },
              { q: "ما هي طرق الدفع المتاحة؟", a: "نوفر طرق دفع متعددة لتسهيل العملية على أولياء الأمور، ويمكنك معرفة المزيد من لوحة التحكم الخاصة بك." },
              { q: "هل الدروس مباشرة أم مسجلة؟", a: "نعتمد نظاماً يجمع بين الجلسات المباشرة التفاعلية والدروس المسجلة للمراجعة." }
            ].map((faq, i) => (
              <details key={i} className="group bg-gray-50 rounded-xl border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg">
                  {faq.q}
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-gray-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Contact Section */}
      <section id="contact" className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-8">{t('contact.title')}</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">فريقنا مستعد دائماً للإجابة على استفساراتكم ومساعدتكم في اختيار البرنامج الأنسب.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href={`https://wa.me/${settings.contact.whatsapp.replace('+', '')}`} className="px-8 py-4 bg-green-500 font-bold rounded-xl text-xl hover:bg-green-600 transition flex items-center justify-center gap-3">
              تواصل عبر واتساب
            </a>
            <a href={`mailto:${settings.contact.email}`} className="px-8 py-4 bg-white/10 font-bold rounded-xl text-xl hover:bg-white/20 transition flex items-center justify-center gap-3">
              راسلنا عبر الإيميل
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
