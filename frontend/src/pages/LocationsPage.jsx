import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Globe, 
  Building, 
  Navigation, 
  Check, 
  AlertCircle,
  Search
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { CustomSelect } from '../components/ui/select';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const LocationsPage = () => {
  const { showToast, currentUser, triggerRefresh } = useApp();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Modals state
  const [isAddStateModalOpen, setIsAddStateModalOpen] = useState(false);
  const [isAddCityModalOpen, setIsAddCityModalOpen] = useState(false);
  const [isAddAreaModalOpen, setIsAddAreaModalOpen] = useState(false);

  // Form Inputs
  const [stateForm, setStateForm] = useState({ name: '', code: '' });
  const [cityForm, setCityForm] = useState({ cityName: '', code: '', stateName: '' });
  const [areaForm, setAreaForm] = useState({ areaName: '', cityName: '' });

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await api.getLocations();
      if (res.data) {
        setLocations(res.data);
        // Select first state & city by default if none selected
        if (res.data[0]?.states?.[0]) {
          const firstState = res.data[0].states[0];
          setSelectedState(firstState);
          if (firstState.cities?.[0]) {
            setSelectedCity(firstState.cities[0]);
          }
        }
      }
    } catch (err) {
      showToast('Failed to load locations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Handler: Add State
  const handleAddState = async (e) => {
    e.preventDefault();
    if (!stateForm.name.trim()) return;
    try {
      await api.addState(stateForm);
      showToast(`Added State "${stateForm.name}" successfully!`, 'success');
      setIsAddStateModalOpen(false);
      setStateForm({ name: '', code: '' });
      fetchLocations();
      triggerRefresh();
    } catch (err) {
      showToast('Failed to add state', 'error');
    }
  };

  // Handler: Add City
  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!cityForm.cityName.trim() || !cityForm.stateName) return;
    try {
      await api.addCity(cityForm);
      showToast(`Added City "${cityForm.cityName}" to ${cityForm.stateName}!`, 'success');
      setIsAddCityModalOpen(false);
      setCityForm({ cityName: '', code: '', stateName: '' });
      fetchLocations();
      triggerRefresh();
    } catch (err) {
      showToast('Failed to add city', 'error');
    }
  };

  // Handler: Add Area
  const handleAddArea = async (e) => {
    e.preventDefault();
    if (!areaForm.areaName.trim() || !areaForm.cityName) return;
    try {
      await api.addArea(areaForm);
      showToast(`Added Area "${areaForm.areaName}" to ${areaForm.cityName}!`, 'success');
      setIsAddAreaModalOpen(false);
      setAreaForm({ areaName: '', cityName: '' });
      fetchLocations();
      triggerRefresh();
    } catch (err) {
      showToast('Failed to add area', 'error');
    }
  };

  // Handler: Delete Area
  const handleDeleteArea = async (cityName, areaName) => {
    if (!currentUser.permissions.canManageLocations) {
      showToast('Permission Denied', 'error');
      return;
    }
    if (window.confirm(`Remove area "${areaName}" from ${cityName}?`)) {
      try {
        await api.deleteArea(cityName, areaName);
        showToast(`Area removed`, 'success');
        fetchLocations();
        triggerRefresh();
      } catch (err) {
        showToast('Failed to delete area', 'error');
      }
    }
  };

  // Handler: Delete City
  const handleDeleteCity = async (city) => {
    if (!currentUser.permissions.canManageLocations) {
      showToast('Permission Denied', 'error');
      return;
    }
    if (window.confirm(`Delete city "${city.name}" and all its areas?`)) {
      try {
        await api.deleteCity(city.id);
        showToast(`City deleted`, 'success');
        fetchLocations();
        triggerRefresh();
      } catch (err) {
        showToast('Failed to delete city', 'error');
      }
    }
  };

  const allStates = (locations[0]?.states || []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-brand-600" />
            Dynamic Location Management (Module 4)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add new states, cities, and localities dynamically on the fly without changing code
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddStateModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Add State
          </button>
          <button
            onClick={() => {
              setCityForm(prev => ({ ...prev, stateName: selectedState?.name || allStates[0]?.name || '' }));
              setIsAddCityModalOpen(true);
            }}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Add City
          </button>
          <button
            onClick={() => {
              setAreaForm(prev => ({ ...prev, cityName: selectedCity?.name || '' }));
              setIsAddAreaModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all"
          >
            Add Area / Locality
          </button>
        </div>
      </div>

      {/* 3-Column Hierarchy Explorer: State -> City -> Areas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: States */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-600" />
              1. States ({allStates.length})
            </span>
            <button
              onClick={() => setIsAddStateModalOpen(true)}
              className="text-[11px] font-bold text-brand-600 hover:underline"
            >
              Add State
            </button>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {allStates.map(st => {
              const isSelected = selectedState?.id === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => {
                    setSelectedState(st);
                    setSelectedCity(st.cities?.[0] || null);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all ${
                    isSelected 
                      ? 'bg-brand-50 text-brand-900 dark:bg-brand-950/70 dark:text-brand-300 font-bold border border-brand-200 dark:border-brand-800' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black">
                      {st.code || st.name.substring(0, 2).toUpperCase()}
                    </span>
                    <span>{st.name}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {st.cities?.length || 0} cities
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Cities */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-600" />
              2. Cities in {selectedState?.name || 'State'}
            </span>
            <button
              onClick={() => {
                setCityForm(prev => ({ ...prev, stateName: selectedState?.name || '' }));
                setIsAddCityModalOpen(true);
              }}
              className="text-[11px] font-bold text-sky-600 hover:underline"
            >
              Add City
            </button>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {(selectedState?.cities || []).length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No cities yet in {selectedState?.name}</p>
            ) : (
              (selectedState?.cities || []).map(ct => {
                const isSelected = selectedCity?.id === ct.id;
                return (
                  <div
                    key={ct.id}
                    onClick={() => setSelectedCity(ct)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer text-xs transition-all ${
                      isSelected 
                        ? 'bg-sky-50 text-sky-900 dark:bg-sky-950/70 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{ct.name}</p>
                      <p className="text-[10px] text-slate-400 font-normal">Code: {ct.code || 'N/A'}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-semibold">
                        {ct.areas?.length || 0} areas
                      </span>
                      {currentUser.permissions.canManageLocations && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCity(ct);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Delete City"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 3: Areas / Localities */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-purple-600" />
              3. Areas in {selectedCity?.name || 'City'}
            </span>
            <button
              onClick={() => {
                setAreaForm(prev => ({ ...prev, cityName: selectedCity?.name || '' }));
                setIsAddAreaModalOpen(true);
              }}
              className="text-[11px] font-bold text-purple-600 hover:underline"
            >
              Add Area
            </button>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {(selectedCity?.areas || []).length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No areas added yet for {selectedCity?.name}</p>
            ) : (
              (selectedCity?.areas || []).map((areaName, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    {areaName}
                  </span>

                  {currentUser.permissions.canManageLocations && (
                    <button
                      onClick={() => handleDeleteArea(selectedCity.name, areaName)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove Area"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Modal: Add State */}
      <Modal
        isOpen={isAddStateModalOpen}
        onClose={() => setIsAddStateModalOpen(false)}
        title="Add New State"
        subtitle="Expand KeralaPG to new states (e.g. Kerala, Karnataka, Tamil Nadu, Telangana)"
      >
        <form onSubmit={handleAddState} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">State Name *</label>
            <input
              type="text"
              value={stateForm.name}
              onChange={(e) => setStateForm({ ...stateForm, name: e.target.value })}
              placeholder="e.g. Kerala, Karnataka, Maharashtra"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">State Code (2 Letters)</label>
            <input
              type="text"
              value={stateForm.code}
              onChange={(e) => setStateForm({ ...stateForm, code: e.target.value.toUpperCase() })}
              placeholder="e.g. KL, KA, MH"
              maxLength={3}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddStateModalOpen(false)}
              className="px-4 py-2 text-xs rounded-xl text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl shadow-md"
            >
              Save State
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add City */}
      <Modal
        isOpen={isAddCityModalOpen}
        onClose={() => setIsAddCityModalOpen(false)}
        title="Add New City"
        subtitle="Add a city under any state for immediate PG listings"
      >
        <form onSubmit={handleAddCity} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select State *</label>
            <CustomSelect
              value={cityForm.stateName}
              onChange={(e) => setCityForm({ ...cityForm, stateName: e.target.value })}
              placeholder="Select State"
              options={allStates.map(st => ({ value: st.name, label: st.name }))}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">City Name *</label>
            <input
              type="text"
              value={cityForm.cityName}
              onChange={(e) => setCityForm({ ...cityForm, cityName: e.target.value })}
              placeholder="e.g. Bangalore, Kochi, Calicut, Trivandrum"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">City Airport/Short Code</label>
            <input
              type="text"
              value={cityForm.code}
              onChange={(e) => setCityForm({ ...cityForm, code: e.target.value.toUpperCase() })}
              placeholder="e.g. BLR, COK, CCJ"
              maxLength={4}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddCityModalOpen(false)}
              className="px-4 py-2 text-xs rounded-xl text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl shadow-md"
            >
              Save City
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Area */}
      <Modal
        isOpen={isAddAreaModalOpen}
        onClose={() => setIsAddAreaModalOpen(false)}
        title="Add Locality / Area"
        subtitle="Add specific tech park localities, neighborhoods, and hubs"
      >
        <form onSubmit={handleAddArea} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target City *</label>
            <CustomSelect
              value={areaForm.cityName}
              onChange={(e) => setAreaForm({ ...areaForm, cityName: e.target.value })}
              placeholder="Select City"
              options={allStates.flatMap(s => (s.cities || [])).map(c => ({ value: c.name, label: c.name }))}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Area / Locality Name *</label>
            <input
              type="text"
              value={areaForm.areaName}
              onChange={(e) => setAreaForm({ ...areaForm, areaName: e.target.value })}
              placeholder="e.g. Infopark South Gate, Electronic City Phase 2, Marathahalli"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddAreaModalOpen(false)}
              className="px-4 py-2 text-xs rounded-xl text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl shadow-md"
            >
              Save Area
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
