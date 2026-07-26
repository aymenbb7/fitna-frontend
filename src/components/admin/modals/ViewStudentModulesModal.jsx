import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { DataTable } from '../../ui/DataTable';
import api from '../../../api/axios';

export const ViewStudentModulesModal = ({ isOpen, onClose, student, onRemove }) => {
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' or 'payments'
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && student) {
      if (activeTab === 'modules') fetchEnrollments();
      else if (activeTab === 'payments') fetchPayments();
    }
  }, [isOpen, student, activeTab]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/students/${student.id}/enrollments/`);
      setEnrollments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/students/${student.id}/payments/`);
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (enrollmentId) => {
    if (!window.confirm('هل أنت متأكد من إلغاء تسجيل هذا الطالب من هذه الوحدة؟')) return;
    try {
      await api.delete(`/admin/enrollments/${enrollmentId}/`);
      fetchEnrollments();
      if (onRemove) onRemove();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء محاولة إلغاء تسجيل الطالب');
    }
  };

  const moduleColumns = [
    { key: 'module_name', label: 'الوحدة الدراسية' },
    { 
      key: 'enrolled_at', 
      label: 'تاريخ التسجيل',
      render: (val) => new Date(val).toLocaleDateString('ar-DZ')
    },
    { 
      key: 'progress', 
      label: 'التقدم',
      render: (val) => `${val}%`
    },
    { 
      key: 'status', 
      label: 'الحالة',
      render: (val) => <span className="text-green-500">نشط</span>
    },
    {
      key: 'actions',
      label: 'العمليات',
      render: (_, row) => (
        <Button 
          variant="danger" 
          size="sm" 
          onClick={() => handleRemove(row.id)}
        >
          إلغاء
        </Button>
      )
    }
  ];

  const paymentColumns = [
    { key: 'module_name', label: 'الوحدة' },
    { key: 'amount', label: 'المبلغ', render: val => `${val} د.ج` },
    { key: 'method', label: 'طريقة الدفع' },
    { 
      key: 'status', 
      label: 'الحالة',
      render: (val) => (
        <span className={val === 'SUCCESS' ? 'text-green-500' : val === 'PENDING' ? 'text-yellow-500' : 'text-red-500'}>
          {val === 'SUCCESS' ? 'ناجح' : val === 'PENDING' ? 'قيد الانتظار' : 'فاشل'}
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'التاريخ',
      render: (val) => new Date(val).toLocaleDateString('ar-DZ')
    },
    { key: 'receipt_number', label: 'رقم الإيصال', render: val => val || '-' },
    { key: 'admin', label: 'المسؤول', render: val => val || 'تلقائي' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-bgDarker border border-white/10 rounded-2xl w-full max-w-4xl p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">تفاصيل الطالب - {student?.full_name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        
        <div className="flex gap-4 border-b border-white/10 mb-6">
          <button 
            className={`pb-2 px-2 font-bold ${activeTab === 'modules' ? 'text-accentGold border-b-2 border-accentGold' : 'text-gray-400'}`}
            onClick={() => setActiveTab('modules')}
          >
            الوحدات المسجلة
          </button>
          <button 
            className={`pb-2 px-2 font-bold ${activeTab === 'payments' ? 'text-accentGold border-b-2 border-accentGold' : 'text-gray-400'}`}
            onClick={() => setActiveTab('payments')}
          >
            سجل المدفوعات
          </button>
        </div>

        {activeTab === 'modules' ? (
          <DataTable 
            columns={moduleColumns}
            data={enrollments}
            isLoading={loading}
            emptyStateTitle="لا توجد وحدات"
            emptyStateDesc="هذا الطالب غير مسجل في أي وحدة حالياً."
          />
        ) : (
          <DataTable 
            columns={paymentColumns}
            data={payments}
            isLoading={loading}
            emptyStateTitle="لا توجد مدفوعات"
            emptyStateDesc="لا يوجد سجل مدفوعات لهذا الطالب بعد."
          />
        )}
        
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>إغلاق</Button>
        </div>
      </div>
    </div>
  );
};
