import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, FileText, CheckSquare, ArrowRight, Mic, Image as ImageIcon, ExternalLink, Download, AlertCircle } from 'lucide-react';
import api, { getMediaUrl } from '../../api/axios';

const TrialPage = () => {
  const { slug } = useParams();
  const [mod, setMod] = useState(null);
  const [trialContent, setTrialContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([
      api.get(`/modules/${slug}/`),
      api.get(`/modules/${slug}/trial/`).catch(() => ({ data: null }))
    ])
    .then(([modRes, trialRes]) => {
      setMod(modRes.data);
      setTrialContent(trialRes.data);
    })
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

  const handleDownload = async (url, filename) => {
    if (!url) {
      alert('الملف غير متاح حالياً.');
      return;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      alert('حدث خطأ أثناء التحميل.');
    }
  };

  const handleViewPDF = (url) => {
    if (!url) {
      alert('الملف غير متاح حالياً.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) return <div className="p-24 text-center text-white">جاري التحميل...</div>;
  if (!mod) return <div className="p-24 text-center text-white">البرنامج غير موجود</div>;

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
        
        {!trialContent || trialContent.length === 0 ? (
          <div className="bg-bgPurple rounded-3xl shadow-2xl border border-white/10 overflow-hidden p-12 text-center">
            <h2 className="text-2xl font-black mb-4">التجربة المجانية غير متاحة حالياً</h2>
            <p className="text-gray-400">يرجى العودة لاحقاً أو التسجيل في البرنامج.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {trialContent.map((lesson, index) => (
              <div key={lesson.id} className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-black text-white bg-white/5 inline-block px-8 py-3 rounded-full border border-white/10 shadow-lg">
                    الدرس {index + 1}: {lesson.title}
                  </h2>
                  {lesson.description && <p className="text-gray-400 mt-4 text-lg">{lesson.description}</p>}
                </div>

                {lesson.videos?.length > 0 && lesson.videos.map(video => (
                  <div key={video.id} className="bg-bgPurple rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/5">
                      <PlayCircle className="text-accentGold w-8 h-8" />
                      <h2 className="text-2xl font-black">{video.title}</h2>
                    </div>
                    <div className="p-8 bg-bgDark">
                      <a
                        href={video.telegram_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-4 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl font-bold text-base hover:bg-blue-500 hover:text-white transition"
                      >
                        <PlayCircle size={20} />
                        مشاهدة الفيديو على تيليغرام
                      </a>
                    </div>
                  </div>
                ))}

                {lesson.documents?.length > 0 && lesson.documents.map(doc => {
                  const fileUrl = getMediaUrl(doc.document_file || doc.file_url);
                  const hasFile = !!fileUrl;
                  return (
                    <div key={doc.id} className="bg-bgPurple rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
                      <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/5">
                        <FileText className="text-accentGold w-8 h-8" />
                        <h2 className="text-2xl font-black">{doc.title}</h2>
                      </div>
                      <div className="p-8 flex items-center justify-between bg-bgDark">
                        <div>
                          <div className="font-bold text-xl mb-1 text-white">{doc.title}</div>
                          <div className="text-gray-400 font-bold">ملف PDF</div>
                          {!hasFile && (
                            <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
                              <AlertCircle size={14} /> الملف غير متاح حالياً
                            </div>
                          )}
                        </div>
                        {hasFile && (
                          <div className="flex gap-3">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl font-bold transition text-white hover:text-accentGold"
                            >
                              <ExternalLink size={18} />
                              عرض
                            </a>
                            <a
                              href={fileUrl}
                              download={`${doc.title}.pdf`}
                              className="flex items-center gap-2 px-6 py-3 bg-accentGold/20 border border-accentGold/40 hover:bg-accentGold hover:text-bgDark rounded-xl font-bold transition text-accentGold"
                            >
                              <Download size={18} />
                              تحميل
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {lesson.voice_messages?.length > 0 && lesson.voice_messages.map(voice => {
                  const audioUrl = getMediaUrl(voice.audio_file || voice.audio_url);
                  const hasAudio = !!audioUrl;
                  return (
                    <div key={voice.id} className="bg-bgPurple rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
                      <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/5">
                        <Mic className="text-accentGold w-8 h-8" />
                        <h2 className="text-2xl font-black">{voice.title}</h2>
                      </div>
                      <div className="p-8 bg-bgDark">
                        {hasAudio ? (
                          <div className="flex flex-col gap-4">
                            <audio 
                              src={audioUrl} 
                              controls 
                              className="w-full"
                              preload="metadata"
                            />
                            <a
                              href={audioUrl}
                              download={`${voice.title}.mp3`}
                              className="self-end flex items-center gap-2 px-6 py-3 bg-accentGold/20 border border-accentGold/40 hover:bg-accentGold hover:text-bgDark rounded-xl font-bold transition text-accentGold"
                            >
                              <Download size={18} />
                              تحميل الصوت
                            </a>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400">
                            <AlertCircle size={16} />
                            الملف الصوتي غير متاح حالياً
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {lesson.photos?.length > 0 && lesson.photos.map(photo => (
                  <div key={photo.id} className="bg-bgPurple rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/5">
                      <ImageIcon className="text-accentGold w-8 h-8" />
                      <h2 className="text-2xl font-black">{photo.title}</h2>
                    </div>
                    <div className="bg-black flex items-center justify-center p-4">
                      <img 
                        src={getMediaUrl(photo.image_file || photo.photo_url)} 
                        alt={photo.title}
                        className="max-h-96 object-contain rounded-xl"
                      />
                    </div>
                  </div>
                ))}

                {lesson.quizzes?.length > 0 && lesson.quizzes.map(quizId => (
                  <div key={quizId} className="bg-bgPurple rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/5">
                      <CheckSquare className="text-accentGold w-8 h-8" />
                      <h2 className="text-2xl font-black">اختبر معلوماتك</h2>
                    </div>
                    <div className="p-12 text-center bg-bgDark">
                      <h3 className="text-2xl font-black mb-4 text-white">اختبار حول الجلسة المجانية</h3>
                      <p className="text-gray-300 font-bold mb-8 text-lg">يتكون من أسئلة سريعة لتقييم مدى استيعابك للمفاهيم الأساسية.</p>
                      <Link 
                        to={`/modules/${slug}/trial/quiz/${quizId}`}
                        className="inline-block px-10 py-4 bg-accentGold text-bgDark shadow-[0_0_15px_rgba(245,197,24,0.4)] hover:shadow-[0_0_25px_rgba(245,197,24,0.6)] rounded-2xl font-black text-xl transition hover:scale-105"
                      >
                        ابدأ الاختبار 🚀
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

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
