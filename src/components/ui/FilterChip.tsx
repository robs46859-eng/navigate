import React from 'react';
import { cn } from '../../lib/utils';

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, active, onClick, icon, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border',
        active
          ? 'bg-[#E97451] text-white border-[#E97451] shadow-sm'
          : 'bg-white text-[#5D4037] border-[#5D4037]/10 hover:border-[#E97451]/30',
        className
      )}
    >
      {icon}
      {label}
    </button>
  );
};
