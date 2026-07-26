import React, { useState, useEffect, useContext } from 'react';
import { Button } from '../../ui/Button';
import api from '../../../api/axios';
import { AuthContext } from '../../../context/AuthContext';

export const UpdateModuleModal = ({ isOpen, onClose, module, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [adminId, setAdminId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [learningOutcomes, setLearningOutcomes] = useState('');
  const [benefits, setBenefits] = useState('');
  
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && module) {
      fetchAdmins();
      setName(module.name || '');
      setDescription(module.description || '');
      setPrice(module.price || 0);
      setAdminId(module.admin_id || '');
      setIsActive(module.is_active !== undefined ? module.is_active : true);
      setThumbnailFile(null);
      setHeroImageFile(null);
      
      try {
        setLearningOutcomes(module.learning_outcomes ? JSON.parse(module.learning_outcomes).join('\n') : '');
      } catch (e) {
        setLearningOutcomes(module.learning_outcomes || '');
      }
      
      try {
        setBenefits(module.benefits ? JSON.parse(module.benefits).join('\n') : '');
      } catch (e) {
        setBenefits(module.benefits || '');
      }
      
      setError(null);
    }
  }, [isOpen, module]);

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/admin/users/');
      setAdmins(res.data.filter(u => u.role === 'MODULE_ADMIN'));
    } catch (err) {
      console.error(err);
    }
  };

  const uploadFile = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/upload/', formData);
    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let thumbnailUrl = module.thumbnail || module.cover_image_url || '';
      if (thumbnailFile) {
        thumbnailUrl = await uploadFile(thumbnailFile);
      }
      
      const outcomesJson = JSON.stringify(learningOutcomes.split('\n').filter(l => l.trim()));
      const benefitsJson = JSON.stringify(benefits.split('\n').filter(l => l.trim()));

      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', Number(price));
      if (thumbnailUrl) formData.append('thumbnail', thumbnailUrl);
      
      if (heroImageFile) {
        formData.append('hero_image', heroImageFile);
      }
      
      formData.append('learning_outcomes', outcomesJson);
      formData.append('benefits', benefitsJson);
      if (adminId) formData.append('admin_id', adminId);
      formData.append('is_active', isActive);

      await api.post(`/admin/modules/${module.slug}/update/`, formData);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ أثناء حفظ الإعدادات.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-bgDarker border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">إعدادات الوحدة - {module?.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm font-bold">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">اسم الوحدة</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">الوصف</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold min-h-[100px]" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">صورة مصغرة جديدة (اختياري)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setThumbnailFile(e.target.files[0])}
              className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accentGold file:text-bgDarker hover:file:bg-accentGold/80" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">صورة الغلاف (Hero Image) (اختياري)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setHeroImageFile(e.target.files[0])}
              className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">مخرجات التعلم (كل مخرج في سطر)</label>
            <textarea 
              value={learningOutcomes}
              onChange={e => setLearningOutcomes(e.target.value)}
              placeholder="يستطيع الطالب كذا...&#10;يتعلم الطالب كذا..."
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold min-h-[80px]" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">الفوائد والمميزات (كل ميزة في سطر)</label>
            <textarea 
              value={benefits}
              onChange={e => setBenefits(e.target.value)}
              placeholder="ميزة 1...&#10;ميزة 2..."
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold min-h-[80px]" 
            />
          </div>

          {user?.role === 'SUPER_ADMIN' && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">السعر (د.ج)</label>
                <input 
                  type="number" 
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold" 
                  min="0"
                  step="100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">مشرف الوحدة</label>
                <select 
                  value={adminId}
                  onChange={e => setAdminId(e.target.value)}
                  className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold"
                >
                  <option value="">-- بدون مشرف --</option>
                  {admins.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.full_name} ({a.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-accentGold border-white/10 rounded focus:ring-accentGold focus:ring-offset-bgDarker bg-bgDark"
                  />
                  <span className="text-white font-bold">الوحدة نشطة (تفعيل / إيقاف)</span>
                </label>
              </div>
            </>
          )}
          
          <div className="flex gap-4 mt-6">
            <Button type="button" variant="secondary" className="flex-1 justify-center" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
