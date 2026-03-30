export type UserStage = 'pregnant' | 'newborn_0_3' | 'infant_3_6' | 'baby_6_12' | 'toddler_1_3' | 'preschooler_3_plus' | 'partner' | 'grandparent';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  stage: UserStage;
  dueDate?: string;
  comfortRoutingEnabled: boolean;
  darkMode?: boolean;
  locationServices?: boolean;
  pushNotifications?: boolean;
  babyInfo?: {
    name: string;
    birthDate: string;
    pediatrician: string;
  };
  linkedPartner?: string;
  favorites?: {
    places: string[];
    services: string[];
  };
  badges?: Badge[];
  onboarded?: boolean;
  interests?: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export type PlaceCategory = 
  | 'bathroom' 
  | 'nursing_room' 
  | 'hospital' 
  | 'playground' 
  | 'pediatric_urgent_care' 
  | 'cafe' 
  | 'changing_station' 
  | 'prenatal_class'
  | 'rest_stop';

export interface Place {
  id: string;
  name: string;
  address: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  source: string;
  rating: number;
  reviewCount: number;
  description?: string;
  hours?: string;
  phone?: string;
  websiteUrl?: string;
  photos?: string[];
  accessibilityFeatures?: string[];
  aggregateStats?: {
    avgCleanliness: number;
    avgPrivacy: number;
    strollerAccessRate: number;
    reviewCount: number;
  };
}

export interface Review {
  id: string;
  placeId: string;
  authorUid: string;
  authorName: string;
  rating: number;
  cleanliness: number;
  privacy: number;
  strollerAccess: boolean;
  notes: string;
  createdAt: string;
  helpfulCount?: number;
}

export interface Service {
  id: string;
  name: string;
  category: 'babysitting' | 'pediatrician' | 'therapist' | 'exercise' | 'lactation' | 'birth_services' | 'sleep_consultant';
  description: string;
  rating: number;
  reviewCount: number;
  phone: string;
  email: string;
  websiteUrl?: string;
  hours?: string;
  address: string;
  coordinates: { lat: number; lng: number };
  specializations?: string[];
  languages?: string[];
  insuranceAccepted?: string[];
  pricing?: {
    range: '$' | '$$' | '$$$';
    estimate?: string;
    details?: string;
  };
  availability?: string;
  verificationBadges?: string[];
  imageUrl: string;
  photos?: string[];
  reviews?: UserReview[];
  createdDate: string;
  distance?: string; // For UI convenience
}

export interface UserReview {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  text: string;
  images?: string[];
  helpfulCount: number;
  verifiedBooking: boolean;
  createdDate: string;
  providerResponse?: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorColor: string;
  category: string;
  upvotes: number;
  downvotes: number;
  comments: CommunityComment[];
  createdDate: string;
  updatedDate: string;
  isModerated: boolean;
  flags: string[];
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdDate: string;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  category?: string;
  icon?: string;
}

export interface Resource {
  id: string;
  title: string;
  category: 'first_timer' | 'basics' | 'recovery' | 'sleep' | 'safety';
  description: string;
  content: string;
  imageUrl: string;
  link?: string;
}

export interface SleepLog {
  id: string;
  userId: string;
  babyName: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface Contraction {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: number; // seconds
  interval?: number; // seconds since last contraction
  intensity: 1 | 2 | 3 | 4 | 5;
}

export interface KickCount {
  id: string;
  startTime: string;
  endTime: string;
  count: number;
  duration: number; // minutes
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  location: string;
  notes?: string;
  type: 'prenatal' | 'ultrasound' | 'pediatric' | 'other';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
