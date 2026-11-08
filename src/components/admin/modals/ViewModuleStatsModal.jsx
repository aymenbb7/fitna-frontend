import { formatDate } from '../../../utils/date';
import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { DataTable } from '../../ui/DataTable';
import { AlertCircle } from 'lucide-react';
import api from '../../../api/axios';

export const ViewModuleStatsModal = ({ isOpen, onClose, module }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    if (!module?.slug) {
      setError("معرف الوحدة الدراسية غير متوفر.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const encodedSlug = encodeURIComponent(module.slug);
      const res = await api.get(`/admin/modules/${encodedSlug}/stats/`);
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching module stats:', err);
      const msg = err.userMessage || err.response?.data?.error || err.response?.data?.detail || "تعذر تحميل إحصائيات هذه الوحدة. يرجى المحاولة مرة أخرى.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && module) {
      setStats(null);
      setError(null);
      fetchStats();
    } else {
      setStats(null);
      setError(null);
      setLoading(false);
    }
  }, [isOpen, module]);

  const columns = [
    { key: 'student_name', label: 'الطالب' },
    { key: 'amount', label: 'المبلغ', render: val => <span className="font-bold text-accentGold">{val} د.ج</span> },
    { key: 'method', label: 'طريقة الدفع' },
    { 
      key: 'paid_at', 
      label: 'تاريخ الدفع',
      render: (val) => formatDate(val)
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-bgDarker border border-white/10 rounded-2xl w-full max-w-4xl p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">إحصائيات الوحدة {module?.name ? `- ${module.name}` : ''}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-10 h-10 border-4 border-accentGold border-t-transparent rounded-full animate-spin"></div>
            <div className="text-gray-400 font-bold text-sm">جاري التحميل...</div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center my-6">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">{error}</h3>
            <Button onClick={fetchStats} variant="primary" className="mt-3" size="sm">
              إعادة المحاولة
            </Button>
          </div>
        ) : stats ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">السعر</p>
                <p className="font-bold text-lg text-white">{stats.price} د.ج</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">الطلاب المسجلون</p>
                <p className="font-bold text-lg text-white">{stats.total_students}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">إجمالي الإيرادات</p>
                <p className="font-bold text-lg text-accentGold">{stats.total_revenue} د.ج</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">متوسط الإيرادات / طالب</p>
                <p className="font-bold text-lg text-green-400">{Number(stats.average_revenue).toFixed(2)} د.ج</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">أحدث عمليات الدفع</h4>
              <DataTable 
                columns={columns}
                data={stats.latest_payments || []}
                isLoading={false}
                emptyStateTitle="لا توجد مدفوعات"
                emptyStateDesc="لم يتم تسجيل أي عمليات دفع لهذه الوحدة بعد."
              />
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-center py-10">لا توجد بيانات متاحة.</div>
        )}
        
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>إغلاق</Button>
        </div>
      </div>
    </div>
  );
};

export default ViewModuleStatsModal;
