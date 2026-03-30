import React from 'react';
import { motion } from 'motion/react';
import { Map, Heart, Activity, Users, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab }) => {
  const tabs = [
    { id: 'home', icon: Map, label: 'Home', path: '#/' },
    { id: 'services', icon: Heart, label: 'Services', path: '#services' },
    { id: 'health', icon: Activity, label: 'Health', path: '#health' },
    { id: 'community', icon: Users, label: 'Community', path: '#community' },
    { id: 'profile', icon: User, label: 'Profile', path: '#profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-2 py-1 z-50 safe-area-bottom">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id || (activeTab === '' && tab.id === 'home');
          const Icon = tab.icon;
          
          return (
            <a
              key={tab.id}
              href={tab.path}
              className="flex flex-col items-center py-1 px-3 min-w-[64px] relative"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? '#f43f5e' : '#78716c'
                }}
                className="mb-0.5"
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-rose-500' : 'text-stone-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 w-8 h-1 bg-rose-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
