import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, PlayCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';

const SYMBOLS = {
  'quran': ['آيات', 'بسم الله', '🌙', '⭐'],
  'memory': ['🧠', '1 0 1', '🔗', '✨'],
  'soroban': ['1+2=3', '🧮', 'x', '÷'],
  'problem-solving': ['π', '√', '∑', '△'],
  'health': ['❤️', '🌿', '⚛', 'DNA'],
  'history': ['🏛', '1954', '📜', '🏺'],
  'languages': ['ع', 'ABC', '你好', 'Bonjour'],
  'talents': ['🎨', '{ }', '✒️', '💡'],
  'psychology': ['〰️', '⭕', '∞', '✨']
};

const ModulePage = () => {
  const { slug } = useParams();
  const [mod, setMod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    api.get(`/modules/${slug}/`)
      .then(res => setMod(res.data))
      .catch(err => {
        console.error(err);
        // Fallback for demo
        setMod({
          slug,
          name: slug === 'quran' ? 'قسم التعليم القرآني' : slug,
          description: 'الوصف الكامل للبرنامج سيظهر هنا. هذا نص تجريبي لتوضيح كيف سيبدو المحتوى.',
          icon: slug === 'quran' ? '🕌' : '⭐',
          color_primary: slug === 'quran' ? '#1B5E20' : '#1565C0',
          price: 0
        });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-24 text-center">جاري التحميل...</div>;
  if (!mod) return <div className="p-24 text-center">البرنامج غير موجود</div>;

  const symbols = SYMBOLS[slug] || ['✨', '⭐', '🌟', '💫'];

  return (
    <div className="w-full">
      {/* Hero */}
      <section 
        className="relative pt-32 pb-24 overflow-hidden text-white"
        style={{ background: `linear-gradient(135deg, ${mod.color_primary} 0%, #000000 150%)` }}
      >
        {symbols.map((sym, i) => (
          <motion.div 
            key={i}
            animate={{ y: [0, -30, 0], opacity: [0.1, 0.3, 0.1] }} 
            transition={{ duration: 4 + i, repeat: Infinity }}
            className={`absolute text-6xl md:text-8xl select-none pointer-events-none opacity-10 font-black`}
            style={{ 
              top: `${20 + i*20}%`, 
              [i % 2 === 0 ? 'left' : 'right']: `${10 + i*15}%`,
            }}
          >
            {sym}
          </motion.div>
        ))}

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl mb-6">{mod.icon}</motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl md:text-7xl font-black mb-6">
            {mod.name}
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-2xl font-light mb-10 text-white/80 leading-relaxed">
            {mod.description}
          </motion.p>
          
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setModalOpen(true)}
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl text-xl hover:bg-gray-100 transition shadow-xl"
            >
              سجّل الآن
            </button>
            <Link 
              to={`/modules/${slug}/trial`}
              className="px-8 py-4 bg-black/20 backdrop-blur border border-white/30 text-white font-bold rounded-xl text-xl hover:bg-black/40 transition flex items-center justify-center gap-2"
            >
              <PlayCircle /> تجربة مجانية
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-2 h-8 rounded-full" style={{ backgroundColor: mod.color_primary }} />
              ماذا سيتعلم الطالب؟
            </h2>
            <ul className="space-y-4">
              {[1,2,3,4].map(i => (
                <li key={i} className="flex items-start gap-3 text-lg text-gray-700">
                  <CheckCircle2 className="mt-1 shrink-0" style={{ color: mod.color_primary }} />
                  <span>تطوير مهارات أساسية ومتقدمة في هذا المجال بطريقة عملية وتفاعلية.</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {isModalOpen && <EnrollmentModal mod={mod} onClose={() => setModalOpen(false)} />}
    </div>
  );
};

const EnrollmentModal = ({ mod, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const onSubmit = async (data) => {
    setStatus('loading');
    try {
      // Calculate age simply
      const dob = new Date(data.dob);
      const diffMs = Date.now() - dob.getTime();
      const ageDate = new Date(diffMs); 
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);

      await api.post('/auth/register/', {
        first_name: data.first_name,
        last_name: data.last_name,
        full_name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        phone_number: data.parent_phone,
        age: age,
        module_slugs: [mod.slug]
      });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <div className="p-6 text-white text-center" style={{ backgroundColor: mod.color_primary }}>
          <h2 className="text-2xl font-bold">التسجيل في {mod.name}</h2>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">✕</button>
        </div>
        <div className="p-8">
          {status === 'success' ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">تم استلام طلبك بنجاح!</h3>
              <p className="text-gray-600">ستصلك رسالة على بريدك الإلكتروني عند موافقة الإدارة.</p>
              <button onClick={onClose} className="mt-8 px-6 py-2 bg-gray-900 text-white rounded-lg">إغلاق</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">الاسم</label>
                  <input {...register('first_name', { required: true })} className="w-full border rounded-lg p-3 bg-gray-50 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">اللقب</label>
                  <input {...register('last_name', { required: true })} className="w-full border rounded-lg p-3 bg-gray-50 focus:border-primary outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1">البريد الإلكتروني</label>
                <input type="email" {...register('email', { required: true })} className="w-full border rounded-lg p-3 bg-gray-50 focus:border-primary outline-none text-left" dir="ltr" />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1">تاريخ الميلاد</label>
                <input type="date" {...register('dob', { required: true })} className="w-full border rounded-lg p-3 bg-gray-50 focus:border-primary outline-none" />
                <p className="text-xs text-gray-500 mt-1">يجب أن يكون العمر بين 14 و 18 سنة.</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">رقم هاتف الولي</label>
                <input type="tel" {...register('parent_phone', { required: true })} className="w-full border rounded-lg p-3 bg-gray-50 focus:border-primary outline-none text-left" dir="ltr" />
              </div>

              {status === 'error' && <div className="text-red-500 text-sm font-bold">حدث خطأ أثناء التسجيل. تأكد من صحة البيانات وأن الإيميل غير مسجل مسبقاً.</div>}

              <button type="submit" disabled={status === 'loading'} className="w-full py-4 text-white font-bold rounded-xl mt-6 transition disabled:opacity-50" style={{ backgroundColor: mod.color_primary }}>
                {status === 'loading' ? 'جاري الإرسال...' : 'تأكيد التسجيل'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
