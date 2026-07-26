import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { DataTable } from '../../ui/DataTable';
import api from '../../../api/axios';

export const ViewModuleStudentsModal = ({ isOpen, onClose, module }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && module) {
      fetchStudents();
    }
  }, [isOpen, module]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/modules/${module.slug}/students/`);
      setStudents(res.data);
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
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء محاولة إلغاء تسجيل الطالب');
    }
  };

  const columns = [
    { key: 'full_name', label: 'الاسم' },
    { key: 'email', label: 'البريد الإلكتروني' },
    { 
      key: 'enrolled_at', 
      label: 'تاريخ التسجيل',
      render: (val) => new Date(val).toLocaleDateString('ar-DZ')
    },
    { 
      key: 'is_active', 
      label: 'حالة الحساب',
      render: (val) => val ? <span className="text-green-500">نشط</span> : <span className="text-red-500">موقوف</span>
    },
    {
      key: 'actions',
      label: 'العمليات',
      render: (_, row) => (
        <Button 
          variant="danger" 
          size="sm" 
          onClick={() => handleRemove(row.enrollment_id)}
        >
          إلغاء
        </Button>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-bgDarker border border-white/10 rounded-2xl w-full max-w-4xl p-6 max-h-[85vh] overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h3 className="text-xl font-bold text-white">الطلاب المسجلون - {module?.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        
        <div className="overflow-y-auto flex-1 pr-2">
          <DataTable 
            columns={columns}
            data={students}
            isLoading={loading}
            emptyStateTitle="لا يوجد طلاب"
            emptyStateDesc="لم يتم العثور على أي طلاب مسجلين في هذه الوحدة بعد."
          />
        </div>
        
        <div className="mt-6 flex justify-end shrink-0">
          <Button variant="secondary" onClick={onClose}>إغلاق</Button>
        </div>
      </div>
    </div>
  );
};
