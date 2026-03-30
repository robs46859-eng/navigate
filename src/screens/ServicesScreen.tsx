import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Star, 
  Phone, 
  Users, 
  Stethoscope, 
  Heart, 
  Dumbbell,
  Filter,
  Share2,
  Menu,
  MapPin,
  Clock,
  ShieldCheck,
  X,
  Check
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { MOCK_SERVICES } from '../constants/mockData';
import { Service } from '../types';
import { cn } from '../lib/utils';
import { hapticFeedback } from '../lib/haptics';
import { Sidebar } from '../components/Sidebar';
import { ServiceDetail } from '../components/ServiceDetail';

const CATEGORIES = [
  { id: 'all', name: 'All Services', icon: null },
  { id: 'babysitting', name: 'Babysitting', icon: <Users className="w-4 h-4" /> },
  { id: 'pediatrician', name: 'Pediatricians', icon: <Stethoscope className="w-4 h-4" /> },
  { id: 'therapist', name: 'Therapists', icon: <Heart className="w-4 h-4" /> },
  { id: 'exercise', name: 'Exercise', icon: <Dumbbell className="w-4 h-4" /> },
  { id: 'sleep_consultant', name: 'Sleep Help', icon: <Clock className="w-4 h-4" /> },
] as const;

export const ServicesScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    verifiedOnly: false,
    maxDistance: 10,
    minRating: 0
  });

  const filteredServices = MOCK_SERVICES.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVerified = !filters.verifiedOnly || (service.verificationBadges && service.verificationBadges.length > 0);
    const matchesRating = service.rating >= filters.minRating;
    
    return matchesCategory && matchesSearch && matchesVerified && matchesRating;
  });

  const handleBack = () => {
    hapticFeedback.light();
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentHash={window.location.hash}
      />

      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-white border-b border-[#5D4037]/5 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <IconButton onClick={handleBack}>
              <ArrowLeft className="w-6 h-6" />
            </IconButton>
            <h1 className="text-2xl font-bold text-[#5D4037]">Services</h1>
          </div>
          <IconButton onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </IconButton>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5D4037]/40" />
            <input 
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#5D4037]/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E97451]/20 transition-all"
            />
          </div>
          <IconButton 
            onClick={() => {
              hapticFeedback.light();
              setShowFilters(true);
            }}
            className={cn(
              "bg-[#5D4037]/5 rounded-2xl border-none",
              (filters.verifiedOnly || filters.minRating > 0) && "bg-rose-50 text-rose-500"
            )}
          >
            <Filter className="w-5 h-5" />
          </IconButton>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                hapticFeedback.light();
                setSelectedCategory(cat.id);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                selectedCategory === cat.id 
                  ? "bg-[#E97451] text-white shadow-lg shadow-[#E97451]/20" 
                  : "bg-[#5D4037]/5 text-[#5D4037]/60 hover:bg-[#5D4037]/10"
              )}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Services List */}
      <main className="flex-1 p-6">
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-0 overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow relative">
                  {service.verificationBadges && service.verificationBadges.length > 0 && (
                    <div className="absolute top-3 left-3 z-10">
                      <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                        <ShieldCheck size={14} />
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-32 h-32 sm:h-auto overflow-hidden">
                      <img 
                        src={service.imageUrl} 
                        alt={service.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                            {service.category.replace('_', ' ')}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-current" />
                            <span className="text-xs font-bold text-stone-700">{service.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold text-stone-800">{service.name}</h3>
                          {service.verificationBadges && service.verificationBadges.length > 0 && (
                            <ShieldCheck size={14} className="text-emerald-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-stone-400 font-medium mb-2">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {service.distance || '0.3 mi away'}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {service.hours || '9:00 AM - 5:00 PM'}</span>
                          {service.pricing && (
                            <span className="text-emerald-600 font-bold">
                              {service.pricing.range}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 line-clamp-2 mb-3">
                          {service.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          className="flex-1 h-9 text-[10px] font-bold uppercase tracking-widest gap-2"
                          onClick={() => {
                            hapticFeedback.medium();
                            setSelectedService(service);
                          }}
                        >
                          View Details
                        </Button>
                        <IconButton 
                          size="sm" 
                          variant="outline" 
                          className="h-9 w-9 border-stone-200"
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
                        >
                          <Share2 className="w-4 h-4 text-stone-400" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#5D4037]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-[#5D4037]/20" />
              </div>
              <p className="text-[#5D4037]/40 font-medium">No services found matching your criteria.</p>
              <Button 
                variant="ghost" 
                className="mt-2 text-[#E97451]"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setFilters({ verifiedOnly: false, maxDistance: 10, minRating: 0 });
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Advanced Filters Sheet */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-[32px] p-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-stone-800">Advanced Filters</h3>
                <IconButton onClick={() => setShowFilters(false)}>
                  <X size={20} />
                </IconButton>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-stone-800">Verified Experts Only</p>
                      <p className="text-xs text-stone-400">Show only providers with verification badges</p>
                    </div>
                    <button 
                      onClick={() => {
                        hapticFeedback.light();
                        setFilters(prev => ({ ...prev, verifiedOnly: !prev.verifiedOnly }));
                      }}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative",
                        filters.verifiedOnly ? "bg-rose-500" : "bg-stone-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                        filters.verifiedOnly ? "left-7" : "left-1"
                      )} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Minimum Rating</p>
                  <div className="flex gap-2">
                    {[0, 3, 4, 4.5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => {
                          hapticFeedback.light();
                          setFilters(prev => ({ ...prev, minRating: rating }));
                        }}
                        className={cn(
                          "flex-1 py-3 rounded-xl border-2 transition-all font-bold text-sm",
                          filters.minRating === rating 
                            ? "border-rose-500 bg-rose-50 text-rose-500" 
                            : "border-stone-100 text-stone-400"
                        )}
                      >
                        {rating === 0 ? 'Any' : `${rating}+`}
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full h-14 bg-rose-500 hover:bg-rose-600 rounded-2xl text-lg font-bold"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedService && (
          <ServiceDetail 
            service={selectedService} 
            onClose={() => setSelectedService(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
