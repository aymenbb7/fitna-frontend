import React from 'react';
import { FolderX } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({ 
  icon: Icon = FolderX, 
  title = 'لا توجد بيانات', 
  description = 'لم يتم العثور على أي بيانات لعرضها في الوقت الحالي.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-bgPurple/50 border border-white/5 rounded-2xl border-dashed">
      <div className="w-16 h-16 bg-bgDark rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-sm mx-auto mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
