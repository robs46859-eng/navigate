import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Heart, 
  MessageSquare, 
  Plus, 
  Stethoscope, 
  Timer,
  AlertCircle,
  TrendingUp,
  Baby,
  Send,
  Sparkles,
  Bot
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { format, differenceInSeconds, differenceInMinutes, isAfter, addHours } from 'date-fns';
import { Contraction, KickCount, Appointment, ChatMessage } from '../types';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const HealthScreen = () => {
  const [activeTab, setActiveTab] = useState<'contractions' | 'kicks' | 'appointments' | 'ai'>('contractions');
  
  // Contraction State
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [currentContraction, setCurrentContraction] = useState<Partial<Contraction> | null>(null);
  
  // Kick State
  const [kickCounts, setKickCounts] = useState<KickCount[]>([]);
  const [currentKickCount, setCurrentKickCount] = useState<number>(0);
  const [kickStartTime, setKickStartTime] = useState<Date | null>(null);
  
  // Appointment State
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      title: 'Prenatal Checkup',
      date: addHours(new Date(), 48).toISOString(),
      location: 'St. Mary\'s Hospital',
      type: 'prenatal',
      notes: 'Bring ultrasound photos'
    },
    {
      id: '2',
      title: 'Glucose Test',
      date: addHours(new Date(), 120).toISOString(),
      location: 'LabCorp Downtown',
      type: 'other',
    }
  ]);

  // AI State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hi! I'm your MamaNav AI assistant. How can I help you today? You can ask me about pregnancy symptoms, find nearby amenities, or get advice on when to head to the hospital.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Contraction Handlers
  const toggleContraction = () => {
    const now = new Date().toISOString();
    if (!isTracking) {
      // Start
      const lastContraction = contractions[0];
      const interval = lastContraction ? differenceInSeconds(new Date(now), new Date(lastContraction.startTime)) : undefined;
      
      setCurrentContraction({
        id: Math.random().toString(36).substr(2, 9),
        startTime: now,
        interval,
        intensity: 3
      });
      setIsTracking(true);
    } else {
      // Stop
      if (currentContraction) {
        const duration = differenceInSeconds(new Date(now), new Date(currentContraction.startTime!));
        const completed: Contraction = {
          ...currentContraction as Contraction,
          endTime: now,
          duration
        };
        setContractions([completed, ...contractions]);
        setCurrentContraction(null);
        setIsTracking(false);
      }
    }
  };

  // Kick Handlers
  const addKick = () => {
    if (!kickStartTime) {
      setKickStartTime(new Date());
    }
    setCurrentKickCount(prev => prev + 1);
  };

  const finishKickCount = () => {
    if (kickStartTime) {
      const now = new Date();
      const duration = differenceInMinutes(now, kickStartTime);
      const newCount: KickCount = {
        id: Math.random().toString(36).substr(2, 9),
        startTime: kickStartTime.toISOString(),
        endTime: now.toISOString(),
        count: currentKickCount,
        duration
      };
      setKickCounts([newCount, ...kickCounts]);
      setCurrentKickCount(0);
      setKickStartTime(null);
    }
  };

  // AI Handlers
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: input }] }],
        config: {
          systemInstruction: "You are MamaNav AI, a helpful assistant for pregnant women and new parents. Provide empathetic, clinically-aware (but not medical advice) guidance. Help find amenities, explain symptoms, and offer comfort. If the user mentions severe pain or bleeding, strongly advise contacting their doctor or emergency services."
        }
      });

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result.text || "I'm sorry, I couldn't process that. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // 5-1-1 Rule Logic
  const checkLaborStatus = () => {
    if (contractions.length < 3) return null;
    
    const recent = contractions.slice(0, 5);
    const avgInterval = recent.reduce((acc, c) => acc + (c.interval || 0), 0) / recent.length;
    const avgDuration = recent.reduce((acc, c) => acc + (c.duration || 0), 0) / recent.length;
    
    // 5-1-1: 5 mins apart, 1 min long, for 1 hour
    if (avgInterval <= 300 && avgDuration >= 60) {
      return {
        status: 'Active Labor Likely',
        advice: 'Your contractions are consistent with active labor. Contact your doctor or head to the hospital.',
        color: 'text-red-500'
      };
    }
    
    if (avgInterval <= 600) {
      return {
        status: 'Early Labor Possible',
        advice: 'Contractions are becoming regular. Keep tracking and prepare your hospital bag.',
        color: 'text-orange-500'
      };
    }
    
    return {
      status: 'Braxton Hicks / Early Phase',
      advice: 'Contractions are irregular. Rest and stay hydrated.',
      color: 'text-blue-500'
    };
  };

  const laborStatus = checkLaborStatus();

  return (
    <div className="min-h-screen bg-[#FDF5E6] pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#5D4037]">Health</h1>
            <p className="text-[#5D4037]/60">Monitor your well-being</p>
          </div>
          <div className="w-12 h-12 bg-[#E97451]/10 rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-[#E97451]" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'contractions', icon: Timer, label: 'Labor' },
            { id: 'kicks', icon: Activity, label: 'Kicks' },
            { id: 'appointments', icon: Calendar, label: 'Calendar' },
            { id: 'ai', icon: Bot, label: 'Ask AI' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all",
                activeTab === tab.id 
                  ? "bg-[#E97451] text-white shadow-lg shadow-[#E97451]/20" 
                  : "bg-[#5D4037]/5 text-[#5D4037]/60 hover:bg-[#5D4037]/10"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'contractions' && (
            <motion.div
              key="contractions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Labor Status Card */}
              {laborStatus && (
                <Card className="p-6 border-l-4 border-l-[#E97451] bg-white">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-50 rounded-2xl">
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className={cn("text-lg font-bold", laborStatus.color)}>{laborStatus.status}</h3>
                      <p className="text-sm text-[#5D4037]/70 mt-1">{laborStatus.advice}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Tracker Controls */}
              <div className="flex flex-col items-center justify-center py-12 space-y-8 bg-white rounded-[40px] shadow-sm">
                <div className="relative">
                  <motion.div
                    animate={isTracking ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={cn(
                      "w-48 h-48 rounded-full flex flex-col items-center justify-center border-8 transition-colors",
                      isTracking ? "border-[#E97451] bg-[#E97451]/5" : "border-[#5D4037]/10 bg-stone-50"
                    )}
                  >
                    <span className="text-4xl font-bold text-[#5D4037]">
                      {isTracking && currentContraction?.startTime 
                        ? format(new Date(differenceInSeconds(new Date(), new Date(currentContraction.startTime)) * 1000), 'mm:ss')
                        : '00:00'}
                    </span>
                    <span className="text-xs font-bold text-[#5D4037]/40 uppercase tracking-widest mt-2">
                      {isTracking ? 'Recording...' : 'Ready'}
                    </span>
                  </motion.div>
                </div>

                <Button
                  size="lg"
                  onClick={toggleContraction}
                  className={cn(
                    "w-64 h-16 rounded-2xl text-lg font-bold shadow-xl",
                    isTracking ? "bg-red-500 hover:bg-red-600" : "bg-[#E97451] hover:bg-[#D66340]"
                  )}
                >
                  {isTracking ? 'Stop Contraction' : 'Start Contraction'}
                </Button>
              </div>

              {/* History */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#5D4037] px-2">Recent History</h3>
                {contractions.length === 0 ? (
                  <div className="text-center py-12 bg-white/50 rounded-[32px] border border-dashed border-[#5D4037]/20">
                    <p className="text-[#5D4037]/40">No contractions recorded yet.</p>
                  </div>
                ) : (
                  contractions.map(c => (
                    <Card key={c.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#E97451]/10 rounded-xl flex items-center justify-center">
                          <Timer className="w-5 h-5 text-[#E97451]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#5D4037]">{format(new Date(c.startTime), 'h:mm a')}</p>
                          <p className="text-xs text-[#5D4037]/60">Duration: {c.duration}s</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-[#E97451] uppercase tracking-tighter">
                          {c.interval ? `Interval: ${Math.floor(c.interval / 60)}m` : 'First'}
                        </p>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'kicks' && (
            <motion.div
              key="kicks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="p-8 flex flex-col items-center space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#5D4037]">{currentKickCount}</h3>
                  <p className="text-[#5D4037]/60">Kicks this session</p>
                </div>
                
                <button
                  onClick={addKick}
                  className="w-32 h-32 bg-[#E97451] rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform"
                >
                  <Baby className="w-12 h-12 text-white" />
                </button>

                <div className="flex gap-4 w-full">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setCurrentKickCount(0);
                      setKickStartTime(null);
                    }}
                  >
                    Reset
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={finishKickCount}
                    disabled={currentKickCount === 0}
                  >
                    Save Session
                  </Button>
                </div>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#5D4037] px-2">Past Sessions</h3>
                {kickCounts.map(k => (
                  <Card key={k.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Activity className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#5D4037]">{format(new Date(k.startTime), 'MMM d, h:mm a')}</p>
                        <p className="text-xs text-[#5D4037]/60">{k.duration} minutes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#5D4037]">{k.count}</p>
                      <p className="text-[10px] font-bold text-[#5D4037]/40 uppercase">Kicks</p>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-bold text-[#5D4037]">Upcoming</h3>
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>

              {appointments.map(apt => (
                <Card key={apt.id} className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        apt.type === 'prenatal' ? "bg-[#E97451]/10" : "bg-blue-50"
                      )}>
                        {apt.type === 'prenatal' ? <Stethoscope className="w-6 h-6 text-[#E97451]" /> : <Calendar className="w-6 h-6 text-blue-500" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#5D4037]">{apt.title}</h4>
                        <p className="text-sm text-[#5D4037]/60">{apt.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#E97451]">{format(new Date(apt.date), 'MMM d')}</p>
                      <p className="text-xs text-[#5D4037]/40">{format(new Date(apt.date), 'h:mm a')}</p>
                    </div>
                  </div>
                  {apt.notes && (
                    <div className="bg-stone-50 p-3 rounded-xl">
                      <p className="text-xs text-[#5D4037]/70">{apt.notes}</p>
                    </div>
                  )}
                </Card>
              ))}
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col h-[calc(100vh-280px)]"
            >
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 p-2 no-scrollbar">
                {messages.map(m => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex w-full",
                      m.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[85%] p-4 rounded-2xl shadow-sm",
                      m.role === 'user' 
                        ? "bg-[#E97451] text-white rounded-tr-none" 
                        : "bg-white text-[#5D4037] rounded-tl-none"
                    )}>
                      <p className="text-sm leading-relaxed">{m.text}</p>
                      <p className={cn(
                        "text-[10px] mt-2",
                        m.role === 'user' ? "text-white/60" : "text-[#5D4037]/40"
                      )}>
                        {format(new Date(m.timestamp), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                      <div className="w-1.5 h-1.5 bg-[#5D4037]/20 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-[#5D4037]/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-[#5D4037]/20 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask anything..."
                  className="flex-1 bg-white border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E97451] shadow-sm"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="w-12 h-12 rounded-2xl p-0 flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
