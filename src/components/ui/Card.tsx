import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hoverable = false, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-4 shadow-sm border border-[#5D4037]/5',
        hoverable && 'hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
