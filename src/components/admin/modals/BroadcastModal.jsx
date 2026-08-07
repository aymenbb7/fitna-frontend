import React, { useState, useEffect, useContext } from 'react';
import { Button } from '../../ui/Button';
import api from '../../../api/axios';
import { AuthContext } from '../../../context/AuthContext';
import { Search } from 'lucide-react';

export const BroadcastModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetType, setTargetType] = useState('ALL_STUDENTS');
  const [targetIds, setTargetIds] = useState([]); // array of selected IDs
  const [sendEmail, setSendEmail] = useState(false);

  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setMessage('');
      setTargetType('ALL_STUDENTS');
      setTargetIds([]);
      setSendEmail(false);
      setSearchQuery('');
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const [modRes, userRes] = await Promise.all([
        api.get('/admin/modules/'),
        api.get('/admin/users/')
      ]);
      setModules(modRes.data);
      setStudents(userRes.data.filter(u => u.role === 'STUDENT'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckboxChange = (id) => {
    setTargetIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/admin/notifications/broadcast/', {
        title,
        message,
        target_type: targetType,
        target_ids: targetIds,
        send_email: sendEmail
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ أثناء الإرسال.");
    } finally {
      setLoading(false);
    }
  };

  const filteredModules = modules.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredStudents = students.filter(s => s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-bgDarker border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h3 className="text-xl font-bold text-white">إرسال إشعار</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm font-bold shrink-0">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4 min-h-0">
          <div className="shrink-0 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1">عنوان الإشعار</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold" 
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1">نص الإشعار</label>
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold min-h-[100px]" 
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1">المستهدفون</label>
              <select 
                value={targetType}
                onChange={e => {
                  setTargetType(e.target.value);
                  setTargetIds([]);
                  setSearchQuery('');
                }}
                className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold"
              >
                {user?.role === 'SUPER_ADMIN' && <option value="ALL">الجميع (طلاب ومشرفين)</option>}
                <option value="ALL_STUDENTS">جميع الطلاب</option>
                {user?.role === 'SUPER_ADMIN' && <option value="ALL_MODULE_ADMINS">جميع مشرفي الوحدات</option>}
                {user?.role === 'SUPER_ADMIN' && <option value="MODULES">وحدات دراسية محددة</option>}
                <option value="STUDENTS">طلاب محددين</option>
              </select>
            </div>
          </div>
          
          {(targetType === 'MODULES' || targetType === 'STUDENTS') && (
            <div className="flex-1 flex flex-col min-h-[150px] border border-white/10 rounded-xl bg-bgDark p-3 overflow-hidden">
              <div className="relative mb-3 shrink-0">
                <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="بحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-bgDarker border border-white/5 rounded-lg py-1.5 pr-9 pl-3 text-sm text-white focus:outline-none focus:border-accentGold"
                />
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {targetType === 'MODULES' && filteredModules.map(m => (
                  <label key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition">
                    <input 
                      type="checkbox"
                      checked={targetIds.includes(m.id)}
                      onChange={() => handleCheckboxChange(m.id)}
                      className="w-4 h-4 rounded border-gray-600 bg-bgDarker checked:bg-accentGold focus:ring-accentGold focus:ring-offset-bgDark"
                    />
                    <span className="text-sm text-white">{m.name}</span>
                  </label>
                ))}
                
                {targetType === 'STUDENTS' && filteredStudents.map(s => (
                  <label key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition">
                    <input 
                      type="checkbox"
                      checked={targetIds.includes(s.id)}
                      onChange={() => handleCheckboxChange(s.id)}
                      className="w-4 h-4 rounded border-gray-600 bg-bgDarker checked:bg-accentGold focus:ring-accentGold focus:ring-offset-bgDark"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm text-white font-bold">{s.full_name}</span>
                      <span className="text-xs text-gray-400">{s.email}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0 pt-2">
            <input 
              type="checkbox"
              id="sendEmail"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-bgDark checked:bg-accentGold focus:ring-accentGold focus:ring-offset-bgDark"
            />
            <label htmlFor="sendEmail" className="text-sm font-bold text-white cursor-pointer">
              إرسال كرسالة بريد إلكتروني أيضاً
            </label>
          </div>

          <div className="flex gap-4 mt-6 shrink-0">
            <Button type="button" variant="secondary" className="flex-1 justify-center" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center" disabled={loading || ((targetType === 'MODULES' || targetType === 'STUDENTS') && targetIds.length === 0)}>
              {loading ? 'جاري الإرسال...' : 'إرسال الإشعار'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
