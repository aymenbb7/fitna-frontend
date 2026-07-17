import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Bell, Send, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

export const AdminNotifications = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // This would be controlled by a modal state in a real implementation
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/notifications/history/');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل سجل الإشعارات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const columns = [
    { key: 'title', label: 'عنوان الإشعار', render: (val) => <span className="font-bold text-white">{val}</span> },
    { key: 'recipient', label: 'المستلم' },
    { 
      key: 'type', 
      label: 'النوع',
      render: (val) => <Badge variant="primary">{val}</Badge>
    },
    { 
      key: 'is_read', 
      label: 'الحالة',
      render: (val) => val ? <Badge variant="success">مقروء</Badge> : <Badge variant="warning">غير مقروء</Badge>
    },
    { 
      key: 'created_at', 
      label: 'تاريخ الإرسال',
      render: (val) => new Date(val).toLocaleString('ar-DZ')
    }
  ];

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-4">{error}</h2>
        <Button onClick={fetchHistory} variant="primary">إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title="الإشعارات والتنبيهات" 
        description="إرسال وتتبع الإشعارات للطلاب والمشرفين"
        actionLabel="إرسال إشعار جديد"
        actionIcon={Send}
        onAction={() => setShowBroadcastModal(true)}
      />

      <DataTable 
        columns={columns}
        data={history}
        isLoading={loading}
        searchPlaceholder="ابحث بعنوان الإشعار أو المستلم..."
        emptyStateTitle="لا توجد إشعارات"
        emptyStateDesc="لم تقم بإرسال أي إشعارات بعد."
      />

      {/* Broadcast Modal Placeholder */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-bgDarker border border-white/10 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">إرسال إشعار جديد</h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">الجمهور المستهدف</label>
                <select className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold">
                  <option value="ALL">الجميع</option>
                  <option value="ALL_STUDENTS">جميع الطلاب</option>
                  <option value="ALL_MODULE_ADMINS">جميع المشرفين</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">عنوان الإشعار</label>
                <input type="text" className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">نص الإشعار</label>
                <textarea rows="4" className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold"></textarea>
              </div>
              
              <Button variant="primary" className="w-full" onClick={() => setShowBroadcastModal(false)}>
                إرسال الآن
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
