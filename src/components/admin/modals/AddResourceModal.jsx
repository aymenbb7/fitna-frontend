import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Link as LinkIcon, Loader, Mic, Square, Play } from 'lucide-react';
import api from '../../../api/axios';

export const AddResourceModal = ({ isOpen, onClose, onSuccess, moduleSlug, lessonId, activeTab }) => {
  const [title, setTitle] = useState('');
  const [inputType, setInputType] = useState('upload'); // 'upload' or 'url'
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = e => chunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const objUrl = URL.createObjectURL(blob);
        setAudioUrl(objUrl);
        const recordingFile = new File([blob], 'recording.webm', { type: 'audio/webm' });
        setFile(recordingFile);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert('لا يمكن الوصول إلى الميكروفون. يرجى التحقق من الصلاحيات.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'sessions' || activeTab === 'videos') {
      setInputType('url');
    } else {
      setInputType('upload');
    }
  }, [activeTab]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError("يرجى إدخال عنوان.");
      return;
    }
    if (activeTab !== 'sessions' && (inputType === 'upload' || inputType === 'record') && !file) {
      setError("يرجى اختيار ملف.");
      return;
    }
    if ((inputType === 'url' || activeTab === 'sessions') && !url) {
      setError("يرجى إدخال رابط.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let endpoint = '';
      const formData = new FormData();
      formData.append('title', title);
      formData.append('lesson', lessonId);

      if (activeTab === 'videos') {
        endpoint = `/modules/${moduleSlug}/videos/`;
        const jsonPayload = {
          title,
          lesson: lessonId,
          video_type: 'SESSION_RECORDING',
          telegram_link: url,
        };
        const res = await api.post(endpoint, jsonPayload);
        onSuccess();
        setTitle('');
        setUrl('');
        setInputType('url');
        return;
      } else if (activeTab === 'documents') {
        endpoint = `/modules/${moduleSlug}/documents/`;
        formData.append('doc_type', 'PDF');
        if (inputType === 'upload') formData.append('document_file', file);
        else formData.append('file_url', url);
      } else if (activeTab === 'voice_messages') {
        endpoint = `/modules/${moduleSlug}/voice/`;
        formData.append('voice_type', 'LESSON');
        if (inputType === 'upload' || inputType === 'record') formData.append('audio_file', file);
        else formData.append('audio_url', url);
      } else if (activeTab === 'photos') {
        endpoint = `/modules/${moduleSlug}/photos/`;
        formData.append('photo_type', 'OTHER');
        if (inputType === 'upload') formData.append('image_file', file);
        else formData.append('photo_url', url);
      } else if (activeTab === 'sessions') {
        endpoint = `/modules/${moduleSlug}/sessions/`;
        formData.append('session_link', url);
        formData.append('session_date', new Date().toISOString());
      }

      await api.post(endpoint, formData);
      
      onSuccess();
      setTitle('');
      setFile(null);
      setUrl('');
      setInputType('upload');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ أثناء إضافة المحتوى. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const getAcceptType = () => {
    switch (activeTab) {
      case 'videos': return 'video/*';
      case 'documents': return '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt';
      case 'voice_messages': return 'audio/*';
      case 'photos': return 'image/*';
      default: return '*/*';
    }
  };

  const getTypeName = () => {
    switch (activeTab) {
      case 'videos': return 'فيديو';
      case 'documents': return 'ملف (PDF/Word)';
      case 'voice_messages': return 'مقطع صوتي';
      case 'photos': return 'صورة';
      default: return 'محتوى';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-bgDarker w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-bgDark">
          <h2 className="text-xl font-bold text-white">إضافة {getTypeName()}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">العنوان</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-bgPurple border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accentGold transition"
                placeholder="أدخل عنواناً..."
                required
              />
            </div>

            {activeTab !== 'sessions' && activeTab !== 'videos' && (
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-4">طريقة الإضافة</label>
                <div className={`grid gap-4 ${activeTab === 'voice_messages' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  <button
                    type="button"
                    onClick={() => setInputType('upload')}
                    className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition border ${
                      inputType === 'upload' 
                        ? 'bg-accentGold/20 border-accentGold text-accentGold' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Upload size={18} />
                    رفع ملف
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputType('url')}
                    className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition border ${
                      inputType === 'url' 
                        ? 'bg-accentGold/20 border-accentGold text-accentGold' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <LinkIcon size={18} />
                    رابط خارجي
                  </button>
                  {activeTab === 'voice_messages' && (
                    <button
                      type="button"
                      onClick={() => setInputType('record')}
                      className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition border ${
                        inputType === 'record' 
                          ? 'bg-accentGold/20 border-accentGold text-accentGold' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <Mic size={18} />
                      تسجيل صوتي
                    </button>
                  )}
                </div>
              </div>
            )}

            {inputType === 'upload' && activeTab !== 'sessions' ? (
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">الملف ({getTypeName()})</label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={getAcceptType()}
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full bg-bgPurple border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accentGold transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accentGold/10 file:text-accentGold hover:file:bg-accentGold/20"
                    required
                  />
                </div>
              </div>
            ) : inputType === 'url' ? (
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">الرابط (URL)</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-bgPurple border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accentGold transition"
                  placeholder={activeTab === 'videos' ? "https://t.me/c/..." : "https://..."}
                  required
                />
              </div>
            ) : inputType === 'record' ? (
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">التسجيل الصوتي</label>
                <div className="w-full bg-bgPurple border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-4">
                  {!isRecording && !audioUrl ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition group border border-red-500/50"
                    >
                      <Mic size={32} />
                    </button>
                  ) : isRecording ? (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                    >
                      <Square size={24} fill="currentColor" />
                    </button>
                  ) : (
                    <div className="flex flex-col items-center gap-4 w-full">
                      <audio src={audioUrl} controls className="w-full max-w-sm h-10" />
                      <button
                        type="button"
                        onClick={() => {
                          setAudioUrl(null);
                          setFile(null);
                        }}
                        className="text-sm text-red-400 hover:text-red-300 transition"
                      >
                        حذف وإعادة التسجيل
                      </button>
                    </div>
                  )}
                  {isRecording && <p className="text-red-400 font-bold text-sm animate-pulse">جاري التسجيل...</p>}
                  {!isRecording && !audioUrl && <p className="text-gray-400 text-sm">انقر لبدء التسجيل</p>}
                </div>
              </div>
            ) : null}

            <div className="pt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
                disabled={loading}
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-accentGold text-bgDark font-bold hover:bg-yellow-400 transition flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    جاري الإضافة...
                  </>
                ) : (
                  'إضافة'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
