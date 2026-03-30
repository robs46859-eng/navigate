import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RatingSelectorProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export const RatingSelector = ({ value, onChange, label }: RatingSelectorProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-[#5D4037]">{label}</span>}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform active:scale-90"
          >
            <Star
              className={cn(
                'w-8 h-8 transition-colors',
                star <= value ? 'fill-[#FFD700] text-[#FFD700]' : 'text-[#5D4037]/20'
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
