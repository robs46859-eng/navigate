import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, LogOut, Shield, HelpCircle, Bell, Menu, Database, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { Sidebar } from '../components/Sidebar';
import { UserStage } from '../types';

export const SettingsScreen = () => {
  const { profile, refreshProfile } = useApp();
  const [stage, setStage] = useState<UserStage>(profile?.stage || 'pregnant');
  const [dueDate, setDueDate] = useState(profile?.dueDate || '');
  const [comfortToggle, setComfortToggle] = useState(profile?.comfortRoutingEnabled ?? true);
  const [saving, setSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ingestQuery, setIngestQuery] = useState('');
  const [ingestCategory, setIngestCategory] = useState('bathroom');
  const [ingesting, setIngesting] = useState(false);

  const handleIngest = async () => {
    if (!ingestQuery) return;
    setIngesting(true);
    try {
      const response = await fetch('/api/admin/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: ingestQuery, category: ingestCategory })
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Success: ${data.message}`);
        setIngestQuery('');
      } else {
        alert(`Error: ${data.error} - ${data.message}`);
      }
    } catch (error) {
      console.error('Ingestion failed', error);
      alert('Failed to connect to ingestion service');
    } finally {
      setIngesting(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await profileService.updateProfile(profile.uid, {
        stage,
        dueDate,
        comfortRoutingEnabled: comfortToggle
      });
      await refreshProfile();
      window.location.hash = '';
    } catch (error) {
      console.error('Save failed', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentHash={window.location.hash}
      />

      <header className="glass sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <IconButton onClick={() => (window.location.hash = '')}>
            <ChevronLeft className="w-6 h-6" />
          </IconButton>
          <h1 className="text-xl font-bold text-[#5D4037]">Settings</h1>
        </div>
        <IconButton onClick={() => setIsSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </IconButton>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Profile Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#5D4037]/40">Your Journey</h2>
          <div className="bg-white rounded-[32px] p-6 space-y-6 shadow-sm border border-[#5D4037]/5">
            <div className="space-y-3">
              <label className="text-sm font-medium">I am a...</label>
              <div className="flex gap-2">
                {(['pregnant', 'partner', 'grandparent'] as UserStage[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStage(s)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                      stage === s 
                        ? 'border-[#E97451] bg-[#E97451]/5 text-[#E97451]' 
                        : 'border-[#5D4037]/5 text-[#5D4037]/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {stage === 'pregnant' && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-[#5D4037]/5 bg-[#FAF9F6] focus:border-[#E97451] outline-none"
                />
              </div>
            )}
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#5D4037]/40">Preferences</h2>
          <div className="bg-white rounded-[32px] p-6 space-y-4 shadow-sm border border-[#5D4037]/5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-bold">Comfort Routing</p>
                <p className="text-xs text-[#5D4037]/60">Prioritize routes with essentials</p>
              </div>
              <button 
                onClick={() => setComfortToggle(!comfortToggle)}
                className={`w-12 h-6 rounded-full transition-colors relative ${comfortToggle ? 'bg-[#E97451]' : 'bg-[#5D4037]/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${comfortToggle ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Admin Data Ingestion (Visible for robs46859@gmail.com) */}
        {profile?.email === 'robs46859@gmail.com' && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#5D4037]/40">Admin: Data Ingestion</h2>
            <div className="bg-white rounded-[32px] p-6 space-y-4 shadow-sm border border-[#5D4037]/5">
              <p className="text-xs text-[#5D4037]/60">Crawl and synthesize facility data from Google Places API.</p>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5D4037]/40" />
                  <input 
                    type="text"
                    placeholder="e.g., Hospitals in Denver"
                    value={ingestQuery}
                    onChange={(e) => setIngestQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#5D4037]/10 bg-[#FAF9F6] text-sm outline-none focus:border-[#E97451]"
                  />
                </div>
                <select 
                  value={ingestCategory}
                  onChange={(e) => setIngestCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#5D4037]/10 bg-[#FAF9F6] text-sm outline-none focus:border-[#E97451]"
                >
                  <option value="bathroom">Bathroom</option>
                  <option value="nursing_room">Nursing Room</option>
                  <option value="rest_stop">Rest Stop</option>
                  <option value="hospital">Hospital</option>
                </select>
                <Button 
                  className="w-full" 
                  size="sm" 
                  onClick={handleIngest} 
                  disabled={ingesting || !ingestQuery}
                >
                  {ingesting ? 'Ingesting...' : 'Start Ingestion'}
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Links */}
        <section className="space-y-2">
          <SettingsLink 
            icon={<Shield className="w-5 h-5" />} 
            label="Legal Documents" 
            onClick={() => (window.location.hash = '#privacy')}
          />
          <SettingsLink 
            icon={<HelpCircle className="w-5 h-5" />} 
            label="Support" 
            onClick={() => alert("Support page coming soon!")}
          />
          <SettingsLink 
            icon={<Bell className="w-5 h-5" />} 
            label="Notifications" 
            onClick={() => alert("Notifications settings coming soon!")}
          />
        </section>

        <div className="pt-4 space-y-4">
          <Button className="w-full" size="lg" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="ghost" className="w-full text-red-500" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </Button>
        </div>
      </main>
    </div>
  );
};

const SettingsLink = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-[#5D4037]/5 hover:bg-[#FDF5E6] transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className="text-[#E97451]">{icon}</div>
      <span className="font-medium">{label}</span>
    </div>
    <ChevronLeft className="w-5 h-5 rotate-180 text-[#5D4037]/20" />
  </button>
);
