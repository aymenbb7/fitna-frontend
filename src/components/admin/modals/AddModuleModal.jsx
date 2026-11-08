import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import api from '../../../api/axios';
import { toast } from '../../../utils/toast';

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
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/admin/users/');
      setAdmins(Array.isArray(res.data) ? res.data.filter(u => u.role === 'MODULE_ADMIN') : []);
    } catch (err) {
      console.error('Failed to fetch module admins:', err);
    }
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    const generated = val.trim().toLowerCase().replace(/\s+/g, '-');
    if (!slug || slug === name.trim().toLowerCase().replace(/\s+/g, '-')) {
      setSlug(generated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double submission

    const trimmedName = name.trim();
    const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, '-');

    if (!trimmedName || !cleanSlug) {
      setError("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post('/admin/modules/create/', {
        name: trimmedName,
        slug: cleanSlug,
        price: Number(price) || 0,
        admin_id: adminId || null
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to create module:', err);
      const msg = err.response?.data?.error || err.userMessage || "حدث خطأ أثناء إنشاء الوحدة.";
      setError(msg);
      toast.error(msg);
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
          <button onClick={onClose} className="text-gray-400 hover:text-white" disabled={loading}>✕</button>
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
              disabled={loading}
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold disabled:opacity-50" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">الرابط (Slug)</label>
            <input 
              type="text" 
              value={slug}
              onChange={e => setSlug(e.target.value)}
              disabled={loading}
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold font-mono disabled:opacity-50" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">السعر (د.ج)</label>
            <input 
              type="number" 
              value={price}
              onChange={e => setPrice(e.target.value)}
              disabled={loading}
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold disabled:opacity-50" 
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
              disabled={loading}
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold disabled:opacity-50"
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
            <Button type="button" variant="secondary" className="flex-1 justify-center" onClick={onClose} disabled={loading}>
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

export default AddModuleModal;
