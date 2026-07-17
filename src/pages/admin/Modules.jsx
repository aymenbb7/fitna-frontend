import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { BookOpen, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

export const Modules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/modules/');
      setModules(res.data);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل بيانات الوحدات الدراسية.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const columns = [
    { 
      key: 'name', 
      label: 'الوحدة الدراسية',
      render: (val, row) => (
        <div>
          <p className="font-bold text-white">{val}</p>
          <p className="text-xs text-gray-400 font-mono">{row.slug}</p>
        </div>
      )
    },
    {
      key: 'admin',
      label: 'المشرف',
      render: (val) => val || <span className="text-gray-500 text-xs">بدون مشرف</span>
    },
    {
      key: 'student_count',
      label: 'عدد الطلاب',
      render: (val) => <span className="font-bold text-accentGold">{val}</span>
    },
    {
      key: 'is_active',
      label: 'الحالة',
      render: (val) => val 
        ? <Badge variant="success">نشط</Badge> 
        : <Badge variant="error">مغلق</Badge>
    }
  ];

  const rowActions = [
    { label: 'إعدادات الوحدة', onClick: (row) => console.log('Settings', row) },
    { label: 'تعيين مشرف', onClick: (row) => console.log('Assign Admin', row) },
    { label: 'تفعيل/تعطيل الوحدة', danger: true, onClick: (row) => console.log('Toggle Active', row) }
  ];

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-4">{error}</h2>
        <Button onClick={fetchModules} variant="primary">إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title="الوحدات الدراسية" 
        description="إدارة جميع الوحدات الدراسية المتاحة على المنصة"
        actionLabel="إنشاء وحدة"
        actionIcon={BookOpen}
        onAction={() => console.log("Open Create Module Modal")}
      />

      <DataTable 
        columns={columns}
        data={modules}
        isLoading={loading}
        searchPlaceholder="ابحث باسم الوحدة، المشرف..."
        rowActions={rowActions}
        emptyStateTitle="لا توجد وحدات"
        emptyStateDesc="لم يتم إنشاء أي وحدات دراسية بعد."
      />
    </div>
  );
};

export default Modules;
