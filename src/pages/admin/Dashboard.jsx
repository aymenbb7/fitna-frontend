import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, UserCheck, FolderOpen, Activity, AlertCircle } from 'lucide-react';
import { StatCard } from '../../components/admin/StatCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import api from '../../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/stats/');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError('حدث خطأ أثناء تحميل الإحصائيات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">خطأ في التحميل</h3>
        <p className="text-gray-400 mb-6">{error}</p>
        <Button onClick={fetchStats} variant="primary">إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title="نظرة عامة" 
        description="إحصائيات ونشاطات المنصة"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="h-full" noPadding>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">النشاط الأخير</h3>
              <Button variant="ghost" size="sm">عرض الكل</Button>
            </div>
            <div className="p-6">
              <EmptyState 
                icon={Activity} 
                title="لا يوجد نشاط حديث" 
                description="لم يتم تسجيل أي أنشطة على المنصة مؤخراً." 
              />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <h3 className="text-xl font-bold text-white mb-6">إجراءات سريعة</h3>
            <div className="space-y-4">
              <Button variant="secondary" className="w-full justify-start text-right">إضافة طالب جديد</Button>
              <Button variant="secondary" className="w-full justify-start text-right">إنشاء وحدة دراسية</Button>
              <Button variant="secondary" className="w-full justify-start text-right">إرسال إشعار للجميع</Button>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Chart Placeholder */}
      <div>
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">تحليل التسجيلات (Placeholder)</h3>
          </div>
          <div className="h-64 w-full bg-bgDarker rounded-xl border border-dashed border-white/10 flex items-center justify-center">
            <p className="text-gray-500 font-bold">Chart Integration Pending...</p>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;
