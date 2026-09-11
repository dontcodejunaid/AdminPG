import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ChevronDown, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  Bed,
  Eye,
  DollarSign
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const PropertiesPage = ({ onOpenNewPgModal, onEditPg }) => {
  const { showToast, currentUser, refreshTrigger, triggerRefresh } = useApp();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPgId, setExpandedPgId] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedVerification, setSelectedVerification] = useState('');

  // Load properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedCity) params.city = selectedCity;
      if (selectedType) params.type = selectedType;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedVerification) params.verificationStatus = selectedVerification;

      const res = await api.getProperties(params);
      if (res.data) setProperties(res.data);
    } catch (err) {
      showToast('Failed to load properties', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [refreshTrigger, search, selectedCity, selectedType, selectedStatus, selectedVerification]);

  // Quick Action Handlers
  const handleQuickUpdate = async (pgId, patch, message) => {
    try {
      await api.quickUpdateProperty(pgId, patch);
      showToast(message, 'success');
      fetchProperties();
      triggerRefresh();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async (pg) => {
    if (!currentUser.permissions.canDeletePG) {
      showToast('Permission Denied: Staff cannot delete properties', 'error');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete "${pg.name}"?`)) {
      try {
        await api.deleteProperty(pg.id);
        showToast(`Deleted "${pg.name}" successfully`, 'success');
        fetchProperties();
        triggerRefresh();
      } catch (err) {
        showToast('Delete failed', 'error');
      }
    }
  };

  // Distinct cities list for filter
  const cities = Array.from(new Set(properties.map(p => p.city).filter(Boolean)));

  return (
    <div className="space-y-6">
      
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-brand-600" />
            PG & Property Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage all PG listings, multi-sharing room rates, photos, availability & verification status
          </p>
        </div>

        {currentUser.permissions.canAddPG && (
          <button
            onClick={onOpenNewPgModal}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New PG Property</span>
          </button>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PG name, area..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
          >
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
          >
            <option value="">All PG Types</option>
            <option value="Boys">Boys PG</option>
            <option value="Girls">Girls PG / Hostel</option>
            <option value="Co-living">Co-living Space</option>
          </select>

          {/* Publish Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>

          {/* Verification Status */}
          <select
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
          >
            <option value="">All Verifications</option>
            <option value="Verified">Verified Only</option>
            <option value="Pending">Pending Verification</option>
            <option value="Not Verified">Not Verified</option>
          </select>

        </div>
      </div>

      {/* Property Cards List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No properties found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or add a new PG property.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((pg) => {
            const isExpanded = expandedPgId === pg.id;
            const minRent = (pg.rooms || []).reduce((min, r) => r.rent < min ? r.rent : min, 99999);
            const maxRent = (pg.rooms || []).reduce((max, r) => r.rent > max ? r.rent : max, 0);

            return (
              <div
                key={pg.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
              >
                {/* Main Card Row */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Image & Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={pg.photos?.[0] || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80"}
                      alt={pg.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0 border border-slate-100 dark:border-slate-800"
                    />

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                          {pg.name}
                        </h3>
                        {pg.isFeatured && (
                          <span className="text-[10px] bg-amber-500 text-white font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Star className="w-3 h-3 fill-current" />
                            FEATURED
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <Badge variant={pg.type}>{pg.type}</Badge>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{pg.area}</span>, {pg.city}, {pg.state}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1">
                          <Bed className="w-3 h-3 text-slate-400" />
                          {pg.availableBeds || 0} / {pg.totalBeds || 0} Beds Available
                        </span>
                      </div>

                      {/* Pricing Range Tag */}
                      <div className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-2 pt-0.5">
                        <span>
                          ₹{minRent !== 99999 ? minRent.toLocaleString() : 'N/A'} - ₹{maxRent.toLocaleString()}/mo
                        </span>
                        <span className="text-[11px] font-normal text-slate-400">
                          ({pg.rooms?.length || 0} sharing options)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Badges & Quick Toggles */}
                  <div className="flex flex-wrap lg:flex-col items-start lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 dark:border-slate-800">
                    
                    {/* Status & Verification Badges */}
                    <div className="flex items-center gap-2">
                      <Badge variant={pg.status}>{pg.status}</Badge>
                      <Badge variant={pg.availabilityStatus}>{pg.availabilityStatus}</Badge>
                      <Badge variant={pg.verificationStatus}>{pg.verificationStatus}</Badge>
                    </div>

                    {/* Quick Admin Toggles & Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      
                      {/* Availability Quick Toggle */}
                      <select
                        value={pg.availabilityStatus}
                        onChange={(e) => handleQuickUpdate(pg.id, { availabilityStatus: e.target.value }, `Updated availability to ${e.target.value}`)}
                        className="text-[11px] font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        title="Quick change availability"
                      >
                        <option value="Available">Available</option>
                        <option value="Limited">Limited</option>
                        <option value="Full">Mark as Full</option>
                      </select>

                      {/* Featured Quick Toggle */}
                      <button
                        onClick={() => handleQuickUpdate(pg.id, { isFeatured: !pg.isFeatured }, pg.isFeatured ? 'Removed from Featured' : 'Marked as Featured')}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          pg.isFeatured 
                            ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300' 
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-amber-600 dark:bg-slate-800'
                        }`}
                        title={pg.isFeatured ? "Unfeature" : "Mark as Featured"}
                      >
                        <Star className={`w-3.5 h-3.5 ${pg.isFeatured ? 'fill-current' : ''}`} />
                      </button>

                      {/* WhatsApp Call Direct */}
                      <a
                        href={`https://wa.me/${pg.whatsappNumber?.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:scale-105 transition-transform"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>

                      {/* Edit Button */}
                      <button
                        onClick={() => onEditPg(pg)}
                        className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* Delete Button (RBAC Gated) */}
                      {currentUser.permissions.canDeletePG && (
                        <button
                          onClick={() => handleDelete(pg)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Delete PG"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Expand Details Trigger */}
                      <button
                        onClick={() => setExpandedPgId(isExpanded ? null : pg.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View Room Pricing & Details"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                  </div>

                </div>

                {/* Expanded Section: Detailed Room & Pricing Breakdown */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
                    
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5 text-brand-600" />
                        Room & Pricing Breakdown (Module 3)
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {(pg.rooms || []).map(r => (
                          <div key={r.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{r.type}</span>
                              <span className="text-xs font-black text-brand-600 dark:text-brand-400">₹{r.rent.toLocaleString()}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 space-y-0.5">
                              <p>Deposit: ₹{r.deposit?.toLocaleString() || 'N/A'}</p>
                              <p>Beds: {r.availableBeds} Available / {r.totalBeds} Total</p>
                              <div className="flex gap-2 pt-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                                {r.hasAC && <span className="text-teal-600 dark:text-teal-400">✓ AC</span>}
                                {r.hasAttachedBath && <span className="text-blue-600 dark:text-blue-400">✓ Attached Bath</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Charges Policy */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Deposit Policy</span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">₹{pg.charges?.deposit?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Food Charges</span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{pg.charges?.foodCharges || 'Included'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Electricity</span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{pg.charges?.electricityCharges || 'Included'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Maintenance</span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">₹{pg.charges?.maintenanceCharges || 0}/mo</p>
                      </div>
                    </div>

                    {/* Full Address & Map */}
                    <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p><span className="font-bold text-slate-800 dark:text-slate-200">Address:</span> {pg.fullAddress}</p>
                      {pg.mapUrl && (
                        <a
                          href={pg.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 font-bold hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Google Maps Location</span>
                        </a>
                      )}
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
