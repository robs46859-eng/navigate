/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import { db } from './firebase';
import { AppProvider, useApp } from './context/AppContext';
import { SoundProvider } from './context/SoundContext';
import { UserProvider } from './context/UserContext';
import { LoginScreen } from './screens/LoginScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { HealthScreen } from './screens/HealthScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SleepScreen } from './screens/SleepScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import CommunityScreen from './screens/CommunityScreen';
import ProfileScreen from './screens/ProfileScreen';
import JourneyScreen from './screens/JourneyScreen';
import SavedScreen from './screens/SavedScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import AboutScreen from './screens/AboutScreen';
import { LegalScreen } from './screens/LegalScreen';
import BottomNav from './components/BottomNav';

function MapsErrorScreen({ isPlaceholder }: { isPlaceholder: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-6 text-center">
      <div className="max-w-md w-full p-8 bg-white rounded-[32px] shadow-2xl border border-[#5D4037]/5 space-y-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#5D4037]">Maps Configuration Error</h2>
          <p className="text-[#5D4037]/60">
            {isPlaceholder 
              ? "The Google Maps API key is missing or using a placeholder value." 
              : "The provided Google Maps API key is invalid or restricted."}
          </p>
        </div>
        <div className="bg-[#FDF5E6] p-4 rounded-2xl text-left space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-[#5D4037]/40">How to fix:</p>
          <ol className="text-sm text-[#5D4037]/70 list-decimal list-inside space-y-2">
            <li>Open <strong>Settings (⚙️)</strong> in the bottom left.</li>
            <li>Go to <strong>Environment Variables</strong>.</li>
            <li>Add or update <strong>VITE_GOOGLE_MAPS_API_KEY</strong>.</li>
            <li>Ensure <strong>Maps JavaScript API</strong>, <strong>Places API</strong>, and <strong>Directions API</strong> are enabled in Google Cloud Console.</li>
          </ol>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="w-full py-4 bg-[#E97451] text-white rounded-2xl font-bold shadow-lg hover:bg-[#D66340] transition-colors"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}

function MapLoader({ children, mapsKey }: { children: React.ReactNode, mapsKey: string }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: mapsKey,
    libraries: ['places', 'geometry']
  });

  if (loadError) {
    return <MapsErrorScreen isPlaceholder={false} />;
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF5E6]">
        <div className="animate-bounce">
          <div className="w-16 h-16 bg-[#E97451] rounded-2xl shadow-lg" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function AppContent() {
  const { user, profile, loading } = useApp();
  const [hash, setHash] = useState(window.location.hash);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const mapsKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY;
  const isKeyPlaceholder = !mapsKey || mapsKey === 'YOUR_GOOGLE_MAPS_API_KEY' || mapsKey.includes('TODO');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test Firestore connection
        await getDocFromServer(doc(db, '_connection_test_', 'ping'));
      } catch (error: any) {
        if (error?.message?.includes('the client is offline') || error?.code === 'unavailable') {
          setFirebaseError("Firebase is offline or configuration is incorrect. Please check your firebase-applet-config.json.");
        }
        // Other errors are expected if the doc doesn't exist, which is fine
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF5E6]">
        <div className="animate-bounce">
          <div className="w-16 h-16 bg-[#E97451] rounded-2xl shadow-lg" />
        </div>
      </div>
    );
  }

  if (isKeyPlaceholder) {
    return <MapsErrorScreen isPlaceholder={true} />;
  }

  if (firebaseError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-6 text-center">
        <div className="max-w-md w-full p-8 bg-white rounded-[32px] shadow-2xl border border-red-100 space-y-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#5D4037]">Firebase Connection Error</h2>
            <p className="text-[#5D4037]/60">{firebaseError}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-[#E97451] text-white rounded-2xl font-bold shadow-lg hover:bg-[#D66340] transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const getActiveTab = () => {
    if (hash === '' || hash === '#/') return 'home';
    if (hash === '#services') return 'services';
    if (hash === '#health') return 'health';
    if (hash === '#community') return 'community';
    if (hash === '#profile') return 'profile';
    return '';
  };

  return (
    <MapLoader mapsKey={mapsKey}>
      <div className="min-h-screen bg-stone-50">
        {(() => {
          if (!user) return <LoginScreen />;
          if (!profile) return <OnboardingScreen />;
          
          let content;
          if (hash === '#settings') content = <SettingsScreen />;
          else if (hash === '#health') content = <HealthScreen />;
          else if (hash === '#sleep') content = <SleepScreen />;
          else if (hash === '#services' || hash.startsWith('#service/')) content = <ServicesScreen />;
          else if (hash === '#community' || hash.startsWith('#community/')) content = <CommunityScreen />;
          else if (hash === '#profile') content = <ProfileScreen />;
          else if (hash === '#journey') content = <JourneyScreen />;
          else if (hash === '#saved') content = <SavedScreen />;
          else if (hash === '#notifications') content = <NotificationsScreen />;
          else if (hash === '#about') content = <AboutScreen />;
          else if (hash === '#legal' || hash === '#privacy') content = <LegalScreen />;
          else content = <HomeScreen />;

          return (
            <>
              {content}
              {user && profile && !['#settings', '#about', '#legal', '#privacy'].includes(hash) && (
                <BottomNav activeTab={getActiveTab()} />
              )}
            </>
          );
        })()}
      </div>
    </MapLoader>
  );
}

export default function App() {
  return (
    <AppProvider>
      <UserProvider>
        <SoundProvider>
          <AppContent />
        </SoundProvider>
      </UserProvider>
    </AppProvider>
  );
}

