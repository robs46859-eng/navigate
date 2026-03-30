import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, Star, Award, MessageSquare, MapPin, Trash2, Check } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function NotificationsScreen() {
  const { notifications, markNotificationRead } = useUser();

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'milestone': return <Bell className="w-5 h-5 text-[#E97451]" />;
      case 'review': return <Star className="w-5 h-5 text-yellow-500" />;
      case 'badge': return <Award className="w-5 h-5 text-purple-500" />;
      case 'community': return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'place': return <MapPin className="w-5 h-5 text-teal-500" />;
      default: return <Bell className="w-5 h-5 text-[#5D4037]/40" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 sticky top-0 z-10 border-b border-[#5D4037]/5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#5D4037]">Notifications</h1>
          <button 
            className="text-sm font-bold text-[#E97451] hover:text-[#D66340]"
            onClick={() => alert("Mark all as read functionality coming soon!")}
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              layout
              key={notif.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 rounded-[24px] border transition-all cursor-pointer ${
                notif.read 
                  ? 'bg-white border-[#5D4037]/5 opacity-60' 
                  : 'bg-white border-[#E97451]/20 shadow-sm'
              }`}
            >
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  notif.read ? 'bg-stone-100' : 'bg-[#E97451]/5'
                }`}>
                  {getIcon(notif.type)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold ${notif.read ? 'text-[#5D4037]/60' : 'text-[#5D4037]'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[10px] text-[#5D4037]/40 font-medium">
                      {formatTime(notif.timestamp)}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${notif.read ? 'text-[#5D4037]/40' : 'text-[#5D4037]/70'}`}>
                    {notif.body}
                  </p>
                </div>

                {!notif.read && (
                  <div className="w-2 h-2 bg-[#E97451] rounded-full mt-2" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Bell className="w-10 h-10 text-[#5D4037]/10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#5D4037]">All caught up!</h3>
              <p className="text-sm text-[#5D4037]/40">
                Check back later for updates and reminders.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
