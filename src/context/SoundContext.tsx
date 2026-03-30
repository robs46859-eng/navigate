import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface Sound {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: 'White Noise' | 'Nature' | 'Ambient' | 'Lullaby' | 'Custom';
  color: string;
}

export const SOUNDS: Sound[] = [
  // White Noise
  { id: 'white-noise-1', name: 'Classic White Noise', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', icon: 'Volume2', category: 'White Noise', color: '#94a3b8' },
  { id: 'white-noise-2', name: 'Pink Noise', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', icon: 'Volume2', category: 'White Noise', color: '#f472b6' },
  { id: 'white-noise-3', name: 'Brown Noise', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', icon: 'Volume2', category: 'White Noise', color: '#92400e' },
  { id: 'white-noise-4', name: 'TV Static', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', icon: 'Tv', category: 'White Noise', color: '#475569' },
  { id: 'white-noise-5', name: 'Vacuum Cleaner', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', icon: 'Wind', category: 'White Noise', color: '#dc2626' },
  
  // Nature
  { id: 'nature-1', name: 'Gentle Rain', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', icon: 'CloudRain', category: 'Nature', color: '#60a5fa' },
  { id: 'nature-2', name: 'Thunderstorm', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', icon: 'CloudLightning', category: 'Nature', color: '#1e3a8a' },
  { id: 'nature-3', name: 'Ocean Waves', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', icon: 'Waves', category: 'Nature', color: '#0891b2' },
  { id: 'nature-4', name: 'Forest Birds', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', icon: 'Bird', category: 'Nature', color: '#10b981' },
  { id: 'nature-5', name: 'Flowing Stream', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', icon: 'Droplets', category: 'Nature', color: '#3b82f6' },
  
  // Ambient
  { id: 'ambient-1', name: 'Heartbeat', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', icon: 'Heart', category: 'Ambient', color: '#ef4444' },
  { id: 'ambient-2', name: 'Womb Sounds', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', icon: 'Activity', category: 'Ambient', color: '#f87171' },
  { id: 'ambient-3', name: 'Shushing', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', icon: 'MicOff', category: 'Ambient', color: '#fbbf24' },
  { id: 'ambient-4', name: 'Ceiling Fan', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', icon: 'Wind', category: 'Ambient', color: '#94a3b8' },
  { id: 'ambient-5', name: 'Dryer Hum', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', icon: 'Sun', category: 'Ambient', color: '#f59e0b' },
  
  // Lullaby
  { id: 'lullaby-1', name: 'Twinkle Twinkle', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', icon: 'Star', category: 'Lullaby', color: '#fde047' },
  { id: 'lullaby-2', name: 'Brahms\' Lullaby', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', icon: 'Music', category: 'Lullaby', color: '#a78bfa' },
  { id: 'lullaby-3', name: 'Rock-a-Bye Baby', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', icon: 'Moon', category: 'Lullaby', color: '#818cf8' },
  { id: 'lullaby-4', name: 'Hush Little Baby', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', icon: 'Baby', category: 'Lullaby', color: '#f472b6' },
  { id: 'lullaby-5', name: 'Zen Garden', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', icon: 'Leaf', category: 'Lullaby', color: '#4ade80' },
];

interface SoundContextType {
  activeSound: Sound | null;
  isPlaying: boolean;
  volume: number;
  timeLeft: number | null;
  isFadeOut: boolean;
  playSound: (sound: Sound) => void;
  pauseSound: () => void;
  setVolume: (volume: number) => void;
  setTimer: (minutes: number) => void;
  setIsFadeOut: (enabled: boolean) => void;
  customSounds: Sound[];
  addCustomSound: (name: string, url: string) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSound, setActiveSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isFadeOut, setIsFadeOut] = useState(true);
  const [customSounds, setCustomSounds] = useState<Sound[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && activeSound) {
      audioRef.current.src = activeSound.url;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [activeSound]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      if (isFadeOut && timeLeft !== null && timeLeft <= 30 && timeLeft > 0) {
        // Fade out over the last 30 seconds
        const fadeFactor = timeLeft / 30;
        audioRef.current.volume = volume * fadeFactor;
      } else {
        audioRef.current.volume = volume;
      }
    }
  }, [volume, timeLeft, isFadeOut]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev !== null && prev > 0) return prev - 1;
          setIsPlaying(false);
          return null;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, isPlaying]);

  const playSound = (sound: Sound) => {
    if (activeSound?.id === sound.id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveSound(sound);
      setIsPlaying(true);
    }
  };

  const pauseSound = () => setIsPlaying(false);
  const setVolume = (v: number) => setVolumeState(v);
  const setTimer = (mins: number) => {
    if (mins === 0) setTimeLeft(null);
    else setTimeLeft(mins * 60);
  };

  const addCustomSound = (name: string, url: string) => {
    const newSound: Sound = {
      id: `custom-${Date.now()}`,
      name,
      url,
      icon: 'Music',
      category: 'Custom',
      color: '#ec4899' // Default pink for custom sounds
    };
    setCustomSounds(prev => [...prev, newSound]);
    setActiveSound(newSound);
    setIsPlaying(true);
  };

  return (
    <SoundContext.Provider value={{ 
      activeSound, 
      isPlaying, 
      volume, 
      timeLeft, 
      isFadeOut,
      playSound, 
      pauseSound, 
      setVolume, 
      setTimer,
      setIsFadeOut,
      customSounds,
      addCustomSound
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within a SoundProvider');
  return context;
};
