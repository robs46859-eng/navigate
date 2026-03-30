import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Camera, CheckCircle2, Circle, Info, Calendar } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { PREGNANCY_JOURNEY, BABY_JOURNEY } from '../constants/sampleData';

export default function JourneyScreen() {
  const { profile, journeyProgress, updateJourneyWeek, babyMilestones, toggleMilestone } = useUser();
  const isPregnant = profile?.stage === 'pregnant';
  
  // Calculate current week based on due date
  const calculateCurrentWeek = () => {
    if (!profile?.dueDate) return 1;
    const due = new Date(profile.dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeksRemaining = Math.floor(diffDays / 7);
    const currentWeek = 40 - weeksRemaining;
    return Math.max(1, Math.min(40, currentWeek));
  };

  const currentWeek = calculateCurrentWeek();
  const [expandedWeek, setExpandedWeek] = useState<number>(currentWeek);

  const moods = ['😫', '😕', '😐', '🙂', '😊'];

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 sticky top-0 z-10 border-b border-[#5D4037]/5">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-[#5D4037]">Your Journey</h1>
          <div className="bg-[#E97451]/10 px-3 py-1 rounded-full">
            <span className="text-[#E97451] text-sm font-bold">
              {isPregnant ? `Week ${currentWeek}` : 'Baby Emma, 3m'}
            </span>
          </div>
        </div>
        <p className="text-[#5D4037]/60 text-sm">
          {isPregnant ? 'Tracking your pregnancy progress' : 'Watching your little one grow'}
        </p>
      </div>

      <div className="p-6">
        {isPregnant ? (
          <div className="space-y-4 relative">
            {/* Timeline Line */}
            <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-[#E97451]/10 z-0" />
            
            {PREGNANCY_JOURNEY.map((item) => {
              const isCurrent = item.week === currentWeek;
              const isPast = item.week < currentWeek;
              const isExpanded = expandedWeek === item.week;
              const progress = journeyProgress.find(p => p.week === item.week);

              return (
                <div key={item.week} className="relative z-10">
                  <div className="flex gap-4">
                    {/* Timeline Dot */}
                    <button 
                      onClick={() => setExpandedWeek(item.week)}
                      className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isCurrent ? 'bg-[#E97451] text-white shadow-lg scale-110' : 
                        isPast ? 'bg-[#E97451]/20 text-[#E97451]' : 'bg-white text-[#5D4037]/20 border border-[#5D4037]/10'
                      }`}
                    >
                      <span className="text-sm font-bold">{item.week}</span>
                    </button>

                    {/* Content Card */}
                    <div className="flex-1">
                      <motion.div 
                        layout
                        onClick={() => setExpandedWeek(item.week)}
                        className={`bg-white rounded-2xl p-4 border transition-all ${
                          isExpanded ? 'border-[#E97451] shadow-md' : 'border-[#5D4037]/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className={`font-bold ${isExpanded ? 'text-[#E97451]' : 'text-[#5D4037]'}`}>
                            Week {item.week}
                          </h3>
                          {progress?.mood !== null && (
                            <span className="text-lg">{moods[progress!.mood!]}</span>
                          )}
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 space-y-4 overflow-hidden"
                            >
                              <div className="bg-[#FAF9F6] p-3 rounded-xl flex items-center gap-3">
                                <span className="text-3xl">{item.emoji}</span>
                                <div>
                                  <p className="text-xs text-[#5D4037]/40 uppercase font-bold tracking-wider">Baby Size</p>
                                  <p className="text-[#5D4037] font-medium">{item.size}</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <Info className="w-4 h-4 text-[#E97451] mt-0.5" />
                                  <p className="text-sm text-[#5D4037]/70 leading-relaxed">{item.fact}</p>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-[#5D4037]/5 space-y-4">
                                <div>
                                  <p className="text-xs font-bold text-[#5D4037]/40 mb-2">HOW ARE YOU FEELING?</p>
                                  <div className="flex justify-between">
                                    {moods.map((emoji, idx) => (
                                      <button
                                        key={idx}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateJourneyWeek(item.week, { mood: idx });
                                        }}
                                        className={`text-2xl p-2 rounded-xl transition-all ${
                                          progress?.mood === idx ? 'bg-[#E97451]/10 scale-125' : 'hover:bg-stone-100'
                                        }`}
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Simulated photo upload
                                    updateJourneyWeek(item.week, { photo: 'https://picsum.photos/seed/bump/400/400' });
                                  }}
                                  className="w-full py-3 border-2 border-dashed border-[#5D4037]/10 rounded-xl flex items-center justify-center gap-2 text-[#5D4037]/40 hover:text-[#E97451] hover:border-[#E97451]/30 transition-all"
                                >
                                  {progress?.photo ? (
                                    <div className="flex items-center gap-2">
                                      <img src={progress.photo} className="w-8 h-8 rounded-lg object-cover" />
                                      <span className="text-sm font-medium text-[#E97451]">Photo Added!</span>
                                    </div>
                                  ) : (
                                    <>
                                      <Camera className="w-5 h-5" />
                                      <span className="text-sm font-medium">Add Bump Photo</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            {BABY_JOURNEY.map((month) => (
              <div key={month.month} className="bg-white rounded-[32px] p-6 shadow-sm border border-[#5D4037]/5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#5D4037]">Month {month.month}</h2>
                  <div className="bg-[#E97451]/10 px-3 py-1 rounded-full">
                    <span className="text-[#E97451] text-xs font-bold uppercase tracking-wider">Development</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-[#5D4037]/40 uppercase tracking-widest">Milestones</p>
                  <div className="space-y-3">
                    {month.milestones.map((milestone) => {
                      const isCompleted = babyMilestones.find(m => m.id === milestone.id)?.completed;
                      return (
                        <button
                          key={milestone.id}
                          onClick={() => toggleMilestone(milestone.id)}
                          className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-50 transition-colors text-left"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-[#5D4037]/20" />
                          )}
                          <span className={`text-sm font-medium ${isCompleted ? 'text-[#5D4037]/40 line-through' : 'text-[#5D4037]'}`}>
                            {milestone.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#5D4037]/5 grid grid-cols-2 gap-4">
                  <div className="bg-[#FAF9F6] p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-[#5D4037]/40 uppercase mb-1">Weight</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-[#5D4037]">12.4</span>
                      <span className="text-xs text-[#5D4037]/60">lbs</span>
                    </div>
                  </div>
                  <div className="bg-[#FAF9F6] p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-[#5D4037]/40 uppercase mb-1">Height</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-[#5D4037]">24.2</span>
                      <span className="text-xs text-[#5D4037]/60">in</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
