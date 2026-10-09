import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/locations (Dynamically merged with all property areas & cities)
router.get('/', async (req, res) => {
  try {
    const locations = await store.getLocations();
    const properties = await store.findAll('properties');

    // Dynamically clone and merge any missing states, cities, or areas present in properties
    const merged = JSON.parse(JSON.stringify(locations || []));
    if (merged.length === 0) {
      merged.push({ id: 'loc_in', name: 'India', code: 'IN', states: [] });
    }
    const country = merged[0];
    if (!country.states) country.states = [];

    (properties || []).forEach(p => {
      if (!p.state) return;
      let stateObj = country.states.find(s => s.name?.toLowerCase() === p.state.toLowerCase());
      if (!stateObj) {
        stateObj = {
          id: `state_${p.state.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          name: p.state,
          code: p.state.substring(0, 2).toUpperCase(),
          type: 'state',
          cities: []
        };
        country.states.push(stateObj);
      }
      if (!stateObj.cities) stateObj.cities = [];

      if (p.city) {
        let cityObj = stateObj.cities.find(c => c.name?.toLowerCase() === p.city.toLowerCase());
        if (!cityObj) {
          cityObj = {
            id: `city_${p.city.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
            name: p.city,
            code: p.city.substring(0, 3).toUpperCase(),
            areas: []
          };
          stateObj.cities.push(cityObj);
        }
        if (!cityObj.areas) cityObj.areas = [];

        if (p.area) {
          const areaTrimmed = p.area.trim();
          const exists = cityObj.areas.some(a => (typeof a === 'string' ? a : a.name)?.toLowerCase() === areaTrimmed.toLowerCase());
          if (!exists) {
            cityObj.areas.push(areaTrimmed);
          }
        }
      }
    });

    res.json({ success: true, data: merged });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Helper flat list of all states, cities and areas for dropdowns (dynamically aggregated from Locations database & Properties)
router.get('/flat', async (req, res) => {
  try {
    const locations = await store.getLocations();
    const properties = await store.findAll('properties');
    const flatAreas = [];

    const stateMap = new Map();
    const cityMap = new Map();
    const areaSet = new Set();

    (locations || []).forEach(country => {
      (country.states || []).forEach(state => {
        if (state.name && !stateMap.has(state.name.toLowerCase())) {
          stateMap.set(state.name.toLowerCase(), { id: state.id, name: state.name, country: country.name });
        }
        (state.cities || []).forEach(city => {
          if (city.name && !cityMap.has(`${state.name}_${city.name}`.toLowerCase())) {
            cityMap.set(`${state.name}_${city.name}`.toLowerCase(), {
              id: city.id,
              name: city.name,
              state: state.name,
              country: country.name,
              areas: city.areas || []
            });
          }
          (city.areas || []).forEach(area => {
            if (area) {
              const key = `${state.name}_${city.name}_${area}`.toLowerCase();
              if (!areaSet.has(key)) {
                areaSet.add(key);
                flatAreas.push({ name: area, city: city.name, state: state.name });
              }
            }
          });
        });
      });
    });

    // Dynamically include any states, cities, or areas present on existing properties in database
    (properties || []).forEach(p => {
      if (p.state && !stateMap.has(p.state.toLowerCase())) {
        stateMap.set(p.state.toLowerCase(), { id: `st_${Date.now()}_${Math.random()}`, name: p.state, country: 'India' });
      }
      if (p.city) {
        const cityKey = `${p.state || ''}_${p.city}`.toLowerCase();
        if (!cityMap.has(cityKey)) {
          cityMap.set(cityKey, {
            id: `ct_${Date.now()}_${Math.random()}`,
            name: p.city,
            state: p.state || '',
            country: 'India',
            areas: p.area ? [p.area] : []
          });
        } else if (p.area) {
          const cObj = cityMap.get(cityKey);
          if (!cObj.areas.includes(p.area)) {
            cObj.areas.push(p.area);
          }
        }
      }
      if (p.area) {
        const aKey = `${p.state || ''}_${p.city || ''}_${p.area}`.toLowerCase();
        if (!areaSet.has(aKey)) {
          areaSet.add(aKey);
          flatAreas.push({ name: p.area, city: p.city || '', state: p.state || '' });
        }
      }
    });

    res.json({
      success: true,
      data: {
        states: Array.from(stateMap.values()),
        cities: Array.from(cityMap.values()),
        areas: flatAreas
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/locations/state
router.post('/state', async (req, res) => {
  try {
    const { name, code, countryName = "India" } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'State name is required' });

    await store.addState({ name, code, countryName });
    const locations = await store.getLocations();
    let country = locations.find(c => c.name.toLowerCase() === countryName.toLowerCase()) || locations[0];

    if (!country.states) country.states = [];
    const newState = {
      id: `state_${uuidv4().substring(0, 6)}`,
      name,
      code: code || name.substring(0, 2).toUpperCase(),
      type: 'state',
      cities: []
    };

    const existingState = country.states.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (!existingState) {
      country.states.push(newState);
      await store.setCollection('locations', locations);
    }

    res.status(201).json({ success: true, data: existingState || newState });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/locations/city
router.post('/city', async (req, res) => {
  try {
    const { stateName, cityName, code, areas = [] } = req.body;
    if (!stateName || !cityName) {
      return res.status(400).json({ success: false, error: 'State name and City name are required' });
    }

    await store.addCity({ stateName, cityName, code, areas });
    const locations = await store.getLocations();
    let country = locations[0] || { id: 'loc_in', name: 'India', code: 'IN', states: [] };
    if (!country.states) country.states = [];

    let stateFound = null;
    for (const c of locations) {
      const s = (c.states || []).find(st => st.name.toLowerCase() === stateName.toLowerCase());
      if (s) {
        stateFound = s;
        break;
      }
    }

    if (!stateFound) {
      stateFound = {
        id: `state_${uuidv4().substring(0, 6)}`,
        name: stateName,
        code: stateName.substring(0, 2).toUpperCase(),
        type: 'state',
        cities: []
      };
      country.states.push(stateFound);
    }

    if (stateFound) {
      if (!stateFound.cities) stateFound.cities = [];
      const existingCity = stateFound.cities.find(ct => ct.name.toLowerCase() === cityName.toLowerCase());
      if (!existingCity) {
        const newCity = {
          id: `city_${uuidv4().substring(0, 6)}`,
          name: cityName,
          code: code || cityName.substring(0, 3).toUpperCase(),
          areas: Array.isArray(areas) ? areas : []
        };
        stateFound.cities.push(newCity);
      } else if (Array.isArray(areas) && areas.length > 0) {
        if (!existingCity.areas) existingCity.areas = [];
        areas.forEach(a => {
          if (a && !existingCity.areas.some(ex => (typeof ex === 'string' ? ex : ex.name)?.toLowerCase() === a.toLowerCase())) {
            existingCity.areas.push(a);
          }
        });
      }
      await store.setCollection('locations', locations);
    }

    res.status(201).json({ success: true, data: { name: cityName, code, areas } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/locations/area
router.post('/area', async (req, res) => {
  try {
    const { cityName, areaName } = req.body;
    if (!cityName || !areaName) {
      return res.status(400).json({ success: false, error: 'City name and Area name are required' });
    }

    await store.addArea({ cityName, areaName });
    const locations = await store.getLocations();
    let cityFound = null;

    for (const c of locations) {
      for (const st of (c.states || [])) {
        const ct = (st.cities || []).find(city => city.name.toLowerCase() === cityName.toLowerCase());
        if (ct) {
          cityFound = ct;
          break;
        }
      }
      if (cityFound) break;
    }

    if (cityFound) {
      if (!cityFound.areas) cityFound.areas = [];
      if (!cityFound.areas.some(a => (typeof a === 'string' ? a : a.name)?.toLowerCase() === areaName.toLowerCase())) {
        cityFound.areas.push(areaName);
        await store.setCollection('locations', locations);
      }
    }

    res.status(201).json({ success: true, data: { cityName, areaName } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/locations/city/:cityId
router.delete('/city/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    await store.deleteCity(cityId);

    const locations = await store.getLocations();
    locations.forEach(c => {
      (c.states || []).forEach(st => {
        if (st.cities) {
          st.cities = st.cities.filter(ct => ct.id !== cityId);
        }
      });
    });

    await store.setCollection('locations', locations);
    res.json({ success: true, message: 'City deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/locations/area (remove area from city)
router.delete('/area', async (req, res) => {
  try {
    const { cityName, areaName } = req.body;
    await store.deleteArea({ cityName, areaName });

    const locations = await store.getLocations();
    locations.forEach(c => {
      (c.states || []).forEach(st => {
        (st.cities || []).forEach(ct => {
          if (ct.name.toLowerCase() === cityName.toLowerCase() && ct.areas) {
            ct.areas = ct.areas.filter(a => a.toLowerCase() !== areaName.toLowerCase());
          }
        });
      });
    });

    await store.setCollection('locations', locations);
    res.json({ success: true, message: 'Area deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
