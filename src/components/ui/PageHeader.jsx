import React from 'react';
import { Button } from './Button';

export const PageHeader = ({ title, description, actionLabel, actionIcon, onAction }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accentGold to-yellow-300">
          {title}
        </h1>
        {description && (
          <p className="text-gray-400 mt-2 font-medium">{description}</p>
        )}
      </div>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} icon={actionIcon} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
