import React from 'react';
import { Users, BookOpen, Layers, LineChart, Bell, Settings } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';

const PlaceholderPage = ({ title, description, icon }) => (
  <div className="space-y-8">
    <PageHeader title={title} description={description} />
    <EmptyState 
      icon={icon} 
      title={`${title} - قريباً`} 
      description="هذه الصفحة قيد التطوير حالياً." 
    />
  </div>
);

export const Students = () => <PlaceholderPage title="إدارة الطلاب" description="عرض وإدارة طلاب المنصة" icon={Users} />;
export const Modules = () => <PlaceholderPage title="الوحدات الدراسية" description="إدارة الوحدات والمحتوى" icon={BookOpen} />;
export const Categories = () => <PlaceholderPage title="التصنيفات" description="إدارة تصنيفات الوحدات" icon={Layers} />;
export const Analytics = () => <PlaceholderPage title="الإحصائيات والتقارير" description="تحليل أداء المنصة" icon={LineChart} />;
export const Notifications = () => <PlaceholderPage title="الإشعارات" description="إدارة التنبيهات والرسائل" icon={Bell} />;
export const AdminSettings = () => <PlaceholderPage title="الإعدادات" description="إعدادات النظام العامة" icon={Settings} />;
