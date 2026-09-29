import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: 'Relocating to Bengaluru Tech Corridors: Ultimate Guide for Software Engineers',
      category: 'Relocation Guide',
      date: 'Aug 14, 2026',
      author: 'Aafa Editorial Team',
      snippet: 'Moving near major tech corridors in Bengaluru? Discover transport tips, local food hubs, internet readiness, and how to find zero-deposit PG accommodation across Pan-India.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Why Authentic Kerala Homestyle Meals Are Essential for Techies',
      category: 'Food & Wellness',
      date: 'Aug 10, 2026',
      author: 'Chef Vinod Nair',
      snippet: 'Say goodbye to oily PG food. Learn how fresh coconut, red rice, and spiced Kerala dishes boost focus during long coding marathons.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Daily Stay (₹499/day) vs Monthly PG: Which Plan Fits Your Visit?',
      category: 'Co-Living Tips',
      date: 'Aug 05, 2026',
      author: 'Campus Desk',
      snippet: 'Visiting for interview rounds or short client projects? Compare our flexible ₹499/day daily stay (free breakfast included) vs monthly 1BHK/2BHK plans across Pan-India.',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    },
  ];

  return (
    <PageTransition>
      <div className="relative pt-28 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#D4A64A] text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-4 h-4 text-[#D4A64A]" />
            <span>Life at Aafa & City Living Guides</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAF7F0] mb-6 font-sora tracking-tight">
            Community Stories & <span className="text-gradient-gold">Relocation Guides</span>
          </h2>
          <p className="text-[#FAF7F0]/80 text-base sm:text-lg">
            Practical advice for tech professionals, engineers, and students moving to major IT hubs across Pan-India.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {posts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group"
              data-cursor="expand"
            >
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0B1220]/80 backdrop-blur-md text-[#D4A64A] text-[10px] font-bold uppercase font-mono">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-[10px] text-[#FAF7F0]/60 font-mono mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#D4A64A]" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span>{post.author}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#FAF7F0] mb-2 font-sora group-hover:text-[#D4A64A] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#FAF7F0]/75 leading-relaxed">
                    {post.snippet}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#D4A64A] font-bold group-hover:translate-x-1 transition-transform">
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </PageTransition>
  );
}
