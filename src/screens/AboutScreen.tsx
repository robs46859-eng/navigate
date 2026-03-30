import React from 'react';
import { motion } from 'motion/react';
import { Heart, Users, Mail, Globe, MapPin, ChevronLeft } from 'lucide-react';

const AboutScreen: React.FC = () => {
  return (
    <div className="pb-20 bg-white min-h-screen">
      <header className="px-6 pt-12 pb-6 bg-rose-50 rounded-b-[40px]">
        <a href="#profile" className="inline-flex items-center gap-1 text-rose-500 font-semibold mb-4">
          <ChevronLeft size={20} />
          Back
        </a>
        <h1 className="text-3xl font-bold text-stone-800 mb-2">About MamaNav</h1>
        <p className="text-stone-600 leading-relaxed">
          Empowering mothers to navigate the world with confidence, comfort, and community.
        </p>
      </header>

      <div className="px-6 py-8 space-y-10">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-100 text-rose-500 rounded-xl">
              <Heart size={24} />
            </div>
            <h2 className="text-xl font-bold text-stone-800">Our Mission</h2>
          </div>
          <p className="text-stone-600 leading-relaxed">
            MamaNav was born out of a simple observation: the world isn't always designed with mothers in mind. 
            From finding a clean nursing room in a busy mall to locating a stroller-friendly playground, 
            we believe that every mom deserves access to reliable, real-time information that makes her day easier.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-100 text-rose-500 rounded-xl">
              <Users size={24} />
            </div>
            <h2 className="text-xl font-bold text-stone-800">Our Team</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Sarah Mitchell', role: 'Founder & CEO', avatar: 'https://picsum.photos/seed/team1/200/200' },
              { name: 'David Chen', role: 'Head of Product', avatar: 'https://picsum.photos/seed/team2/200/200' },
              { name: 'Elena Rodriguez', role: 'Community Lead', avatar: 'https://picsum.photos/seed/team3/200/200' },
              { name: 'Marcus Thorne', role: 'Lead Engineer', avatar: 'https://picsum.photos/seed/team4/200/200' },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-2 object-cover border-2 border-rose-50" />
                <h3 className="font-bold text-stone-800 text-sm">{member.name}</h3>
                <p className="text-xs text-stone-500">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
          <h2 className="text-xl font-bold text-stone-800 mb-4">Contact Us</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-600">
              <Mail size={20} className="text-rose-500" />
              <span>hello@mamanav.com</span>
            </div>
            <div className="flex items-center gap-3 text-stone-600">
              <Globe size={20} className="text-rose-500" />
              <span>www.mamanav.com</span>
            </div>
            <div className="flex items-center gap-3 text-stone-600">
              <MapPin size={20} className="text-rose-500" />
              <span>Denver, Colorado</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutScreen;
