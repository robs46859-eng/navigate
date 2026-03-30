import React from 'react';
import { cn } from '../../lib/utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-[#E97451] text-white hover:bg-[#D66340] shadow-md',
      secondary: 'bg-[#FDF5E6] text-[#5D4037] hover:bg-[#F5EBD7]',
      ghost: 'text-[#5D4037] hover:bg-[#5D4037]/10',
    };

    const sizes = {
      sm: 'p-1.5',
      md: 'p-3',
      lg: 'p-4',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-all active:scale-90 disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
