import React, { useState, useEffect, useContext } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { BookOpen, AlertCircle, UserPlus } from 'lucide-react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { AddStudentModal } from '../../components/admin/modals/AddStudentModal';
import { AuthContext } from '../../context/AuthContext';

export const ModuleAdminModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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
      render: (val) => <span className="font-bold text-accentGold">{val ?? 0}</span>
    },
    {
      key: 'price',
      label: 'السعر',
      render: (val) => <span className="text-gray-300">{val ?? 0} د.ج</span>
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
    { 
      label: 'إدارة المحتوى', 
      onClick: (row) => navigate('/dashboard/admin/modules/' + row.slug + '/content') 
    },
    { 
      label: 'إضافة صورة / PDF / صوت', 
      onClick: (row) => navigate('/dashboard/admin/modules/' + row.slug + '/content') 
    },
    { 
      label: 'إضافة جلسة مباشرة', 
      onClick: (row) => navigate('/dashboard/admin/modules/' + row.slug + '/content') 
    },
    { 
      label: 'إدارة المحاضرات التجريبية', 
      onClick: (row) => navigate('/dashboard/admin/modules/' + row.slug + '/content') 
    },
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
        title="وحداتي الدراسية" 
        description={`إدارة محتوى الوحدات الدراسية المخصصة لك${user?.full_name ? ' - ' + user.full_name : ''}`}
        actionLabel="إضافة طالب جديد"
        actionIcon={UserPlus}
        onAction={() => setIsAddStudentOpen(true)}
      />

      {modules.length === 0 && !loading && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center">
          <BookOpen className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">لا توجد وحدات مخصصة لك</h3>
          <p className="text-gray-400 text-sm">تواصل مع المسؤول الرئيسي لتخصيص وحدات دراسية لحسابك.</p>
        </div>
      )}

      {(modules.length > 0 || loading) && (
        <DataTable 
          columns={columns}
          data={modules}
          isLoading={loading}
          searchPlaceholder="ابحث باسم الوحدة..."
          rowActions={rowActions}
          emptyStateTitle="لا توجد وحدات"
          emptyStateDesc="لم يتم تخصيص أي وحدات دراسية لك بعد."
        />
      )}

      <AddStudentModal 
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onSuccess={fetchModules}
      />
    </div>
  );
};

export default ModuleAdminModules;
