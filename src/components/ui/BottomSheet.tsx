import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { IconButton } from './IconButton';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const BottomSheet = ({ isOpen, onClose, title, children, className }: BottomSheetProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-50 max-h-[90vh] overflow-y-auto safe-area-bottom shadow-2xl',
              className
            )}
          >
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-[#5D4037]/5 z-10">
              <div className="w-12 h-1.5 bg-[#5D4037]/10 rounded-full absolute top-2 left-1/2 -translate-x-1/2" />
              <h3 className="text-xl font-semibold text-[#5D4037] mt-2">{title}</h3>
              <IconButton onClick={onClose} size="sm" className="mt-2">
                <X className="w-6 h-6" />
              </IconButton>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
