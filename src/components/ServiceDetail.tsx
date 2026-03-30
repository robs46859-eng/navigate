import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  MessageSquare,
  Calendar,
  Share2,
  ChevronRight,
  Send
} from 'lucide-react';
import { Service } from '../types';
import { Button } from './ui/Button';
import { IconButton } from './ui/IconButton';
import { hapticFeedback } from '../lib/haptics';

interface ServiceDetailProps {
  service: Service;
  onClose: () => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onClose }) => {
  const [showBooking, setShowBooking] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [messageSent, setMessageSent] = useState(false);

  const handleBooking = () => {
    hapticFeedback.medium();
    if (bookingStep < 3) {
      setBookingStep(prev => prev + 1);
    } else {
      hapticFeedback.success();
      setShowBooking(false);
      setBookingStep(1);
      // In a real app, this would send data to a backend
    }
  };

  const handleSendMessage = () => {
    hapticFeedback.success();
    setMessageSent(true);
    setTimeout(() => {
      setShowMessaging(false);
      setMessageSent(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-white overflow-y-auto no-scrollbar"
    >
      {/* Hero Section */}
      <div className="relative h-72">
        <img 
          src={service.imageUrl} 
          alt={service.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-12 left-6 right-6 flex justify-between items-center">
          <IconButton 
            onClick={() => {
              hapticFeedback.light();
              onClose();
            }}
            className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/40"
          >
            <X size={24} />
          </IconButton>
          <div className="flex gap-2">
            <IconButton 
              onClick={() => {
                hapticFeedback.light();
                if (navigator.share) {
                  navigator.share({
                    title: service.name,
                    text: service.description,
                    url: window.location.href
                  }).catch(console.error);
                } else {
                  alert("Sharing is not supported on this device.");
                }
              }}
              className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/40"
            >
              <Share2 size={20} />
            </IconButton>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
              {service.category.replace('_', ' ')}
            </span>
            {service.verificationBadges?.map(badge => (
              <span key={badge} className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                <ShieldCheck size={10} /> {badge}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">{service.name}</h1>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span className="font-bold text-white">{service.rating}</span>
              <span className="text-xs">({service.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{service.distance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8 pb-32">
        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Pricing</p>
            <p className="font-bold text-stone-800">{service.pricing?.estimate || service.pricing?.range || 'Contact for rates'}</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Availability</p>
            <p className="font-bold text-stone-800">{service.availability || 'By Appointment'}</p>
          </div>
        </div>

        {/* Description */}
        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">About</h2>
          <p className="text-stone-600 leading-relaxed">
            {service.description}
          </p>
        </section>

        {/* Contact Info */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-stone-800 mb-3">Contact & Location</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
              <MapPin className="text-rose-500 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-bold text-stone-800">Address</p>
                <p className="text-sm text-stone-500">{service.address || 'Denver, CO'}</p>
              </div>
            </div>
            {service.phone && (
              <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <Phone className="text-rose-500 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-bold text-stone-800">Phone</p>
                  <a href={`tel:${service.phone}`} className="text-sm text-rose-500 hover:underline block">
                    {service.phone}
                  </a>
                </div>
              </div>
            )}
            {service.email && (
              <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <Mail className="text-rose-500 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-bold text-stone-800">Email</p>
                  <a href={`mailto:${service.email}`} className="text-sm text-rose-500 hover:underline block">
                    {service.email}
                  </a>
                </div>
              </div>
            )}
            {service.websiteUrl && (
              <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <Globe className="text-rose-500 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-bold text-stone-800">Website</p>
                  <a href={service.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-rose-500 hover:underline truncate max-w-[200px] block">
                    {service.websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Specializations */}
        {service.specializations && service.specializations.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {service.specializations.map(spec => (
                <span key={spec} className="px-3 py-1.5 bg-stone-100 text-stone-600 text-xs font-medium rounded-lg">
                  {spec}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-stone-800">Reviews</h2>
            <Button 
              variant="ghost" 
              className="text-rose-500 text-sm font-bold"
              onClick={() => alert("All reviews functionality coming soon!")}
            >
              See All
            </Button>
          </div>
          <div className="space-y-4">
            {service.reviews?.slice(0, 2).map(review => (
              <div key={review.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-xs">
                      {review.userName.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-stone-800">{review.userName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    <span className="text-xs font-bold text-stone-700">{review.rating}</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-stone-800 mb-1">{review.title}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{review.text}</p>
              </div>
            ))}
            {!service.reviews?.length && (
              <p className="text-sm text-stone-400 italic">No reviews yet. Be the first to leave one!</p>
            )}
          </div>
        </section>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-stone-100 flex gap-4 z-40">
        <Button 
          variant="outline" 
          className="flex-1 h-14 rounded-2xl gap-2 border-stone-200 text-stone-600"
          onClick={() => {
            hapticFeedback.medium();
            setShowMessaging(true);
          }}
        >
          <MessageSquare size={20} />
          Message
        </Button>
        <Button 
          className="flex-[2] h-14 rounded-2xl gap-2 bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20"
          onClick={() => {
            hapticFeedback.medium();
            setShowBooking(true);
          }}
        >
          <Calendar size={20} />
          Book Now
        </Button>
      </div>

      {/* Booking Modal Overlay */}
      <AnimatePresence>
        {showBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowBooking(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-[32px] p-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-stone-800">Book Appointment</h3>
                <IconButton onClick={() => setShowBooking(false)}>
                  <X size={20} />
                </IconButton>
              </div>

              <div className="space-y-6">
                {bookingStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-sm text-stone-500">Select a date for your consultation with {service.name}.</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[16, 17, 18, 19, 20, 21, 22, 23].map(day => (
                        <button key={day} className="p-3 border border-stone-100 rounded-xl text-center hover:border-rose-500 hover:bg-rose-50/50 transition-all">
                          <p className="text-[10px] uppercase font-bold text-stone-400">Mar</p>
                          <p className="text-lg font-bold text-stone-800">{day}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-sm text-stone-500">Choose an available time slot.</p>
                    <div className="grid grid-cols-3 gap-2">
                      {['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM'].map(time => (
                        <button key={time} className="p-3 border border-stone-100 rounded-xl text-center hover:border-rose-500 hover:bg-rose-50/50 transition-all">
                          <p className="text-xs font-bold text-stone-800">{time}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-900">Ready to confirm!</p>
                        <p className="text-xs text-emerald-700">Mar 18, 2026 at 10:30 AM</p>
                      </div>
                    </div>
                    <p className="text-sm text-stone-500">By confirming, you agree to the service provider's terms and cancellation policy.</p>
                  </div>
                )}

                <Button 
                  className="w-full h-14 bg-rose-500 hover:bg-rose-600 rounded-2xl text-lg font-bold"
                  onClick={handleBooking}
                >
                  {bookingStep === 3 ? 'Confirm Booking' : 'Next Step'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showMessaging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowMessaging(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-[32px] p-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-stone-800">Message Provider</h3>
                <IconButton onClick={() => setShowMessaging(false)}>
                  <X size={20} />
                </IconButton>
              </div>

              <div className="space-y-4">
                {messageSent ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-stone-800 mb-1">Message Sent!</h4>
                    <p className="text-sm text-stone-500">{service.name} will get back to you soon.</p>
                  </div>
                ) : (
                  <>
                    <textarea 
                      placeholder="Type your message here..."
                      className="w-full h-32 p-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none text-sm"
                    />
                    <Button 
                      className="w-full h-14 bg-rose-500 hover:bg-rose-600 rounded-2xl text-lg font-bold gap-2"
                      onClick={handleSendMessage}
                    >
                      <Send size={20} />
                      Send Message
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
