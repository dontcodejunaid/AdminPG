import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sparkles, ArrowRight, Bell, CheckCircle2, Send, Phone, Search, Building2, Navigation, Compass, Star } from 'lucide-react';
import { locations } from '../data/locationsData';
import PageTransition from '../components/PageTransition';
import confetti from 'canvas-confetti';

export default function LocationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'live' | 'upcoming'
  const [notifyCity, setNotifyCity] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchStatus =
        selectedFilter === 'all'
          ? true
          : selectedFilter === 'live'
          ? loc.status === 'live'
          : loc.status !== 'live';

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchStatus;

      const inCity = loc.city.toLowerCase().includes(q);
      const inArea = loc.area.toLowerCase().includes(q);
      const inState = loc.state.toLowerCase().includes(q);
      const inTech = loc.techParks?.some((tp) => tp.toLowerCase().includes(q));
      const inCompanies = loc.popularCompanies?.some((c) => c.toLowerCase().includes(q));

      return matchStatus && (inCity || inArea || inState || inTech || inCompanies);
    });
  }, [searchQuery, selectedFilter]);

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!notifyCity || !notifyEmail) return;
    setNotifySubmitted(true);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#D4A64A', '#f59e0b', '#10B981', '#FAF7F0'],
      });
    } catch (err) {}
  };

  return (
    <PageTransition>
      <div className="relative pt-28 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#D4A64A] text-xs font-semibold uppercase tracking-wider mb-4 font-mono">
            <Compass className="w-4 h-4 text-[#D4A64A]" />
            <span>Pan-India Presence & Expansion</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FAF7F0] mb-4 font-sora tracking-tight">
            Aafa Coliving <span className="text-gradient-gold">Campus Network</span>
          </h1>
          <p className="text-[#FAF7F0]/80 text-sm sm:text-base leading-relaxed">
            Zero-gravity coliving, 100% generator power backup, and authentic Kerala dining across India's premier tech clusters.
          </p>
        </div>

        {/* ANIMATED LOCATION SEARCH & FILTER BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl glass-card border border-[#D4A64A]/40 p-4 sm:p-6 mb-14 shadow-2xl bg-gradient-to-r from-[#D4A64A]/10 via-[#0B1220] to-[#D4A64A]/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Live Search Input */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4A64A]" />
              <input
                type="text"
                placeholder="Search by city, tech park or company (e.g. HCL, Hinjawadi, Powai, OMR, Infopark)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl glass-card text-xs sm:text-sm text-[#FAF7F0] placeholder-[#FAF7F0]/50 focus:outline-none focus:border-[#D4A64A] border border-white/10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#FAF7F0]/60 hover:text-[#FAF7F0]"
                >
                  ✕ Clear
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 shrink-0">
              {[
                { id: 'all', label: `All Hubs (${locations.length})` },
                { id: 'live', label: '🟢 Live (Bengaluru)' },
                { id: 'upcoming', label: '🚀 Launching 2026/27' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedFilter === tab.id
                      ? 'bg-gradient-to-r from-[#D4A64A] to-amber-500 text-[#0B1220] shadow-md shadow-[#D4A64A]/30 scale-105'
                      : 'glass-card text-[#FAF7F0]/70 hover:text-[#FAF7F0]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>

          {/* Quick Hub Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
            <span className="text-[10px] font-mono text-[#D4A64A] uppercase font-bold">Trending Tech Parks:</span>
            {['HCL Gate (2 min)', 'Biocon Park (5 min)', 'Hinjawadi', 'OMR Chennai', 'Cyber City DLF', 'Infopark Kochi'].map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(tag.split(' ')[0])}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#D4A64A]/20 text-[#FAF7F0]/70 hover:text-[#FAF7F0] border border-white/10 text-[10px] transition-all font-mono"
              >
                #{tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <AnimatePresence mode="popLayout">
            {filteredLocations.map((loc, idx) => (
              <motion.div
                layout
                key={loc.slug}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`glass-card glass-card-hover rounded-3xl overflow-hidden border flex flex-col justify-between group relative ${
                  loc.status === 'live' ? 'border-[#D4A64A]/50 shadow-2xl' : 'border-white/10'
                }`}
                data-cursor="expand"
              >
                <div>
                  {/* Image & Status Badge */}
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={loc.heroImage}
                      alt={`${loc.city} Aafa Coliving`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent opacity-80" />

                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          loc.status === 'live'
                            ? 'bg-emerald-500 text-black shadow-lg font-mono'
                            : 'bg-[#0B1220]/80 text-[#D4A64A] border border-[#D4A64A]/40 backdrop-blur-md'
                        }`}
                      >
                        {loc.status === 'live' ? '🟢 Live Campus' : `⏳ ${loc.launchTimeline}`}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#D4A64A] uppercase bg-[#0B1220]/80 px-2 py-0.5 rounded">
                        {loc.state}
                      </span>
                      <span className="text-white bg-[#0B1220]/80 px-2 py-0.5 rounded">
                        {loc.pricingStarting}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold font-sora text-[#FAF7F0] group-hover:text-[#D4A64A] transition-colors">
                        {loc.city}
                      </h3>
                      {loc.status === 'live' && (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          140+ Reviews (4.9★)
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#FAF7F0]/75 font-medium mb-4 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D4A64A] shrink-0" />
                      <span>{loc.area}</span>
                    </p>

                    {/* Tech Parks */}
                    {loc.techParks && (
                      <div className="mb-4">
                        <span className="text-[10px] font-mono uppercase text-[#FAF7F0]/60 block mb-1.5 font-bold">
                          Nearby Tech Parks:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {loc.techParks.map((tp, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-[#FAF7F0]/85 border border-white/10"
                            >
                              {tp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Highlights */}
                    {loc.highlights && (
                      <ul className="space-y-1.5 mb-4 text-[11px] text-[#FAF7F0]/80">
                        {loc.highlights.slice(0, 2).map((h, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A64A] shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-6 pt-0">
                  {loc.status === 'live' ? (
                    <Link
                      to={`/locations/${loc.slug}`}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#D4A64A] via-amber-500 to-yellow-600 text-[#0B1220] font-extrabold text-xs shadow-lg shadow-[#D4A64A]/25 hover:shadow-[#D4A64A]/45 hover:scale-[1.02] transition-all btn-shimmer"
                    >
                      <span>Explore Bengaluru Campus</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      to={`/locations/${loc.slug}`}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl glass-card text-[#D4A64A] hover:bg-[#D4A64A]/15 font-bold text-xs border border-[#D4A64A]/30 transition-all"
                    >
                      <Bell className="w-3.5 h-3.5 text-[#D4A64A]" />
                      <span>View {loc.city} Blueprint & Register</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lead Capture Priority List */}
        <div className="rounded-3xl glass-card border border-[#D4A64A]/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#D4A64A]/15 via-[#0B1220] to-[#0B1220]">
          <div className="max-w-2xl mx-auto text-center">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4A64A]/15 text-[#D4A64A] text-xs font-mono uppercase mb-4 border border-[#D4A64A]/30">
              <Bell className="w-4 h-4" />
              <span>Expansion Priority List</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold font-sora text-[#FAF7F0] mb-2">
              Want Aafa Coliving in Your City?
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF7F0]/75 mb-6 leading-relaxed">
              Select your city and email below. We’ll notify you first with exclusive early-bird discounts and priority room lock when we launch!
            </p>

            {!notifySubmitted ? (
              <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row items-center gap-3">
                <select
                  value={notifyCity}
                  onChange={(e) => setNotifyCity(e.target.value)}
                  className="w-full sm:w-1/3 px-4 py-3.5 rounded-xl glass-card text-xs focus:outline-none focus:border-[#D4A64A] bg-[#0B1220] text-[#FAF7F0]"
                  required
                >
                  <option value="">Select City...</option>
                  <option value="Pune">Pune (Hinjawadi)</option>
                  <option value="Mumbai">Mumbai (Powai / BKC)</option>
                  <option value="Delhi NCR">Delhi NCR (Cyber Hub)</option>
                  <option value="Chennai">Chennai (OMR)</option>
                  <option value="Kerala">Kerala (Infopark / Technopark)</option>
                </select>

                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  className="w-full sm:w-2/3 px-4 py-3.5 rounded-xl glass-card text-xs focus:outline-none focus:border-[#D4A64A] text-[#FAF7F0]"
                  required
                />

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4A64A] via-amber-500 to-yellow-600 text-[#0B1220] font-extrabold text-xs shrink-0 shadow-lg shadow-[#D4A64A]/25 hover:scale-105 transition-all btn-shimmer"
                  data-cursor="expand"
                >
                  Get Priority Pass
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-2xl glass-card border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>You're on the priority list! We'll notify you when {notifyCity} goes live.</span>
              </div>
            )}

          </div>
        </div>

      </div>
    </PageTransition>
  );
}
