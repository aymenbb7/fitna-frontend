import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { UserPlus, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

export const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      // The API returns all users, we filter for students
      const res = await api.get('/admin/users/');
      setStudents(res.data.filter(u => u.role === 'STUDENT'));
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل بيانات الطلاب.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStatusChange = async (student, newStatus) => {
    // In a real app, this would hit an API endpoint to update the student's status
    console.log(`Setting status of ${student.email} to ${newStatus}`);
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
      label: 'الوحدات',
      render: (val) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {val && val.length > 0 ? val.map((m, i) => (
            <Badge key={i} variant="primary">{m.name}</Badge>
          )) : <span className="text-gray-500 text-xs">لا يوجد</span>}
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

  const rowActions = [
    { label: 'عرض الملف الشخصي', onClick: (row) => console.log('View', row) },
    { label: 'تعديل البيانات', onClick: (row) => console.log('Edit', row) },
    { label: 'إعادة تعيين كلمة المرور', onClick: (row) => console.log('Reset Password', row) },
    { label: 'تفعيل/إيقاف الحساب', danger: true, onClick: (row) => handleStatusChange(row, !row.is_active) }
  ];

  const bulkActions = [
    { label: 'تفعيل المحدد', onClick: (ids) => console.log('Activate', ids) },
    { label: 'إيقاف المحدد', danger: true, onClick: (ids) => console.log('Suspend', ids) }
  ];

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-4">{error}</h2>
        <Button onClick={fetchStudents} variant="primary">إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title="إدارة الطلاب" 
        description="عرض وإدارة حسابات الطلاب، وتتبع نشاطهم في المنصة"
        actionLabel="إضافة طالب"
        actionIcon={UserPlus}
        onAction={() => console.log("Open Add Student Modal")}
      />

      <DataTable 
        columns={columns}
        data={students}
        isLoading={loading}
        searchPlaceholder="ابحث بالاسم، البريد الإلكتروني..."
        rowActions={rowActions}
        bulkActions={bulkActions}
        onExport={() => console.log("Export Students CSV")}
        emptyStateTitle="لا يوجد طلاب"
        emptyStateDesc="لم يتم العثور على طلاب مسجلين في المنصة."
      />
    </div>
  );
};

export default Students;
