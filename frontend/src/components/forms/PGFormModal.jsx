import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Image, 
  ListChecks, 
  Plus, 
  Trash2, 
  Check, 
  Phone, 
  MessageSquare, 
  Layers,
  Video,
  Info
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { DynamicIcon } from '../common/IconHelper';
import { CustomSelect } from '../ui/select';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const PGFormModal = ({ isOpen, onClose, pgToEdit = null, onSuccess }) => {
  const { showToast, triggerRefresh } = useApp();
  const isEditing = Boolean(pgToEdit);

  // Dynamic Location data from API
  const [flatLocations, setFlatLocations] = useState({ states: [], cities: [], areas: [] });
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'rooms' | 'facilities' | 'media'

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Boys',
    state: 'Kerala',
    city: 'Kochi',
    area: 'Kakkanad',
    fullAddress: '',
    mapUrl: '',
    description: '',
    contactNumber: '',
    whatsappNumber: '',
    photos: [],
    videoUrl: '',
    status: 'Active',
    availabilityStatus: 'Available',
    verificationStatus: 'Pending',
    isFeatured: false,
    featuredOrder: 0,
    charges: {
      deposit: 5001,
      foodCharges: 'Included (3 times daily)',
      electricityCharges: 'As per sub-meter',
      maintenanceCharges: 300,
      otherCharges: 'None'
    },
    rooms: [
      { id: 'r_1', type: 'Single Sharing', rent: 12000, deposit: 8000, totalBeds: 4, availableBeds: 1, hasAC: true, hasAttachedBath: true },
      { id: 'r_2', type: '2 Sharing', rent: 8500, deposit: 5001, totalBeds: 10, availableBeds: 3, hasAC: true, hasAttachedBath: true }
    ],
    facilities: ['fac_food', 'fac_wifi', 'fac_ac', 'fac_wm', 'fac_cctv']
  });

  // Load locations & facilities on mount
  useEffect(() => {
    async function loadMetadata() {
      try {
        const [locRes, facRes] = await Promise.all([
          api.getFlatLocations(),
          api.getFacilities()
        ]);
        if (locRes.data) setFlatLocations(locRes.data);
        if (facRes.data) setAvailableFacilities(facRes.data);
      } catch (err) {
        console.error('Error fetching form metadata:', err);
      }
    }
    if (isOpen) {
      loadMetadata();
      if (pgToEdit) {
        setFormData({
          ...pgToEdit,
          charges: {
            deposit: pgToEdit.charges?.deposit || 0,
            foodCharges: pgToEdit.charges?.foodCharges || 'Included',
            electricityCharges: pgToEdit.charges?.electricityCharges || 'Included',
            maintenanceCharges: pgToEdit.charges?.maintenanceCharges || 0,
            otherCharges: pgToEdit.charges?.otherCharges || 'None'
          },
          rooms: pgToEdit.rooms || [],
          facilities: pgToEdit.facilities || [],
          photos: pgToEdit.photos || []
        });
      } else {
        setFormData({
          name: '',
          type: 'Boys',
          state: 'Kerala',
          city: 'Kochi',
          area: 'Kakkanad',
          fullAddress: '',
          mapUrl: '',
          description: '',
          contactNumber: '',
          whatsappNumber: '',
          photos: [],
          videoUrl: '',
          status: 'Active',
          availabilityStatus: 'Available',
          verificationStatus: 'Verified',
          isFeatured: false,
          featuredOrder: 0,
          charges: {
            deposit: 5001,
            foodCharges: 'Included (3 times daily)',
            electricityCharges: 'As per meter',
            maintenanceCharges: 300,
            otherCharges: 'None'
          },
          rooms: [
            { id: 'r_1', type: 'Single Sharing', rent: 12000, deposit: 8000, totalBeds: 4, availableBeds: 1, hasAC: true, hasAttachedBath: true },
            { id: 'r_2', type: '2 Sharing', rent: 8500, deposit: 5001, totalBeds: 10, availableBeds: 2, hasAC: true, hasAttachedBath: true }
          ],
          facilities: ['fac_food', 'fac_wifi', 'fac_ac', 'fac_wm', 'fac_cctv']
        });
      }
    }
  }, [isOpen, pgToEdit]);

  // Derived filtered cities and areas based on selected state and city
  const filteredCities = flatLocations.cities.filter(c => c.state?.toLowerCase() === formData.state?.toLowerCase());
  const currentCityObj = flatLocations.cities.find(c => c.name?.toLowerCase() === formData.city?.toLowerCase());
  const filteredAreas = currentCityObj ? (currentCityObj.areas || []) : [];

  // Add a new room sharing type
  const handleAddRoom = () => {
    const newRoom = {
      id: `r_${Date.now()}`,
      type: '3 Sharing',
      rent: 7000,
      deposit: 4000,
      totalBeds: 6,
      availableBeds: 2,
      hasAC: false,
      hasAttachedBath: true
    };
    setFormData(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
  };

  const handleRemoveRoom = (roomId) => {
    setFormData(prev => ({ ...prev, rooms: prev.rooms.filter(r => r.id !== roomId) }));
  };

  const handleRoomChange = (roomId, field, value) => {
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === roomId ? { ...r, [field]: value } : r)
    }));
  };

  // Toggle Facility selection
  const toggleFacility = (facId) => {
    setFormData(prev => {
      const exists = prev.facilities.includes(facId);
      return {
        ...prev,
        facilities: exists ? prev.facilities.filter(id => id !== facId) : [...prev.facilities, facId]
      };
    });
  };

  // Add / Remove Photo URLs
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    setFormData(prev => ({ ...prev, photos: [...prev.photos, newPhotoUrl.trim()] }));
    setNewPhotoUrl('');
  };
  const handlePhotoFiles = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    Promise.all(files.map(file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }))).then(newPhotos => {
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    }).catch(() => showToast('Could not read one or more photos', 'error'));
    event.target.value = '';
  };
  const handleRemovePhoto = (index) => {
    setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter the PG Name', 'error');
      return;
    }
    if (!formData.contactNumber.trim()) {
      showToast('Please provide a contact phone number', 'error');
      return;
    }

    setLoading(true);
    try {
      // Calculate total & available beds from rooms
      const totalBeds = formData.rooms.reduce((sum, r) => sum + (Number(r.totalBeds) || 0), 0);
      const availableBeds = formData.rooms.reduce((sum, r) => sum + (Number(r.availableBeds) || 0), 0);

      const payload = {
        ...formData,
        rooms: formData.rooms.map(r => ({
          ...r,
          rent: Number(r.rent) || 0,
          totalBeds: Number(r.totalBeds) || 0,
          availableBeds: Number(r.availableBeds) || 0,
          deposit: Number(r.deposit) || 0
        })),
        charges: {
          ...formData.charges,
          deposit: Number(formData.charges.deposit) || 0,
          maintenanceCharges: Number(formData.charges.maintenanceCharges) || 0
        },
        totalBeds,
        availableBeds
      };

      if (isEditing) {
        await api.updateProperty(pgToEdit.id, payload);
        showToast(`Updated "${formData.name}" successfully!`, 'success');
      } else {
        await api.createProperty(payload);
        showToast(`Added new PG "${formData.name}" successfully!`, 'success');
      }

      triggerRefresh();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to save property', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={isEditing ? `Edit Property: ${formData.name || 'PG'}` : 'Add New PG / Property'}
      subtitle="Configure property details, room sharings, pricing, dynamic locations, and amenities"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Publish PG Property')}
          </button>
        </>
      }
    >
      {/* Navigation Tabs inside Modal */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'basic' 
              ? 'border-brand-600 text-brand-600 dark:text-brand-400' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. Basic Info & Location</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rooms')}
          className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'rooms' 
              ? 'border-brand-600 text-brand-600 dark:text-brand-400' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>2. Rooms & Pricing ({formData.rooms.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('facilities')}
          className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'facilities' 
              ? 'border-brand-600 text-brand-600 dark:text-brand-400' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          <span>3. Facilities ({formData.facilities.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'media' 
              ? 'border-brand-600 text-brand-600 dark:text-brand-400' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>4. Photos & Media</span>
        </button>
      </div>

      {/* TAB 1: BASIC INFO & DYNAMIC LOCATION */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                PG / Property Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Royal Palms Luxury PG for Men"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                PG Type *
              </label>
              <CustomSelect
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                options={[
                  { value: 'Boys', label: 'Boys PG' },
                  { value: 'Girls', label: 'Girls PG / Hostel' },
                  { value: 'Co-living', label: 'Co-living Space' }
                ]}
              />
            </div>
          </div>

          {/* Dynamic Location Selectors */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                Dynamic Location Hierarchy (No Hardcoded Cities)
              </span>
              <span className="text-[11px] text-slate-400">Fed from Locations Manager</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">State</label>
                <CustomSelect
                  value={formData.state}
                  placeholder="Select State"
                  onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '', area: '' })}
                  options={flatLocations.states.map(st => ({ value: st.name, label: st.name }))}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">City</label>
                <CustomSelect
                  value={formData.city}
                  placeholder="Select City"
                  onChange={(e) => setFormData({ ...formData, city: e.target.value, area: '' })}
                  options={filteredCities.map(ct => ({ value: ct.name, label: ct.name }))}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Area / Locality</label>
                <input
                  list="area-list"
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g. Kakkanad or Electronic City"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
                <datalist id="area-list">
                  {filteredAreas.map(a => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Address
              </label>
              <textarea
                rows={2}
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                placeholder="Door No, Street name, Landmark, Pincode"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Google Maps Link / Coordinates
              </label>
              <input
                type="text"
                value={formData.mapUrl}
                onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-brand-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Helps students navigate directly via Google Maps app</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-600" />
                Contact Phone Number *
              </label>
              <input
                type="text"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="+91 98470 00000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp Number
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="+91 98470 00000 (Defaults to contact number)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Status Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Publish Status</label>
              <CustomSelect
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: 'Active', label: '🟢 Active' },
                  { value: 'Inactive', label: '🔴 Inactive' }
                ]}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Availability</label>
              <CustomSelect
                value={formData.availabilityStatus}
                onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                options={[
                  { value: 'Available', label: 'Available' },
                  { value: 'Limited', label: 'Limited Availability' },
                  { value: 'Full', label: 'Full / Unavailable' }
                ]}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Verification</label>
              <CustomSelect
                value={formData.verificationStatus}
                onChange={(e) => setFormData({ ...formData, verificationStatus: e.target.value })}
                options={[
                  { value: 'Verified', label: '🟢 Verified' },
                  { value: 'Pending', label: '🟡 Pending' },
                  { value: 'Not Verified', label: '🔴 Not Verified' }
                ]}
              />
            </div>

            <div className="flex flex-col justify-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">★ Mark as Featured</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description & Highlights
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe nearby landmarks, food options, room ambience, and rules..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* TAB 2: ROOM & PRICING MANAGEMENT */}
      {activeTab === 'rooms' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Multi-Room Sharings & Pricing
              </h4>
              <p className="text-[11px] text-slate-500">Add different room types (Single, 2 sharing, 3 sharing, etc.) with custom rates</p>
            </div>
            <button
              type="button"
              onClick={handleAddRoom}
              className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Room Type</span>
            </button>
          </div>

          {/* Rooms List */}
          <div className="space-y-3">
            {formData.rooms.map((room, idx) => (
              <div key={room.id || idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-brand-600" />
                    Room Option #{idx + 1}
                  </span>
                  {formData.rooms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRoom(room.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sharing Type</label>
                    <CustomSelect
                      value={room.type}
                      onChange={(e) => handleRoomChange(room.id, 'type', e.target.value)}
                      options={[
                        { value: 'Single Sharing', label: 'Single Sharing' },
                        { value: 'Single Studio', label: 'Single Studio' },
                        { value: '2 Sharing', label: '2 Sharing' },
                        { value: '3 Sharing', label: '3 Sharing' },
                        { value: '4 Sharing', label: '4 Sharing' },
                        { value: 'Dormitory', label: 'Dormitory' }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      value={room.rent ?? ''}
                      onChange={(e) => handleRoomChange(room.id, 'rent', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full mt-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-brand-600 dark:text-brand-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Total Beds</label>
                    <input
                      type="number"
                      value={room.totalBeds ?? ''}
                      onChange={(e) => handleRoomChange(room.id, 'totalBeds', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full mt-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Available Beds</label>
                    <input
                      type="number"
                      value={room.availableBeds ?? ''}
                      onChange={(e) => handleRoomChange(room.id, 'availableBeds', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full mt-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={room.hasAC}
                      onChange={(e) => handleRoomChange(room.id, 'hasAC', e.target.checked)}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span>AC Room</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={room.hasAttachedBath}
                      onChange={(e) => handleRoomChange(room.id, 'hasAttachedBath', e.target.checked)}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span>Attached Bathroom</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Charges Policy Section */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Deposit & Additional Charges Policy
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Security Deposit (₹)
                </label>
                <input
                  type="number"
                  value={formData.charges.deposit ?? ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    charges: { ...formData.charges, deposit: e.target.value === '' ? '' : Number(e.target.value) }
                  })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Food Policy
                </label>
                <input
                  type="text"
                  value={formData.charges.foodCharges}
                  onChange={(e) => setFormData({
                    ...formData,
                    charges: { ...formData.charges, foodCharges: e.target.value }
                  })}
                  placeholder="e.g. Included / ₹3,000 optional"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Electricity Charges
                </label>
                <input
                  type="text"
                  value={formData.charges.electricityCharges}
                  onChange={(e) => setFormData({
                    ...formData,
                    charges: { ...formData.charges, electricityCharges: e.target.value }
                  })}
                  placeholder="e.g. As per meter / Included"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Maintenance Charges (₹/mo)
                </label>
                <input
                  type="number"
                  value={formData.charges.maintenanceCharges ?? ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    charges: { ...formData.charges, maintenanceCharges: e.target.value === '' ? '' : Number(e.target.value) }
                  })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Other Charges (if any)
                </label>
                <input
                  type="text"
                  value={formData.charges.otherCharges}
                  onChange={(e) => setFormData({
                    ...formData,
                    charges: { ...formData.charges, otherCharges: e.target.value }
                  })}
                  placeholder="e.g. None or ₹200 one-time registration"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC FACILITIES */}
      {activeTab === 'facilities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Select Available Amenities & Facilities
              </h4>
              <p className="text-[11px] text-slate-500">Check all amenities available at this PG. New facilities can be added anytime in Facilities Manager.</p>
            </div>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
              {formData.facilities.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {availableFacilities.map(fac => {
              const isSelected = formData.facilities.includes(fac.id);
              return (
                <button
                  key={fac.id}
                  type="button"
                  onClick={() => toggleFacility(fac.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs transition-all ${
                    isSelected 
                      ? 'border-brand-500 bg-brand-50/80 text-brand-900 dark:bg-brand-950/60 dark:text-brand-200 shadow-sm font-semibold' 
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    <DynamicIcon name={fac.icon} className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{fac.name}</p>
                    <p className="text-[10px] text-slate-400 font-normal">{fac.category || 'General'}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: PHOTOS & MEDIA */}
      {activeTab === 'media' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Add Photo
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or hosted image link"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-brand-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl"
              >
                Add URL
              </button>
            </div>
            <label className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              Choose from device
              <input type="file" accept="image/*" multiple onChange={handlePhotoFiles} className="sr-only" />
            </label>
          </div>

          {/* Photos Grid */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Photo Gallery ({formData.photos.length})
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {formData.photos.map((url, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-800">
                  <img src={url} alt={`PG Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            {!formData.photos.length && <p className="text-xs text-slate-400">No photos added yet.</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-rose-500" />
              Property Video Walkthrough URL (YouTube / Drive)
            </label>
            <input
              type="text"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
