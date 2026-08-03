import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { UserPlus, AlertCircle, Eye } from 'lucide-react';
import api from '../../api/axios';

import { AddStudentModal } from '../../components/admin/modals/AddStudentModal';
import { ViewStudentModulesModal } from '../../components/admin/modals/ViewStudentModulesModal';
import { ResetPasswordModal } from '../../components/admin/modals/ResetPasswordModal';
import { EnrollStudentModal } from '../../components/admin/modals/EnrollStudentModal';
import { UpdateStudentModal } from '../../components/admin/modals/UpdateStudentModal';

import { useSearchParams } from 'react-router-dom';

export const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedStudentForModules, setSelectedStudentForModules] = useState(null);
  const [selectedStudentForPassword, setSelectedStudentForPassword] = useState(null);
  const [selectedStudentForEnrollment, setSelectedStudentForEnrollment] = useState(null);
  const [selectedStudentForUpdate, setSelectedStudentForUpdate] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const q = searchParams.get('search');
      const url = q ? `/admin/users/?search=${encodeURIComponent(q)}` : '/admin/users/';
      const res = await api.get(url);
      setStudents(res.data.filter(u => u.role === 'STUDENT'));
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل البيانات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [searchParams]);

  const handleStatusChange = async (student, newStatus) => {
    if (!window.confirm(`هل أنت متأكد من ${newStatus ? 'تفعيل' : 'إيقاف'} حساب ${student.full_name}؟`)) return;
    try {
      await api.post(`/admin/users/${student.id}/status/`, { is_active: newStatus });
      fetchStudents();
    } catch (err) {
      alert("حدث خطأ أثناء تغيير حالة الحساب.");
    }
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`هل أنت متأكد من حذف حساب ${student.full_name} بشكل نهائي؟ هذا الإجراء لا يمكن التراجع عنه.`)) return;
    try {
      await api.delete(`/admin/users/${student.id}/`);
      fetchStudents();
    } catch (err) {
      alert("حدث خطأ أثناء حذف الحساب.");
    }
  };

  const columns = [
    { 
      key: 'full_name', 
      label: 'الاسم',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accentGold/20 flex items-center justify-center text-accentGold font-bold text-xs">
            {val ? val.substring(0, 2).toUpperCase() : 'ST'}
          </div>
          <div>
            <p className="font-bold text-white">{val || 'بدون اسم'}</p>
            <p className="text-xs text-gray-400">{row.email}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'enrolled_modules', 
      label: 'عدد الوحدات',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <Badge variant="primary">{val ? val.length : 0} وحدات</Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedStudentForModules(row)}
            title="الملف الشخصي والوحدات"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      )
    },
    { 
      key: 'total_spent', 
      label: 'إجمالي المشتريات',
      render: (val) => <span className="text-accentGold font-bold">{val} د.ج</span>
    },
    {
      key: 'is_approved',
      label: 'حالة الحساب',
      render: (val, row) => {
        if (!val) return <Badge variant="warning">قيد الانتظار</Badge>;
        if (!row.is_active) return <Badge variant="error">موقوف</Badge>;
        return <Badge variant="success">نشط</Badge>;
      }
    },
    {
      key: 'date_joined',
      label: 'تاريخ الانضمام',
      render: (val) => new Date(val).toLocaleDateString('ar-DZ')
    }
  ];

  const rowActions = React.useMemo(() => [
    { label: 'عرض', onClick: (row) => setSelectedStudentForModules(row) },
    { label: 'تعديل', onClick: (row) => setSelectedStudentForUpdate(row) },
    { label: 'إعادة تعيين كلمة المرور', onClick: (row) => setSelectedStudentForPassword(row) },
    { label: (row) => row.is_active ? 'إيقاف الحساب' : 'تفعيل الحساب', danger: (row) => row.is_active, onClick: (row) => handleStatusChange(row, !row.is_active) },
    { label: 'حذف', danger: true, onClick: (row) => handleDelete(row) }
  ], []);

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-4">{error}</h2>
        <Button onClick={fetchStudents} variant="primary">إعادة المحاولة</Button>
      </div>
    );
  }

  const handleExport = async (format) => {
    try {
      const res = await api.get(`/admin/users/export/?role=STUDENT&format=${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("حدث خطأ أثناء التصدير.");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="إدارة الطلاب" 
        description="عرض وإدارة حسابات الطلاب، وتتبع نشاطهم في المنصة"
        actionLabel="إضافة طالب"
        actionIcon={UserPlus}
        onAction={() => setIsAddOpen(true)}
      />

      <AddStudentModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => { fetchStudents(); }}
      />

      <EnrollStudentModal
        isOpen={!!selectedStudentForEnrollment}
        onClose={() => setSelectedStudentForEnrollment(null)}
        student={selectedStudentForEnrollment}
        onSuccess={() => { fetchStudents(); }}
      />

      <UpdateStudentModal
        isOpen={!!selectedStudentForUpdate}
        onClose={() => setSelectedStudentForUpdate(null)}
        student={selectedStudentForUpdate}
        onSuccess={() => { fetchStudents(); setSelectedStudentForUpdate(null); }}
      />

      <ViewStudentModulesModal 
        isOpen={!!selectedStudentForModules}
        onClose={() => setSelectedStudentForModules(null)}
        student={selectedStudentForModules}
        onRemove={() => fetchStudents()}
      />

      <ResetPasswordModal 
        isOpen={!!selectedStudentForPassword}
        onClose={() => setSelectedStudentForPassword(null)}
        user={selectedStudentForPassword}
      />

      <DataTable 
        columns={columns}
        data={students}
        isLoading={loading}
        searchPlaceholder="ابحث بالاسم، البريد الإلكتروني..."
        rowActions={rowActions}
        onExport={handleExport}
        emptyStateTitle="لا يوجد طلاب"
        emptyStateDesc="لم يتم العثور على طلاب مسجلين في المنصة."
      />
    </div>
  );
};

export default Students;
