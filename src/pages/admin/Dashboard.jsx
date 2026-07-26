import React, { useState, useEffect, useContext } from 'react';
import { Users, GraduationCap, UserCheck, FolderOpen, Activity, AlertCircle } from 'lucide-react';
import { StatCard } from '../../components/admin/StatCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardSkeleton, TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import api from '../../api/axios';

import { AddStudentModal } from '../../components/admin/modals/AddStudentModal';
import { AddModuleModal } from '../../components/admin/modals/AddModuleModal';
import { BroadcastModal } from '../../components/admin/modals/BroadcastModal';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [moduleStats, setModuleStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, modStatsRes] = await Promise.all([
        api.get('/admin/stats/'),
        api.get('/admin/modules/dashboard-stats/')
      ]);
      setStats(statsRes.data);
      setModuleStats(modStatsRes.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError('حدث خطأ أثناء تحميل الإحصائيات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">خطأ في التحميل</h3>
        <p className="text-gray-400 mb-6">{error}</p>
        <Button onClick={fetchData} variant="primary">إعادة المحاولة</Button>
      </div>
    );
  }

  const moduleColumns = [
    { key: 'name', label: 'اسم الوحدة' },
    { key: 'total_students', label: 'إجمالي الطلاب' },
    { key: 'active_students', label: 'نشطين' },
    { key: 'new_students_month', label: 'جدد (هذا الشهر)' },
    { 
      key: 'revenue', 
      label: 'الإيرادات',
      render: (val) => <span className="text-accentGold font-bold">{val} د.ج</span>
    },
    { key: 'admin', label: 'المشرف' },
    { 
      key: 'completion_percent', 
      label: 'معدل الإكمال',
      render: (val) => `${val}%`
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="نظرة عامة" 
        description="إحصائيات ونشاطات المنصة"
      />

      <AddStudentModal 
        isOpen={isAddStudentOpen} 
        onClose={() => setIsAddStudentOpen(false)}
        onSuccess={() => { fetchData(); }}
      />
      <AddModuleModal 
        isOpen={isAddModuleOpen} 
        onClose={() => setIsAddModuleOpen(false)}
        onSuccess={() => { fetchData(); setIsAddModuleOpen(false); }}
      />
      <BroadcastModal 
        isOpen={isBroadcastOpen} 
        onClose={() => setIsBroadcastOpen(false)}
        onSuccess={() => { setIsBroadcastOpen(false); }}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard 
              title="إجمالي الطلاب" 
              value={stats.total_students} 
              icon={GraduationCap} 
              colorClass="text-blue-400"
            />
            <StatCard 
              title="الطلاب النشطين" 
              value={stats.active_students} 
              icon={UserCheck} 
              colorClass="text-green-400"
            />
            {stats.total_module_admins !== undefined && (
              <StatCard 
                title="مشرفي الوحدات" 
                value={stats.total_module_admins} 
                icon={Users} 
                colorClass="text-purple-400"
              />
            )}
            <StatCard 
              title="الوحدات الدراسية" 
              value={stats.total_modules} 
              icon={FolderOpen} 
              colorClass="text-accentGold"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Module Statistics */}
        <div className="lg:col-span-3">
          <Card className="h-full" noPadding>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">إحصائيات الوحدات</h3>
            </div>
            <div className="p-6">
              <DataTable 
                columns={moduleColumns}
                data={moduleStats}
                isLoading={loading}
                emptyStateTitle="لا توجد وحدات"
                emptyStateDesc="قم بإضافة وحدات دراسية لرؤية الإحصائيات هنا."
              />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <h3 className="text-xl font-bold text-white mb-6">إجراءات سريعة</h3>
            <div className="space-y-4">
              <Button onClick={() => setIsAddStudentOpen(true)} variant="secondary" className="w-full justify-start text-right">إضافة طالب جديد</Button>
              {user?.role === 'SUPER_ADMIN' && (
                <Button onClick={() => setIsAddModuleOpen(true)} variant="secondary" className="w-full justify-start text-right">إنشاء وحدة دراسية</Button>
              )}
              <Button onClick={() => setIsBroadcastOpen(true)} variant="secondary" className="w-full justify-start text-right">إرسال إشعار للجميع</Button>
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
