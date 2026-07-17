import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

export const ModuleAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all users and filter for MODULE_ADMIN
      const res = await api.get('/admin/users/');
      setAdmins(res.data.filter(u => u.role === 'MODULE_ADMIN'));
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل بيانات مشرفي الوحدات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const columns = [
    { 
      key: 'full_name', 
      label: 'الاسم',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
            {val ? val.substring(0, 2).toUpperCase() : 'MA'}
          </div>
          <div>
            <p className="font-bold text-white">{val || 'بدون اسم'}</p>
            <p className="text-xs text-gray-400">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'is_active',
      label: 'الحالة',
      render: (val) => val 
        ? <Badge variant="success">نشط</Badge> 
        : <Badge variant="error">موقوف</Badge>
    },
    {
      key: 'last_login',
      label: 'آخر تسجيل دخول',
      render: (val) => val ? new Date(val).toLocaleDateString('ar-DZ') : 'لم يسجل الدخول'
    }
  ];

  const rowActions = [
    { label: 'عرض الملف الشخصي', onClick: (row) => console.log('View', row) },
    { label: 'تعديل البيانات', onClick: (row) => console.log('Edit', row) },
    { label: 'تفعيل/إيقاف الحساب', danger: true, onClick: (row) => console.log('Suspend', row) }
  ];

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-4">{error}</h2>
        <Button onClick={fetchAdmins} variant="primary">إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title="مشرفي الوحدات" 
        description="إدارة حسابات مشرفي الوحدات الدراسية وصلاحياتهم"
        actionLabel="إضافة مشرف"
        actionIcon={ShieldCheck}
        onAction={() => console.log("Open Add Admin Modal")}
      />

      <DataTable 
        columns={columns}
        data={admins}
        isLoading={loading}
        searchPlaceholder="ابحث باسم المشرف..."
        rowActions={rowActions}
        emptyStateTitle="لا يوجد مشرفين"
        emptyStateDesc="لم يتم إضافة أي مشرف للوحدات بعد."
      />
    </div>
  );
};

export default ModuleAdmins;
