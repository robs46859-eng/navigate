import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star, Navigation, Map as MapIcon, ChevronRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useApp } from '../context/AppContext';
import { Place } from '../types';

export default function SavedScreen() {
  const { savedPlaces, toggleSavePlace } = useUser();
  const { profile } = useApp();
  
  // In a real app, we'd fetch these from a service. For now, we'll mock them.
  // We need access to the full places list. Let's assume they are available.
  const [places] = useState<Place[]>([]); // This should be populated from the map service

  const savedList = places.filter(p => savedPlaces.includes(p.id));

  const categories = [
    { id: 'all', name: 'All Saved' },
    { id: 'nursing_room', name: 'Nursing Rooms' },
    { id: 'bathroom', name: 'Bathrooms' },
    { id: 'hospital', name: 'Hospitals' },
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 sticky top-0 z-10 border-b border-[#5D4037]/5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#5D4037]">Saved Places</h1>
          <button 
            onClick={() => window.location.hash = '#/'}
            className="flex items-center gap-2 bg-[#E97451] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
          >
            <MapIcon className="w-4 h-4" />
            Show on Map
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id 
                  ? 'bg-[#5D4037] text-white' 
                  : 'bg-[#5D4037]/5 text-[#5D4037]/60 hover:bg-[#5D4037]/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {savedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Heart className="w-10 h-10 text-[#5D4037]/10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#5D4037]">No saved places yet</h3>
              <p className="text-sm text-[#5D4037]/40 max-w-[200px] mx-auto">
                Tap the heart icon on any place to save it for later.
              </p>
            </div>
            <button 
              onClick={() => window.location.hash = '#/'}
              className="text-[#E97451] font-bold text-sm"
            >
              Explore the Map
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedList.map((place) => (
              <motion.div 
                layout
                key={place.id}
                className="bg-white rounded-3xl p-4 shadow-sm border border-[#5D4037]/5 flex gap-4"
              >
                <div className="w-20 h-20 bg-[#FAF9F6] rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                  {place.photos?.[0] ? (
                    <img src={place.photos[0]} className="w-full h-full object-cover" />
                  ) : (
                    <MapPin className="w-8 h-8 text-[#E97451]/20" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-[#5D4037] truncate">{place.name}</h3>
                      <p className="text-xs text-[#5D4037]/40 truncate">{place.address}</p>
                    </div>
                    <button 
                      onClick={() => toggleSavePlace(place.id)}
                      className="text-[#E97451]"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-[10px] font-bold text-yellow-700">{place.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#5D4037]/40">
                      <Navigation className="w-3 h-3" />
                      <span className="text-[10px] font-bold">0.4 mi</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Trip Planner Section */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#5D4037]">Trip Planner</h2>
            <span className="text-xs font-bold text-[#E97451] bg-[#E97451]/10 px-2 py-1 rounded-full">BETA</span>
          </div>

          <div className="bg-[#5D4037] rounded-[32px] p-6 text-white overflow-hidden relative">
            <div className="relative z-10 space-y-4">
              <h3 className="text-lg font-bold leading-tight">Plan a stress-free outing with your baby.</h3>
              <p className="text-white/60 text-sm">
                Select multiple stops and we'll optimize the route with baby-friendly pit stops.
              </p>
              <button 
                className="bg-[#E97451] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-[#D66340] transition-all flex items-center gap-2"
                onClick={() => alert("Trip Planner functionality coming soon!")}
              >
                Start Planning
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
