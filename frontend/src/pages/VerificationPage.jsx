import React, { useState, useEffect } from 'react';
import { 
  BadgeCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  MapPin, 
  Phone, 
  Eye, 
  ExternalLink,
  ShieldAlert,
  Search
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const VerificationPage = ({ onEditPg }) => {
  const { showToast, triggerRefresh } = useApp();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // 'All' | 'Pending' | 'Verified' | 'Not Verified'

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await api.getProperties();
      if (res.data) setProperties(res.data);
    } catch (err) {
      showToast('Failed to load listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSetVerification = async (pgId, status) => {
    try {
      await api.quickUpdateProperty(pgId, { verificationStatus: status });
      showToast(`Listing marked as ${status}`, 'success');
      fetchProperties();
      triggerRefresh();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const filtered = properties.filter(p => {
    if (filter === 'All') return true;
    return p.verificationStatus === filter;
  });

  const pendingCount = properties.filter(p => p.verificationStatus === 'Pending').length;
  const verifiedCount = properties.filter(p => p.verificationStatus === 'Verified').length;
  const notVerifiedCount = properties.filter(p => p.verificationStatus === 'Not Verified').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <BadgeCheck className="w-6 h-6 text-teal-600" />
          Verification Management Hub
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Review, approve, and verify PG properties. Verified listings display the official KeralaPG Verified badge.
        </p>
      </div>

      {/* Verification Status Tabs */}
      <div className="flex flex-wrap gap-2.5">
        {[
          { id: 'All', label: 'All Listings', count: properties.length, color: 'border-slate-300' },
          { id: 'Pending', label: '🟡 Pending Verification', count: pendingCount, color: 'border-amber-400 text-amber-600' },
          { id: 'Verified', label: '🟢 KeralaPG Verified', count: verifiedCount, color: 'border-teal-400 text-teal-600' },
          { id: 'Not Verified', label: '🔴 Not Verified', count: notVerifiedCount, color: 'border-rose-400 text-rose-600' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              filter === tab.id 
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 border-slate-200 dark:border-slate-800'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Listings List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading listings...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">No properties matching status: {filter}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(pg => (
            <div
              key={pg.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <img
                    src={pg.photos?.[0] || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=200&q=80"}
                    alt={pg.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {pg.name}
                    </h3>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{pg.area}, {pg.city}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Phone: <span className="font-semibold text-slate-700 dark:text-slate-300">{pg.contactNumber}</span>
                    </div>
                  </div>
                </div>

                <Badge variant={pg.verificationStatus}>{pg.verificationStatus}</Badge>
              </div>

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onEditPg(pg)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Review Details
                </button>

                <div className="flex items-center gap-1.5">
                  {pg.verificationStatus !== 'Verified' && (
                    <button
                      onClick={() => handleSetVerification(pg.id, 'Verified')}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Verify</span>
                    </button>
                  )}

                  {pg.verificationStatus !== 'Pending' && (
                    <button
                      onClick={() => handleSetVerification(pg.id, 'Pending')}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-xs font-semibold"
                    >
                      Set Pending
                    </button>
                  )}

                  {pg.verificationStatus !== 'Not Verified' && (
                    <button
                      onClick={() => handleSetVerification(pg.id, 'Not Verified')}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-xs font-semibold"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
