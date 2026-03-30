import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  ShieldCheck, 
  Users, 
  Sparkles,
  Baby,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { useApp } from '../context/AppContext';
import { profileService } from '../services/profileService';
import { UserStage } from '../types';
import { hapticFeedback } from '../lib/haptics';
import { cn } from '../lib/utils';

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to MamaNav',
    subtitle: 'Your companion for the beautiful journey of motherhood.',
    icon: <Heart className="w-12 h-12 text-rose-500" />,
    trust: 'Used by 10k+ Mamas'
  },
  {
    id: 'stage',
    title: 'Where are you now?',
    subtitle: 'We personalize your experience based on your current stage.',
    icon: <Baby className="w-12 h-12 text-rose-500" />
  },
  {
    id: 'details',
    title: 'A few more details',
    subtitle: 'Help us tailor the content for you.',
    icon: <Calendar className="w-12 h-12 text-rose-500" />
  },
  {
    id: 'interests',
    title: 'What interests you?',
    subtitle: 'Select topics you want to see more of.',
    icon: <Sparkles className="w-12 h-12 text-rose-500" />
  }
];

const INTERESTS = [
  'Safe Sleep', 'Breastfeeding', 'Postpartum Recovery', 
  'Baby Gear', 'Local Meetups', 'Mental Health', 
  'Nutrition', 'Exercise', 'Safety Tips'
];

export const OnboardingScreen = () => {
  const { user, refreshProfile } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [stage, setStage] = useState<UserStage>('pregnant');
  const [dueDate, setDueDate] = useState('');
  const [babyAge, setBabyAge] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleNext = () => {
    hapticFeedback.medium();
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    hapticFeedback.light();
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleInterest = (interest: string) => {
    hapticFeedback.light();
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      await profileService.createProfile({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'MamaNav User',
        stage,
        dueDate: stage === 'pregnant' ? dueDate : undefined,
        comfortRoutingEnabled: true,
        interests: selectedInterests
      });
      await refreshProfile();
    } catch (error) {
      console.error('Onboarding failed', error);
    } finally {
      setSubmitting(false);
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-50" />

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-8 relative z-10">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                i <= currentStep ? "bg-rose-500" : "bg-stone-200"
              )} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="mb-8">
              <div className="mb-6">{step.icon}</div>
              <h2 className="text-3xl font-bold text-stone-800 mb-2 leading-tight">{step.title}</h2>
              <p className="text-stone-500 text-lg leading-relaxed">{step.subtitle}</p>
            </div>

            <div className="flex-1">
              {step.id === 'welcome' && (
                <div className="space-y-6">
                  <div className="p-6 bg-white rounded-[32px] border border-stone-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                        <ShieldCheck size={24} />
                      </div>
                      <p className="text-sm font-bold text-stone-700">Verified Health Experts</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                        <Users size={24} />
                      </div>
                      <p className="text-sm font-bold text-stone-700">10k+ Active Community</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
                        <CheckCircle2 size={24} />
                      </div>
                      <p className="text-sm font-bold text-stone-700">Personalized Journey</p>
                    </div>
                  </div>
                </div>
              )}

              {step.id === 'stage' && (
                <div className="space-y-3">
                  {(['pregnant', 'partner', 'grandparent'] as UserStage[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        hapticFeedback.light();
                        setStage(s);
                      }}
                      className={cn(
                        "w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between group",
                        stage === s 
                          ? 'border-rose-500 bg-rose-50/50 text-rose-600' 
                          : 'border-stone-100 bg-white text-stone-600 hover:border-rose-200'
                      )}
                    >
                      <span className="capitalize font-bold text-lg">{s}</span>
                      {stage === s && <CheckCircle2 className="text-rose-500" size={24} />}
                    </button>
                  ))}
                </div>
              )}

              {step.id === 'details' && (
                <div className="space-y-6">
                  {stage === 'pregnant' ? (
                    <div className="space-y-4">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Estimated Due Date</label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full p-5 rounded-2xl border-2 border-stone-100 bg-white focus:border-rose-500 outline-none transition-all text-lg font-medium"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Baby's Age (if applicable)</label>
                      <select
                        value={babyAge}
                        onChange={(e) => setBabyAge(e.target.value)}
                        className="w-full p-5 rounded-2xl border-2 border-stone-100 bg-white focus:border-rose-500 outline-none transition-all text-lg font-medium"
                      >
                        <option value="">Select age range</option>
                        <option value="0-3">0-3 months</option>
                        <option value="3-6">3-6 months</option>
                        <option value="6-12">6-12 months</option>
                        <option value="12+">12+ months</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {step.id === 'interests' && (
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-sm font-bold transition-all border-2",
                        selectedInterests.includes(interest)
                          ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20"
                          : "bg-white border-stone-100 text-stone-600 hover:border-rose-200"
                      )}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="mt-12 flex gap-4">
          {currentStep > 0 && (
            <IconButton 
              onClick={handleBack}
              className="h-16 w-16 rounded-2xl bg-stone-100 text-stone-600"
            >
              <ChevronLeft size={24} />
            </IconButton>
          )}
          <Button 
            onClick={handleNext} 
            className="flex-1 h-16 rounded-2xl text-lg font-bold gap-2 bg-rose-500 hover:bg-rose-600 shadow-xl shadow-rose-500/20"
            disabled={submitting}
          >
            {submitting ? 'Setting up...' : currentStep === STEPS.length - 1 ? 'Get Started' : 'Continue'}
            {currentStep < STEPS.length - 1 && <ChevronRight size={24} />}
          </Button>
        </div>
      </div>
    </div>
  );
};
