import React, { useState, useEffect } from 'react';
import { 
  ListChecks, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Tag, 
  FolderPlus
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { DynamicIcon, AVAILABLE_FACILITY_ICONS } from '../components/common/IconHelper';
import { CustomSelect } from '../components/ui/select';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const FacilitiesPage = () => {
  const { showToast, currentUser, triggerRefresh, confirm } = useApp();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [facilityToEdit, setFacilityToEdit] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'General',
    icon: 'ListChecks'
  });

  const categories = [
    'Food & Dining',
    'Connectivity',
    'Comfort & Climate',
    'Laundry',
    'Security & Safety',
    'Cleaning',
    'Bathroom',
    'Vehicle & Parking',
    'Building & Elevators',
    'Utility & Power',
    'Health & Fitness',
    'Furniture',
    'General'
  ];

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await api.getFacilities();
      if (res.data) setFacilities(res.data);
    } catch (err) {
      showToast('Failed to load facilities', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleOpenAdd = () => {
    setFacilityToEdit(null);
    setFormData({ name: '', category: 'General', icon: 'ListChecks' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fac) => {
    setFacilityToEdit(fac);
    setFormData({ name: fac.name, category: fac.category || 'General', icon: fac.icon || 'ListChecks' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (facilityToEdit) {
        await api.updateFacility(facilityToEdit.id, formData);
        showToast(`Updated facility "${formData.name}"`, 'success');
      } else {
        await api.createFacility(formData);
        showToast(`Added new facility "${formData.name}"! It is now available across all PG listings.`, 'success');
      }
      setIsModalOpen(false);
      fetchFacilities();
      triggerRefresh();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async (fac) => {
    if (!currentUser.permissions.canManageFacilities) {
      showToast('Permission Denied', 'error');
      return;
    }
    const ok = await confirm({
      title: 'Delete Facility',
      message: `Are you sure you want to delete amenity "${fac.name}"?`,
      confirmText: 'Delete Facility',
      type: 'danger'
    });
    if (!ok) return;

    try {
      await api.deleteFacility(fac.id);
      showToast('Facility deleted successfully', 'success');
      fetchFacilities();
      triggerRefresh();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  // Group by category
  const grouped = facilities.reduce((acc, fac) => {
    const cat = fac.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(fac);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <ListChecks className="w-6 h-6 text-brand-600" />
            Dynamic Facilities & Amenities Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add custom amenities anytime. All newly added facilities immediately become selectable in the PG editor.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Facility / Amenity</span>
        </button>
      </div>

      {/* Facilities Catalog Grouped by Category */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading amenities...</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-brand-600" />
                <span>{category}</span>
                <span className="text-[11px] font-normal text-slate-400">({items.length})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.map(fac => (
                  <div
                    key={fac.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 group hover:border-brand-500/50 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex-shrink-0">
                        <DynamicIcon name={fac.icon} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {fac.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          Icon: {fac.icon || 'Sparkles'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(fac)}
                        className="p-1 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800"
                        title="Edit Facility"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {currentUser.permissions.canManageFacilities && (
                        <button
                          onClick={() => handleDelete(fac)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                          title="Delete Facility"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Facility Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={facilityToEdit ? `Edit Facility: ${facilityToEdit.name}` : 'Add New Amenity / Facility'}
        subtitle="Create an amenity tag that can be toggled on any PG listing"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Facility Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Kerala Food, Swimming Pool, Biometric Attendance, EV Charging"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <CustomSelect
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categories.map(cat => ({ value: cat, label: cat }))}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Display Icon
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              {AVAILABLE_FACILITY_ICONS.map(iconName => {
                const isSelected = formData.icon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: iconName })}
                    className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected 
                        ? 'bg-brand-600 text-white shadow-md' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                    title={iconName}
                  >
                    <DynamicIcon name={iconName} className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs rounded-xl text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl shadow-md hover:bg-brand-700"
            >
              {facilityToEdit ? 'Save Changes' : 'Create Amenity'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
