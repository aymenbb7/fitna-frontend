import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/admin/StatCard';
import { DataTable } from '../../components/ui/DataTable';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import api from '../../api/axios';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CreditCard,
  Download,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Button } from '../../components/ui/Button';

export const Revenue = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/revenue/stats/');
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل بيانات الإيرادات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const handleExport = async (format) => {
    try {
      // In a real application, you would trigger a download directly or fetch blob
      window.open(`http://127.0.0.1:8000/api/v1/admin/revenue/export/?format=${format}`, '_blank');
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-4">{error}</h2>
        <Button onClick={fetchRevenue} variant="primary">إعادة المحاولة</Button>
      </div>
    );
  }

  const columns = [
    { key: 'id', label: 'رقم الفاتورة' },
    { key: 'student', label: 'الطالب' },
    { key: 'module', label: 'الوحدة الدراسية' },
    { 
      key: 'amount', 
      label: 'المبلغ',
      render: (val) => <span className="font-bold text-accentGold">{val} د.ج</span>
    },
    { key: 'method', label: 'طريقة الدفع' },
    { 
      key: 'date', 
      label: 'التاريخ',
      render: (val) => new Date(val).toLocaleDateString('ar-DZ')
    },
    {
      key: 'status',
      label: 'الحالة',
      render: () => <Badge variant="success">مكتمل</Badge>
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="الإيرادات والمبيعات" 
        description="تتبع المبيعات، الفواتير، وتحليل الأرباح"
        actionLabel="تصدير كـ Excel"
        actionIcon={Download}
        onAction={() => handleExport('excel')}
      />

      {/* Main Stats */}
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
              title="إجمالي الإيرادات" 
              value={`${data.total_revenue} د.ج`} 
              icon={DollarSign} 
              colorClass="text-accentGold"
            />
            <StatCard 
              title="إيرادات اليوم" 
              value={`${data.revenue_today} د.ج`} 
              icon={TrendingUp} 
              colorClass="text-green-400"
            />
            <StatCard 
              title="هذا الشهر" 
              value={`${data.revenue_this_month} د.ج`} 
              icon={Calendar} 
              colorClass="text-blue-400"
            />
            <StatCard 
              title="متوسط قيمة الطلب" 
              value={`${data.average_order_value.toFixed(2)} د.ج`} 
              icon={CreditCard} 
              colorClass="text-purple-400"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <Card className="h-[400px]">
            <h3 className="text-lg font-bold text-white mb-6">الإيرادات (آخر 30 يوم)</h3>
            {loading ? (
              <div className="h-full flex items-center justify-center"><CardSkeleton className="w-full h-full" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={data.daily_revenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F5C518" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F5C518" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E1B2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#F5C518', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#F5C518" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Top Modules */}
        <div className="lg:col-span-1">
          <Card className="h-[400px] overflow-hidden flex flex-col" noPadding>
            <div className="p-6 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">الوحدات الأكثر مبيعاً</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <TableSkeleton rows={4} />
              ) : data.best_selling_modules.length === 0 ? (
                <p className="text-gray-400 text-center mt-10">لا توجد مبيعات بعد</p>
              ) : (
                data.best_selling_modules.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div>
                      <p className="font-bold text-white">{m.module__name}</p>
                      <p className="text-xs text-gray-400">{m.enrollment_count} عملية شراء</p>
                    </div>
                    <span className="font-bold text-accentGold">{m.total_revenue} د.ج</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Transactions Table */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6">أحدث العمليات</h3>
        <DataTable 
          columns={columns}
          data={data?.latest_purchases || []}
          isLoading={loading}
          searchPlaceholder="ابحث برقم الفاتورة، الطالب..."
          onExport={() => handleExport('csv')}
          emptyStateTitle="لا توجد عمليات"
          emptyStateDesc="لم يتم تسجيل أي عمليات شراء مؤخراً."
        />
      </div>

    </div>
  );
};

export default Revenue;
