import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import api from '../../../api/axios';

export const AddModuleModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState(0);
  const [adminId, setAdminId] = useState('');
  
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchAdmins();
      setName('');
      setSlug('');
      setPrice(0);
      setAdminId('');
    }
  }, [isOpen]);

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/admin/users/');
      setAdmins(res.data.filter(u => u.role === 'MODULE_ADMIN'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    // basic slug generation for english, but works fine for id-like usage
    if (!slug || slug === name.toLowerCase().replace(/ /g, '-')) {
      setSlug(val.toLowerCase().replace(/\s+/g, '-'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/admin/modules/create/', {
        name,
        slug,
        price,
        admin_id: adminId || null
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error); alert(err.response?.data?.error || "حدث خطأ أثناء إنشاء الوحدة.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-bgDarker border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">إنشاء وحدة دراسية جديدة</h3>
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
              onChange={handleNameChange}
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">الرابط (Slug)</label>
            <input 
              type="text" 
              value={slug}
              onChange={e => setSlug(e.target.value)}
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold font-mono" 
              required
            />
          </div>

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
            <label className="block text-sm font-bold text-gray-400 mb-1">مشرف الوحدة (اختياري)</label>
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
          
          <div className="flex gap-4 mt-6">
            <Button type="button" variant="secondary" className="flex-1 justify-center" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center" disabled={loading}>
              {loading ? 'جاري الإنشاء...' : 'إنشاء الوحدة'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
