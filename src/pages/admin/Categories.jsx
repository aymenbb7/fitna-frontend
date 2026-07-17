import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Layers } from 'lucide-react';

export const Categories = () => {
  // In a real implementation, this would fetch from an API
  const categoriesData = [
    { id: 1, name: 'تطوير الويب', slug: 'web-development', moduleCount: 5, status: true },
    { id: 2, name: 'التصميم', slug: 'design', moduleCount: 3, status: true },
    { id: 3, name: 'التسويق', slug: 'marketing', moduleCount: 0, status: false }
  ];

  const columns = [
    { key: 'name', label: 'اسم التصنيف' },
    { key: 'slug', label: 'الرابط (Slug)' },
    { 
      key: 'moduleCount', 
      label: 'عدد الوحدات',
      render: (val) => <span className="font-bold text-accentGold">{val}</span>
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (val) => val ? <Badge variant="success">نشط</Badge> : <Badge variant="error">غير نشط</Badge>
    }
  ];

  const rowActions = [
    { label: 'تعديل التصنيف', onClick: (row) => console.log('Edit', row) },
    { label: 'حذف التصنيف', danger: true, onClick: (row) => console.log('Delete', row) }
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="التصنيفات" 
        description="إدارة تصنيفات الوحدات الدراسية لتنظيم المحتوى"
        actionLabel="إضافة تصنيف"
        actionIcon={Layers}
        onAction={() => console.log("Open Create Category Modal")}
      />

      <DataTable 
        columns={columns}
        data={categoriesData}
        searchPlaceholder="ابحث باسم التصنيف..."
        rowActions={rowActions}
        emptyStateTitle="لا توجد تصنيفات"
        emptyStateDesc="لم يتم إنشاء أي تصنيفات بعد."
      />
    </div>
  );
};

export default Categories;
