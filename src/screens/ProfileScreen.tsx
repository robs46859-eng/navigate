import React from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  MapPin, 
  Heart, 
  Star, 
  Award, 
  ChevronRight, 
  LogOut, 
  Calendar, 
  Mail, 
  ThumbsUp, 
  Baby, 
  Users, 
  Bell, 
  Shield, 
  Smartphone 
} from 'lucide-react';
import { MOCK_PLACES, MOCK_SERVICES, MOCK_REVIEWS } from '../constants/mockData';
import { Button } from '../components/ui/Button';
import { useUser } from '../context/UserContext';
import { authService } from '../services/authService';

const ProfileScreen: React.FC = () => {
  const { profile, savedPlaces } = useUser();

  if (!profile) return null;

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.hash = '';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Filter saved places from MOCK_PLACES
  const savedPlacesData = MOCK_PLACES.filter(p => savedPlaces.includes(p.id));

  return (
    <div className="pb-24 bg-stone-50 min-h-screen">
      {/* Profile Header */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm border-b border-stone-100 relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-rose-50 rounded-full blur-3xl opacity-60" />
        
        <div className="flex flex-col items-center relative z-10">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-rose-100 p-1 overflow-hidden shadow-lg">
              <img src={profile.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=random`} alt={profile.displayName} className="w-full h-full object-cover rounded-full" />
            </div>
            <button 
              className="absolute bottom-0 right-0 p-2 bg-rose-500 text-white rounded-full shadow-md border-2 border-white"
              onClick={() => alert("Settings coming soon!")}
            >
              <Settings size={16} />
            </button>
          </div>
          
          <h1 className="text-2xl font-bold text-stone-800 mb-1">{profile.displayName}</h1>
          <p className="text-stone-500 text-sm flex items-center gap-1.5 mb-6">
            <Mail size={14} />
            {profile.email}
          </p>

          <div className="flex gap-3">
            <div className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-amber-100 text-amber-600 min-w-[90px] shadow-sm">
              <Star size={16} />
              <span className="text-[9px] font-bold uppercase tracking-wider text-center">First Steps</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Baby Info Section */}
        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-stone-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
              <Baby size={20} />
            </div>
            <h2 className="text-lg font-bold text-stone-800">Stage Info</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-stone-50">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Current Stage</span>
              <span className="text-sm font-semibold text-stone-700 capitalize">{profile.stage}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Due Date</span>
              <span className="text-sm font-semibold text-stone-700">
                {profile.dueDate ? new Date(profile.dueDate).toLocaleDateString() : 'Not set'}
              </span>
            </div>
          </div>
        </section>

        {/* Saved Places */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-stone-800">Saved Places</h2>
          </div>
          <div className="space-y-3">
            {savedPlacesData.length > 0 ? (
              savedPlacesData.map((place) => (
                <motion.div
                  key={place.id}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-800 text-sm truncate">{place.name}</h3>
                    <p className="text-xs text-stone-400 truncate">{place.address}</p>
                  </div>
                  <ChevronRight size={18} className="text-stone-300" />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-stone-200">
                <p className="text-stone-400 text-sm">No saved places yet</p>
              </div>
            )}
          </div>
        </section>

        {/* Settings & Account */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Settings & Account</h3>
          <div className="bg-white rounded-[24px] shadow-sm border border-stone-100 overflow-hidden">
            <button 
              className="w-full px-5 py-4 flex items-center gap-4 hover:bg-stone-50 transition-colors border-b border-stone-50"
              onClick={() => alert("Notifications settings coming soon!")}
            >
              <Bell size={20} className="text-stone-400" />
              <span className="flex-1 text-left text-stone-700 font-semibold text-sm">Notifications</span>
              <ChevronRight size={18} className="text-stone-300" />
            </button>
            <button 
              className="w-full px-5 py-4 flex items-center gap-4 hover:bg-rose-50 transition-colors text-rose-500"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span className="flex-1 text-left font-bold text-sm">Log Out</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileScreen;
