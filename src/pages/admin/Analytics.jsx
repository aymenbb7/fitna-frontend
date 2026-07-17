import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/admin/StatCard';
import { Card } from '../../components/ui/Card';
import { LineChart, Users, BookOpen, Clock, Activity } from 'lucide-react';
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
  // Placeholder data for analytics
  const engagementData = [
    { name: 'السبت', activeUsers: 400, sessions: 240 },
    { name: 'الأحد', activeUsers: 300, sessions: 139 },
    { name: 'الإثنين', activeUsers: 200, sessions: 980 },
    { name: 'الثلاثاء', activeUsers: 278, sessions: 390 },
    { name: 'الأربعاء', activeUsers: 189, sessions: 480 },
    { name: 'الخميس', activeUsers: 239, sessions: 380 },
    { name: 'الجمعة', activeUsers: 349, sessions: 430 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="الإحصائيات والتقارير" 
        description="تحليل استخدام المنصة وتفاعل الطلاب مع المحتوى"
        actionLabel="تحديث البيانات"
        actionIcon={Activity}
        onAction={() => console.log('Refresh Analytics')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="معدل إكمال الوحدات" 
          value="68%" 
          icon={BookOpen} 
          trend={4.5}
          colorClass="text-blue-400"
        />
        <StatCard 
          title="متوسط وقت الجلسة" 
          value="24m" 
          icon={Clock} 
          trend={2.1}
          colorClass="text-green-400"
        />
        <StatCard 
          title="الطلاب النشطين شهرياً" 
          value="1,240" 
          icon={Users} 
          trend={-1.2}
          colorClass="text-purple-400"
        />
        <StatCard 
          title="نسبة النجاح في الاختبارات" 
          value="85%" 
          icon={LineChart} 
          trend={5.4}
          colorClass="text-accentGold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">تفاعل الطلاب الأسبوعي</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={engagementData}>
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
        </Card>

        <Card className="h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">نمو الجلسات التعليمية</h3>
          <ResponsiveContainer width="100%" height="85%">
            <RechartsLineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E1B2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="sessions" name="جلسات" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
