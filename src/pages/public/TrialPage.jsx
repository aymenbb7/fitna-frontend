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
    <div className="w-full bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div 
        className="pt-24 pb-12 text-white px-4 text-center"
        style={{ backgroundColor: mod.color_primary }}
      >
        <h1 className="text-4xl font-black mb-4">التجربة المجانية - {mod.name}</h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">استكشف محتوى البرنامج، شاهد الجلسة المجانية واختبر معلوماتك.</p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 mt-12 space-y-12">
        {/* Video Session */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <PlayCircle className="text-gray-400 w-8 h-8" />
            <h2 className="text-2xl font-bold">جلسة تعريفية</h2>
          </div>
          <div className="aspect-video bg-gray-900 flex items-center justify-center text-gray-500 relative">
            {/* Mock video player */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000')] bg-cover bg-center opacity-30" />
            <PlayCircle className="w-20 h-20 text-white opacity-80 z-10 cursor-pointer hover:scale-110 transition" />
          </div>
        </div>

        {/* PDF / Document */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <FileText className="text-gray-400 w-8 h-8" />
            <h2 className="text-2xl font-bold">ملف الجلسة</h2>
          </div>
          <div className="p-8 flex items-center justify-between bg-gray-50">
            <div>
              <div className="font-bold text-lg mb-1">مقدمة في {mod.name}.pdf</div>
              <div className="text-gray-500 text-sm">2.4 MB</div>
            </div>
            <button className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition">
              تحميل
            </button>
          </div>
        </div>

        {/* Trial Quiz */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <CheckSquare className="text-gray-400 w-8 h-8" />
            <h2 className="text-2xl font-bold">اختبر معلوماتك</h2>
          </div>
          <div className="p-8 text-center bg-blue-50/50">
            <h3 className="text-xl font-bold mb-2">اختبار قصير حول الجلسة التعريفية</h3>
            <p className="text-gray-600 mb-6">يتكون من 5 أسئلة سريعة لتقييم مدى استيعابك للمفاهيم الأساسية.</p>
            <button className="px-8 py-3 bg-white border border-gray-200 shadow-sm rounded-xl font-bold hover:bg-gray-50 transition">
              ابدأ الاختبار
            </button>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-8 border-t">
          <h2 className="text-3xl font-black mb-6">أعجبك البرنامج؟</h2>
          <Link 
            to={`/modules/${slug}`}
            className="inline-flex items-center gap-2 px-10 py-5 text-white font-bold rounded-xl text-xl hover:opacity-90 transition shadow-xl"
            style={{ backgroundColor: mod.color_primary }}
          >
            سجّل الآن في البرنامج <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrialPage;
