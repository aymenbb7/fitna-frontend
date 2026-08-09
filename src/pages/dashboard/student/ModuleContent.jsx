import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { getMediaUrl } from '../../../api/axios';
import {
  ArrowRight, Video, FileText, Mic, Image as ImageIcon,
  PlayCircle, CheckSquare, ExternalLink, AlertCircle,
  Download, ChevronDown, ChevronRight, BookOpen, Lock,
  Menu, X,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

// â”€â”€â”€ Main student module content page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ModuleContent = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [moduleData, setModuleData]   = useState(null);
  const [sections, setSections]       = useState([]);
  const [quizzes, setQuizzes]         = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile

  useEffect(() => { fetchModuleData(); }, [slug]);

  const fetchModuleData = async () => {
    try {
      setLoading(true);
      const [modRes, secRes, quizRes] = await Promise.all([
        api.get(`/modules/${slug}/`),
        api.get(`/modules/${slug}/sections/`),
        api.get(`/modules/${slug}/quizzes/`),
      ]);
      setModuleData(modRes.data);
      setSections(secRes.data);
      setQuizzes(quizRes.data);

      // Auto-expand every section and pre-select the first lesson
      const expanded = {};
      let first = null;
      secRes.data.forEach(sec => {
        expanded[sec.id] = true;
        if (!first && sec.lessons?.length > 0)
          first = { ...sec.lessons[0], sectionTitle: sec.title };
      });
      setExpandedSections(expanded);
      if (first) setActiveLesson(first);
    } catch (err) {
      console.error('Error fetching module content:', err);
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
    } catch {
      alert('Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø´Ù‡Ø§Ø¯Ø©. ØªØ£ÙƒØ¯ Ù…Ù† Ø¥ÙƒÙ…Ø§Ù„ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø¯Ø±ÙˆØ³.');
    }
  };

  const toggleSection = id =>
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));

  const selectLesson = (lesson, sectionTitle) => {
    setActiveLesson({ ...lesson, sectionTitle });
    setSidebarOpen(false);
  };

  const totalLessons = sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accentGold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-bold">Ø¬Ø§Ø±ÙŠ ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ù…Ø­ØªÙˆÙ‰...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* â”€â”€ Page header â”€â”€ */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/student/modules"
            className="text-gray-400 hover:text-white transition p-2 bg-bgPurple rounded-full border border-white/5"
          >
            <ArrowRight size={20} />
          </Link>
          <div>
            <h2 className="text-2xl font-black text-white">{moduleData?.name}</h2>
            <p className="text-gray-400 text-sm">
              {sections.length} Ù‚Ø³Ù… Â· {totalLessons} Ø¯Ø±Ø³
              {quizzes.length > 0 && ` Â· ${quizzes.length} Ø§Ø®ØªØ¨Ø§Ø±`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="lg:hidden p-2 bg-bgPurple border border-white/10 rounded-xl text-white"
            aria-label="ÙØªØ­/Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„Ù…Ù†Ù‡Ø¬"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Button variant="secondary" onClick={handleDownloadCertificate} className="text-sm whitespace-nowrap">
            ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø´Ù‡Ø§Ø¯Ø©
          </Button>
        </div>
      </div>

      {/* â”€â”€ Main layout â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ minHeight: '75vh' }}>

        {/* Sidebar */}
        <div
          className={`lg:col-span-1 bg-bgPurple rounded-2xl border border-white/5 flex flex-col overflow-hidden
            ${sidebarOpen ? 'flex' : 'hidden lg:flex'}`}
          style={{ maxHeight: '75vh' }}
        >
          <div className="p-4 border-b border-white/5 shrink-0">
            <h3 className="font-black text-white flex items-center gap-2 text-sm">
              <BookOpen size={15} className="text-accentGold" />
              Ø§Ù„Ù…Ù†Ù‡Ø¬ Ø§Ù„Ø¯Ø±Ø§Ø³ÙŠ
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {sections.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ø­ØªÙˆÙ‰ Ø¨Ø¹Ø¯.</div>
            ) : sections.map(section => (
              <div key={section.id}>
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition text-right"
                >
                  <span className="font-bold text-white text-sm leading-snug">{section.title}</span>
                  <span className="flex items-center gap-1 shrink-0 ml-2">
                    <span className="text-xs text-gray-600">{section.lessons?.length || 0}</span>
                    {expandedSections[section.id]
                      ? <ChevronDown size={14} className="text-gray-400" />
                      : <ChevronRight size={14} className="text-gray-400" />
                    }
                  </span>
                </button>

                {/* Lessons */}
                {expandedSections[section.id] && (
                  <div className="pr-3 pb-1 space-y-0.5">
                    {!section.lessons?.length ? (
                      <div className="text-xs text-gray-600 px-3 py-2">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¯Ø±ÙˆØ³</div>
                    ) : section.lessons.map(lesson => {
                      const isActive = activeLesson?.id === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => selectLesson(lesson, section.title)}
                          className={`w-full text-right flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition
                            ${isActive
                              ? 'bg-accentGold/15 border border-accentGold/30 text-accentGold font-black'
                              : 'text-gray-400 hover:bg-white/5 hover:text-white font-semibold'}`}
                        >
                          <PlayCircle size={13} className={isActive ? 'text-accentGold shrink-0' : 'text-gray-600 shrink-0'} />
                          <span className="truncate leading-snug">{lesson.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Module-level quizzes */}
            {quizzes.length > 0 && (
              <div className="border-t border-white/5 pt-2 mt-2">
                <div className="px-3 py-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
                  Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª
                </div>
                {quizzes.map(quiz => (
                  <button
                    key={quiz.id}
                    onClick={() => navigate(`/dashboard/student/modules/${slug}/quiz/${quiz.id}`)}
                    className="w-full text-right flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-400
                      hover:bg-yellow-500/10 hover:text-yellow-400 transition font-semibold"
                  >
                    <CheckSquare size={13} className="text-gray-600 shrink-0" />
                    <span className="truncate">{quiz.title}</span>
                    <span className="text-xs text-gray-600 shrink-0 mr-auto ml-1">
                      {quiz.questions_count ?? 0}Ø³
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div
          className="lg:col-span-3 bg-bgPurple rounded-2xl border border-white/5 flex flex-col overflow-hidden"
          style={{ maxHeight: '75vh' }}
        >
          {!activeLesson ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-gray-500">
              <BookOpen size={56} className="mb-4 text-white/10" />
              <p className="text-lg font-bold text-center">Ø§Ø®ØªØ± Ø¯Ø±Ø³Ø§Ù‹ Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø¬Ø§Ù†Ø¨ÙŠØ©</p>
              <p className="text-sm mt-2 text-center text-gray-600">
                {sections.length === 0
                  ? 'Ù„Ù… ÙŠÙØ¶ÙŽÙ Ù…Ø­ØªÙˆÙ‰ Ø¨Ø¹Ø¯. Ø¹Ø¯ Ù„Ø§Ø­Ù‚Ø§Ù‹.'
                  : 'Ø§Ù†Ù‚Ø± Ø¹Ù„Ù‰ Ø£ÙŠ Ø¯Ø±Ø³ ÙÙŠ Ø§Ù„Ù…Ù†Ù‡Ø¬ Ù„Ø¹Ø±Ø¶ Ù…Ø­ØªÙˆØ§Ù‡'}
              </p>
            </div>
          ) : (
            <LessonView lesson={activeLesson} moduleSlug={slug} navigate={navigate} />
          )}
        </div>
      </div>
    </div>
  );
};

// â”€â”€â”€ Per-lesson content view â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const LessonView = ({ lesson, moduleSlug, navigate }) => {
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    // Pick first populated tab
    if (lesson.videos?.length)         setActiveTab('videos');
    else if (lesson.documents?.length) setActiveTab('documents');
    else if (lesson.voice_messages?.length) setActiveTab('voice');
    else if (lesson.photos?.length)    setActiveTab('photos');
    else if (lesson.sessions?.length)  setActiveTab('sessions');
    else setActiveTab(null);
  }, [lesson.id]);

  const tabs = [
    { key: 'videos',     label: 'ÙÙŠØ¯ÙŠÙˆÙ‡Ø§Øª', Icon: Video,       count: lesson.videos?.length || 0 },
    { key: 'documents',  label: 'Ù…Ù„ÙØ§Øª',     Icon: FileText,    count: lesson.documents?.length || 0 },
    { key: 'voice',      label: 'ØµÙˆØªÙŠØ§Øª',    Icon: Mic,         count: lesson.voice_messages?.length || 0 },
    { key: 'photos',     label: 'ØµÙˆØ±',       Icon: ImageIcon,   count: lesson.photos?.length || 0 },
    { key: 'sessions',   label: 'Ø¬Ù„Ø³Ø§Øª',     Icon: PlayCircle,  count: lesson.sessions?.length || 0 },
  ].filter(t => t.count > 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Lesson header */}
      <div className="p-5 border-b border-white/5 shrink-0">
        <div className="text-xs text-gray-500 font-bold mb-1">{lesson.sectionTitle}</div>
        <h3 className="text-xl font-black text-white">{lesson.title}</h3>
        {lesson.description && <p className="text-gray-400 text-sm mt-1">{lesson.description}</p>}
      </div>

      {tabs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-gray-500">
          <Lock size={40} className="mb-4 text-white/10" />
          <p className="font-bold">Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ø­ØªÙˆÙ‰ Ù„Ù‡Ø°Ø§ Ø§Ù„Ø¯Ø±Ø³ Ø¨Ø¹Ø¯.</p>
          <p className="text-sm mt-1">Ø³ÙŠÙØ¶Ø§Ù Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ù‚Ø±ÙŠØ¨Ø§Ù‹ Ù…Ù† Ù‚Ø¨Ù„ Ø§Ù„Ø£Ø³ØªØ§Ø°.</p>
        </div>
      ) : (
        <>
          {/* Tab bar */}
          <div className="flex gap-2 px-4 py-3 border-b border-white/5 overflow-x-auto shrink-0">
            {tabs.map(({ key, label, Icon, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition shrink-0
                  ${activeTab === key
                    ? 'bg-accentGold text-bgDark'
                    : 'bg-bgDark text-gray-400 border border-white/5 hover:border-white/15 hover:text-white'}`}
              >
                <Icon size={14} />
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-black
                  ${activeTab === key ? 'bg-black/20 text-bgDark' : 'bg-white/10 text-gray-500'}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
            {activeTab === 'videos'    && lesson.videos?.map(v => <VideoCard   key={v.id} item={v} />)}
            {activeTab === 'documents' && lesson.documents?.map(d => <DocumentCard key={d.id} item={d} />)}
            {activeTab === 'voice'     && lesson.voice_messages?.map(v => <VoiceCard    key={v.id} item={v} />)}
            {activeTab === 'photos'    && lesson.photos?.map(p => <PhotoCard    key={p.id} item={p} />)}
            {activeTab === 'sessions'  && lesson.sessions?.map(s => <SessionCard  key={s.id} item={s} />)}
          </div>
        </>
      )}
    </div>
  );
};

// â”€â”€â”€ Media cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const VideoCard = ({ item }) => (
  <div className="bg-bgDark rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition">
    <div className="p-4 flex items-start gap-3">
      <div className="p-2 bg-blue-500/10 rounded-lg shrink-0"><Video size={18} className="text-blue-400" /></div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white">{item.title}</p>
        {item.description && <p className="text-gray-500 text-sm mt-0.5">{item.description}</p>}
      </div>
    </div>
    {item.telegram_link && (
      <div className="px-4 pb-4">
        <a href={item.telegram_link} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-500/10 text-blue-400
            border border-blue-500/20 rounded-xl font-bold text-sm hover:bg-blue-500 hover:text-white transition">
          <PlayCircle size={16} /> Ù…Ø´Ø§Ù‡Ø¯Ø© Ø§Ù„ÙÙŠØ¯ÙŠÙˆ
        </a>
      </div>
    )}
  </div>
);

const DocumentCard = ({ item }) => {
  const url = item.effective_url || getMediaUrl(item.file_url) || getMediaUrl(item.document_file);
  return (
    <div className="bg-bgDark rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition">
      <div className="p-4 flex items-center gap-3">
        <div className="p-2 bg-red-500/10 rounded-lg shrink-0"><FileText size={18} className="text-red-400" /></div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white">{item.title}</p>
          <p className="text-gray-500 text-xs mt-0.5">Ù…Ù„Ù PDF</p>
          {!url && (
            <span className="inline-flex items-center gap-1 text-yellow-400 text-xs mt-1">
              <AlertCircle size={12} /> Ø§Ù„Ù…Ù„Ù ØºÙŠØ± Ù…ØªØ§Ø­ Ø­Ø§Ù„ÙŠØ§Ù‹
            </span>
          )}
        </div>
        {url && (
          <div className="flex gap-2 shrink-0">
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg
                text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition">
              <ExternalLink size={13} /> Ø¹Ø±Ø¶
            </a>
            <a href={url} download={`${item.title}.pdf`}
              className="flex items-center gap-1 px-3 py-2 bg-accentGold/10 border border-accentGold/20 rounded-lg
                text-xs font-bold text-accentGold hover:bg-accentGold hover:text-bgDark transition">
              <Download size={13} /> ØªØ­Ù…ÙŠÙ„
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const VoiceCard = ({ item }) => {
  const url = item.effective_url || getMediaUrl(item.audio_url) || getMediaUrl(item.audio_file);
  return (
    <div className="bg-bgDark rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-purple-500/10 rounded-lg shrink-0"><Mic size={18} className="text-purple-400" /></div>
          <p className="font-bold text-white">{item.title}</p>
        </div>
        {url ? (
          <div className="space-y-2">
            <audio src={url} controls className="w-full" preload="metadata" />
            <a href={url} download={`${item.title}.mp3`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accentGold/10 border border-accentGold/20
                rounded-xl text-xs font-bold text-accentGold hover:bg-accentGold hover:text-bgDark transition">
              <Download size={13} /> ØªØ­Ù…ÙŠÙ„ Ø§Ù„ØµÙˆØª
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm">
            <AlertCircle size={14} /> Ø§Ù„Ù…Ù„Ù Ø§Ù„ØµÙˆØªÙŠ ØºÙŠØ± Ù…ØªØ§Ø­ Ø­Ø§Ù„ÙŠØ§Ù‹
          </div>
        )}
      </div>
    </div>
  );
};

const PhotoCard = ({ item }) => {
  const url = item.effective_url || getMediaUrl(item.photo_url) || getMediaUrl(item.image_file);
  return (
    <div className="bg-bgDark rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition">
      <div className="p-4 flex items-center gap-3 border-b border-white/5">
        <div className="p-2 bg-green-500/10 rounded-lg shrink-0"><ImageIcon size={18} className="text-green-400" /></div>
        <p className="font-bold text-white">{item.title}</p>
      </div>
      {url
        ? <div className="bg-black/30 flex items-center justify-center p-4">
            <img src={url} alt={item.title} className="max-h-80 object-contain rounded-xl" />
          </div>
        : <div className="p-4 text-center text-gray-500 text-sm">Ø§Ù„ØµÙˆØ±Ø© ØºÙŠØ± Ù…ØªØ§Ø­Ø©</div>
      }
    </div>
  );
};

const SessionCard = ({ item }) => {
  const url = item.telegram_link || item.session_url || item.link;
  return (
    <div className="bg-bgDark rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition">
      <div className="p-4 flex items-start gap-3">
        <div className="p-2 bg-orange-500/10 rounded-lg shrink-0"><PlayCircle size={18} className="text-orange-400" /></div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white">{item.title}</p>
          {item.description && <p className="text-gray-500 text-sm mt-0.5">{item.description}</p>}
        </div>
      </div>
      {url && (
        <div className="px-4 pb-4">
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500/10 text-orange-400
              border border-orange-500/20 rounded-xl font-bold text-sm hover:bg-orange-500 hover:text-white transition">
            <ExternalLink size={16} /> ÙØªØ­ Ø§Ù„Ø¬Ù„Ø³Ø©
          </a>
        </div>
      )}
    </div>
  );
};

export default ModuleContent;
