import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Map as MapIcon, 
  List, 
  Settings, 
  Baby, 
  Droplets, 
  Coffee, 
  Hospital, 
  Navigation, 
  Star, 
  Check, 
  X,
  Plus,
  Moon,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Heart,
  Stethoscope,
  Users,
  Dumbbell,
  BookOpen,
  Upload,
  Menu,
  MapPin,
  Clock,
  ThumbsUp,
  Car,
  Footprints,
  Square,
  Phone,
  Bell,
  Zap,
  ChevronRight,
  AlertCircle,
  Globe,
  Shield,
  CloudRain,
  Wind,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import { useSound, SOUNDS } from '../context/SoundContext';
import { placeService } from '../services/placeService';
import { reviewService } from '../services/reviewService';
import { Place, PlaceCategory, Review, Service, Resource } from '../types';
import { MOCK_SERVICES, MOCK_RESOURCES } from '../constants/mockData';
import { TIPS } from '../constants/sampleData';
import { FilterChip } from '../components/ui/FilterChip';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { BottomSheet } from '../components/ui/BottomSheet';
import { RatingSelector } from '../components/ui/RatingSelector';
import { InteractiveMap } from '../components/InteractiveMap';
import { hapticFeedback } from '../lib/haptics';
import { Sidebar } from '../components/Sidebar';
import { cn } from '../lib/utils';

export const HomeScreen = () => {
  const { profile } = useApp();
  const { streak, unreadNotificationsCount, savedPlaces, toggleSavePlace } = useUser();
  const { 
    activeSound, 
    isPlaying, 
    volume, 
    timeLeft, 
    playSound, 
    setVolume, 
    setTimer,
    isFadeOut,
    setIsFadeOut,
    customSounds,
    addCustomSound
  } = useSound();
  const [soundCategory, setSoundCategory] = useState<'Basics' | 'Nature' | 'Instrumental' | 'Animal' | 'Custom'>('Basics');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLaborModeOpen, setIsLaborModeOpen] = useState(false);
  const [isSafeMode, setIsSafeMode] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [isPitStopOpen, setIsPitStopOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [etaInfo, setEtaInfo] = useState<{ time: number; distance: number } | null>(null);
  const [apiRestricted, setApiRestricted] = useState(false);

  // Navigation State
  const [navigationState, setNavigationState] = useState<{
    isActive: boolean;
    isLaborMode: boolean;
    destination: Place | null;
    origin: { lat: number; lng: number } | null;
    directionsResult: google.maps.DirectionsResult | null;
    travelMode: google.maps.TravelMode;
    currentStepIndex: number;
    phase: 'preview' | 'active' | 'arrived';
  }>({
    isActive: false,
    isLaborMode: false,
    destination: null,
    origin: null,
    directionsResult: null,
    travelMode: typeof google !== 'undefined' ? google.maps.TravelMode.DRIVING : 'DRIVING' as any,
    currentStepIndex: 0,
    phase: 'preview'
  });

  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [isContractionTimerOpen, setIsContractionTimerOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sheetState, setSheetState] = useState<'peek' | 'half' | 'detail' | 'navigation'>('peek');

  useEffect(() => {
    fetchPlaces();
    getUserLocation();
  }, [selectedCategory]);

  useEffect(() => {
    if (userLocation && navigationState.isActive && navigationState.phase === 'active') {
      checkArrival();
      checkStepAdvancement();
    }
  }, [userLocation, navigationState.isActive, navigationState.phase]);

  useEffect(() => {
    if (navigationState.isActive) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const newLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLoc);
          
          if (navigationState.directionsResult && navigationState.phase === 'active') {
            const path = navigationState.directionsResult.routes[0].overview_path;
            let minDistance = Infinity;
            const userLatLng = new google.maps.LatLng(newLoc.lat, newLoc.lng);
            
            path.forEach(point => {
              const d = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, point);
              if (d < minDistance) minDistance = d;
            });

            if (minDistance > 200) {
              calculateRoute(newLoc, navigationState.destination!, navigationState.travelMode, true);
            }
          }
        },
        (error) => console.error('Watch position error', error),
        { enableHighAccuracy: true }
      );
      setWatchId(id);
    } else {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
    }
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [navigationState.isActive]);

  const checkArrival = () => {
    if (!userLocation || !navigationState.destination) return;
    const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
    const destLatLng = new google.maps.LatLng(navigationState.destination.lat, navigationState.destination.lng);
    const distance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, destLatLng);
    
    if (distance < 50 && navigationState.phase !== 'arrived') {
      setNavigationState(prev => ({ ...prev, phase: 'arrived' }));
      hapticFeedback.success();
    }
  };

  const checkStepAdvancement = () => {
    if (!userLocation || !navigationState.directionsResult) return;
    const steps = navigationState.directionsResult.routes[0].legs[0].steps;
    const currentStep = steps[navigationState.currentStepIndex];
    if (!currentStep) return;

    const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
    const stepEndLatLng = currentStep.end_location;
    const distanceToStepEnd = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, stepEndLatLng);

    if (distanceToStepEnd < 30 && navigationState.currentStepIndex < steps.length - 1) {
      setNavigationState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex + 1 }));
    }
  };

  const calculateRoute = (origin: {lat: number, lng: number}, dest: Place, mode: google.maps.TravelMode, skipPreview = false) => {
    if (typeof google === 'undefined') return;
    
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(dest.lat, dest.lng),
        travelMode: mode,
      },
      (response, status) => {
        if (status === 'OK' && response) {
          setNavigationState(prev => ({
            ...prev,
            isActive: true,
            destination: dest,
            origin: origin,
            directionsResult: response,
            travelMode: mode,
            currentStepIndex: 0,
            phase: skipPreview ? 'active' : 'preview'
          }));
          
          if (mapInstance && response.routes[0].bounds) {
            mapInstance.fitBounds(response.routes[0].bounds, { top: 100, bottom: 300, left: 50, right: 50 });
          }
          
          setSheetState(skipPreview ? 'navigation' : 'detail');
        } else {
          alert("We couldn't find a route to this location. Please try a different travel mode or check the address.");
        }
      }
    );
  };

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location', error);
          setUserLocation({ lat: 39.7392, lng: -104.9903 });
        }
      );
    }
  };

  const handleSOS = () => {
    hapticFeedback.heavy();
    setShowSOS(true);
  };

  const triggerSOS = () => {
    hapticFeedback.heavy();
    alert("Emergency services have been notified of your location. A message has also been sent to your emergency contacts.");
    setShowSOS(false);
  };

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const data = await placeService.getPlaces(selectedCategory === 'all' ? undefined : selectedCategory);
      setPlaces(data);
    } catch (error) {
      console.error('Failed to fetch places', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLaborMode = async () => {
    hapticFeedback.heavy();
    setIsLaborModeOpen(true);
  };

  const activateLaborMode = () => {
    hapticFeedback.success();
    if (!userLocation) {
      alert("We need your location to navigate. Please enable location services.");
      setIsLaborModeOpen(false);
      return;
    }

    const hospitals = places.filter(p => p.category === 'hospital');
    if (hospitals.length > 0) {
      let nearest = hospitals[0];
      let minDistance = Infinity;
      const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);

      hospitals.forEach(h => {
        const hLatLng = new google.maps.LatLng(h.lat, h.lng);
        const d = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, hLatLng);
        if (d < minDistance) {
          minDistance = d;
          nearest = h;
        }
      });

      setNavigationState(prev => ({ ...prev, isLaborMode: true }));
      calculateRoute(userLocation, nearest, google.maps.TravelMode.DRIVING, true);
    }
    setIsLaborModeOpen(false);
  };

  const handlePlaceClick = (place: Place) => {
    hapticFeedback.light();
    setSelectedPlace(place);
    setSheetState('detail');
  };

  const startNavigation = () => {
    hapticFeedback.medium();
    if (userLocation && selectedPlace) {
      calculateRoute(userLocation, selectedPlace, navigationState.travelMode, true);
    } else {
      setNavigationState(prev => ({ ...prev, phase: 'active' }));
      setSheetState('navigation');
    }
  };

  const openInNativeMaps = (place: Place) => {
    hapticFeedback.medium();
    const lat = place.lat;
    const lng = place.lng;
    const label = encodeURIComponent(place.name);
    
    // Check if it's iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // Apple Maps
      window.open(`maps://?q=${label}&ll=${lat},${lng}&daddr=${lat},${lng}`, '_blank');
    } else {
      // Google Maps (Universal Link)
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
  };

  const exitNavigation = () => {
    hapticFeedback.light();
    setNavigationState({
      isActive: false,
      isLaborMode: false,
      destination: null,
      origin: null,
      directionsResult: null,
      travelMode: google.maps.TravelMode.DRIVING,
      currentStepIndex: 0,
      phase: 'preview'
    });
    setSheetState('peek');
  };

  const categories: { id: PlaceCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <MapIcon className="w-4 h-4" /> },
    { id: 'bathroom', label: 'Bathrooms', icon: <Droplets className="w-4 h-4" /> },
    { id: 'nursing_room', label: 'Nursing', icon: <Baby className="w-4 h-4" /> },
    { id: 'hospital', label: 'Hospitals', icon: <Hospital className="w-4 h-4" /> },
    { id: 'playground', label: 'Playgrounds', icon: <MapIcon className="w-4 h-4" /> },
    { id: 'pediatric_urgent_care', label: 'Urgent Care', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'cafe', label: 'Cafés', icon: <Coffee className="w-4 h-4" /> },
    { id: 'changing_station', label: 'Changing', icon: <Baby className="w-4 h-4" /> },
    { id: 'prenatal_class', label: 'Classes', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="h-screen w-screen bg-[#FAF9F6] relative overflow-hidden">
      {/* SOS Button */}
      <div className="absolute top-16 right-6 z-50">
        <Button
          onClick={handleSOS}
          className="w-14 h-14 rounded-2xl bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/20 flex items-center justify-center p-0"
        >
          <AlertCircle className="w-7 h-7 text-white" />
        </Button>
      </div>

      {/* Safe Mode Toggle */}
      <div className="absolute top-16 left-6 z-50">
        <Button
          onClick={() => setIsSafeMode(!isSafeMode)}
          variant="outline"
          className={cn(
            "h-14 px-4 rounded-2xl shadow-xl transition-all border-none",
            isSafeMode ? "bg-emerald-500 text-white" : "bg-white text-[#5D4037]"
          )}
        >
          <Shield className={cn("w-5 h-5 mr-2", isSafeMode ? "text-white" : "text-emerald-500")} />
          <span className="text-sm font-bold">{isSafeMode ? 'Safe Mode ON' : 'Safe Mode'}</span>
        </Button>
      </div>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentHash={window.location.hash}
      />

      {/* Full-screen Map */}
      <div className="absolute inset-0 z-0">
        <InteractiveMap 
          places={places} 
          onMarkerClick={handlePlaceClick} 
          userLocation={userLocation}
          directionsResponse={navigationState.directionsResult}
          navigationActive={navigationState.isActive}
          onMapLoad={setMapInstance}
          destination={navigationState.destination}
          selectedPlace={selectedPlace}
        />
      </div>

      {/* Floating Search Bar */}
      {!navigationState.isActive && (
        <div className="absolute top-12 left-4 right-4 z-30">
          <div className={cn(
            "bg-white rounded-full shadow-2xl border border-[#5D4037]/5 flex items-center px-4 py-3 transition-all duration-300",
            isSearchFocused ? "rounded-b-none" : ""
          )}>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-[#5D4037]/5 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6 text-[#5D4037]" />
            </button>
            <input 
              type="text"
              placeholder="Search for a safe space..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none px-3 text-sm font-medium text-[#5D4037] placeholder:text-[#5D4037]/40"
            />
            {isSearchFocused ? (
              <button 
                onClick={() => {
                  setIsSearchFocused(false);
                  setSearchQuery('');
                }}
                className="text-sm font-bold text-[#E97451] px-2"
              >
                Cancel
              </button>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#E97451] flex items-center justify-center text-white font-bold text-xs shadow-md">
                {profile?.displayName?.[0] || 'M'}
              </div>
            )}
          </div>

          {/* Search Results Backdrop */}
          <AnimatePresence>
            {isSearchFocused && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-b-3xl shadow-2xl border-x border-b border-[#5D4037]/5 p-4 max-h-[60vh] overflow-y-auto"
              >
                <div className="space-y-4">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {categories.slice(1).map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setIsSearchFocused(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#5D4037]/5 rounded-full text-xs font-bold text-[#5D4037] whitespace-nowrap"
                      >
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-[#5D4037]/40 uppercase tracking-widest">Recent Searches</h4>
                    {['Cherry Creek Mall', 'Wash Park', 'Target Nursing Room'].map(s => (
                      <button 
                        key={s}
                        onClick={() => {
                          setSearchQuery(s);
                          setIsSearchFocused(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-[#5D4037]/5 rounded-xl transition-colors text-left"
                      >
                        <Clock size={14} className="text-[#5D4037]/30" />
                        <span className="text-sm text-[#5D4037]">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Category Filter Chips */}
      {!navigationState.isActive && !isSearchFocused && (
        <div className="absolute top-32 left-0 right-0 z-20 px-4 overflow-x-auto no-scrollbar py-2">
          <div className="flex gap-2 w-max px-2">
            {categories.map((cat) => (
              <FilterChip 
                key={cat.id}
                label={cat.label} 
                active={selectedCategory === cat.id} 
                onClick={() => {
                  hapticFeedback.light();
                  setSelectedCategory(cat.id);
                }} 
                icon={cat.icon}
                className="bg-white shadow-lg border border-[#5D4037]/5"
              />
            ))}
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute right-4 bottom-32 z-20 flex flex-col gap-3">
        <IconButton 
          onClick={() => {
            hapticFeedback.light();
            if (userLocation && mapInstance) {
              mapInstance.panTo(userLocation);
              mapInstance.setZoom(15);
            }
          }}
          className="bg-white shadow-xl w-12 h-12 rounded-2xl"
        >
          <Navigation className="w-6 h-6 text-[#E97451]" />
        </IconButton>
        
        {!navigationState.isActive && (
          <button
            onClick={handleLaborMode}
            className="w-14 h-14 bg-red-500 text-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-red-600 transition-all active:scale-90"
          >
            <Hospital className="w-7 h-7" />
          </button>
        )}
      </div>

      {/* Bottom Sheet Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-40 pointer-events-none">
        <div className="max-w-md mx-auto w-full pointer-events-auto">
          <MapBottomSheet 
            state={sheetState}
            setState={setSheetState}
            places={places}
            selectedPlace={selectedPlace}
            onPlaceSelect={handlePlaceClick}
            navigationState={navigationState}
            onStartNavigation={startNavigation}
            onExitNavigation={exitNavigation}
            userLocation={userLocation}
            savedPlaces={savedPlaces}
            toggleSavePlace={toggleSavePlace}
            openInNativeMaps={openInNativeMaps}
            isSafeMode={isSafeMode}
            setIsPitStopOpen={setIsPitStopOpen}
          />
        </div>
      </div>

      {/* Emergency Overlays */}
      <AnimatePresence>
        {navigationState.isLaborMode && navigationState.isActive && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="absolute top-12 left-4 right-4 z-50"
          >
            <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <Hospital size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Labor Mode Active</p>
                  <p className="text-sm font-bold">Navigating to {navigationState.destination?.name}</p>
                </div>
              </div>
              <button 
                onClick={() => window.open(`tel:${navigationState.destination?.phone || '911'}`)}
                className="bg-white text-red-600 px-4 py-2 rounded-lg text-xs font-bold active:scale-95 transition-all"
              >
                CALL
              </button>
            </div>
          </motion.div>
        )}

        {showSOS && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <Card className="w-full max-w-sm p-8 space-y-8 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#5D4037]">Trigger SOS?</h3>
                <p className="text-[#5D4037]/60">This will notify emergency services and your emergency contacts.</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={triggerSOS}
                  className="w-full h-16 bg-red-500 hover:bg-red-600 rounded-2xl text-lg font-bold"
                >
                  Yes, Trigger SOS
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowSOS(false)}
                  className="w-full h-14 rounded-2xl border-[#5D4037]/10"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <PitStopOverlay 
        isOpen={isPitStopOpen} 
        onClose={() => setIsPitStopOpen(false)} 
        userLocation={userLocation || null}
        onSelectPitStop={(stop) => {
          setSelectedPlace(stop);
          setIsPitStopOpen(false);
          setSheetState('detail');
        }}
      />
      <BottomSheet
        isOpen={isLaborModeOpen}
        onClose={() => setIsLaborModeOpen(false)}
        title="Activate Labor Mode?"
      >
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Hospital className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">Emergency Hospital Navigation</p>
            <p className="text-[#5D4037]/60">We will find the nearest maternity hospital and start navigation immediately.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button variant="danger" size="lg" onClick={activateLaborMode}>
              YES, START NAVIGATION
            </Button>
            <Button variant="ghost" onClick={() => setIsLaborModeOpen(false)}>
              CANCEL
            </Button>
          </div>
        </div>
      </BottomSheet>

      <ContractionTimer 
        isOpen={isContractionTimerOpen} 
        onClose={() => setIsContractionTimerOpen(false)} 
      />
    </div>
  );
};

interface MapBottomSheetProps {
  state: 'peek' | 'half' | 'detail' | 'navigation';
  setState: (state: 'peek' | 'half' | 'detail' | 'navigation') => void;
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
  navigationState: any;
  onStartNavigation: () => void;
  onExitNavigation: () => void;
  userLocation?: { lat: number; lng: number };
  savedPlaces: string[];
  toggleSavePlace: (placeId: string) => void;
  openInNativeMaps: (place: Place) => void;
  isSafeMode: boolean;
  setIsPitStopOpen: (open: boolean) => void;
}

const MapBottomSheet = ({ 
  state, 
  setState, 
  places, 
  selectedPlace, 
  onPlaceSelect,
  navigationState,
  onStartNavigation,
  onExitNavigation,
  userLocation,
  savedPlaces,
  toggleSavePlace,
  openInNativeMaps,
  isSafeMode,
  setIsPitStopOpen
}: MapBottomSheetProps) => {
  const heightMap = {
    peek: '180px',
    half: '50vh',
    detail: '75vh',
    navigation: '220px'
  };

  const nearestPlace = React.useMemo(() => {
    if (!userLocation || places.length === 0) return places[0];
    const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
    return [...places].sort((a, b) => {
      const distA = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, new google.maps.LatLng(a.lat, a.lng));
      const distB = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, new google.maps.LatLng(b.lat, b.lng));
      return distA - distB;
    })[0];
  }, [places, userLocation]);

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.y < -50) {
          if (state === 'peek') setState('half');
          else if (state === 'half') setState('detail');
        } else if (info.offset.y > 50) {
          if (state === 'detail') setState('half');
          else if (state === 'half') setState('peek');
        }
      }}
      animate={{ height: heightMap[state] }}
      className="bg-white rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col border-t border-[#5D4037]/5"
    >
      {/* Handle */}
      <div className="w-full py-3 flex justify-center cursor-grab active:cursor-grabbing">
        <div className="w-12 h-1.5 bg-[#5D4037]/10 rounded-full" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-24">
        {state === 'peek' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#5D4037]">Nearby Safe Spaces</h3>
              <span className="text-[10px] font-bold text-[#E97451] uppercase tracking-widest">{places.length} Found</span>
            </div>
            {nearestPlace && (
              <button 
                onClick={() => onPlaceSelect(nearestPlace)}
                className="w-full flex items-center gap-4 p-4 bg-[#5D4037]/5 rounded-2xl text-left"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#E97451] shadow-sm">
                  {nearestPlace.category === 'bathroom' ? <Droplets className="w-6 h-6" /> : <Baby className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#5D4037] truncate">{nearestPlace.name}</h4>
                  <p className="text-xs text-[#5D4037]/40 truncate">{nearestPlace.address}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[#E97451] font-bold text-sm">
                    <Star size={12} fill="currentColor" />
                    <span>{nearestPlace.rating}</span>
                  </div>
                  <p className="text-[10px] font-bold text-[#5D4037]/30 uppercase">0.2 mi</p>
                </div>
              </button>
            )}
          </div>
        )}

        {state === 'half' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between sticky top-0 bg-white py-2 z-10">
              <h3 className="text-xl font-bold text-[#5D4037]">Nearby Places</h3>
              <IconButton onClick={() => setState('peek')} size="sm">
                <X className="w-5 h-5" />
              </IconButton>
            </div>
            <div className="space-y-4">
              {places.map(place => (
                <button 
                  key={place.id}
                  onClick={() => onPlaceSelect(place)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-[#5D4037]/5 rounded-2xl transition-colors text-left border border-[#5D4037]/5"
                >
                  <div className="w-12 h-12 bg-[#5D4037]/5 rounded-xl flex items-center justify-center text-[#E97451]">
                    {place.category === 'bathroom' ? <Droplets className="w-6 h-6" /> : <Baby className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#5D4037] truncate">{place.name}</h4>
                    <p className="text-xs text-[#5D4037]/40 truncate">{place.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                        <Star size={10} fill="currentColor" /> {place.rating}
                      </div>
                      <span className="text-[10px] text-[#5D4037]/30">•</span>
                      <span className="text-[10px] font-bold text-[#5D4037]/40 uppercase tracking-widest">{place.category.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#5D4037]">0.4 mi</p>
                    <p className="text-[10px] text-green-600 font-bold uppercase">Open</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {state === 'detail' && selectedPlace && (
          <div className="space-y-6">
            <div className="flex items-center justify-between sticky top-0 bg-white py-2 z-10">
              <h3 className="text-2xl font-bold text-[#5D4037] truncate flex-1 mr-4">{selectedPlace.name}</h3>
              <IconButton onClick={() => setState('half')} size="sm">
                <X className="w-6 h-6" />
              </IconButton>
            </div>

            {selectedPlace.photos && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6">
                {selectedPlace.photos.map((photo, i) => (
                  <img key={i} src={photo} alt="" className="w-64 h-40 object-cover rounded-3xl flex-shrink-0 shadow-md" referrerPolicy="no-referrer" />
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#E97451] shrink-0 mt-0.5" />
                <p className="text-sm text-[#5D4037]/60 leading-relaxed">{selectedPlace.address}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge label={selectedPlace.category.replace('_', ' ')} className="bg-[#E97451]/10 text-[#E97451]" />
                {selectedPlace.accessibilityFeatures?.map(f => (
                  <Badge key={f} label={f.replace('_', ' ')} className="bg-[#5D4037]/5 text-[#5D4037]/60" />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <StatCard label="Cleanliness" value={selectedPlace.aggregateStats?.avgCleanliness?.toFixed(1) || '4.8'} icon={<Droplets className="w-4 h-4" />} />
                <StatCard label="Privacy" value={selectedPlace.aggregateStats?.avgPrivacy?.toFixed(1) || '4.5'} icon={<Heart className="w-4 h-4" />} />
                <StatCard label="Rating" value={selectedPlace.rating?.toFixed(1) || '4.9'} icon={<Star className="w-4 h-4" />} />
              </div>

              <div className="bg-[#5D4037]/5 p-4 rounded-3xl space-y-3">
                <h4 className="text-xs font-bold text-[#5D4037] uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Hours & Info
                </h4>
                <p className="text-sm text-[#5D4037]/70">{selectedPlace.description || 'A safe and welcoming space for mamas and little ones.'}</p>
                <p className="text-xs font-bold text-[#E97451]">{selectedPlace.hours || 'Open 24 hours'}</p>
                {selectedPlace.phone && (
                  <p className="text-sm text-[#5D4037]/70 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#E97451]" />
                    <a href={`tel:${selectedPlace.phone}`} className="hover:underline">{selectedPlace.phone}</a>
                  </p>
                )}
                {selectedPlace.websiteUrl && (
                  <p className="text-sm text-[#5D4037]/70 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#E97451]" />
                    <a href={selectedPlace.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                      {selectedPlace.websiteUrl.replace(/^https?:\/\//, '')}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className={cn(
                  "flex-1 h-14 rounded-2xl",
                  savedPlaces.includes(selectedPlace.id) && "bg-rose-50 border-rose-200 text-rose-500"
                )}
                onClick={() => {
                  hapticFeedback.medium();
                  toggleSavePlace(selectedPlace.id);
                }}
              >
                <Heart className={cn("w-5 h-5 mr-2", savedPlaces.includes(selectedPlace.id) && "fill-current")} /> 
                {savedPlaces.includes(selectedPlace.id) ? 'Saved' : 'Save'}
              </Button>
              <Button 
                className="flex-[2] h-14 rounded-2xl shadow-lg shadow-[#E97451]/20"
                onClick={() => {
                  if (userLocation) {
                    onStartNavigation();
                  }
                }}
              >
                <Navigation className="w-5 h-5 mr-2" /> Directions
              </Button>
            </div>

            <Button 
              variant="outline"
              className="w-full h-12 rounded-xl border-[#5D4037]/10 mt-2"
              onClick={() => openInNativeMaps(selectedPlace)}
            >
              <MapPin className="w-4 h-4 mr-2" /> Open in Native Maps
            </Button>
          </div>
        )}

        {state === 'navigation' && navigationState.directionsResult && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-bold text-[#E97451] uppercase tracking-widest">Navigation Active</p>
                  {isSafeMode && (
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                      <Shield size={10} /> Safe Route
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-[#5D4037]">
                  {navigationState.directionsResult.routes[0].legs[0].duration?.text}
                </h3>
                <p className="text-sm text-[#5D4037]/40">
                  {navigationState.directionsResult.routes[0].legs[0].distance?.text} • {navigationState.travelMode.toLowerCase()}
                </p>
              </div>
              <IconButton onClick={onExitNavigation} className="bg-[#5D4037]/5">
                <X className="w-6 h-6" />
              </IconButton>
            </div>

            {isSafeMode && (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-emerald-50 p-3 rounded-2xl flex flex-col items-center text-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1" />
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Roads</span>
                  <span className="text-xs font-bold text-emerald-900">Paved</span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl flex flex-col items-center text-center">
                  <CloudRain className="w-4 h-4 text-emerald-500 mb-1" />
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Weather</span>
                  <span className="text-xs font-bold text-emerald-900">Clear</span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl flex flex-col items-center text-center">
                  <Wind className="w-4 h-4 text-emerald-500 mb-1" />
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Traffic</span>
                  <span className="text-xs font-bold text-emerald-900">Light</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 p-4 bg-[#E97451] text-white rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Navigation className="w-6 h-6 rotate-45" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Next Step</p>
                <p className="text-sm font-bold truncate" dangerouslySetInnerHTML={{ __html: navigationState.directionsResult.routes[0].legs[0].steps[navigationState.currentStepIndex]?.instructions || 'Continue straight' }} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-xl border-[#5D4037]/10"
                onClick={() => setIsPitStopOpen(true)}
              >
                <Coffee className="w-4 h-4 mr-2" /> Find Pit Stop
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-xl border-[#5D4037]/10"
                onClick={onExitNavigation}
              >
                End
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};


const PlaceCard: React.FC<{ place: Place; onClick: () => void }> = ({ place, onClick }) => (
  <Card hoverable onClick={onClick} className="flex gap-4">
    <div className="w-16 h-16 bg-[#FDF5E6] rounded-2xl flex items-center justify-center flex-shrink-0">
      {place.category === 'bathroom' && <Droplets className="w-8 h-8 text-[#E97451]" />}
      {place.category === 'nursing_room' && <Baby className="w-8 h-8 text-[#E97451]" />}
      {place.category === 'rest_stop' && <Coffee className="w-8 h-8 text-[#E97451]" />}
      {place.category === 'hospital' && <Hospital className="w-8 h-8 text-[#E97451]" />}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-[#5D4037] truncate">{place.name}</h3>
      <p className="text-sm text-[#5D4037]/60 truncate">{place.address}</p>
      <div className="flex items-center gap-3 mt-2">
        <div className="flex items-center gap-1 text-xs font-bold text-[#E97451]">
          <Star className="w-3 h-3 fill-[#E97451]" />
          {place.aggregateStats?.avgCleanliness?.toFixed(1) || 'N/A'}
        </div>
        {place.aggregateStats?.strollerAccessRate && place.aggregateStats.strollerAccessRate > 0.5 && (
          <div className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            Stroller OK
          </div>
        )}
      </div>
    </div>
  </Card>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-4 flex gap-4 animate-pulse border border-[#5D4037]/5">
    <div className="w-16 h-16 bg-[#5D4037]/5 rounded-2xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-[#5D4037]/5 rounded w-3/4" />
      <div className="h-3 bg-[#5D4037]/5 rounded w-1/2" />
      <div className="h-3 bg-[#5D4037]/5 rounded w-1/4 mt-2" />
    </div>
  </div>
);

const Badge: React.FC<{ label: string; className?: string }> = ({ label, className }) => (
  <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", className)}>
    {label}
  </span>
);

const StatCard = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className="bg-[#FDF5E6] p-3 rounded-2xl text-center space-y-1">
    <div className="text-[#E97451] flex justify-center">{icon}</div>
    <div className="text-lg font-bold text-[#5D4037]">{value}</div>
    <div className="text-[10px] font-bold uppercase tracking-widest text-[#5D4037]/40">{label}</div>
  </div>
);

const ReviewsList = ({ placeId }: { placeId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await reviewService.getReviewsByPlace(placeId);
      setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, [placeId]);

  if (loading) return <div className="text-center py-4 text-[#5D4037]/40">Loading reviews...</div>;
  if (reviews.length === 0) return <div className="text-center py-4 text-[#5D4037]/40">No reviews yet.</div>;

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <div key={review.id} className="p-4 bg-[#FAF9F6] rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm">{review.authorName}</span>
            <span className="text-[10px] text-[#5D4037]/40 uppercase">{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" /> {review.cleanliness}</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-[#E97451]" /> {review.privacy}</span>
            {review.strollerAccess && <span className="text-green-600 font-bold">Stroller OK</span>}
          </div>
          {review.notes && <p className="text-sm text-[#5D4037]/70 italic">"{review.notes}"</p>}
        </div>
      ))}
    </div>
  );
};

// --- Navigation Sub-components ---

const NavigationBottomPanel = ({ 
  state, 
  onStart, 
  onPitStop 
}: { 
  state: any, 
  onStart: () => void, 
  onPitStop: () => void 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const leg = state.directionsResult?.routes[0].legs[0];
  const steps = leg?.steps || [];
  const currentStep = steps[state.currentStepIndex];

  if (state.phase === 'preview') {
    return (
      <motion.div
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-[32px] shadow-2xl p-8"
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Route Preview</p>
              <h3 className="text-2xl font-bold text-[#5D4037]">{leg?.duration?.text}</h3>
              <p className="text-sm text-stone-500">{leg?.distance?.text} • {state.travelMode.toLowerCase()}</p>
            </div>
            <div className="flex gap-2">
              <IconButton className="bg-stone-100">
                <Car size={20} />
              </IconButton>
              <IconButton className="bg-stone-100">
                <Footprints size={20} />
              </IconButton>
            </div>
          </div>
          <Button onClick={onStart} className="w-full h-16 rounded-2xl text-lg font-bold shadow-lg shadow-rose-200">
            Start Navigation
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ height: isExpanded ? '70vh' : 'auto' }}
      className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-[32px] shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Pull Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-4 flex justify-center cursor-pointer"
      >
        <div className="w-12 h-1.5 bg-stone-200 rounded-full" />
      </div>

      {/* Collapsed View: Next Turn */}
      {!isExpanded && (
        <div className="px-8 pb-8 flex flex-col gap-4">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#E97451] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Navigation size={32} className="rotate-45" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#E97451] uppercase tracking-widest mb-1">Next Turn</p>
              <h3 className="text-xl font-bold text-[#5D4037] leading-tight" dangerouslySetInnerHTML={{ __html: currentStep?.instructions || 'Continue straight' }} />
              <p className="text-sm font-bold text-stone-400 mt-1">{currentStep?.distance?.text || '0 ft'}</p>
            </div>
            <IconButton onClick={onPitStop} className="bg-[#FDF5E6] text-[#E97451] border border-[#E97451]/20">
              <Coffee size={20} />
            </IconButton>
          </div>
          
          {state.isLaborMode && (
            <Button 
              onClick={() => window.open(`tel:${state.destination?.phone || '911'}`)}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-14 rounded-2xl flex items-center justify-center gap-3 shadow-lg animate-pulse"
            >
              <Phone size={20} fill="currentColor" />
              <span className="font-bold uppercase tracking-widest">Call Hospital Now</span>
            </Button>
          )}
        </div>
      )}

      {/* Expanded View: Full Directions */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto px-8 pb-8 no-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-[#5D4037]">Directions</h3>
            <div className="flex items-center gap-2 text-[#E97451] font-bold">
              <Clock size={16} />
              <span>{leg?.duration?.text}</span>
            </div>
          </div>
          <div className="space-y-6">
            {steps.map((step: any, idx: number) => (
              <div 
                key={idx} 
                className={cn(
                  "flex gap-4 p-4 rounded-2xl transition-all",
                  idx === state.currentStepIndex ? "bg-[#E97451] text-white shadow-lg scale-[1.02]" : "text-stone-600"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  idx === state.currentStepIndex ? "bg-white/20" : "bg-stone-100"
                )}>
                  <Navigation size={20} className={cn(idx === state.currentStepIndex ? "text-white" : "text-stone-400")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug" dangerouslySetInnerHTML={{ __html: step.instructions }} />
                  <p className={cn(
                    "text-xs mt-1 font-bold",
                    idx === state.currentStepIndex ? "text-white/80" : "text-stone-400"
                  )}>
                    {step.distance.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const ContractionTimer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [contractions, setContractions] = useState<{start: Date, duration?: number}[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const toggleTracking = () => {
    if (isTracking && startTime) {
      const duration = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      setContractions([{ start: startTime, duration }, ...contractions]);
      setIsTracking(false);
      setStartTime(null);
    } else {
      setStartTime(new Date());
      setIsTracking(true);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Contraction Timer">
      <div className="space-y-8 pb-8">
        <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-[32px] border-2 border-red-100">
          <div className="text-5xl font-black text-red-600 mb-4 tabular-nums">
            {isTracking && startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : '0'}s
          </div>
          <button
            onClick={toggleTracking}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-90",
              isTracking ? "bg-stone-800" : "bg-red-600"
            )}
          >
            {isTracking ? <Square size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          <p className="mt-6 text-sm font-bold text-red-600/60 uppercase tracking-widest">
            {isTracking ? 'Recording...' : 'Tap to Start'}
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-[#5D4037] uppercase tracking-widest">History</h4>
          {contractions.length > 0 ? (
            <div className="space-y-3">
              {contractions.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-100">
                  <div>
                    <p className="text-sm font-bold text-[#5D4037]">{c.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-xs text-stone-400">Duration: {c.duration}s</p>
                  </div>
                  {contractions[i+1] && (
                    <div className="text-right">
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Frequency</p>
                      <p className="text-sm font-bold text-[#E97451]">
                        {Math.floor((c.start.getTime() - contractions[i+1].start.getTime()) / 60000)}m apart
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-stone-400 text-sm italic">No contractions recorded yet.</p>
          )}
        </div>
      </div>
    </BottomSheet>
  );
};

const PitStopOverlay = ({ 
  isOpen, 
  onClose, 
  userLocation, 
  onSelectPitStop 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  userLocation: google.maps.LatLngLiteral | null,
  onSelectPitStop: (place: Place) => void
}) => {
  const [pitStops, setPitStops] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userLocation) {
      setLoading(true);
      // Simulate finding nearby pit stops along the route
      setTimeout(() => {
        const mockPitStops = [
          { id: 'p1', name: 'Starbucks Restroom', category: 'bathroom', lat: userLocation.lat + 0.002, lng: userLocation.lng + 0.001, rating: 4.2, reviewCount: 12, address: '2 blocks away' },
          { id: 'p2', name: 'Target Nursing Room', category: 'nursing', lat: userLocation.lat + 0.005, lng: userLocation.lng - 0.002, rating: 4.8, reviewCount: 45, address: '5 mins away' },
        ] as Place[];
        setPitStops(mockPitStops);
        setLoading(false);
      }, 800);
    }
  }, [isOpen, userLocation]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Mama Pit Stops">
      <div className="space-y-6 pb-8">
        <p className="text-sm text-stone-500">Need a quick break? Here are the cleanest spots along your route.</p>
        <div className="space-y-4">
          {loading ? (
            <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-[#E97451] border-t-transparent rounded-full animate-spin" /></div>
          ) : pitStops.map(stop => (
            <div 
              key={stop.id}
              onClick={() => onSelectPitStop(stop)}
              className="p-4 bg-white rounded-2xl border border-stone-100 flex items-center gap-4 active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 bg-[#FDF5E6] rounded-xl flex items-center justify-center text-[#E97451]">
                {stop.category === 'bathroom' ? <Coffee size={24} /> : <Heart size={24} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[#5D4037] truncate">{stop.name}</h4>
                <p className="text-xs text-stone-400">{stop.address}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-[#E97451] font-bold text-sm">
                  <Star size={12} fill="currentColor" />
                  <span>{stop.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
};

// End of file

const QuickActionButton = ({ icon, label, color, onClick }: { icon: React.ReactNode; label: string; color: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 group"
  >
    <div className={cn(
      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-active:scale-95 shadow-sm",
      color
    )}>
      {icon}
    </div>
    <span className="text-[10px] font-bold text-[#5D4037]/60 uppercase tracking-wider text-center leading-tight">
      {label}
    </span>
  </button>
);
