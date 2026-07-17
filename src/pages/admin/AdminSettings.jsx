import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Settings, Save, Shield, Palette, Mail, Bell, CreditCard, Database } from 'lucide-react';

export const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'عام', icon: Settings },
    { id: 'branding', label: 'الهوية البصرية', icon: Palette },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'email', label: 'البريد الإلكتروني', icon: Mail },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'payments', label: 'الدفع', icon: CreditCard },
    { id: 'storage', label: 'التخزين', icon: Database },
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="إعدادات النظام" 
        description="إدارة إعدادات المنصة العامة والتخصيص"
        actionLabel="حفظ التغييرات"
        actionIcon={Save}
        onAction={() => console.log('Save Settings')}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <Card noPadding className="sticky top-24">
            <div className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold ${
                      isActive 
                        ? 'bg-accentGold text-bgDark' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <Card>
            <h3 className="text-xl font-bold text-white mb-6">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            
            {activeTab === 'general' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">اسم المنصة</label>
                  <input type="text" defaultValue="منصة فطنة التعليمية" className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">وصف المنصة</label>
                  <textarea rows="3" defaultValue="منصة متخصصة في تقديم محتوى تعليمي تفاعلي." className="w-full bg-bgDark border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-accentGold"></textarea>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-600 bg-bgDark text-accentGold focus:ring-accentGold" />
                  <label className="text-sm font-bold text-gray-300">السماح بتسجيل الطلاب الجدد</label>
                </div>
              </div>
            )}

            {activeTab !== 'general' && (
              <div className="flex items-center justify-center h-48 text-gray-500 font-bold border-2 border-dashed border-white/10 rounded-2xl">
                هذا القسم قيد التطوير
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
