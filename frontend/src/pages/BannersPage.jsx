import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Eye, 
  Calendar,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { CustomSelect } from '../components/ui/select';
import { CustomDatePicker } from '../components/ui/DatePicker';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const BannersPage = () => {
  const { showToast, currentUser, triggerRefresh, confirm } = useApp();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    targetType: 'All',
    city: 'All Cities',
    actionText: 'Explore PGs',
    link: '/properties',
    startDate: '',
    endDate: '',
    isActive: true
  });

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.getBanners();
      if (res.data) setBanners(res.data);
    } catch (err) {
      showToast('Failed to load banners', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenAdd = () => {
    setBannerToEdit(null);
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
      targetType: 'All',
      city: 'All Cities',
      actionText: 'Explore PGs',
      link: '/properties',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31'
    });
    setIsModalOpen(true);
  };

  const handleBannerImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setFormData(prev => ({ ...prev, imageUrl: reader.result }));
    reader.onerror = () => showToast('Could not read the banner image', 'error');
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleOpenEdit = (b) => {
    setBannerToEdit(b);
    setFormData({
      title: b.title,
      subtitle: b.subtitle || '',
      imageUrl: b.imageUrl,
      targetUrl: b.targetUrl,
      placement: b.placement,
      city: b.city || 'All Cities',
      isActive: Boolean(b.isActive),
      startDate: b.startDate || '',
      endDate: b.endDate || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      showToast('Please fill required fields', 'error');
      return;
    }
    try {
      if (bannerToEdit) {
        await api.updateBanner(bannerToEdit.id, formData);
        showToast('Banner updated successfully', 'success');
      } else {
        await api.createBanner(formData);
        showToast('New promotional banner published!', 'success');
      }
      setIsModalOpen(false);
      fetchBanners();
      triggerRefresh();
    } catch (err) {
      showToast('Failed to save banner', 'error');
    }
  };

  const handleToggleActive = async (b) => {
    try {
      await api.updateBanner(b.id, { isActive: !b.isActive });
      showToast(`Banner ${!b.isActive ? 'activated' : 'deactivated'}`, 'success');
      fetchBanners();
    } catch (err) {
      showToast('Failed to toggle banner', 'error');
    }
  };

  const handleDelete = async (b) => {
    if (!currentUser.permissions.canManageBanners) {
      showToast('Permission Denied', 'error');
      return;
    }
    const ok = await confirm({
      title: 'Delete Banner',
      message: `Are you sure you want to permanently delete banner "${b.title}"?`,
      confirmText: 'Delete Banner',
      type: 'danger'
    });
    if (!ok) return;

    try {
      await api.deleteBanner(b.id);
      showToast('Banner deleted successfully', 'success');
      fetchBanners();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-brand-600" />
            Banner & Advertisement Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage promotional hero banners, sponsored city campaigns, and special discounts
          </p>
        </div>

        {currentUser.permissions.canManageBanners && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Banner</span>
          </button>
        )}
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading banners...</div>
      ) : banners.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">No active banners. Click Create Promo Banner to add one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {banners.map(b => (
            <div
              key={b.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between group"
            >
              {/* Banner Visual Preview */}
              <div className="relative aspect-[21/9] bg-slate-900 overflow-hidden">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-600 self-start mb-1">
                    {b.placement} • {b.city || 'All'}
                  </span>
                  <h4 className="text-sm font-bold leading-tight drop-shadow">{b.title}</h4>
                  {b.subtitle && <p className="text-[11px] text-slate-200 drop-shadow mt-0.5">{b.subtitle}</p>}
                </div>

                <div className="absolute top-3 right-3">
                  <Badge variant={b.isActive ? 'Active' : 'Inactive'}>
                    {b.isActive ? 'Active' : 'Disabled'}
                  </Badge>
                </div>
              </div>

              {/* Bottom Actions & Details */}
              <div className="p-4 flex items-center justify-between gap-3 text-xs border-t border-slate-100 dark:border-slate-800">
                <div className="text-slate-500 text-[11px] flex items-center gap-2 truncate">
                  <span>Link: <code className="text-brand-600 dark:text-brand-400 font-mono">{b.targetUrl}</code></span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleToggleActive(b)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      b.isActive 
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300' 
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                    }`}
                  >
                    {b.isActive ? 'Pause' : 'Activate'}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit Banner"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {currentUser.permissions.canManageBanners && (
                    <button
                      onClick={() => handleDelete(b)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add / Edit Banner */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={bannerToEdit ? 'Edit Promotional Banner' : 'Create New Promotional Banner'}
        subtitle="Configure banner graphic, headline copy, placement zone, and deep-link"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Banner Title / Main Text *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Best Girls PGs in Bangalore with Kerala Food"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subtitle / Tagline</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. Zero Brokerage • Verified Hostels • Wi-Fi Included"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Banner Image *</label>
            <input
              type="text"
              value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder={formData.imageUrl.startsWith('data:') ? 'Device image selected' : 'https://images.unsplash.com/... or hosted image URL'}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
            />
            <label className="mt-2 inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer">
              <ImageIcon className="w-3.5 h-3.5" />
              Choose from device
              <input type="file" accept="image/*" onChange={handleBannerImageFile} className="sr-only" />
            </label>
            {formData.imageUrl && <img src={formData.imageUrl} alt="Banner preview" className="mt-2 h-24 w-full object-cover rounded-xl border border-slate-200 dark:border-slate-700" />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Click Link</label>
              <input
                type="text"
                value={formData.targetUrl}
                onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                placeholder="e.g. /search?city=Bangalore or external URL"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Placement Slot</label>
              <CustomSelect
                value={formData.placement}
                onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                options={[
                  { value: 'Homepage Hero Top', label: 'Homepage Hero Top' },
                  { value: 'Search Results Header', label: 'Search Results Header' },
                  { value: 'City Spotlight Carousel', label: 'City Spotlight Carousel' }
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="All Cities or Kochi / Bangalore"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
              <CustomDatePicker
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                placeholder="Select start date"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
              <CustomDatePicker
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                placeholder="Select end date"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl shadow-md"
            >
              {bannerToEdit ? 'Save Changes' : 'Publish Banner'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
