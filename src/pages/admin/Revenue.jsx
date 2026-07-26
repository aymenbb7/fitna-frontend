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
  AlertCircle,
  BarChart,
  PieChart,
  Activity,
  RefreshCw
} from 'lucide-react';
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
      setError("تعذر تحميل بيانات الأرباح.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();

    // Auto-refresh when user returns to this tab (e.g. after approving a student)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchRevenue();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleExport = async (format) => {
    try {
      const res = await api.get(`/admin/revenue/export/?format=${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `revenue.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed", err);
      alert("تعذر تصدير البيانات.");
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center bg-bgPurple rounded-3xl border border-white/5">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-4">{error}</h2>
        <Button onClick={fetchRevenue} variant="primary">إعادة المحاولة</Button>
      </div>
    );
  }

  const columns = [
    { key: 'id', label: 'رقم المعاملة' },
    { key: 'student', label: 'الطالب' },
    { key: 'module', label: 'الوحدة' },
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
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <PageHeader 
          title="الأرباح والمبيعات" 
          description="نظرة شاملة على الأرباح والمعاملات المالية"
        />
        <div className="flex gap-2 mb-8">
          <Button 
            onClick={fetchRevenue} 
            variant="secondary" 
            className="gap-2"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            تحديث
          </Button>
          <Button onClick={() => handleExport('csv')} variant="secondary" className="gap-2">
            <Download size={18} /> CSV
          </Button>
          <Button onClick={() => handleExport('excel')} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
            <Download size={18} /> Excel
          </Button>
          <Button onClick={() => handleExport('pdf')} className="gap-2 bg-red-600 hover:bg-red-700 text-white">
            <Download size={18} /> PDF
          </Button>
        </div>
      </div>

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
            <div className="bg-gradient-to-br from-bgPurple to-bgDark p-6 rounded-3xl border border-accentGold/20 shadow-[0_0_30px_rgba(245,197,24,0.1)] relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-accentGold/10 rounded-full blur-2xl group-hover:bg-accentGold/20 transition duration-500"></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 font-bold mb-1">إجمالي الأرباح</p>
                  <h3 className="text-3xl font-black text-white">{data?.total_revenue || 0} د.ج</h3>
                </div>
                <div className="p-3 bg-accentGold/10 text-accentGold rounded-2xl">
                  <DollarSign size={24} />
                </div>
              </div>
              <div className="flex items-center text-sm text-green-400 font-bold mt-4">
                <TrendingUp size={16} className="mr-1" />
                <span>شامل جميع المبيعات</span>
              </div>
            </div>

            <StatCard 
              title="أرباح اليوم" 
              value={`${data?.revenue_today || 0} د.ج`} 
              icon={Activity} 
              colorClass="text-green-400"
            />
            <StatCard 
              title="أرباح هذا الشهر" 
              value={`${data?.revenue_this_month || 0} د.ج`} 
              icon={Calendar} 
              colorClass="text-blue-400"
            />
            <StatCard 
              title="أرباح هذه السنة" 
              value={`${data?.revenue_this_year || 0} د.ج`} 
              icon={BarChart} 
              colorClass="text-purple-400"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Module Revenue Table */}
        <div className="lg:col-span-3">
          <Card className="h-full" noPadding>
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-bgPurple rounded-t-3xl">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <PieChart className="text-accentGold" size={24} />
                مبيعات الوحدات
              </h3>
            </div>
            <div className="p-4 bg-bgDark rounded-b-3xl">
              <DataTable 
                columns={[
                  { key: 'module__name', label: 'الوحدة التدريبية' },
                  { 
                    key: 'enrollment_count', 
                    label: 'عدد المشتركين',
                    render: (val) => <span className="font-bold text-blue-400">{val} مشترك</span>
                  },
                  { 
                    key: 'total_revenue', 
                    label: 'الإيرادات',
                    render: (val) => <span className="font-black text-accentGold text-lg">{val} د.ج</span>
                  }
                ]}
                data={data?.modules_revenue || []}
                isLoading={loading}
                searchPlaceholder="بحث في الوحدات..."
                emptyStateTitle="لا توجد بيانات"
                emptyStateDesc="لم يتم تسجيل مبيعات حتى الآن"
              />
            </div>
          </Card>
        </div>

        {/* Quick KPI Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-bgPurple p-6 rounded-3xl border border-white/5 shadow-xl">
            <h4 className="text-gray-400 font-bold mb-4 flex items-center gap-2">
              <CreditCard size={18} />
              متوسط قيمة الطلب
            </h4>
            <div className="text-3xl font-black text-white">
              {Number(data?.average_order_value || 0).toFixed(0)} <span className="text-lg text-gray-500">د.ج</span>
            </div>
          </div>
          
          <div className="bg-bgPurple p-6 rounded-3xl border border-white/5 shadow-xl">
            <h4 className="text-gray-400 font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={18} />
              أرباح هذا الأسبوع
            </h4>
            <div className="text-3xl font-black text-green-400">
              {data?.revenue_this_week || 0} <span className="text-lg text-gray-500">د.ج</span>
            </div>
          </div>

          <div className="bg-bgPurple p-6 rounded-3xl border border-white/5 shadow-xl">
            <h4 className="text-gray-400 font-bold mb-4">حالة المدفوعات</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-400 font-bold">مكتملة</span>
                  <span className="text-white">{data?.successful_payments_count || 0}</span>
                </div>
                <div className="w-full bg-bgDark rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-orange-400 font-bold">قيد الانتظار</span>
                  <span className="text-white">{data?.pending_payments_count || 0}</span>
                </div>
                <div className="w-full bg-bgDark rounded-full h-2">
                  <div className="bg-orange-400 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-red-400 font-bold">مسترجعة</span>
                  <span className="text-white">{data?.refunded_payments_count || 0}</span>
                </div>
                <div className="w-full bg-bgDark rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mt-12">
        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
          <Activity className="text-accentGold" />
          أحدث المعاملات
        </h3>
        <Card noPadding className="overflow-hidden">
          <div className="p-2 bg-bgDark rounded-b-3xl">
            <DataTable 
              columns={columns}
              data={data?.latest_purchases || []}
              isLoading={loading}
              searchPlaceholder="البحث في المعاملات..."
              emptyStateTitle="لا توجد معاملات"
              emptyStateDesc="لم يتم تسجيل أي معاملات مؤخراً"
            />
          </div>
        </Card>
      </div>

    </div>
  );
};

export default Revenue;
