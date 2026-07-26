import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { BroadcastModal } from '../../components/admin/modals/BroadcastModal';
import { Bell, Send, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

export const AdminNotifications = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  const handleDeleteNotification = async (notification) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الإشعار؟")) return;
    try {
      await api.delete(`/admin/notifications/${notification.id}/delete/`);
      fetchHistory();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حذف الإشعار.");
    }
  };

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

  const rowActions = [
    {
      label: 'عرض الرسالة',
      onClick: (row) => {
        setSelectedNotification(row);
        setIsDetailOpen(true);
      }
    },
    {
      label: 'حذف الإشعار',
      danger: true,
      onClick: (row) => handleDeleteNotification(row)
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
        rowActions={rowActions}
        searchPlaceholder="ابحث بعنوان الإشعار أو المستلم..."
        emptyStateTitle="لا توجد إشعارات"
        emptyStateDesc="لم تقم بإرسال أي إشعارات بعد."
      />

      <BroadcastModal 
        isOpen={showBroadcastModal} 
        onClose={() => setShowBroadcastModal(false)} 
        onSuccess={() => {
          setShowBroadcastModal(false);
          fetchHistory();
        }}
      />

      <ViewNotificationModal 
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedNotification(null);
        }}
        notification={selectedNotification}
      />
    </div>
  );
};

const ViewNotificationModal = ({ isOpen, onClose, notification }) => {
  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-bgDarker border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0 border-b border-white/5 pb-4">
          <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300">تفاصيل الإشعار</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition">✕</button>
        </div>
        
        <div className="space-y-4 text-white text-right" dir="rtl">
          <div>
            <span className="text-xs text-gray-400 block mb-1">العنوان</span>
            <div className="text-lg font-bold bg-bgDark/50 p-3 rounded-xl border border-white/5">{notification.title}</div>
          </div>

          <div>
            <span className="text-xs text-gray-400 block mb-1">الرسالة</span>
            <div className="bg-bgDark/50 p-4 rounded-xl border border-white/5 min-h-[120px] whitespace-pre-wrap leading-relaxed text-gray-200">{notification.message}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-400 block mb-1">المرسل</span>
              <div className="bg-bgDark/50 p-3 rounded-xl border border-white/5 text-sm font-semibold">{notification.sender_name || 'النظام'}</div>
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-1">المستلم</span>
              <div className="bg-bgDark/50 p-3 rounded-xl border border-white/5 text-sm font-semibold truncate" title={notification.recipient}>{notification.recipient}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-400 block mb-1">النوع</span>
              <div className="mt-1">
                <Badge variant="primary">{notification.type}</Badge>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-1">تاريخ الإرسال</span>
              <div className="bg-bgDark/50 p-3 rounded-xl border border-white/5 text-sm font-semibold">
                {new Date(notification.created_at).toLocaleString('ar-DZ')}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8 shrink-0">
          <Button type="button" variant="secondary" className="w-full justify-center" onClick={onClose}>
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
