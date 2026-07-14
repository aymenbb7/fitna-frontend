import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, FileText, CheckSquare, ArrowRight } from 'lucide-react';
import api from '../../api/axios';

const TrialPage = () => {
  const { slug } = useParams();
  const [mod, setMod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/modules/${slug}/`)
      .then(res => setMod(res.data))
      .catch(err => {
        console.error(err);
        setMod({
          slug,
          name: slug === 'quran' ? 'قسم التعليم القرآني' : slug,
          color_primary: slug === 'quran' ? '#1B5E20' : '#1565C0',
        });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-24 text-center">جاري التحميل...</div>;
  if (!mod) return <div className="p-24 text-center">البرنامج غير موجود</div>;

  return (
    <div className="w-full bg-bgDark min-h-screen pb-24 text-white">
      {/* Header */}
      <div 
        className="pt-32 pb-24 px-4 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${mod.color_primary} 0%, #0D0B2B 150%)` }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30 pointer-events-none" />
        <h1 className="text-5xl font-black mb-6 drop-shadow-md relative z-10">التجربة المجانية - {mod.name}</h1>
        <p className="text-2xl font-bold max-w-2xl mx-auto relative z-10 drop-shadow-md">استكشف محتوى البرنامج، شاهد الجلسة المجانية واختبر معلوماتك.</p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 mt-12 space-y-12 relative z-20 -top-16">
        {/* Video Session */}
        <div className="bg-bgPurple rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/5">
            <PlayCircle className="text-accentGold w-8 h-8" />
            <h2 className="text-2xl font-black">جلسة تعريفية</h2>
          </div>
          <div className="aspect-video bg-bgDarker flex items-center justify-center text-gray-500 relative">
            {/* Mock video player */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000')] bg-cover bg-center opacity-30 mix-blend-overlay" />
            <PlayCircle className="w-24 h-24 text-white opacity-90 z-10 cursor-pointer hover:scale-110 hover:text-accentGold transition drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          </div>
        </div>

        {/* PDF / Document */}
        <div className="bg-bgPurple rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/5">
            <FileText className="text-accentGold w-8 h-8" />
            <h2 className="text-2xl font-black">ملف الجلسة</h2>
          </div>
          <div className="p-8 flex items-center justify-between bg-bgDark">
            <div>
              <div className="font-bold text-xl mb-1 text-white">مقدمة في {mod.name}.pdf</div>
              <div className="text-gray-400 font-bold">2.4 MB</div>
            </div>
            <button className="px-8 py-3 bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl font-bold transition text-white hover:text-accentGold">
              تحميل
            </button>
          </div>
        </div>

        {/* Trial Quiz */}
        <div className="bg-bgPurple rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/5">
            <CheckSquare className="text-accentGold w-8 h-8" />
            <h2 className="text-2xl font-black">اختبر معلوماتك</h2>
          </div>
          <div className="p-12 text-center bg-bgDark">
            <h3 className="text-2xl font-black mb-4 text-white">اختبار قصير حول الجلسة التعريفية</h3>
            <p className="text-gray-300 font-bold mb-8 text-lg">يتكون من 5 أسئلة سريعة لتقييم مدى استيعابك للمفاهيم الأساسية.</p>
            <button className="px-10 py-4 bg-accentGold text-bgDark shadow-[0_0_15px_rgba(245,197,24,0.4)] hover:shadow-[0_0_25px_rgba(245,197,24,0.6)] rounded-2xl font-black text-xl transition hover:scale-105">
              ابدأ الاختبار 🚀
            </button>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-12 border-t border-white/10">
          <h2 className="text-4xl font-black mb-8 text-white">أعجبك البرنامج؟</h2>
          <Link 
            to={`/modules/${slug}`}
            className="inline-flex items-center justify-center gap-3 px-12 py-5 text-white font-black rounded-2xl text-2xl hover:brightness-110 transition shadow-2xl hover:scale-105"
            style={{ backgroundColor: mod.color_primary }}
          >
            سجّل الآن في البرنامج <ArrowRight className="w-8 h-8" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrialPage;
