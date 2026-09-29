import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Sparkles, CheckCircle2, MapPin, Award } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function ReviewsPage() {
  const stats = [
    { number: '500+', label: 'Happy Residents' },
    { number: '7+', label: 'Years of Service' },
    { number: '4.9★', label: 'Google Rating' },
    { number: '100%', label: 'Power Backup' },
  ];

  const reviews = [
    {
      name: 'Rohan Kurien',
      role: 'Senior Frontend Engineer @ Tech Corridor',
      stay: 'Resident for 1.2 Years',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      quote: 'Living just 3 minutes from HCL Gate is an absolute blessing. The 1GBPS Wi-Fi and generator power backup saved my late-night code releases multiple times. Plus, Wednesday fish curry is top notch!',
      room: 'Single Room'
    },
    {
      name: 'Anjali Menon',
      role: 'UX Designer & Freelancer',
      stay: 'Resident for 9 Months',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      quote: 'As a woman moving to Bengaluru for my first job, safety was my main concern. The biometric facial access, 24/7 CCTV, and friendly housekeeping made me feel completely secure.',
      room: '2 BHK Sharing'
    },
    {
      name: 'Siddharth Varma',
      role: 'Cloud Architect',
      stay: 'Resident for 2 Years',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      quote: 'Zero deposit hassle, super clean attached bathrooms, and zero landlord drama! The gaming lounge is a fantastic place to unwind after long work shifts.',
      room: '1 BHK Suite'
    },
    {
      name: 'Kiran Reddy',
      role: 'Biotech Researcher',
      stay: 'Daily Stay Guest',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      quote: 'I booked the ₹499/day Daily Stay plan for a 3-day interview visit. The free hot Puttu & Kadala breakfast every morning made my trip so smooth. Extended to monthly stay!',
      room: 'Daily Stay ₹499/day'
    },
  ];

  return (
    <PageTransition>
      <div className="relative pt-28 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#D4A64A] text-xs font-semibold uppercase tracking-wider mb-4">
            <Star className="w-4 h-4 text-[#D4A64A] fill-[#D4A64A]" />
            <span>Verified Google Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAF7F0] mb-6 font-sora tracking-tight">
            Loved by <span className="text-gradient-gold">500+ Co-Movers</span>
          </h2>
          <p className="text-[#FAF7F0]/80 text-base sm:text-lg">
            Real stories and unedited reviews from IT professionals, engineers, and students living at Aafa Coliving across Pan-India.
          </p>
        </div>

        {/* Google Rating Badge & Social Proof Strip */}
        <div className="rounded-3xl glass-card border border-[#D4A64A]/30 p-8 mb-16 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#D4A64A]/20 border border-[#D4A64A]/40 text-[#D4A64A] flex items-center justify-center shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D4A64A] text-[#D4A64A]" />
                ))}
                <span className="text-sm font-bold text-[#D4A64A] ml-2 font-mono">4.9 / 5.0</span>
              </div>
              <h3 className="text-xl font-bold font-sora text-[#FAF7F0]">Verified Google Maps Listing</h3>
              <p className="text-xs text-[#FAF7F0]/70">Based on 140+ resident reviews across Pan-India campuses.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>As Seen on Google Maps</span>
          </div>
        </div>

        {/* Scroll Number Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card rounded-3xl p-6 text-center border border-white/10"
            >
              <h4 className="text-4xl font-extrabold text-[#D4A64A] font-sora mb-1">{s.number}</h4>
              <p className="text-xs text-[#FAF7F0]/75 font-mono">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card glass-card-hover rounded-3xl p-8 border border-white/10 flex flex-col justify-between relative"
              data-cursor="expand"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-[#D4A64A]/15" />

              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4A64A] text-[#D4A64A]" />
                  ))}
                </div>

                <p className="text-[#FAF7F0]/90 text-sm leading-relaxed italic mb-6">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#D4A64A] shadow-md"
                />
                <div>
                  <h4 className="text-base font-bold font-sora text-[#FAF7F0]">{rev.name}</h4>
                  <p className="text-xs text-[#D4A64A] font-medium">{rev.role}</p>
                  <p className="text-[10px] text-[#FAF7F0]/60 font-mono mt-0.5">{rev.stay} • {rev.room}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </PageTransition>
  );
}
