import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  MessageSquareText, 
  MapPin, 
  Users, 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  Phone, 
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Eye
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const DashboardHome = ({ onOpenNewPgModal, onEditPg }) => {
  const { setActiveTab, refreshTrigger } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await api.getDashboardStats();
        if (res.data) setStats(res.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [refreshTrigger]);

  if (loading && !stats) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold">Loading KeralaPG Analytics...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total PGs', value: stats?.totalPgs || 0, icon: Building2, color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/60 dark:text-brand-400', tab: 'properties', filter: { status: '', verificationStatus: '', availabilityStatus: '', search: '', city: '', type: '' } },
    { label: 'Active Listings', value: stats?.activePgs || 0, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400', tab: 'properties', filter: { status: 'Active', verificationStatus: '', availabilityStatus: '', search: '', city: '', type: '' } },
    { label: 'Pending Verification', value: stats?.pendingPgs || 0, icon: Clock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400', tab: 'verifications', badge: stats?.pendingPgs > 0 ? 'Action Needed' : null },
    { label: 'Verified PGs', value: stats?.verifiedPgs || 0, icon: ShieldCheck, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-400', tab: 'properties', filter: { verificationStatus: 'Verified', status: '', availabilityStatus: '', search: '', city: '', type: '' } },
    { label: 'Full / Unavailable', value: stats?.fullPgs || 0, icon: AlertCircle, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400', tab: 'properties', filter: { availabilityStatus: 'Full', status: '', verificationStatus: '', search: '', city: '', type: '' } },
    { label: 'Total Enquiries', value: stats?.totalEnquiries || 0, icon: MessageSquareText, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400', tab: 'enquiries' },
    { label: "Today's Enquiries", value: stats?.todayEnquiries || 0, icon: TrendingUp, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-400', tab: 'enquiries', highlight: true },
    { label: 'Total Active Cities', value: stats?.totalCities || 0, icon: MapPin, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400', tab: 'locations' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner with Official Logo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-brand-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 flex items-center justify-center shadow-xl border border-white/20 flex-shrink-0">
              <img
                src="/logo.png"
                alt="KeralaPG Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[11px] font-bold border border-brand-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Operations System Active
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Kerala<span className="text-amber-400">PG</span>.com Admin Dashboard
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                Complete administrative control over all PGs, room sharings, dynamic locations, amenities, customer leads, and platform safety.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewPgModal}
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add New PG Property</span>
            </button>
            <button
              onClick={() => setActiveTab('enquiries')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/10 transition-colors"
            >
              View Leads CRM
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 8 Primary Requirement Stat Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => setActiveTab(card.tab, card.filter || {})}
              className="group cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-500/50 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {card.label}
                </span>
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </span>
                <div className="flex items-center text-[11px] font-bold text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  <span>Manage</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Properties & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recently Added / Updated PGs */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-600" />
                Recently Added & Active PGs
              </h3>
              <p className="text-[11px] text-slate-500">Live listings on KeralaPG.com portal</p>
            </div>
            <button
              onClick={() => setActiveTab('properties')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View All PGs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">PG Name & Location</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Min Rent</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Verification</th>
                  <th className="py-2.5 px-3 rounded-r-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(stats?.recentPgs || []).map((pg) => {
                  const minRent = (pg.rooms || []).reduce((min, r) => r.rent < min ? r.rent : min, 99999);
                  return (
                    <tr key={pg.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                          {pg.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{pg.area}, {pg.city}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={pg.type}>{pg.type}</Badge>
                      </td>
                      <td className="py-3 px-3 font-bold text-brand-600 dark:text-brand-400">
                        ₹{minRent !== 99999 ? minRent.toLocaleString() : 'N/A'}/mo
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={pg.availabilityStatus}>{pg.availabilityStatus}</Badge>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={pg.verificationStatus}>{pg.verificationStatus}</Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onEditPg(pg)}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950 dark:hover:text-brand-300 rounded-lg text-slate-700 dark:text-slate-300 font-semibold transition-colors"
                        >
                          Edit PG
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Recent Customer Enquiries Feed */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquareText className="w-4 h-4 text-sky-600" />
                Latest Enquiries / Leads
              </h3>
              <p className="text-[11px] text-slate-500">Real-time customer contact requests</p>
            </div>
            <button
              onClick={() => setActiveTab('enquiries')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              CRM Pipeline
            </button>
          </div>

          <div className="space-y-3">
            {(stats?.recentEnquiries || []).map(enq => (
              <div
                key={enq.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {enq.customerName}
                    </h5>
                    <p className="text-[11px] text-slate-500 font-medium truncate max-w-[170px]">
                      {enq.pgName}
                    </p>
                  </div>
                  <Badge variant={enq.status}>{enq.status}</Badge>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    {enq.roomType} • {enq.customerPhone}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://wa.me/${enq.customerPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:scale-110 transition-transform"
                      title="Direct WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`tel:${enq.customerPhone}`}
                      className="p-1 rounded-md bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 hover:scale-110 transition-transform"
                      title="Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
