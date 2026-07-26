import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import api from '../../../api/axios';

export const EnrollStudentModal = ({ isOpen, onClose, student, onSuccess }) => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('CASH');
  const [receipt, setReceipt] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchModules();
      setSelectedModule('');
      setAmount('');
      setMethod('CASH');
      setReceipt('');
      setNotes('');
      setError(null);
    }
  }, [isOpen]);

  const fetchModules = async () => {
    try {
      const res = await api.get('/admin/modules/');
      setModules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // When module changes, update default amount
  useEffect(() => {
    if (selectedModule) {
      const mod = modules.find(m => m.slug === selectedModule);
      if (mod) {
        setAmount(mod.price);
      }
    }
  }, [selectedModule, modules]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedModule) {
      setError("الرجاء اختيار وحدة دراسية");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // We map this to SuperAdminAddStudentModuleView in urls.py
      await api.post(`/admin/students/${student.id}/add-module/`, {
        module_slug: selectedModule,
        amount: amount,
        method: method,
        receipt_number: receipt,
        notes: notes
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "حدث خطأ أثناء تسجيل الطالب.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-bgDarker border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">تسجيل في وحدة - {student?.full_name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm font-bold">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">الوحدة الدراسية</label>
            <select 
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold"
              required
            >
              <option value="">-- اختر وحدة --</option>
              {modules
                .filter(m => !student?.enrolled_modules?.some(em => em.slug === m.slug))
                .map(m => (
                <option key={m.slug} value={m.slug}>
                  {m.name} - {m.price} د.ج
                </option>
              ))}
            </select>
          </div>

          <div className="bg-bgPurple/30 p-4 rounded-xl border border-white/10 space-y-4">
            <h4 className="font-bold text-accentGold mb-2">تفاصيل الدفع</h4>
            <div className="grid grid-cols-1 gap-3 mb-2">
              <div>
                <label className="block text-xs text-gray-400 mb-1">طريقة الدفع</label>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  className="w-full bg-bgDark border border-white/10 rounded-lg py-1 px-2 text-white text-sm focus:border-accentGold"
                >
                  <option value="CASH">نقداً</option>
                  <option value="EDAHABIA">البطاقة الذهبية</option>
                  <option value="BARIDIMOB">بريدي موب</option>
                  <option value="BANK_TRANSFER">تحويل بنكي</option>
                  <option value="OTHER">أخرى</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">رقم الإيصال (اختياري)</label>
                <input 
                  type="text"
                  value={receipt}
                  onChange={e => setReceipt(e.target.value)}
                  className="w-full bg-bgDark border border-white/10 rounded-lg py-1 px-2 text-white text-sm focus:border-accentGold"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">ملاحظات (اختياري)</label>
                <input 
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-bgDark border border-white/10 rounded-lg py-1 px-2 text-white text-sm focus:border-accentGold"
                />
              </div>
            </div>
          </div>
          
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'جاري التسجيل...' : 'تسجيل الطالب'}
          </Button>
        </form>
      </div>
    </div>
  );
};
