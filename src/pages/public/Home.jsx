import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, animate } from 'framer-motion';
import { SettingsContext } from '../../context/SettingsContext';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { BookOpen, Users, Star, ArrowLeft, Trophy, CheckCircle2, ChevronLeft, Target, Medal, FileText, Smartphone } from 'lucide-react';

const MODULE_COLORS = {
  'quran': '#10B981',
  'memory': '#8B5CF6',
  'soroban': '#F59E0B',
  'problem-solving': '#3B82F6',
  'health': '#EF4444',
  'history': '#D97706',
  'languages': '#EC4899',
  'talents': '#06B6D4',
  'psychology': '#6366F1',
};

const SYMBOLS = [
  { text: '🚀', top: '15%', left: '10%', duration: 12, size: 'text-6xl', rotate: 20 },
  { text: '⭐', top: '70%', left: '85%', duration: 15, size: 'text-5xl', rotate: 180 },
  { text: '⚡', top: '30%', left: '85%', duration: 10, size: 'text-7xl', rotate: -15 },
  { text: '🏆', top: '80%', left: '15%', duration: 18, size: 'text-6xl', rotate: 0 },
  { text: '📚', top: '25%', left: '50%', duration: 22, size: 'text-7xl', rotate: -10 },
  { text: '🎮', top: '65%', left: '35%', duration: 14, size: 'text-6xl', rotate: 15 },
];

const Counter = ({ from, to, duration = 2, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration: duration,
        delay: delay,
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value);
          }
        },
      });
      return () => controls.stop();
    }
  }, [from, to, inView, duration, delay]);

  return <span ref={ref}>{from}</span>;
};

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
    <div className="w-full bg-bgDark overflow-hidden text-white font-sans relative">
      
      {/* Global Background Grid Pattern & Floating Emojis */}
      <div className="fixed inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-bgDark to-bgDarker flex items-center justify-center pt-20 pb-32">
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

        {/* New Right Character: 3D Boy */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-4 md:right-20 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center justify-center pointer-events-none z-0"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400/20 blur-[100px] w-64 h-64 rounded-full" />
          <div className="text-[10rem] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative z-10 transform scale-x-[-1]">
            🧑
          </div>
          <div className="text-[6rem] absolute -bottom-4 -left-2 drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] z-20">
            🎒
          </div>
          <div className="text-[4rem] absolute top-10 -right-8 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-20 transform -rotate-12">
            📖
          </div>
        </motion.div>

        {/* New Left Character: Friendly Robot */}
        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [2, -2, 2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute left-4 md:left-20 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center justify-center pointer-events-none z-0"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-400/20 blur-[100px] w-56 h-56 rounded-full" />
          <div className="text-[9rem] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative z-10">
            🤖
          </div>
        </motion.div>

        <div className="z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center relative">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300 drop-shadow-[0_0_20px_rgba(245,197,24,0.6)] py-2"
          >
            منصة فطنة
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

      {/* Modules Section */}
      <section id="programs" className="py-32 relative z-10">
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
                  className="min-w-[85vw] sm:min-w-[300px] snap-center rounded-3xl overflow-hidden relative group transform-gpu will-change-transform shadow-2xl flex flex-col"
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
                    {/* Price display placeholder */}
                    {mod.price === 0 && (
                      <div className="mb-4">
                        <span className="bg-green-500 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">مجاني</span>
                      </div>
                    )}
                    {mod.price > 0 && (
                      <div className="mb-4">
                        <span className="bg-accentGold px-4 py-1.5 rounded-full text-sm font-bold text-bgDark shadow-lg">{mod.price} دج</span>
                      </div>
                    )}
                    <p className="text-white/90 font-medium mb-8 flex-grow text-lg leading-relaxed">{mod.description}</p>
                    
                    <div className="flex flex-col gap-3 mt-auto">
                      <Link 
                        to={`/modules/${mod.slug}`} 
                        className="w-full py-4 bg-accentGold text-bgDark text-center font-black rounded-xl hover:scale-105 transition-all shadow-[0_0_15px_rgba(245,197,24,0.4)] hover:shadow-[0_0_25px_rgba(245,197,24,0.6)]"
                      >
                        سجّل الآن
                      </Link>
                      <Link 
                        to={`/modules/${mod.slug}/trial`} 
                        className="w-full py-3 bg-white/20 border border-white/30 text-white text-center font-bold rounded-xl hover:bg-white/30 transition-all backdrop-blur"
                      >
                        تجربة مجانية
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEW SECTION 2: إنجازاتنا بالأرقام (Animated Counters) */}
      <section className="py-24 bg-bgPurple border-y border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 relative">
            <h2 className="text-4xl font-black text-white inline-block drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              إنجازاتنا بالأرقام
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: settings.stats.students, label: 'طالب وطالبة', emoji: '😊', glow: 'rgba(59,130,246,0.5)', prefix: '+' },
              { num: settings.stats.modules, label: 'برنامج تدريبي', emoji: '🏆', glow: 'rgba(245,197,24,0.5)', prefix: '+' },
              { num: 15, label: 'مدرب مميز', emoji: '🎓', glow: 'rgba(139,92,246,0.5)', prefix: '+' },
              { num: settings.stats.satisfaction, label: 'نسبة رضا الطلاب', emoji: '⭐', glow: 'rgba(16,185,129,0.5)', suffix: '%' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-bgDark p-8 rounded-3xl border border-white/10 shadow-2xl text-center relative overflow-hidden group"
                style={{ boxShadow: `0 10px 40px -10px ${stat.glow}` }}
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-6xl mb-4 drop-shadow-[0_0_15px_currentColor]" style={{ color: stat.glow.replace('0.5)', '1)') }}>
                  {stat.emoji}
                </div>
                <div className="text-4xl font-black text-white mb-2 flex justify-center items-center gap-1">
                  {stat.prefix && <span className="text-accentGold">{stat.prefix}</span>}
                  <Counter from={0} to={stat.num} delay={i * 0.1} />
                  {stat.suffix && <span className="text-accentGold">{stat.suffix}</span>}
                </div>
                <div className="text-gray-300 font-bold text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION 1: التعلم أصبح أكثر متعة (App Preview) */}
      <section className="py-32 bg-[#1A0A4B] relative z-10 border-b border-white/5 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 relative">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="inline-block text-5xl mb-4">👑</motion.div>
            <h2 className="text-5xl font-black text-white mb-6 drop-shadow-lg">
              التعلم أصبح <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300">أكثر متعة!</span>
            </h2>
            <p className="text-xl text-gray-300 font-bold max-w-2xl mx-auto">تجربة تعليمية تفاعلية مليئة بالألعاب والتحديات والمكافآت لتحفزك كل يوم على التقدم والتعلم.</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left side: The Phone UI */}
            <div className="flex-1 w-full flex justify-center">
              <motion.div 
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full max-w-[320px] bg-bgDark rounded-[3rem] p-3 border-4 border-gray-800 shadow-[0_0_50px_rgba(124,58,237,0.3)] relative"
              >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-20" />
                
                {/* Screen Content */}
                <div className="bg-bgPurple h-[600px] rounded-[2.5rem] overflow-hidden relative border border-white/10 flex flex-col p-6 pt-12">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-white">مرحباً بطل! 🏆</h3>
                      <div className="text-sm text-gray-400 font-bold mt-1">المستوى 5 - عبقري</div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accentPurple rounded-full border-2 border-accentGold" />
                  </div>

                  {/* XP Bar */}
                  <div className="bg-bgDark p-4 rounded-2xl border border-white/5 mb-6">
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-accentGold">850 / 1000 XP</span>
                      <span className="text-gray-400">للمستوى القادم</span>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-accentGold to-yellow-400 shadow-[0_0_10px_rgba(245,197,24,0.8)]" 
                      />
                    </div>
                  </div>

                  {/* Daily Challenge */}
                  <div className="bg-white p-5 rounded-2xl shadow-lg mb-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accentGold" />
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🎯</span>
                      <h4 className="text-bgDark font-black text-lg">تحدي اليوم</h4>
                    </div>
                    <p className="text-gray-600 font-bold text-sm mb-4">أكمل 3 دروس واحصل على 50 نقطة إضافية!</p>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-primary" />
                    </div>
                    <div className="text-xs text-gray-500 font-bold mt-2 text-left">2/3 مكتمل</div>
                  </div>

                  {/* Badges */}
                  <div className="mt-auto pb-4">
                    <h4 className="text-gray-300 font-bold mb-3 text-sm">إنجازاتك الأخيرة</h4>
                    <div className="flex justify-between gap-2">
                      {[
                        { icon: '⭐', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
                        { icon: '🔥', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
                        { icon: '🎯', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
                        { icon: '👑', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
                      ].map((badge, i) => (
                        <div key={i} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${badge.color}`}>
                          {badge.icon}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>

            {/* Right side: Features Stack */}
            <div className="flex-1 flex flex-col gap-6">
              {[
                { title: 'تحديات يومية', desc: 'أكمل التحديات اليومية واربح نقاط ومكافآت رائعة.', icon: <Target />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { title: 'نظام النقاط', desc: 'اجمع النقاط، ارتقِ في المستويات، وكن الأفضل!', icon: <Trophy />, color: 'text-accentGold', bg: 'bg-yellow-400/10' },
                { title: 'شهادات وإنجازات', desc: 'احصل على شهادات معتمدة وشارك إنجازاتك مع أصدقائك.', icon: <Medal />, color: 'text-green-400', bg: 'bg-green-400/10' },
                { title: 'متابعة أولياء الأمور', desc: 'تابع تقدم أبنائك وتعرف على تقارير تفصيلية بسهولة.', icon: <Users />, color: 'text-pink-400', bg: 'bg-pink-400/10' },
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-bgDark p-6 rounded-2xl border border-white/5 flex items-center gap-6 shadow-xl hover:bg-white/5 transition-colors"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${feature.bg} ${feature.color}`}>
                    {React.cloneElement(feature.icon, { size: 32 })}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 font-bold text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-bgPurple border-y border-white/5 relative z-10">
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
      <section className="py-24 bg-bgDark relative z-10">
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
      <section className="py-24 bg-bgPurple border-t border-white/5 relative z-10">
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

      {/* NEW SECTION 3: جاهز تصنع إنجازك؟ (Bottom CTA Banner) */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-[#120838] to-[#1A0A4B] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Background Decor */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="absolute top-10 left-10 text-4xl opacity-50">⭐</motion.div>
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className="absolute bottom-10 right-10 text-5xl opacity-50">⚡</motion.div>
          
          {/* 3D Full Body Character Left (Boy Jumping) */}
          <motion.div 
            animate={{ y: [-15, 15, -15] }} 
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center pointer-events-none z-20"
          >
            {/* Head */}
            <div className="text-[7rem] drop-shadow-xl z-20 relative">🧒</div>
            {/* Body (Shirt) */}
            <div className="w-24 h-28 bg-blue-500 rounded-3xl -mt-6 z-10 shadow-lg relative">
              {/* Arms */}
              <div className="absolute -left-6 top-2 w-8 h-20 bg-blue-500 rounded-full origin-top rotate-[-45deg]" />
              <div className="absolute -right-6 top-2 w-8 h-20 bg-blue-500 rounded-full origin-top rotate-[45deg]" />
              {/* Backpack */}
              <div className="absolute top-4 -right-10 text-6xl drop-shadow-lg -z-10 transform scale-x-[-1]">🎒</div>
            </div>
            {/* Legs */}
            <div className="flex gap-4 -mt-4 z-0">
              <div className="w-8 h-20 bg-gray-700 rounded-full origin-top rotate-[-20deg]" />
              <div className="w-8 h-20 bg-gray-700 rounded-full origin-top rotate-[40deg]" />
            </div>
          </motion.div>

          {/* 3D Full Body Character Right (Girl Pointing) */}
          <motion.div 
            animate={{ y: [15, -15, 15] }} 
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -right-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center pointer-events-none z-20"
          >
            {/* Head */}
            <div className="text-[7rem] drop-shadow-xl z-20 relative transform scale-x-[-1]">👧</div>
            {/* Body (Shirt) */}
            <div className="w-24 h-28 bg-pink-500 rounded-3xl -mt-6 z-10 shadow-lg relative">
              {/* Arms */}
              <div className="absolute -left-6 top-2 w-8 h-20 bg-pink-500 rounded-full origin-top rotate-[-150deg]" />
              <div className="absolute -right-6 top-2 w-8 h-20 bg-pink-500 rounded-full origin-top rotate-[20deg]" />
            </div>
            {/* Legs */}
            <div className="flex gap-4 -mt-4 z-0">
              <div className="w-8 h-24 bg-gray-700 rounded-full origin-top rotate-[-10deg]" />
              <div className="w-8 h-24 bg-gray-700 rounded-full origin-top rotate-[10deg]" />
            </div>
          </motion.div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white drop-shadow-md">
              جاهز تصنع إنجازك؟
            </h2>
            <p className="text-xl text-gray-300 font-bold mb-10">
              انضم الآن إلى آلاف الطلاب وابدأ رحلتك مع فطنة نحو التميز والإبداع!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="px-10 py-5 bg-accentGold text-bgDark font-black rounded-2xl text-xl hover:bg-yellow-400 transition shadow-[0_0_20px_rgba(245,197,24,0.5)] hover:shadow-[0_0_30px_rgba(245,197,24,0.8)] transform hover:-translate-y-1">
                ابدأ الآن
              </Link>
              <a href="#programs" className="px-10 py-5 bg-white/10 border border-white/20 text-white font-bold rounded-2xl text-xl hover:bg-white/20 transition transform hover:-translate-y-1">
                اعرف المزيد ←
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-bgDark relative z-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-black mb-8 text-white">{t('contact.title')}</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-bold leading-relaxed">فريقنا مستعد دائماً للإجابة على استفساراتكم ومساعدتكم في اختيار البرنامج الأنسب.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href={`https://wa.me/${settings.contact.whatsapp.replace('+', '')}`} className="px-10 py-5 bg-[#25D366] text-white font-black rounded-2xl text-xl hover:bg-[#1DA851] transition flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:-translate-y-1">
              تواصل عبر واتساب
            </a>
            <a href={`mailto:${settings.contact.email}`} className="px-10 py-5 bg-white/10 font-bold rounded-2xl text-xl hover:bg-white/20 transition flex items-center justify-center gap-3 border border-white/10 hover:-translate-y-1">
              راسلنا عبر الإيميل
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
