import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ArrowUp, 
  ArrowDown, 
  Building2, 
  MapPin, 
  Sparkles, 
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const FeaturedPage = ({ onEditPg }) => {
  const { showToast, triggerRefresh } = useApp();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      const res = await api.getProperties({ isFeatured: 'true' });
      if (res.data) {
        // Sort by featuredOrder
        const sorted = res.data.sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
        setProperties(sorted);
      }
    } catch (err) {
      showToast('Failed to load featured PGs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  const handleToggleFeatured = async (pgId) => {
    try {
      await api.quickUpdateProperty(pgId, { isFeatured: false, featuredOrder: 0 });
      showToast('Removed from Featured rankings', 'success');
      fetchFeatured();
      triggerRefresh();
    } catch (err) {
      showToast('Failed to update', 'error');
    }
  };

  const handleReorder = async (pgId, newOrder) => {
    try {
      await api.quickUpdateProperty(pgId, { featuredOrder: newOrder });
      fetchFeatured();
      triggerRefresh();
    } catch (err) {
      showToast('Reorder failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
          Featured PG Management
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Control which properties appear on the Homepage spotlight carousel and at the top of search results.
        </p>
      </div>

      {/* Featured Slots Table */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading featured PGs...</div>
      ) : properties.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No PGs are currently marked as Featured. You can toggle the Featured star on any PG in Property Management.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((pg, idx) => (
            <div
              key={pg.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-black text-sm">
                  #{idx + 1}
                </span>

                <img
                  src={pg.photos?.[0] || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=200&q=80"}
                  alt={pg.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {pg.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{pg.area}, {pg.city}</span>
                  </p>
                  <p className="text-[11px] font-bold text-brand-600 dark:text-brand-400 mt-1">
                    Homepage & Search Spotlight Active
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleReorder(pg.id, (pg.featuredOrder || idx + 1) - 1)}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === properties.length - 1}
                    onClick={() => handleReorder(pg.id, (pg.featuredOrder || idx + 1) + 1)}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onEditPg(pg)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleToggleFeatured(pg.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-xs font-semibold"
                >
                  Unfeature
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
