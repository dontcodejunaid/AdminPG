import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/locations
router.get('/', async (req, res) => {
  try {
    const locations = await store.findAll('locations');
    res.json({ success: true, data: locations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Helper flat list of all states, cities and areas for dropdowns
router.get('/flat', async (req, res) => {
  try {
    const locations = await store.findAll('locations');
    const flatStates = [];
    const flatCities = [];
    const flatAreas = [];

    locations.forEach(country => {
      (country.states || []).forEach(state => {
        flatStates.push({ id: state.id, name: state.name, country: country.name });
        (state.cities || []).forEach(city => {
          flatCities.push({ id: city.id, name: city.name, state: state.name, country: country.name, areas: city.areas || [] });
          (city.areas || []).forEach(area => {
            flatAreas.push({ name: area, city: city.name, state: state.name });
          });
        });
      });
    });

    res.json({
      success: true,
      data: {
        states: flatStates,
        cities: flatCities,
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

    const locations = await store.findAll('locations');
    let country = locations.find(c => c.name.toLowerCase() === countryName.toLowerCase()) || locations[0];

    if (!country.states) country.states = [];
    const newState = {
      id: `state_${uuidv4().substring(0, 6)}`,
      name,
      code: code || name.substring(0, 2).toUpperCase(),
      type: 'state',
      cities: []
    };

    country.states.push(newState);
    await store.setCollection('locations', locations);

    res.status(201).json({ success: true, data: newState });
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

    const locations = await store.findAll('locations');
    let stateFound = null;

    for (const c of locations) {
      const s = (c.states || []).find(st => st.name.toLowerCase() === stateName.toLowerCase());
      if (s) {
        stateFound = s;
        break;
      }
    }

    if (!stateFound) {
      return res.status(404).json({ success: false, error: `State "${stateName}" not found. Please create the state first.` });
    }

    if (!stateFound.cities) stateFound.cities = [];
    const newCity = {
      id: `city_${uuidv4().substring(0, 6)}`,
      name: cityName,
      code: code || cityName.substring(0, 3).toUpperCase(),
      areas: Array.isArray(areas) ? areas : []
    };

    stateFound.cities.push(newCity);
    await store.setCollection('locations', locations);

    res.status(201).json({ success: true, data: newCity });
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

    const locations = await store.findAll('locations');
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

    if (!cityFound) {
      return res.status(404).json({ success: false, error: `City "${cityName}" not found.` });
    }

    if (!cityFound.areas) cityFound.areas = [];
    if (!cityFound.areas.includes(areaName)) {
      cityFound.areas.push(areaName);
      await store.setCollection('locations', locations);
    }

    res.status(201).json({ success: true, data: { cityName, areaName, areas: cityFound.areas } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/locations/city/:cityId
router.delete('/city/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const locations = await store.findAll('locations');

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
    const locations = await store.findAll('locations');

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
