import React from 'react';
import { motion } from 'motion/react';
import { Baby, MapPin, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { authService } from '../services/authService';

export const LoginScreen = () => {
  const handleLogin = async () => {
    try {
      await authService.loginWithGoogle();
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        console.log('Login popup closed by user.');
      } else {
        console.error('Login failed', error);
        alert('Failed to log in. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#FDF5E6]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-12 text-center"
      >
        <div className="w-24 h-24 bg-[#E97451] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
          <Baby className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#5D4037] mb-2">MamaNav</h1>
        <p className="text-[#5D4037]/60">Your comfort companion on the road</p>
      </motion.div>

      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-4">
          <FeatureItem icon={<MapPin className="w-5 h-5" />} text="Find nursing rooms & clean bathrooms" />
          <FeatureItem icon={<Heart className="w-5 h-5" />} text="Comfort-aware route planning" />
          <FeatureItem icon={<Baby className="w-5 h-5" />} text="Emergency Labor Mode" />
        </div>

        <Button onClick={handleLogin} className="w-full" size="lg">
          Continue with Google
        </Button>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm"
  >
    <div className="text-[#E97451]">{icon}</div>
    <span className="text-[#5D4037] font-medium">{text}</span>
  </motion.div>
);
