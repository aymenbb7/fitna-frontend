import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { getMediaUrl } from '../../../api/axios';
import { ArrowRight, Video, FileText, Mic, Image as ImageIcon, PlayCircle, CheckSquare, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

const ModuleContent = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [moduleData, setModuleData] = useState(null);
  
  const [videos, setVideos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [voiceMessages, setVoiceMessages] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  
  const [activeTab, setActiveTab] = useState('videos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModuleData();
  }, [slug]);

  const fetchModuleData = async () => {
    try {
      setLoading(true);
      const [modRes, secRes, quizRes] = await Promise.all([
        api.get(`/modules/${slug}/`),
        api.get(`/modules/${slug}/sections/`),
        api.get(`/modules/${slug}/quizzes/`)
      ]);
      setModuleData(modRes.data);
      setQuizzes(quizRes.data);
      
      const allVideos = [];
      const allDocs = [];
      const allSessions = [];
      const allVoice = [];
      const allPhotos = [];
      
      secRes.data.forEach(sec => {
        sec.lessons?.forEach(les => {
          if (les.videos) allVideos.push(...les.videos.map(v => ({...v, lessonTitle: les.title, sectionTitle: sec.title})));
          if (les.documents) allDocs.push(...les.documents.map(d => ({...d, lessonTitle: les.title, sectionTitle: sec.title})));
          if (les.sessions) allSessions.push(...les.sessions.map(s => ({...s, lessonTitle: les.title, sectionTitle: sec.title})));
          if (les.voice_messages) allVoice.push(...les.voice_messages.map(v => ({...v, lessonTitle: les.title, sectionTitle: sec.title})));
          if (les.photos) allPhotos.push(...les.photos.map(p => ({...p, lessonTitle: les.title, sectionTitle: sec.title})));
        });
      });
      
      setVideos(allVideos);
      setDocuments(allDocs);
      setSessions(allSessions);
      setVoiceMessages(allVoice);
      setPhotos(allPhotos);
      
      if (allVideos.length > 0) setActiveTab('videos');
      else if (allDocs.length > 0) setActiveTab('documents');
      else if (quizRes.data.length > 0) setActiveTab('quizzes');
      else if (allSessions.length > 0) setActiveTab('sessions');
      else if (allVoice.length > 0) setActiveTab('voice_messages');
      else if (allPhotos.length > 0) setActiveTab('photos');
      
    } catch (err) {
      console.error("Error fetching content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const res = await api.get(`/modules/${slug}/certificate/download/`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate_${slug}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("حدث خطأ أثناء تحميل الشهادة. تأكد من إكمال جميع الدروس.");
    }
  };

  const handleDownload = async (item, type) => {
    try {
      const apiType = type === 'voice_messages' ? 'voice' : type;
      const endpoint = `/modules/${slug}/${apiType}/${item.id}/download/`;
      const res = await api.get(endpoint, { responseType: 'blob' });
      
      const contentType = res.headers['content-type'] || 'application/octet-stream';
      const url = window.URL.createObjectURL(new Blob([res.data], { type: contentType }));
      const link = document.createElement('a');
      link.href = url;
      
      let ext = 'file';
      if (type === 'videos') ext = 'mp4';
      if (type === 'documents') ext = 'pdf';
      if (type === 'voice_messages') ext = 'mp3';
      if (type === 'photos') ext = 'jpg';
      
      // Try to extract filename from Content-Disposition
      let filename = `${item.title || 'download'}.${ext}`;
      const disposition = res.headers['content-disposition'];
      if (disposition && disposition.indexOf('filename=') !== -1) {
        const matches = /filename="([^"]*)"/.exec(disposition);
        if (matches != null && matches[1]) filename = matches[1];
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err.response?.status === 404) {
        alert("الملف غير متاح حالياً.");
      } else {
        alert("حدث خطأ أثناء التحميل.");
      }
    }
  };

  const handleViewPDF = (item) => {
    const url = getMediaUrl(item.document_file || item.file_url);
    if (!url) {
      alert("الملف غير متاح حالياً.");
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) return <div className="p-8 text-center text-gray-400">جاري تحميل المحتوى...</div>;

  const tabs = [
    { id: 'videos', label: 'الفيديوهات', icon: <PlayCircle size={16} />, count: videos.length },
    { id: 'documents', label: 'الملفات (PDF)', icon: <FileText size={16} />, count: documents.length },
    { id: 'quizzes', label: 'الاختبارات', icon: <CheckSquare size={16} />, count: quizzes.length },
    { id: 'sessions', label: 'البث المباشر', icon: <Video size={16} />, count: sessions.length },
    { id: 'voice_messages', label: 'الصوتيات', icon: <Mic size={16} />, count: voiceMessages.length },
    { id: 'photos', label: 'الصور', icon: <ImageIcon size={16} />, count: photos.length },
  ].filter(t => t.count > 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between bg-bgPurple p-6 rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition text-gray-400 hover:text-white"
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white">{moduleData?.name}</h1>
            <p className="text-gray-400 text-sm">محتوى الوحدة التدريبية</p>
          </div>
        </div>
        <Button variant="secondary" onClick={handleDownloadCertificate} className="gap-2">
          <FileText size={16} />
          تحميل الشهادة
        </Button>
      </div>
      
      <div className="bg-bgPurple rounded-3xl border border-white/5 p-6 md:p-8 min-h-[60vh]">
        {tabs.length > 0 ? (
          <div className="flex overflow-x-auto gap-2 pb-6 mb-6 border-b border-white/5 hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition whitespace-nowrap border ${
                  activeTab === tab.id 
                    ? 'bg-accentGold text-bgDark border-accentGold' 
                    : 'bg-bgDark text-gray-400 border-white/10 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-bgDark text-accentGold' : 'bg-white/10'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-20">
            <FileText size={48} className="mb-4 text-white/10" />
            <p className="text-lg font-bold">لا يوجد محتوى في هذه الوحدة بعد.</p>
          </div>
        )}

        <div className="space-y-4">
          {activeTab === 'videos' && videos.map(v => (
            <div key={v.id} className="bg-bgDark p-6 rounded-3xl border border-white/5 hover:border-accentGold/50 transition flex flex-col gap-4 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                    <PlayCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{v.title}</h4>
                    <p className="text-xs text-gray-400">{v.sectionTitle} - {v.lessonTitle}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <a
                  href={v.telegram_link}
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

          {activeTab === 'documents' && documents.map(d => {
            const fileUrl = getMediaUrl(d.document_file || d.file_url);
            const hasFile = !!fileUrl;
            return (
              <div key={d.id} className="bg-bgDark p-4 rounded-2xl border border-white/5 hover:border-accentGold/50 transition flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 group-hover:scale-110 transition">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{d.title}</h4>
                    <p className="text-xs text-gray-400">{d.sectionTitle} - {d.lessonTitle}</p>
                    {!hasFile && (
                      <p className="text-xs text-yellow-400 flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> الملف غير متاح حالياً
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={fileUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!hasFile) e.preventDefault();
                    }}
                    className={`px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition flex items-center gap-2 ${
                      !hasFile ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
                    }`}
                  >
                    <ExternalLink size={14} />
                    عرض
                  </a>
                  <a
                    href={fileUrl || '#'}
                    download={`${d.title || 'document'}.pdf`}
                    onClick={(e) => { if (!hasFile) e.preventDefault(); }}
                    className={`px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition ${
                      !hasFile ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
                    }`}
                  >
                    تحميل
                  </a>
                </div>
              </div>
            );
          })}
          
          {activeTab === 'sessions' && sessions.map(s => (
            <div key={s.id} className="bg-bgDark p-4 rounded-2xl border border-white/5 hover:border-accentGold/50 transition flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 group-hover:scale-110 transition">
                  <Video size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{s.title}</h4>
                  <p className="text-xs text-gray-400">{new Date(s.session_date).toLocaleString('ar-DZ')} | {s.sectionTitle} - {s.lessonTitle}</p>
                </div>
              </div>
              <a href={s.session_link} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl font-bold text-sm hover:bg-green-500 hover:text-white transition">
                انضمام للجلسة
              </a>
            </div>
          ))}

          {activeTab === 'voice_messages' && voiceMessages.map(v => {
            const audioUrl = getMediaUrl(v.audio_file || v.audio_url);
            const hasAudio = !!audioUrl;
            return (
              <div key={v.id} className="bg-bgDark p-6 rounded-3xl border border-white/5 hover:border-accentGold/50 transition flex flex-col gap-4 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                    <Mic size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{v.title}</h4>
                    <p className="text-xs text-gray-400">{v.sectionTitle} - {v.lessonTitle}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {hasAudio ? (
                    <audio src={audioUrl} controls className="w-full" />
                  ) : (
                    <div className="flex items-center gap-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm">
                      <AlertCircle size={16} />
                      الملف الصوتي غير متاح حالياً
                    </div>
                  )}
                  <a
                    href={audioUrl || '#'}
                    download={`${v.title}.mp3`}
                    onClick={(e) => { if (!hasAudio) e.preventDefault(); }}
                    className={`self-end px-6 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl font-bold text-sm hover:bg-purple-500 hover:text-white transition ${
                      !hasAudio ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
                    }`}
                  >
                    تحميل الصوت
                  </a>
                </div>
              </div>
            );
          })}

          {activeTab === 'photos' && photos.map(p => (
            <div key={p.id} className="bg-bgDark p-6 rounded-3xl border border-white/5 hover:border-accentGold/50 transition flex flex-col gap-4 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-400">
                  <ImageIcon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{p.title}</h4>
                  <p className="text-xs text-gray-400">{p.sectionTitle} - {p.lessonTitle}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-black flex justify-center">
                  <img src={getMediaUrl(p.image_file || p.photo_url)} alt={p.title} className="max-h-[60vh] object-contain" />
                </div>
                <button onClick={() => handleDownload(p, 'photos')} className="self-end px-6 py-2 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-xl font-bold text-sm hover:bg-pink-500 hover:text-white transition">
                  تحميل الصورة
                </button>
              </div>
            </div>
          ))}

          {activeTab === 'quizzes' && quizzes.map(q => (
            <div key={q.id} className="bg-bgDark p-6 rounded-3xl border border-white/5 hover:border-accentGold/50 transition flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-400 group-hover:scale-110 transition">
                  <CheckSquare size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{q.title}</h4>
                  <p className="text-xs text-gray-400">عدد الأسئلة: {q.questions?.length || 0}</p>
                </div>
              </div>
              <Link to={`/dashboard/student/modules/${slug}/quiz/${q.id}`} className="px-6 py-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl font-bold text-sm hover:bg-yellow-500 hover:text-white transition">
                بدء الاختبار
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleContent;
