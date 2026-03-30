import React, { createContext, useContext, useState, useEffect } from 'react';
import { Badge, UserProfile } from '../types';
import { NOTIFICATIONS, BADGES } from '../constants/sampleData';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';

interface SleepLog {
  id: string;
  date: string;
  duration: number; // minutes
  sounds: string[];
  quality: number; // 1-5
}

interface UserContextType {
  profile: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => void;
  earnedBadges: string[];
  unlockBadge: (badgeId: string) => void;
  notifications: typeof NOTIFICATIONS;
  markNotificationRead: (id: string) => void;
  unreadNotificationsCount: number;
  streak: number;
  lastCheckIn: string | null;
  checkIn: (mood: number, note?: string) => void;
  moodHistory: { date: string; mood: number; note?: string }[];
  savedPlaces: string[];
  toggleSavePlace: (placeId: string) => void;
  sleepLogs: SleepLog[];
  addSleepLog: (log: Omit<SleepLog, 'id'>) => void;
  journeyProgress: { week: number; mood: number | null; photo: string | null }[];
  updateJourneyWeek: (week: number, updates: { mood?: number; photo?: string }) => void;
  babyMilestones: { id: string; completed: boolean }[];
  toggleMilestone: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<string[]>(['first_steps']);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [streak, setStreak] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<{ date: string; mood: number; note?: string }[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<string[]>([]);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [journeyProgress, setJourneyProgress] = useState<{ week: number; mood: number | null; photo: string | null }[]>(
    Array.from({ length: 40 }, (_, i) => ({ week: i + 1, mood: null, photo: null }))
  );
  const [babyMilestones, setBabyMilestones] = useState<{ id: string; completed: boolean }[]>([]);

  // Sync with Firestore when user logs in
  useEffect(() => {
    const unsubscribe = authService.onAuthChange(async (user) => {
      if (user) {
        const userDoc = await profileService.getProfile(user.uid);
        if (userDoc) {
          setProfile(userDoc);
          // Load other data from Firestore if available
          // For now, we'll use the profile's savedPlaces if it exists
          if ((userDoc as any).savedPlaces) {
            setSavedPlaces((userDoc as any).savedPlaces);
          }
        } else {
          // Create initial profile if not exists
          const initialProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Mama',
            stage: 'pregnant',
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            comfortRoutingEnabled: true,
          };
          await profileService.createProfile(initialProfile);
          setProfile(initialProfile);
        }
      } else {
        setProfile(null);
        setSavedPlaces([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    await profileService.updateProfile(profile.uid, updates);
  };

  const unlockBadge = (badgeId: string) => {
    if (!earnedBadges.includes(badgeId)) {
      setEarnedBadges(prev => [...prev, badgeId]);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const checkIn = (mood: number, note?: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (lastCheckIn !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastCheckIn === yesterdayStr) {
        setStreak(prev => prev + 1);
      } else {
        setStreak(1);
      }
      
      setLastCheckIn(today);
      setMoodHistory(prev => [...prev, { date: today, mood, note }]);
      
      if (streak + 1 >= 7) unlockBadge('on_fire');
      if (streak + 1 >= 30) unlockBadge('unstoppable');
    }
  };

  const toggleSavePlace = async (placeId: string) => {
    if (!profile) return;
    const next = savedPlaces.includes(placeId) 
      ? savedPlaces.filter(id => id !== placeId) 
      : [...savedPlaces, placeId];
    
    setSavedPlaces(next);
    await profileService.updateProfile(profile.uid, { savedPlaces: next } as any);
  };

  const addSleepLog = (log: Omit<SleepLog, 'id'>) => {
    const newLog = { ...log, id: Date.now().toString() };
    setSleepLogs(prev => [...prev, newLog]);
    if (sleepLogs.length + 1 >= 7) unlockBadge('sleep_expert');
  };

  const updateJourneyWeek = (week: number, updates: { mood?: number; photo?: string }) => {
    setJourneyProgress(prev => prev.map(p => p.week === week ? { ...p, ...updates } : p));
    if (updates.photo) {
      const photoCount = journeyProgress.filter(p => p.photo).length + 1;
      if (photoCount >= 4) unlockBadge('memory_maker');
    }
  };

  const toggleMilestone = (id: string) => {
    setBabyMilestones(prev => {
      const exists = prev.find(m => m.id === id);
      const next = exists 
        ? prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m)
        : [...prev, { id, completed: true }];
      
      const completedCount = next.filter(m => m.completed).length;
      if (completedCount >= 10) unlockBadge('milestone_master');
      
      return next;
    });
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <UserContext.Provider value={{
      profile,
      updateProfile,
      earnedBadges,
      unlockBadge,
      notifications,
      markNotificationRead,
      unreadNotificationsCount,
      streak,
      lastCheckIn,
      checkIn,
      moodHistory,
      savedPlaces,
      toggleSavePlace,
      sleepLogs,
      addSleepLog,
      journeyProgress,
      updateJourneyWeek,
      babyMilestones,
      toggleMilestone
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
