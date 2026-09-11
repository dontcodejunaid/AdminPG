import { supabase, isSupabaseConfigured } from './supabase.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/store.json');

export async function clearAllDummyData() {
  console.log('🧹 Clearing dummy seed data from Supabase & local store...');

  // 1. Clear Supabase Database Tables if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      console.log('Deleting dummy properties...');
      await supabase.from('properties').delete().neq('id', 'keep_none');

      console.log('Deleting dummy enquiries...');
      await supabase.from('enquiries').delete().neq('id', 'keep_none');

      console.log('Deleting dummy customers...');
      await supabase.from('customers').delete().neq('id', 'keep_none');

      console.log('Deleting dummy reports...');
      await supabase.from('reports').delete().neq('id', 'keep_none');

      console.log('Deleting dummy payments...');
      await supabase.from('payments').delete().neq('id', 'keep_none');

      console.log('Deleting dummy banners...');
      await supabase.from('banners').delete().neq('id', 'keep_none');

      console.log('Deleting dummy notifications...');
      await supabase.from('notifications').delete().neq('id', 'keep_none');

      // Keep only Super Admin in profiles
      console.log('Resetting profiles to only Super Admin...');
      await supabase.from('profiles').delete().neq('email', 'superadmin@keralapg.com');
      
      // Ensure Super Admin exists
      await supabase.from('profiles').upsert({
        id: 'usr_1',
        email: 'superadmin@keralapg.com',
        password_hash: 'KeralaPG@123',
        name: 'Super Admin',
        phone: '+91 98470 11111',
        role: 'Super Admin',
        status: 'Active',
        permissions: {
          canAddPG: true,
          canEditPG: true,
          canDeletePG: true,
          canVerifyPG: true,
          canManageLocations: true,
          canManageFacilities: true,
          canManageEnquiries: true,
          canManageCustomers: true,
          canModerateReports: true,
          canManagePayments: true,
          canManageCMS: true,
          canManageBanners: true,
          canManageUsers: true
        }
      }, { onConflict: 'email' });

      console.log('✅ Supabase database cleared of all dummy listings, enquiries, reports, and payments.');
    } catch (err) {
      console.error('Error clearing Supabase tables:', err.message);
    }
  }

  // 2. Clear local store.json
  try {
    const cleanStore = {
      locations: [
        {
          id: "loc_in",
          name: "India",
          code: "IN",
          type: "country",
          states: [
            {
              id: "state_kl",
              name: "Kerala",
              code: "KL",
              type: "state",
              cities: [
                { id: "city_kochi", name: "Kochi", code: "COK", areas: ["Kakkanad", "Edappally", "Kaloor", "Infopark Campus"] },
                { id: "city_tvm", name: "Thiruvananthapuram", code: "TRV", areas: ["Kazhakkoottam (Technopark)", "Pattom"] },
                { id: "city_clt", name: "Kozhikode", code: "CCJ", areas: ["Cyberpark", "Hilite City"] }
              ]
            }
          ]
        }
      ],
      facilities: [
        { id: "fac_food", name: "3 Times Food (Kerala / Veg & Non-Veg)", icon: "Utensils", category: "Food & Dining", isDefault: true },
        { id: "fac_wifi", name: "High Speed Wi-Fi (100+ Mbps)", icon: "Wifi", category: "Connectivity", isDefault: true },
        { id: "fac_ac", name: "Air Conditioner (AC)", icon: "Wind", category: "Comfort", isDefault: true },
        { id: "fac_wm", name: "Automatic Washing Machine", icon: "Shirt", category: "Laundry", isDefault: true },
        { id: "fac_cctv", name: "24/7 CCTV & Security Guard", icon: "ShieldCheck", category: "Security", isDefault: true },
        { id: "fac_housekeep", name: "Daily Housekeeping", icon: "Brush", category: "Cleaning", isDefault: true },
        { id: "fac_hotwater", name: "24x7 Geyser / Hot Water", icon: "Flame", category: "Bathroom", isDefault: true },
        { id: "fac_parking", name: "2 & 4 Wheeler Parking", icon: "Car", category: "Vehicle", isDefault: true },
        { id: "fac_power", name: "Full Power Backup (Generator / Inverter)", icon: "Zap", category: "Utility", isDefault: true }
      ],
      properties: [],
      enquiries: [],
      customers: [],
      reportedListings: [],
      reports: [],
      payments: [],
      banners: [],
      notifications: [],
      cmsPages: {
        aboutUs: {
          title: "About KeralaPG.com",
          subtitle: "Kerala & Bangalore's #1 Dedicated Paying Guest & Hostel Discovery Platform",
          content: "KeralaPG.com was founded with a single mission: to make finding verified, safe, and comfortable Paying Guest (PG) accommodations completely hassle-free.",
          statsHighlight: []
        },
        contactUs: {
          phone: "+91 98470 00000",
          whatsapp: "+91 98470 00000",
          email: "support@keralapg.com",
          officeAddress: "4th Floor, Infopark TBC, Kakkanad, Kochi, Kerala 682030"
        }
      },
      adminUsers: [
        {
          id: "usr_1",
          name: "Super Admin",
          email: "superadmin@keralapg.com",
          role: "Super Admin",
          phone: "+91 98470 11111",
          password: "KeralaPG@123",
          status: "Active",
          permissions: {
            canAddPG: true,
            canEditPG: true,
            canDeletePG: true,
            canVerifyPG: true,
            canManageLocations: true,
            canManageFacilities: true,
            canManageEnquiries: true,
            canManageCustomers: true,
            canModerateReports: true,
            canManagePayments: true,
            canManageCMS: true,
            canManageBanners: true,
            canManageUsers: true
          }
        }
      ]
    };

    await fs.writeFile(DATA_FILE, JSON.stringify(cleanStore, null, 2), 'utf8');
    console.log('✅ Local store.json reset with empty collections.');
  } catch (err) {
    console.error('Error resetting store.json:', err.message);
  }
}

// Auto-run if executed directly
if (process.argv[1]?.endsWith('cleanDb.js')) {
  clearAllDummyData().then(() => process.exit(0));
}
