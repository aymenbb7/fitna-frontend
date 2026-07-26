import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export const ModuleAdminModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/modules/');
      setModules(res.data);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل البيانات.");
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
    { label: 'إدارة محتوى الوحدة', onClick: (row) => navigate('/dashboard/admin/modules/' + row.slug + '/content') }
  ];

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-4">{error}</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title="محتوى وحداتي" 
        description="إدارة محتوى الوحدات الدراسية المخصصة لك"
        actionIcon={BookOpen}
      />

      <DataTable 
        columns={columns}
        data={modules}
        isLoading={loading}
        searchPlaceholder="ابحث باسم الوحدة..."
        rowActions={rowActions}
        emptyStateTitle="لا توجد وحدات"
        emptyStateDesc="لم يتم تخصيص أي وحدات دراسية لك بعد."
      />
    </div>
  );
};

export default ModuleAdminModules;
