import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { SettingsContext } from '../../context/SettingsContext';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { BookOpen, Users, Star, ArrowLeft, Trophy, CheckCircle2, ChevronLeft } from 'lucide-react';

const MODULE_COLORS = {
  'quran': '#10B981', // green
  'memory': '#8B5CF6', // purple
  'soroban': '#F59E0B', // amber
  'problem-solving': '#3B82F6', // blue
  'health': '#EF4444', // red
  'history': '#D97706', // orange
  'languages': '#EC4899', // pink
  'talents': '#06B6D4', // cyan
  'psychology': '#6366F1', // indigo
};

const SYMBOLS = [
  { text: '🚀', top: '15%', left: '10%', duration: 12, size: 'text-6xl', rotate: 20 },
  { text: '⭐', top: '70%', left: '85%', duration: 15, size: 'text-5xl', rotate: 180 },
  { text: '⚡', top: '30%', left: '85%', duration: 10, size: 'text-7xl', rotate: -15 },
  { text: '🏆', top: '80%', left: '15%', duration: 18, size: 'text-6xl', rotate: 0 },
  { text: '📚', top: '25%', left: '50%', duration: 22, size: 'text-7xl', rotate: -10 },
  { text: '🎮', top: '65%', left: '35%', duration: 14, size: 'text-6xl', rotate: 15 },
];

const Home = () => {
  const { t } = useTranslation();
  const { settings } = React.useContext(SettingsContext);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    api.get('/modules/')
      .then(res => setModules(res.data))
      .catch(err => {
        setModules([
          { slug: 'quran', name: 'قسم التعليم القرآني', description: 'حفظ وتجويد بطرق تفاعلية.', icon: '🕌' },
          { slug: 'memory', name: 'الذاكرة الخارقة', description: 'تطوير مهارات الحفظ السريع.', icon: '🧠' },
          { slug: 'soroban', name: 'الحساب الذهني', description: 'تطوير السرعة في الحساب.', icon: '🧮' },
        ]);
      });
  }, []);

  return (
    <div className="w-full bg-bgDark overflow-hidden text-white font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-bgDark to-bgDarker flex items-center justify-center pt-20 pb-32">
        {/* Confetti / Particle Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Floating background symbols */}
        {SYMBOLS.map((sym, i) => (
          <motion.div 
            key={i}
            animate={{ 
              y: [0, -40, 0], 
              rotate: [sym.rotate, sym.rotate + 15, sym.rotate] 
            }} 
            transition={{ duration: sym.duration, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute ${sym.size} opacity-80 pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`}
            style={{ top: sym.top, left: sym.left }}
          >
            {sym.text}
          </motion.div>
        ))}

        <div className="z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300 drop-shadow-[0_0_20px_rgba(245,197,24,0.6)] py-2"
          >
            فطنة أكاديمي
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold mb-10 text-white max-w-3xl"
          >
            نُعدّهم للحياة، لا للامتحانات!
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto"
          >
            <a href="#programs" className="px-10 py-5 bg-accentGold text-bgDark font-black rounded-2xl text-xl hover:bg-yellow-400 transition shadow-[0_0_20px_rgba(245,197,24,0.5)] hover:shadow-[0_0_30px_rgba(245,197,24,0.8)] transform hover:scale-105 duration-200">
              ابدأ رحلتك الآن 🚀
            </a>
            <Link to="/login" className="px-10 py-5 bg-transparent border-2 border-white text-white font-bold rounded-2xl text-xl hover:bg-white/10 transition transform hover:scale-105 duration-200">
              تسجيل الدخول
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex items-center gap-4 bg-bgPurple/50 backdrop-blur border border-white/10 py-3 px-6 rounded-full"
          >
            <div className="flex -space-x-4 space-x-reverse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-bgDark bg-gradient-to-br from-primary to-accentPurple" />
              ))}
            </div>
            <div className="font-bold text-lg">
              <span className="text-accentGold">+5000</span> طالب يثقون بنا
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-16 px-4 max-w-6xl mx-auto">
        <div className="bg-bgPurple rounded-3xl border border-white/10 shadow-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-x-reverse divide-white/10">
          <div className="text-center">
            <div className="text-4xl mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🙂</div>
            <div className="text-3xl font-black text-white">{settings.stats.students}+</div>
            <div className="text-gray-400 font-bold">طالب مسجل</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2 drop-shadow-[0_0_10px_rgba(245,197,24,0.8)]">🏆</div>
            <div className="text-3xl font-black text-white">{settings.stats.modules}+</div>
            <div className="text-gray-400 font-bold">برنامج متخصص</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">🎓</div>
            <div className="text-3xl font-black text-white">15+</div>
            <div className="text-gray-400 font-bold">مدرب خبير</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">⭐</div>
            <div className="text-3xl font-black text-white">{settings.stats.satisfaction}%</div>
            <div className="text-gray-400 font-bold">نسبة الرضا</div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="programs" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <h2 className="text-5xl font-black text-white inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              برامجنا الممتعة ✨
            </h2>
          </div>

          <div className="flex overflow-x-auto snap-x md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8 md:pb-0 hide-scrollbar perspective-[2000px]">
            {modules.map((mod, index) => {
              const bgColor = MODULE_COLORS[mod.slug] || '#1565C0';
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5 }}
                  key={mod.slug} 
                  className="min-w-[85vw] sm:min-w-[300px] snap-center rounded-3xl overflow-hidden relative group transform-gpu will-change-transform cursor-pointer shadow-2xl flex flex-col"
                  style={{ backgroundColor: bgColor, transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay bg-white/20" />
                  <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(255,255,255,0.2)] pointer-events-none" />

                  <div className="p-8 relative z-10 flex flex-col h-full">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-8xl mb-8 text-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                    >
                      {mod.icon}
                    </motion.div>
                    
                    <h3 className="text-3xl font-black mb-3 text-white drop-shadow-md">{mod.name}</h3>
                    <p className="text-white/90 font-medium mb-12 flex-grow text-lg leading-relaxed">{mod.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="bg-black/20 px-4 py-2 rounded-xl font-bold text-sm">
                        +12 جلسة
                      </span>
                      <Link 
                        to={`/modules/${mod.slug}`} 
                        className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                      >
                        <ChevronLeft size={28} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <button className="px-8 py-4 bg-bgPurple border border-white/20 text-white font-bold rounded-2xl text-xl hover:bg-white/10 transition shadow-lg inline-flex items-center gap-2">
              ⭐ عرض جميع البرامج ⭐
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-bgPurple border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{t('how_it_works.title')}</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: 1, text: t('how_it_works.step1'), color: '#3B82F6' },
              { num: 2, text: t('how_it_works.step2'), color: '#F5C518' },
              { num: 3, text: t('how_it_works.step3'), color: '#10B981' },
              { num: 4, text: t('how_it_works.step4'), color: '#EF4444' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center bg-bgDark p-8 rounded-3xl border border-white/5 shadow-xl hover:-translate-y-2 transition-transform">
                <div 
                  className="w-20 h-20 rounded-2xl text-white flex items-center justify-center text-3xl font-black mb-6 shadow-lg rotate-3"
                  style={{ backgroundColor: step.color, boxShadow: `0 0 20px ${step.color}60` }}
                >
                  {step.num}
                </div>
                <div className="font-bold text-xl text-center text-gray-200">{step.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-bgDark">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16">ماذا يقولون عنا؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "أم أحمد", role: "ولية أمر", text: "لاحظت تغييراً كبيراً في شخصية ابني بعد انضمامه لبرنامج حل المشكلات." },
              { name: "ياسين", role: "طالب (16 سنة)", text: "البرامج هنا مختلفة تماماً عن المدرسة، نتعلم أشياء تفيدنا في حياتنا." },
              { name: "أ. محمد", role: "أستاذ رياضيات", text: "طريقة تقديم المعلومات في فطنة مبتكرة وتجعل التعلم ممتعاً." }
            ].map((test, i) => (
              <div key={i} className="bg-bgPurple p-8 rounded-3xl border border-white/10 shadow-lg relative">
                <div className="absolute -top-4 -right-4 text-5xl opacity-20">💬</div>
                <div className="flex gap-1 mb-6 text-accentGold drop-shadow-[0_0_5px_rgba(245,197,24,0.5)]">
                  <Star fill="currentColor" />
                  <Star fill="currentColor" />
                  <Star fill="currentColor" />
                  <Star fill="currentColor" />
                  <Star fill="currentColor" />
                </div>
                <p className="text-gray-300 mb-8 italic text-lg leading-relaxed">"{test.text}"</p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accentPurple" />
                  <div>
                    <div className="font-bold text-white">{test.name}</div>
                    <div className="text-sm text-gray-400">{test.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-bgPurple border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16">الأسئلة الشائعة</h2>
          <div className="space-y-4">
            {[
              { q: "هل هناك شهادات معتمدة؟", a: "نعم، يحصل الطالب على شهادة إتمام بعد اجتياز متطلبات كل برنامج بنجاح." },
              { q: "ما هي طرق الدفع المتاحة؟", a: "نوفر طرق دفع متعددة لتسهيل العملية على أولياء الأمور، ويمكنك معرفة المزيد من لوحة التحكم الخاصة بك." },
              { q: "هل الدروس مباشرة أم مسجلة؟", a: "نعتمد نظاماً يجمع بين الجلسات المباشرة التفاعلية والدروس المسجلة للمراجعة." }
            ].map((faq, i) => (
              <details key={i} className="group bg-bgDark rounded-2xl border border-white/10 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-xl text-white">
                  {faq.q}
                  <span className="transition-transform group-open:rotate-180 text-accentGold">
                    <svg fill="none" height="24" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-gray-400 text-lg">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-gradient-to-t from-[#0A0720] to-bgDark relative overflow-hidden">
        {/* Glow behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accentPurple/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 bg-bgPurple/50 backdrop-blur-xl p-12 rounded-[3rem] border border-white/10 shadow-2xl">
          <h2 className="text-5xl font-black mb-8 text-white">{t('contact.title')}</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">فريقنا مستعد دائماً للإجابة على استفساراتكم ومساعدتكم في اختيار البرنامج الأنسب.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href={`https://wa.me/${settings.contact.whatsapp.replace('+', '')}`} className="px-10 py-5 bg-[#25D366] text-white font-black rounded-2xl text-xl hover:bg-[#1DA851] transition flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:-translate-y-1">
              تواصل عبر واتساب
            </a>
            <a href={`mailto:${settings.contact.email}`} className="px-10 py-5 bg-white/10 font-bold rounded-2xl text-xl hover:bg-white/20 transition flex items-center justify-center gap-3 border border-white/10">
              راسلنا عبر الإيميل
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
