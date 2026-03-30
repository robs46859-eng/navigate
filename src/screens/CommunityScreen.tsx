import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ThumbsUp, Share2, Search, PlusCircle, Filter, Menu } from 'lucide-react';
import { MOCK_COMMUNITY_POSTS } from '../constants/mockData';
import { CommunityPost } from '../types';
import { cn, formatDate } from '../lib/utils';
import { IconButton } from '../components/ui/IconButton';
import { Sidebar } from '../components/Sidebar';
import { hapticFeedback } from '../lib/haptics';
import { Button } from '../components/ui/Button';

const CommunityScreen: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'events'>('feed');

  const categories = ['All', 'Outdoors', 'Health', 'Tips', 'Meetup', 'Exercise', 'Sleep', 'Food', 'Safety', 'Pregnancy', 'Activities', 'Community'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const handleUpvote = (postId: string) => {
    hapticFeedback.light();
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { ...post, upvotes: post.upvotes + 1 } 
          : post
      )
    );
  };

  const handleShare = async (post: CommunityPost) => {
    hapticFeedback.light();
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  return (
    <div className="pb-20 pt-4 px-4 bg-stone-50 min-h-screen">
      <header className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-stone-800">Community</h1>
          <button 
            onClick={() => alert("Create Post functionality coming soon!")}
            className="p-2 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-colors"
          >
            <PlusCircle size={24} />
          </button>
        </div>

        <div className="flex gap-6 border-b border-stone-200 mb-6">
          {(['feed', 'groups', 'events'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-3 text-xs font-bold uppercase tracking-widest transition-all relative",
                activeTab === tab ? "text-rose-500" : "text-stone-400"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeCommunityTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500" 
                />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'feed' && (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm"
              />
            </div>

            <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-rose-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </>
        )}
      </header>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${post.authorColor}`}>
                      {post.authorAvatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-800">{post.authorName}</h3>
                      <div className="flex items-center gap-2 text-xs text-stone-400">
                        <span>{formatDate(post.createdDate)}</span>
                        <span>•</span>
                        <span className="text-rose-500 font-medium">{post.category}</span>
                      </div>
                    </div>
                  </div>

                  <h2 className="font-bold text-stone-800 mb-2 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-stone-600 mb-4 leading-relaxed text-sm">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-50">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleUpvote(post.id)}
                        className="flex items-center gap-1.5 text-stone-500 hover:text-rose-500 transition-colors group"
                      >
                        <ThumbsUp size={18} className="group-active:scale-125 transition-transform" />
                        <span className="text-sm font-medium">{post.upvotes}</span>
                      </button>
                      <button 
                        onClick={() => alert("Comments functionality coming soon!")}
                        className="flex items-center gap-1.5 text-stone-500 hover:text-rose-500 transition-colors"
                      >
                        <MessageCircle size={18} />
                        <span className="text-sm font-medium">{post.comments.length}</span>
                      </button>
                    </div>
                    <button 
                      onClick={() => handleShare(post)}
                      className="text-stone-400 hover:text-rose-500 transition-colors"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}

              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-stone-400" size={32} />
                  </div>
                  <h3 className="text-stone-800 font-semibold mb-1">No posts found</h3>
                  <p className="text-stone-500 text-sm">Try a different search or category</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'groups' && (
            <motion.div
              key="groups"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-rose-500 rounded-2xl p-6 text-white mb-6">
                <h3 className="text-lg font-bold mb-2">Find Your Tribe</h3>
                <p className="text-rose-100 text-sm mb-4">Join local groups based on your interests, location, or baby's age.</p>
                <button 
                  onClick={() => alert("Browse Groups functionality coming soon!")}
                  className="px-4 py-2 bg-white text-rose-500 rounded-xl text-sm font-bold"
                >
                  Browse All Groups
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'New Mamas NYC', members: 1240, icon: '🏙️' },
                  { name: 'Sleep Training', members: 850, icon: '😴' },
                  { name: 'Postpartum Yoga', members: 420, icon: '🧘' },
                  { name: 'Toddler Playdates', members: 630, icon: '🧸' }
                ].map((group, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                    <div className="text-2xl mb-2">{group.icon}</div>
                    <h4 className="font-bold text-stone-800 text-sm mb-1">{group.name}</h4>
                    <p className="text-[10px] text-stone-400 uppercase font-bold">{group.members} members</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-stone-800">Upcoming Events</h3>
                <button 
                  onClick={() => alert("Calendar functionality coming soon!")}
                  className="text-rose-500 text-xs font-bold uppercase tracking-widest"
                >
                  View Calendar
                </button>
              </div>

              {[
                { title: 'Stroller Walk in Central Park', date: 'Tomorrow, 10:00 AM', location: 'Central Park South', attendees: 12 },
                { title: 'Breastfeeding Support Group', date: 'Wed, Mar 18, 2:00 PM', location: 'Maternal Health Center', attendees: 8 },
                { title: 'Mom & Baby Yoga', date: 'Sat, Mar 21, 11:00 AM', location: 'Zen Studio', attendees: 15 }
              ].map((event, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex gap-4">
                  <div className="w-12 h-12 bg-stone-100 rounded-xl flex flex-col items-center justify-center text-stone-500">
                    <span className="text-[10px] font-bold uppercase">Mar</span>
                    <span className="text-lg font-bold leading-none">{16 + i * 2}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-800 text-sm mb-1">{event.title}</h4>
                    <p className="text-xs text-stone-500 mb-1">{event.date}</p>
                    <p className="text-[10px] text-stone-400">{event.location} • {event.attendees} attending</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommunityScreen;
