import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, HeartHandshake, Award, Compass, Users, CheckCircle2, Utensils, Wifi } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function AboutPage() {
  const timeline = [
    {
      year: '2020',
      title: 'Foundation of Aafa Group',
      desc: 'Founded to eliminate poor PG conditions by introducing authentic Kerala food and clean living spaces in IT hubs.'
    },
    {
      year: '2022',
      title: 'Bengaluru Tech Hub Expansion',
      desc: 'Opened prime flagship campus in Sannidhi Layout, Bengaluru, serving software engineers, bio-tech researchers, and students.'
    },
    {
      year: '2024',
      title: 'Zero-Gravity Infrastructure Upgrade',
      desc: 'Upgraded campus with 1GBPS dual fiber internet, commercial generator power backup, and biometric facial access.'
    },
    {
      year: 'Present',
      title: '140+ Active Co-Movers',
      desc: 'Maintaining a 4.9★ rating with zero hidden costs, daily housekeeping, and flexible ₹499/day daily stays across Pan-India.'
    },
  ];

  const values = [
    {
      title: 'Authentic Kerala Cooking',
      desc: 'Fresh Kerala spice blends, zero artificial colors, and daily variety prepared by experienced in-house chefs.'
    },
    {
      title: 'Uncompromised Daily Hygiene',
      desc: 'Daily room and attached washroom deep cleaning by professional housekeeping staff.'
    },
    {
      title: '100% Zero-Downtime Living',
      desc: 'Commercial generator power backup and dual fiber Wi-Fi ensuring uninterrupted remote work.'
    },
    {
      title: 'Transparent & Respectful',
      desc: '1 month refundable deposit policy only. Zero hidden utility fees or surprise maintenance deductions.'
    },
  ];

  return (
    <PageTransition>
      <div className="relative pt-28 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#D4A64A] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4 text-[#D4A64A]" />
            <span>The Aafa Story</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 font-sora tracking-tight">
            Kerala Hospitality Meets <span className="text-gradient-gold">Modern PG Living</span>
          </h2>
          <p className="opacity-80 text-base sm:text-lg">
            Aafa Coliving was born to solve a simple problem: young professionals moving away from home deserve high hygiene, delicious food, and total peace of mind.
          </p>
        </div>

        {/* Master Copy Box */}
        <div className="rounded-3xl glass-card border border-[#D4A64A]/30 p-8 sm:p-12 mb-20 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-mono uppercase text-[#D4A64A]">Community Mission</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 font-sora mt-1">
                More Than a PG — It's a Community
              </h3>
              <p className="opacity-90 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                Aafa Coliving is more than a PG — it's a community. Located minutes from major IT and corporate corridors across Bengaluru and Pan-India, we offer clean, comfortable, fully furnished rooms with authentic Kerala home-cooked meals, high-speed WiFi, and a warm, family-like environment for working professionals and students.
              </p>
              <p className="opacity-75 text-xs sm:text-sm leading-relaxed">
                Whether you choose a private 1BHK suite, a comfortable 2BHK twin room, a single room, or a flexible ₹499/day stay, our dedicated on-site team ensures your living experience is completely stress-free.
              </p>
            </div>

            <div className="lg:col-span-5 relative h-80 rounded-2xl overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
                alt="Aafa Coliving Community"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Floating Timeline */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-2xl sm:text-4xl font-extrabold font-sora">
              Our Journey & <span className="text-gradient-gold">Milestones</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-extrabold text-[#D4A64A] font-mono block mb-2">
                    {item.year}
                  </span>
                  <h4 className="text-base font-bold mb-2 font-sora">
                    {item.title}
                  </h4>
                  <p className="opacity-80 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Core Pillars */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-4xl font-extrabold font-sora">
              Our Core <span className="text-gradient-gold">Pillars</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 border border-white/10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4A64A]/20 text-[#D4A64A] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-sora mb-1">{v.title}</h4>
                  <p className="text-xs opacity-80 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
