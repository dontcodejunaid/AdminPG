import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, HeartHandshake, Award, Compass, Users, CheckCircle2, Utensils, Wifi, Clock } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { api } from '../../services/api';

export default function AboutPage() {
  const [cmsAbout, setCmsAbout] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.getCms()
      .then((res) => {
        if (res && res.data && res.data.aboutUs && isMounted) {
          setCmsAbout(res.data.aboutUs);
        }
      })
      .catch((err) => console.warn('CMS About fetch error:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  const headline = cmsAbout?.title || 'Kerala Hospitality Meets Modern PG Living';
  const subtitle = cmsAbout?.subtitle || 'Kerala & Bangalore’s #1 Dedicated Paying Guest & Hostel Discovery Platform';
  const contentStory = cmsAbout?.content || 'KeralaPG was founded with a single mission: to make finding verified, safe, and comfortable Paying Guest (PG) accommodations completely hassle-free for students and working professionals. Whether you are moving to Kochi’s Infopark, Trivandrum’s Technopark, Kozhikode Cyberpark, or tech hubs across Bangalore, we connect you directly with genuine property owners with zero fake broker commissions.';

  const timeline = [
    {
      year: '2020',
      title: 'Foundation of KeralaPG Group',
      desc: 'Founded to eliminate poor PG conditions by introducing authentic Kerala food and clean living spaces in IT hubs.'
    },
    {
      year: '2022',
      title: 'Bengaluru Tech Hub Expansion',
      desc: 'Opened prime flagship campuses across Sannidhi Layout, Electronic City, and Koramangala serving software engineers and students.'
    },
    {
      year: '2024',
      title: 'Zero-Gravity Infrastructure Upgrade',
      desc: 'Upgraded campuses with 1GBPS dual fiber internet, commercial generator power backup, and biometric facial access.'
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
            <span>The KeralaPG Story</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 font-sora tracking-tight">
            {headline.includes('Meets') ? (
              <>
                {headline.split('Meets')[0]} Meets <span className="text-gradient-gold">{headline.split('Meets')[1]}</span>
              </>
            ) : (
              <span className="text-[#FAF7F0]">{headline}</span>
            )}
          </h2>
          <p className="opacity-80 text-base sm:text-lg">
            {subtitle}
          </p>
        </div>

        {/* Master Copy Box */}
        <div className="rounded-3xl glass-card border border-[#D4A64A]/30 p-8 sm:p-12 mb-20 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase text-[#D4A64A]">Community Mission</span>
                {cmsAbout && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Live Synced
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 font-sora mt-1">
                More Than a PG — It's a Community
              </h3>
              <p className="opacity-90 text-sm sm:text-base leading-relaxed mb-6 font-medium whitespace-pre-line">
                {contentStory}
              </p>
              <p className="opacity-75 text-xs sm:text-sm leading-relaxed">
                Whether you choose a private 1BHK suite, a comfortable 2BHK twin room, a single room, or a flexible ₹499/day stay, our dedicated on-site team ensures your living experience is completely stress-free.
              </p>
            </div>

            <div className="lg:col-span-5 relative h-80 rounded-2xl overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
                alt="KeralaPG Coliving Community"
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
