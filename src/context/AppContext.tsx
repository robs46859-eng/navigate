import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { UserProfile } from '../types';
import { seedDatabase } from '../lib/seedData';

interface AppContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  refreshProfile: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userProfile = await profileService.getProfile(firebaseUser.uid);
        setProfile(userProfile);
        // Seed database on first login if needed, only if admin
        if (firebaseUser.email === "robs46859@gmail.com") {
          await seedDatabase();
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await profileService.getProfile(user.uid);
      setProfile(userProfile);
    }
  };

  return (
    <AppContext.Provider value={{ user, profile, loading, setProfile, refreshProfile }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
