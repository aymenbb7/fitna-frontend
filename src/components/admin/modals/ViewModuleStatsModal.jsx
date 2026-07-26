import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { DataTable } from '../../ui/DataTable';
import api from '../../../api/axios';

export const ViewModuleStatsModal = ({ isOpen, onClose, module }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && module) {
      fetchStats();
    }
  }, [isOpen, module]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/modules/${module.slug}/stats/`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'student_name', label: 'الطالب' },
    { key: 'amount', label: 'المبلغ', render: val => <span className="font-bold text-accentGold">{val} د.ج</span> },
    { key: 'method', label: 'طريقة الدفع' },
    { 
      key: 'paid_at', 
      label: 'تاريخ الدفع',
      render: (val) => new Date(val).toLocaleDateString('ar-DZ')
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-bgDarker border border-white/10 rounded-2xl w-full max-w-4xl p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">إحصائيات الوحدة - {module?.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        
        {loading || !stats ? (
          <div className="text-gray-400 text-center py-10">جاري التحميل...</div>
        ) : (
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
        )}
        
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>إغلاق</Button>
        </div>
      </div>
    </div>
  );
};
