import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { BookOpen, AlertCircle, Users } from 'lucide-react';
import api from '../../api/axios';

import { AddModuleModal } from '../../components/admin/modals/AddModuleModal';
import { ViewModuleStudentsModal } from '../../components/admin/modals/ViewModuleStudentsModal';
import { UpdateModuleModal } from '../../components/admin/modals/UpdateModuleModal';
import { ViewModuleStatsModal } from '../../components/admin/modals/ViewModuleStatsModal';

import { useSearchParams, useNavigate } from 'react-router-dom';

export const Modules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedModuleForStudents, setSelectedModuleForStudents] = useState(null);
  const [selectedModuleForUpdate, setSelectedModuleForUpdate] = useState(null);
  const [selectedModuleForStats, setSelectedModuleForStats] = useState(null);

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const q = searchParams.get('search');
      const url = q ? `/admin/modules/?search=${encodeURIComponent(q)}` : '/admin/modules/';
      const res = await api.get(url);
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
  }, [searchParams]);

  const handleToggleActive = async (module) => {
    if (!window.confirm(`هل أنت متأكد من ${module.is_active ? 'تعطيل' : 'تفعيل'} هذه الوحدة؟`)) return;
    try {
      await api.post(`/admin/modules/${module.slug}/update/`, { is_active: !module.is_active });
      fetchModules();
    } catch (err) {
      alert("حدث خطأ أثناء تغيير حالة الوحدة.");
    }
  };

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
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-accentGold">{val}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedModuleForStudents(row)}
            title="عرض الطلاب"
          >
            <Users className="w-4 h-4" />
          </Button>
        </div>
      )
    },
    {
      key: 'price',
      label: 'السعر',
      render: (val) => <span className="font-bold text-white">{val || 0} د.ج</span>
    },
    {
      key: 'is_active',
      label: 'الحالة',
      render: (val) => val 
        ? <Badge variant="success">نشط</Badge> 
        : <Badge variant="error">مغلق</Badge>
    }
  ];

  const handleDelete = async (module) => {
    if (!window.confirm(`هل أنت متأكد من حذف الوحدة الدراسية "${module.name}" بشكل نهائي؟`)) return;
    try {
      await api.delete(`/admin/modules/${module.slug}/`);
      fetchModules();
    } catch (err) {
      alert("حدث خطأ أثناء حذف الوحدة.");
    }
  };

  const rowActions = [
    { label: 'إحصائيات الوحدة', onClick: (row) => setSelectedModuleForStats(row) },
    { label: 'حذف الوحدة', danger: true, onClick: (row) => handleDelete(row) },
    { label: 'إعدادات الوحدة', onClick: (row) => setSelectedModuleForUpdate(row) },
    { label: (row) => row.is_active ? 'تعطيل الوحدة' : 'تفعيل الوحدة', danger: (row) => row.is_active, onClick: (row) => handleToggleActive(row) }
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
        onAction={() => setIsAddOpen(true)}
      />

      <AddModuleModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => { fetchModules(); setIsAddOpen(false); }}
      />

      <ViewModuleStudentsModal 
        isOpen={!!selectedModuleForStudents}
        onClose={() => setSelectedModuleForStudents(null)}
        module={selectedModuleForStudents}
      />

      <UpdateModuleModal 
        isOpen={!!selectedModuleForUpdate}
        onClose={() => setSelectedModuleForUpdate(null)}
        module={selectedModuleForUpdate}
        onSuccess={() => { fetchModules(); setSelectedModuleForUpdate(null); }}
      />
      
      <ViewModuleStatsModal 
        isOpen={!!selectedModuleForStats}
        onClose={() => setSelectedModuleForStats(null)}
        module={selectedModuleForStats}
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
