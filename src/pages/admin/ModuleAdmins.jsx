import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, AlertCircle, UserPlus } from 'lucide-react';
import api from '../../api/axios';

import { AddModuleAdminModal } from '../../components/admin/modals/AddModuleAdminModal';
import { UpdateModuleAdminModal } from '../../components/admin/modals/UpdateModuleAdminModal';
import { ResetPasswordModal } from '../../components/admin/modals/ResetPasswordModal';

import { useSearchParams } from 'react-router-dom';

export const ModuleAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedAdminForUpdate, setSelectedAdminForUpdate] = useState(null);
  const [selectedAdminForPassword, setSelectedAdminForPassword] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const q = searchParams.get('search');
      const url = q ? `/admin/users/?search=${encodeURIComponent(q)}` : '/admin/users/';
      const res = await api.get(url);
      setAdmins(res.data.filter(u => u.role === 'MODULE_ADMIN'));
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل البيانات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [searchParams]);

  const handleStatusChange = async (user, isActive) => {
    if (!window.confirm(`هل أنت متأكد من ${isActive ? 'تفعيل' : 'إيقاف'} حساب ${user.full_name}؟`)) return;
    try {
      await api.post(`/admin/users/${user.id}/update/`, { is_active: isActive });
      fetchAdmins();
    } catch (err) {
      alert("حدث خطأ أثناء تغيير حالة الحساب.");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`هل أنت متأكد من حذف حساب المشرف "${user.full_name}" نهائياً؟`)) return;
    try {
      await api.delete(`/admin/users/${user.id}/`);
      fetchAdmins();
    } catch (err) {
      alert("حدث خطأ أثناء الحذف.");
    }
  };

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
    { label: 'تعديل البيانات', onClick: (row) => setSelectedAdminForUpdate(row) },
    { label: 'إعادة تعيين كلمة المرور', onClick: (row) => setSelectedAdminForPassword(row) },
    { label: (row) => row.is_active ? 'إيقاف الحساب' : 'تفعيل الحساب', danger: (row) => row.is_active, onClick: (row) => handleStatusChange(row, !row.is_active) },
    { label: 'حذف المشرف', danger: true, onClick: (row) => handleDelete(row) }
  ];

  const handleExport = async (format) => {
    if (!format) format = 'csv';
    try {
      const res = await api.get(`/admin/users/export/?role=MODULE_ADMIN&format=${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `module_admins.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("حدث خطأ أثناء التصدير.");
    }
  };

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
        onAction={() => setIsAddOpen(true)}
      />

      <AddModuleAdminModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => { fetchAdmins(); setIsAddOpen(false); }}
      />

      <UpdateModuleAdminModal 
        isOpen={!!selectedAdminForUpdate}
        onClose={() => setSelectedAdminForUpdate(null)}
        admin={selectedAdminForUpdate}
        onSuccess={() => { fetchAdmins(); setSelectedAdminForUpdate(null); }}
      />
      
      <ResetPasswordModal 
        isOpen={!!selectedAdminForPassword}
        onClose={() => setSelectedAdminForPassword(null)}
        user={selectedAdminForPassword}
      />

      <DataTable 
        columns={columns}
        data={admins}
        isLoading={loading}
        searchPlaceholder="ابحث باسم المشرف..."
        rowActions={rowActions}
        onExport={() => handleExport('csv')}
        emptyStateTitle="لا يوجد مشرفين"
        emptyStateDesc="لم يتم إضافة أي مشرف للوحدات بعد."
      />
    </div>
  );
};

export default ModuleAdmins;
