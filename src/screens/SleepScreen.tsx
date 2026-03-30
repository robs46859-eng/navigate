import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Moon, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ChevronLeft,
  Wind,
  CloudRain,
  Waves,
  Music,
  Heart,
  Menu,
  Plus,
  Bird,
  Leaf,
  Sparkles,
  Zap,
  Coffee,
  Sun,
  Thermometer,
  ShieldCheck,
  ChevronDown,
  Users,
  ChevronRight,
  History
} from 'lucide-react';
import { hapticFeedback } from '../lib/haptics';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { useSound, SOUNDS } from '../context/SoundContext';

const SLEEP_TIPS = [
  {
    title: "The 5 S's",
    content: "Swaddle, Side/Stomach position, Shush, Swing, and Suck. These mimic the womb environment.",
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
  },
  {
    title: "Ideal Temperature",
    content: "Keep the nursery between 68-72°F (20-22°C) for optimal sleep safety and comfort.",
    icon: <Thermometer className="w-5 h-5 text-blue-400" />
  },
  {
    title: "Consistent Routine",
    content: "A predictable 15-20 minute routine (bath, book, bed) signals to the baby that it's time to sleep.",
    icon: <Sun className="w-5 h-5 text-amber-400" />
  },
  {
    title: "Watch Wake Windows",
    content: "Newborns can usually only stay awake for 60-90 minutes before getting overtired.",
    icon: <Zap className="w-5 h-5 text-purple-400" />
  }
];

const TIMERS = [15, 30, 45, 60, 0];

export const SleepScreen = () => {
  const { 
    activeSound, 
    isPlaying, 
    volume, 
    timeLeft, 
    playSound, 
    setVolume, 
    setTimer,
    customSounds,
    addCustomSound
  } = useSound();
  const [selectedTimer, setSelectedTimer] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'tracker' | 'tips'>('library');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSoundSelect = (soundId: string) => {
    hapticFeedback.light();
    const sound = [...SOUNDS, ...customSounds].find(s => s.id === soundId);
    if (sound) playSound(sound);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      hapticFeedback.medium();
      const url = URL.createObjectURL(file);
      const name = file.name.split('.')[0];
      addCustomSound(name, url);
    }
  };

  const handleTimerSelect = (minutes: number) => {
    hapticFeedback.medium();
    setSelectedTimer(minutes);
    setTimer(minutes);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSoundConfig = [...SOUNDS, ...customSounds].find(s => s.id === activeSound?.id);

  return (
    <div className="min-h-screen bg-[#0a0502] text-white overflow-y-auto no-scrollbar relative pb-24">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="audio/*" 
        className="hidden" 
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentHash={window.location.hash}
      />

      {/* Atmospheric Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className={cn(
            "absolute inset-0 transition-all duration-1000 opacity-30 blur-[120px]",
            currentSoundConfig ? `bg-${currentSoundConfig.color.split('-')[1]}-500` : "bg-indigo-900"
          )}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 flex flex-col max-w-md mx-auto px-6 pt-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <IconButton 
              onClick={() => {
                hapticFeedback.light();
                window.location.hash = '';
              }}
              className="bg-white/5 hover:bg-white/10 border-white/10"
            >
              <ChevronLeft className="w-6 h-6" />
            </IconButton>
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight">Sleep Support</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Rest Better, Mama</p>
            </div>
            <IconButton 
              onClick={() => setIsSidebarOpen(true)}
              className="bg-white/5 hover:bg-white/10 border-white/10"
            >
              <Menu className="w-6 h-6" />
            </IconButton>
          </div>

          <div className="flex gap-6 border-b border-white/5">
            {(['library', 'tracker', 'tips'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  hapticFeedback.light();
                  setActiveTab(tab);
                }}
                className={cn(
                  "pb-3 text-[10px] font-bold uppercase tracking-widest transition-all relative",
                  activeTab === tab ? "text-rose-400" : "text-white/40"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-400" 
                  />
                )}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'library' && (
              <motion.div
                key="library"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Consultant CTA */}
                <button 
                  onClick={() => {
                    hapticFeedback.light();
                    window.location.hash = '#services';
                  }}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">Need expert help?</p>
                      <p className="text-[10px] text-white/40 uppercase font-bold">Find certified sleep consultants</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-white/20 group-hover:text-white transition-colors" />
                </button>

                {/* Active Sound Visualizer */}
                <div className="flex flex-col items-center justify-center space-y-8 mb-12 py-8">
          <AnimatePresence mode="wait">
            {activeSound ? (
              <motion.div 
                key={activeSound.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative"
              >
                <div className={cn(
                  "w-56 h-56 rounded-[40px] flex items-center justify-center bg-gradient-to-br shadow-2xl relative z-10 overflow-hidden group",
                  currentSoundConfig?.color || "from-blue-400 to-blue-600"
                )}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="relative z-20 flex flex-col items-center gap-4">
                    <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
                      {currentSoundConfig?.icon || <Music className="w-8 h-8" />}
                    </div>
                    {isPlaying && (
                      <div className="flex gap-1 h-4 items-end">
                        {[1, 2, 3, 4, 5].map(i => (
                          <motion.div
                            key={i}
                            animate={{ height: [4, 16, 8, 12, 4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                            className="w-1 bg-white rounded-full"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Visualizer Rings */}
                {isPlaying && (
                  <>
                    <motion.div 
                      animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={cn("absolute inset-0 rounded-[40px] border-2 border-white/30")}
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.8], opacity: [0.2, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                      className={cn("absolute inset-0 rounded-[40px] border border-white/20")}
                    />
                  </>
                )}
              </motion.div>
            ) : (
              <div className="w-56 h-56 rounded-[40px] border-2 border-dashed border-white/10 flex items-center justify-center bg-white/5">
                <div className="text-center space-y-2">
                  <Moon className="w-8 h-8 text-white/20 mx-auto" />
                  <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Select a sound</p>
                </div>
              </div>
            )}
          </AnimatePresence>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {activeSound?.name || 'Ready to Sleep'}
            </h2>
            {timeLeft !== null && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-white/60 font-mono text-lg tracking-widest">
                  {formatTime(timeLeft)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-10">
          {/* Sound Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sound Library</h3>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1 hover:text-rose-300 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Custom
              </button>
            </div>
            
            {/* Categories */}
            <div className="space-y-6">
              {['White Noise', 'Nature', 'Ambient', 'Lullaby'].map(category => (
                <div key={category} className="space-y-3">
                  <h4 className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">{category}</h4>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {[...SOUNDS, ...customSounds].filter(s => s.category === category || (!s.category && category === 'Ambient')).map((sound) => (
                      <button
                        key={sound.id}
                        onClick={() => handleSoundSelect(sound.id)}
                        className="flex flex-col items-center gap-2 shrink-0 group"
                      >
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border",
                          activeSound?.id === sound.id 
                            ? `bg-gradient-to-br ${sound.color} border-transparent shadow-lg scale-105` 
                            : "bg-white/5 border-white/10 group-hover:bg-white/10"
                        )}>
                          {React.cloneElement(sound.icon as React.ReactElement, { 
                            className: cn("w-6 h-6", activeSound?.id === sound.id ? "text-white" : "text-white/40 group-hover:text-white/60") 
                          })}
                        </div>
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-wider transition-colors",
                          activeSound?.id === sound.id ? "text-white" : "text-white/30"
                        )}>
                          {sound.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Volume & Timer */}
          <div className="grid grid-cols-1 gap-6 bg-white/5 rounded-[32px] p-6 border border-white/10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Volume</span>
                <span className="text-[10px] font-bold text-white/60">{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-4">
                <VolumeX className="w-4 h-4 text-white/20" />
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <Volume2 className="w-4 h-4 text-white/20" />
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sleep Timer</span>
              <div className="flex items-center justify-between bg-black/20 rounded-2xl p-1">
                {TIMERS.map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleTimerSelect(mins)}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-[10px] font-bold transition-all",
                      selectedTimer === mins ? "bg-white text-black shadow-sm" : "text-white/40 hover:text-white"
                    )}
                  >
                    {mins === 0 ? '∞' : `${mins}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sleep Tips Section */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sleep Tips for Mama</h3>
            <div className="space-y-3">
              {SLEEP_TIPS.map((tip, idx) => (
                <div 
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                >
                  <button 
                    onClick={() => setExpandedTip(expandedTip === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-xl">
                        {tip.icon}
                      </div>
                      <span className="text-sm font-bold text-stone-200">{tip.title}</span>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-stone-500 transition-transform", expandedTip === idx && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {expandedTip === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4"
                      >
                        <p className="text-xs text-stone-400 leading-relaxed pl-11">
                          {tip.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

          {/* Play/Pause Button */}
          <div className="fixed bottom-24 left-0 right-0 px-6 z-50 pointer-events-none">
            <div className="max-w-md mx-auto pointer-events-auto">
              <Button 
                size="lg" 
                className={cn(
                  "w-full h-16 rounded-3xl text-lg font-bold transition-all duration-500 shadow-2xl",
                  isPlaying ? "bg-white text-black" : "bg-rose-500 text-white hover:bg-rose-600"
                )}
                onClick={() => {
                  hapticFeedback.medium();
                  if (activeSound) playSound(activeSound);
                  else handleSoundSelect(SOUNDS[0].id);
                }}
              >
                {isPlaying ? (
                  <><Pause className="w-6 h-6 mr-2 fill-current" /> Pause</>
                ) : (
                  <><Play className="w-6 h-6 mr-2 fill-current" /> Start Soothing</>
                )}
              </Button>
            </div>
          </div>
              </motion.div>
            )}

            {activeTab === 'tracker' && (
              <motion.div
                key="tracker"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <Card className="bg-white/5 border-white/10 p-6">
                  <h3 className="text-lg font-bold mb-4">Sleep Logger</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-sm font-bold">Last Sleep Session</p>
                        <p className="text-xs text-white/40">2h 15m • 2:00 PM - 4:15 PM</p>
                      </div>
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                        <History size={20} />
                      </div>
                    </div>
                    <Button 
                      onClick={() => alert("Log Sleep Session functionality coming soon!")}
                      className="w-full h-12 bg-rose-500 hover:bg-rose-600 gap-2"
                    >
                      <Plus size={20} /> Log Sleep Session
                    </Button>
                  </div>
                </Card>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Recent Logs</h4>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold">March {15-i}, 2026</p>
                        <p className="text-xs text-white/40">Total: {8-i}h 30m</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'tips' && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {SLEEP_TIPS.map((tip, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                  >
                    <button 
                      onClick={() => setExpandedTip(expandedTip === index ? null : index)}
                      className="w-full p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                          {tip.icon}
                        </div>
                        <span className="font-bold text-sm">{tip.title}</span>
                      </div>
                      <ChevronDown 
                        className={cn(
                          "w-5 h-5 text-white/20 transition-transform",
                          expandedTip === index && "rotate-180"
                        )} 
                      />
                    </button>
                    <AnimatePresence>
                      {expandedTip === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4"
                        >
                          <p className="text-xs text-white/60 leading-relaxed pt-2 border-t border-white/5">
                            {tip.content}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
