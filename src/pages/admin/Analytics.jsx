import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/admin/StatCard';
import { Card } from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import { LineChart, Users, BookOpen, Clock, Activity } from 'lucide-react';
import api from '../../api/axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';

export const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/analytics/');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader 
        title="الإحصائيات والتقارير" 
        description="تحليل استخدام المنصة وتفاعل الطلاب مع المحتوى"
        actionLabel="تحديث البيانات"
        actionIcon={Activity}
        onAction={fetchAnalytics}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading || !data ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard 
              title="معدل إكمال الوحدات" 
              value={data.metrics.completion_rate} 
              icon={BookOpen} 
              colorClass="text-blue-400"
            />
            <StatCard 
              title="متوسط وقت الجلسة" 
              value={data.metrics.avg_session} 
              icon={Clock} 
              colorClass="text-green-400"
            />
            <StatCard 
              title="الطلاب النشطين" 
              value={data.metrics.monthly_active} 
              icon={Users} 
              colorClass="text-purple-400"
            />
            <StatCard 
              title="نسبة النجاح في الاختبارات" 
              value={data.metrics.success_rate} 
              icon={LineChart} 
              colorClass="text-accentGold"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">تفاعل الطلاب الأسبوعي</h3>
          {loading || !data ? (
            <div className="h-full flex items-center justify-center"><CardSkeleton className="w-full h-full" /></div>
          ) : (
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={data.engagement_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1B2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#F5C518', fontWeight: 'bold' }}
                />
                <Bar dataKey="activeUsers" name="مستخدمين نشطين" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">نمو الجلسات التعليمية</h3>
          {loading || !data ? (
            <div className="h-full flex items-center justify-center"><CardSkeleton className="w-full h-full" /></div>
          ) : (
            <ResponsiveContainer width="100%" height="85%">
              <RechartsLineChart data={data.engagement_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1B2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="sessions" name="جلسات" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
