import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Home, 
  Heart, 
  Moon, 
  Settings, 
  LogOut, 
  Baby,
  Info,
  Shield,
  HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { hapticFeedback } from '../lib/haptics';
import { authService } from '../services/authService';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentHash: string;
}

export const Sidebar = ({ isOpen, onClose, currentHash }: SidebarProps) => {
  const navigate = (hash: string) => {
    hapticFeedback.light();
    window.location.hash = hash;
    onClose();
  };

  const handleLogout = async () => {
    hapticFeedback.medium();
    await authService.logout();
    window.location.hash = '';
    onClose();
  };

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Home', hash: '' },
    { icon: <Heart className="w-5 h-5" />, label: 'Services', hash: '#services' },
    { icon: <Moon className="w-5 h-5" />, label: 'Sleep Support', hash: '#sleep' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', hash: '#settings' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Sidebar Content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#FAF9F6] z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#5D4037]/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E97451] rounded-xl flex items-center justify-center shadow-lg">
                  <Baby className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-[#5D4037]">MamaNav</h1>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-[#5D4037]/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-[#5D4037]/40" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.hash)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all",
                    (currentHash === item.hash || (currentHash === '#' && item.hash === ''))
                      ? "bg-[#E97451] text-white shadow-lg shadow-[#E97451]/20"
                      : "text-[#5D4037]/60 hover:bg-[#5D4037]/5"
                  )}
                >
                  {item.icon}
                  <span className="font-bold text-sm uppercase tracking-widest">{item.label}</span>
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-[#5D4037]/5 space-y-2">
                <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-[#5D4037]/30 mb-2">Resources</p>
                <button 
                  onClick={() => navigate('#about')}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[#5D4037]/60 hover:bg-[#5D4037]/5 transition-all"
                >
                  <Info className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-widest">About Us</span>
                </button>
                <button 
                  onClick={() => navigate('#privacy')}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[#5D4037]/60 hover:bg-[#5D4037]/5 transition-all"
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-widest">Legal</span>
                </button>
                <button 
                  onClick={() => alert("Support page coming soon!")}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[#5D4037]/60 hover:bg-[#5D4037]/5 transition-all"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-widest">Support</span>
                </button>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-[#5D4037]/5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm uppercase tracking-widest"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
