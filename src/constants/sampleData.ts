import { Place, Review } from '../types';

export const TIPS = [
  "Week 34: Your baby is the size of a cantaloupe 🍈",
  "Don't forget to stay hydrated today, Mama! 💧",
  "Week 28: Baby is the size of an eggplant 🍆",
  "Baby can now open and close their eyes. 👀",
  "Try some gentle prenatal yoga to ease back pain. 🧘",
  "Week 32: Baby is the size of a squash 🥒",
  "Pack your hospital bag early to stay prepared. 🎒",
  "Week 36: Baby is the size of a papaya 🥭",
  "Sleep on your side for better circulation. 😴",
  "Week 40: Baby is the size of a pumpkin! 🎃",
  "Take a deep breath. You're doing great! ✨",
  "Week 12: Baby is the size of a lime 🍋",
  "Week 20: Baby is the size of a banana 🍌",
  "Week 24: Baby is the size of a corn on the cob 🌽",
  "Keep those prenatal vitamins going! 💊",
  "Week 16: Baby is the size of an avocado 🥑",
  "Talk to your baby - they can hear you now! 🗣️",
  "Week 30: Baby is the size of a cabbage 🥬",
  "Rest your feet whenever you can. 👣",
  "Week 38: Baby is the size of a winter melon 🍈",
  "You're almost there, Mama! 🧡"
];

export const BADGES = [
  { id: 'first_steps', name: 'First Steps', icon: '🏁', description: 'Open the app for the first time' },
  { id: 'explorer', name: 'Explorer', icon: '📍', description: 'View 10 different places on the map' },
  { id: 'reviewer', name: 'Reviewer', icon: '⭐', description: 'Leave your first review' },
  { id: 'storyteller', name: 'Storyteller', icon: '📝', description: 'Write 5 reviews' },
  { id: 'on_fire', name: 'On Fire', icon: '🔥', description: '7-day check-in streak' },
  { id: 'unstoppable', name: 'Unstoppable', icon: '🔥🔥', description: '30-day check-in streak' },
  { id: 'milk_maven', name: 'Milk Maven', icon: '🍼', description: 'Save 3 nursing rooms to favorites' },
  { id: 'prepared', name: 'Prepared', icon: '🏥', description: 'Set up emergency contacts and hospital' },
  { id: 'new_chapter', name: 'New Chapter', icon: '👶', description: 'Switch from Pregnant to New Parent mode' },
  { id: 'memory_maker', name: 'Memory Maker', icon: '📸', description: 'Upload 4 weekly bump photos' },
  { id: 'self_care_queen', name: 'Self Care Queen', icon: '🧘', description: 'Book 3 services' },
  { id: 'sleep_expert', name: 'Sleep Expert', icon: '💤', description: 'Log 7 sleep sessions' },
  { id: 'sound_mixer', name: 'Sound Mixer', icon: '🎵', description: 'Create a 3-sound sleep mix' },
  { id: 'community_star', name: 'Community Star', icon: '🤝', description: 'Get 10 likes on community posts' },
  { id: 'sharing_is_care', name: 'Sharing is Caring', icon: '💌', description: 'Invite a partner or friend' },
  { id: 'navigator', name: 'Navigator', icon: '🗺️', description: 'Use in-app navigation 5 times' },
  { id: 'night_owl', name: 'Night Owl', icon: '🌙', description: 'Use the sleep player after 10pm' },
  { id: 'data_mama', name: 'Data Mama', icon: '📊', description: "Log baby's weight 4 times" },
  { id: 'milestone_master', name: 'Milestone Master', icon: '🎯', description: 'Check off 10 baby milestones' },
  { id: 'pro', name: 'MamaNav Pro', icon: '🏆', description: 'Earn 15 other badges' }
];

export const NOTIFICATIONS = [
  { id: '1', title: 'Appointment Reminder', body: 'Your appointment with Dr. Sarah Chen is tomorrow at 10am', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false, type: 'appointment' },
  { id: '2', title: 'Weekly Milestone', body: 'Week 35! Your baby weighs about 5.3 lbs now', timestamp: new Date(Date.now() - 86400000).toISOString(), read: false, type: 'milestone' },
  { id: '3', title: 'Review Prompt', body: 'You visited Union Station Restrooms yesterday — leave a review?', timestamp: new Date(Date.now() - 172800000).toISOString(), read: true, type: 'review' },
  { id: '4', title: 'Badge Unlocked!', body: "You just unlocked 'Explorer'!", timestamp: new Date(Date.now() - 259200000).toISOString(), read: true, type: 'badge' },
  { id: '5', title: 'Community Reply', body: 'Sarah replied to your post about stroller trails', timestamp: new Date(Date.now() - 345600000).toISOString(), read: true, type: 'community' },
  { id: '6', title: 'New Place Added', body: 'A new nursing room was added near you: Whole Foods Capitol Hill', timestamp: new Date(Date.now() - 432000000).toISOString(), read: true, type: 'place' }
];

export const COMMUNITY_POSTS = [
  { id: '1', author: 'MamaBear', authorInitial: 'M', title: 'Best stroller-friendly hiking trails near Denver?', body: 'Looking for some fresh air but need paths that aren\'t too rocky for my Uppababy. Any suggestions within 30 mins of the city?', category: 'Recommendations', likes: 47, comments: 23, time: '2h ago' },
  { id: '2', author: 'StrollerQueen', authorInitial: 'S', title: 'ISO: Gently used Uppababy Vista — Capitol Hill area', body: 'Our family is growing and we need a double stroller! If anyone is selling their Vista please let me know.', category: 'Buy/Sell', likes: 12, comments: 8, time: '4h ago' },
  { id: '3', author: 'ParkMama', authorInitial: 'P', title: 'Playground meetup this Saturday at Washington Park! 🎉', body: 'Meeting near the big playground at 10am. All ages welcome, let\'s get the kids some social time!', category: 'Meetups', likes: 31, comments: 15, time: '6h ago' },
  { id: '4', author: 'SleepyHead', authorInitial: 'S', title: 'Any moms dealing with 4-month sleep regression? Tips??', body: 'My little one was sleeping 6 hours and now we are back to every 2 hours. I am exhausted. What worked for you?', category: 'Questions', likes: 63, comments: 41, time: '1d ago' },
  { id: '5', author: 'GlowingMama', authorInitial: 'G', title: 'Just hit 30 weeks today! 🎉🤰', body: 'Feeling heavy but so excited to meet this little human. 10 weeks to go!', category: 'Milestones', likes: 89, comments: 34, time: '1d ago' },
  { id: '6', author: 'HealthyMama', authorInitial: 'H', title: 'Dr. Chen saved us during a scary fever episode — highly recommend', body: 'She was so calm and responsive even after hours. If you need a pediatrician in Denver, she is the one.', category: 'Recommendations', likes: 55, comments: 18, time: '2d ago' },
  { id: '7', author: 'YogaLover', authorInitial: 'Y', title: 'Postpartum yoga at the studio on Pearl St is AMAZING', body: 'They have a dedicated class for new moms and it has been so good for my mental health.', category: 'Recommendations', likes: 38, comments: 12, time: '2d ago' },
  { id: '8', author: 'NewbieMama', authorInitial: 'N', title: 'Where do you find affordable childcare in the Highlands area?', body: 'Starting to look for when I go back to work in 3 months. Everything seems so expensive!', category: 'Questions', likes: 44, comments: 27, time: '3d ago' },
  { id: '9', author: 'EcoMama', authorInitial: 'E', title: 'Free baby clothes giveaway! Sizes 0-6 months, DM me', body: 'Cleaning out the nursery and have a big bag of organic cotton onesies and sleepers.', category: 'Buy/Sell', likes: 25, comments: 19, time: '3d ago' },
  { id: '10', author: 'CoffeeAddict', authorInitial: 'C', title: 'Weekly new moms coffee meetup — every Tuesday at Little Owl Coffee', body: 'Come hang out, drink caffeine, and vent about diaper blowouts.', category: 'Meetups', likes: 52, comments: 22, time: '4d ago' },
  { id: '11', author: 'TargetMama', authorInitial: 'T', title: 'My water broke at Target and the staff was INCREDIBLE 😂', body: 'Not how I planned it, but they were so helpful and even gave me a free pack of diapers on the way out!', category: 'Milestones', likes: 112, comments: 56, time: '4d ago' },
  { id: '12', author: 'NursingPro', authorInitial: 'N', title: 'Lactation consultant recommendations? Insurance-covered preferred', body: 'Having some latch issues and want to get professional help before I give up.', category: 'Questions', likes: 36, comments: 20, time: '5d ago' },
  { id: '13', author: 'MallWalker', authorInitial: 'M', title: 'Cherry Creek Mall nursing room is newly renovated — so much nicer now!', body: 'They added comfortable rockers and dimmable lights. A great spot if you are out shopping.', category: 'Recommendations', likes: 41, comments: 11, time: '5d ago' },
  { id: '14', author: 'ProudWife', authorInitial: 'P', title: 'Partner appreciation post: my husband learned to swaddle from YouTube 🥹', body: 'He is now the designated swaddle master in this house.', category: 'Milestones', likes: 95, comments: 29, time: '6d ago' },
  { id: '15', author: 'FitMama', authorInitial: 'F', title: 'Anyone tried the Fit Mom Online postnatal program? Worth the price?', body: 'Thinking about signing up but want to know if the workouts are actually manageable with a baby.', category: 'Questions', likes: 28, comments: 16, time: '1w ago' }
];

export const EVENTS = [
  { id: 'e1', title: 'Baby Story Time', date: 'Wednesdays 10am', location: 'Denver Public Library', description: 'Interactive stories and songs for babies and caregivers.', type: 'event' },
  { id: 'e2', title: 'Stroller Strides Free Trial', date: 'Saturday 9am', location: 'City Park', description: 'A total body workout with your little one in the stroller.', type: 'fitness' },
  { id: 'e3', title: 'Denver Zoo Free Day', date: 'November 15', location: 'Denver Zoo', description: 'Free admission for all families. Expect crowds!', type: 'event' },
  { id: 'e4', title: 'New Mom Support Circle', date: 'Tuesdays 2pm', location: 'Mindful Motherhood', description: 'A safe space to share the ups and downs of new parenthood.', type: 'support' },
  { id: 'e5', title: 'Prenatal Yoga in the Park', date: 'Sundays 8am', location: 'Cheesman Park', description: 'Gentle flow to prepare your body for birth.', type: 'fitness' },
  { id: 'e6', title: 'Kids\' Farmers Market', date: 'First Sat of month', location: 'Union Station', description: 'Special activities and samples for the little ones.', type: 'event' },
  { id: 'e7', title: 'Car Seat Safety Check', date: 'Every 3rd Thursday', location: 'Fire Station 1', description: 'Ensure your seat is installed correctly by professionals.', type: 'safety' },
  { id: 'e8', title: 'Babywearing Group Meet', date: 'Fridays 11am', location: 'Novo Coffee', description: 'Learn new carries and try out different wraps.', type: 'support' }
];

export const SOUNDS = [
  { id: 's1', name: 'White Noise', category: 'Static', duration: '∞', icon: '☁️' },
  { id: 's2', name: 'Rainfall', category: 'Nature', duration: '∞', icon: '🌧️' },
  { id: 's3', name: 'Heartbeat', category: 'Body', duration: '∞', icon: '💓' },
  { id: 's4', name: 'Ocean Waves', category: 'Nature', duration: '∞', icon: '🌊' },
  { id: 's5', name: 'Lullaby', category: 'Music', duration: '5:00', icon: '🎵' },
  { id: 's6', name: 'Forest Birds', category: 'Nature', duration: '∞', icon: '🐦' },
  { id: 's7', name: 'Fan', category: 'Static', duration: '∞', icon: '🌀' },
  { id: 's8', name: 'Vacuum', category: 'Static', duration: '∞', icon: '🧹' },
  { id: 's9', name: 'Womb Sounds', category: 'Body', duration: '∞', icon: '🤰' }
];

export const PREGNANCY_JOURNEY = Array.from({ length: 40 }, (_, i) => {
  const week = i + 1;
  let size = "Poppy seed";
  let emoji = "🌱";
  let fact = "Baby is just starting to develop.";
  
  if (week === 12) { size = "Lime"; emoji = "🍋"; fact = "Baby's kidneys are starting to produce urine."; }
  if (week === 20) { size = "Banana"; emoji = "🍌"; fact = "You're halfway there! Baby can now swallow."; }
  if (week === 28) { size = "Eggplant"; emoji = "🍆"; fact = "Baby can now open and close their eyes."; }
  if (week === 34) { size = "Cantaloupe"; emoji = "🍈"; fact = "Baby's lungs are nearly fully developed."; }
  if (week === 40) { size = "Pumpkin"; emoji = "🎃"; fact = "Baby is ready to meet the world!"; }

  return {
    week,
    size,
    emoji,
    fact,
    tip: `Tip for week ${week}: Stay active and eat well!`,
    mood: null
  };
});

export const BABY_JOURNEY = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  return {
    month,
    milestones: [
      { id: `m${month}-1`, text: "Smiles back at you", completed: false },
      { id: `m${month}-2`, text: "Rolls over", completed: false }
    ],
    weight: null,
    height: null,
    photo: null
  };
});
