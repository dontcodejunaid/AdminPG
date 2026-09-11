-- ==============================================================================
-- KeralaPG.com - Supabase Seed Data (PostgreSQL)
-- Run this in your Supabase SQL Editor after running supabase_schema.sql
-- ==============================================================================

-- 1. Insert Initial User Profiles (Super Admin, Operations Admin, Staff)
INSERT INTO public.profiles (id, email, password_hash, name, phone, role, status, permissions)
VALUES 
(
  'usr_1',
  'superadmin@keralapg.com',
  'KeralaPG@123',
  'Super Admin',
  '+91 98470 11111',
  'Super Admin',
  'Active',
  '{"canAddPG": true, "canEditPG": true, "canDeletePG": true, "canVerifyPG": true, "canManageLocations": true, "canManageFacilities": true, "canManageEnquiries": true, "canManageCustomers": true, "canModerateReports": true, "canManagePayments": true, "canManageCMS": true, "canManageBanners": true, "canManageUsers": true}'::jsonb
),
(
  'usr_2',
  'admin@keralapg.com',
  'KeralaPG@123',
  'Father / Operations Manager',
  '+91 98470 22222',
  'Admin',
  'Active',
  '{"canAddPG": true, "canEditPG": true, "canDeletePG": true, "canVerifyPG": true, "canManageLocations": true, "canManageFacilities": true, "canManageEnquiries": true, "canManageCustomers": true, "canModerateReports": true, "canManagePayments": false, "canManageCMS": true, "canManageBanners": true, "canManageUsers": false}'::jsonb
),
(
  'usr_3',
  'staff@keralapg.com',
  'KeralaPG@123',
  'Staff Member / Field Executive',
  '+91 98470 33333',
  'Staff',
  'Active',
  '{"canAddPG": true, "canEditPG": true, "canDeletePG": false, "canVerifyPG": false, "canManageLocations": false, "canManageFacilities": false, "canManageEnquiries": true, "canManageCustomers": false, "canModerateReports": false, "canManagePayments": false, "canManageCMS": false, "canManageBanners": false, "canManageUsers": false}'::jsonb
)
ON CONFLICT (email) DO NOTHING;

-- 2. Insert States
INSERT INTO public.locations_states (id, name, code, country)
VALUES
  ('state_kl', 'Kerala', 'KL', 'India'),
  ('state_ka', 'Karnataka', 'KA', 'India'),
  ('state_tn', 'Tamil Nadu', 'TN', 'India')
ON CONFLICT (name) DO NOTHING;

-- 3. Insert Cities
INSERT INTO public.locations_cities (id, state_id, state_name, name, code, display_order)
VALUES
  ('city_kochi', 'state_kl', 'Kerala', 'Kochi', 'COK', 1),
  ('city_tvm', 'state_kl', 'Kerala', 'Thiruvananthapuram', 'TRV', 2),
  ('city_clt', 'state_kl', 'Kerala', 'Kozhikode', 'CCJ', 3),
  ('city_blr', 'state_ka', 'Karnataka', 'Bangalore', 'BLR', 4),
  ('city_chn', 'state_tn', 'Tamil Nadu', 'Chennai', 'MAA', 5),
  ('city_cbe', 'state_tn', 'Tamil Nadu', 'Coimbatore', 'CJB', 6)
ON CONFLICT (state_id, name) DO NOTHING;

-- 4. Insert Areas
INSERT INTO public.locations_areas (id, city_id, city_name, name, pincode, is_popular)
VALUES
  ('area_kakkanad', 'city_kochi', 'Kochi', 'Kakkanad', '682030', true),
  ('area_edappally', 'city_kochi', 'Kochi', 'Edappally', '682024', true),
  ('area_kaloor', 'city_kochi', 'Kochi', 'Kaloor', '682017', false),
  ('area_infopark', 'city_kochi', 'Kochi', 'Infopark Campus', '682042', true),
  ('area_technopark', 'city_tvm', 'Thiruvananthapuram', 'Kazhakkoottam (Technopark)', '695581', true),
  ('area_pattom', 'city_tvm', 'Thiruvananthapuram', 'Pattom', '695004', false),
  ('area_cyberpark', 'city_clt', 'Kozhikode', 'Cyberpark', '673016', true),
  ('area_ecity', 'city_blr', 'Bangalore', 'Electronic City Phase 1', '560100', true),
  ('area_koramangala', 'city_blr', 'Bangalore', 'Koramangala', '560034', true),
  ('area_hsr', 'city_blr', 'Bangalore', 'HSR Layout', '560102', true),
  ('area_omr', 'city_chn', 'Chennai', 'OMR', '600096', true)
ON CONFLICT (city_id, name) DO NOTHING;

-- 5. Insert Facilities
INSERT INTO public.facilities (id, name, icon, category, is_default, is_active)
VALUES
  ('fac_food', '3 Times Food (Kerala / Veg & Non-Veg)', 'Utensils', 'Food & Dining', true, true),
  ('fac_wifi', 'High Speed Wi-Fi (100+ Mbps)', 'Wifi', 'Connectivity', true, true),
  ('fac_ac', 'Air Conditioner (AC)', 'Wind', 'Comfort', true, true),
  ('fac_wm', 'Automatic Washing Machine', 'Shirt', 'Laundry', true, true),
  ('fac_cctv', '24/7 CCTV & Security Guard', 'ShieldCheck', 'Security', true, true),
  ('fac_housekeep', 'Daily Housekeeping', 'Brush', 'Cleaning', true, true),
  ('fac_hotwater', '24x7 Geyser / Hot Water', 'Flame', 'Bathroom', true, true),
  ('fac_parking', '2 & 4 Wheeler Parking', 'Car', 'Vehicle', true, true),
  ('fac_lift', 'Elevator / Lift', 'ArrowUpDown', 'Building', true, true),
  ('fac_attach_bath', 'Attached Bathroom in all rooms', 'Bath', 'Bathroom', true, true),
  ('fac_power', 'Full Power Backup (Generator / Inverter)', 'Zap', 'Utility', true, true),
  ('fac_gym', 'Fitness Gym', 'Dumbbell', 'Health', true, true),
  ('fac_studytable', 'Individual Study Table & Wardrobe', 'BookOpen', 'Furniture', true, true),
  ('fac_kitchen', 'Self Cooking Area with Gas / Induction', 'Soup', 'Food & Dining', true, true)
ON CONFLICT (name) DO NOTHING;

-- 6. Insert Properties
INSERT INTO public.properties (
  id, name, slug, type, status, availability_status, verification_status,
  is_featured, featured_order, state, city, area, full_address, landmark,
  pincode, map_url, description, notice_period, gate_closing_time, food_availability,
  rules, rooms, facilities, photos, videos, owner_name, owner_phone, whatsapp_number,
  owner_email, view_count, inquiry_count, unlock_count
) VALUES
(
  'pg_101',
  'Malabar Luxury Executive PG for Men',
  'malabar-luxury-executive-pg-men-kakkanad',
  'Boys',
  'Active',
  'Available',
  'Verified',
  true,
  1,
  'Kerala',
  'Kochi',
  'Kakkanad',
  'Near Infopark South Gate, Kusumagiri PO, Kakkanad, Kochi, Kerala 682030',
  'Near Infopark South Gate & World Trade Center',
  '682030',
  'https://maps.google.com/?q=Infopark+Kakkanad+Kochi',
  'Premium executive PG located just 300 meters from Infopark South Gate. Offers high-speed Wi-Fi, delicious home-cooked Kerala buffet (Veg & Non-Veg), spacious AC rooms with private balconies, daily housekeeping, and 24/7 security with biometric access.',
  '30 Days',
  '11:00 PM',
  'Included in Rent (Breakfast, Lunch & Dinner)',
  ARRAY['No smoking inside rooms', 'Guests allowed in common lounge only until 8 PM', 'Gate closes at 11:00 PM', 'Keep common areas clean'],
  '[
    {"id": "r101_1", "type": "1 Sharing (Private)", "price": 9500, "deposit": 10000, "availableBeds": 2, "totalBeds": 4},
    {"id": "r101_2", "type": "2 Sharing", "price": 7500, "deposit": 8000, "availableBeds": 4, "totalBeds": 12},
    {"id": "r101_3", "type": "3 Sharing", "price": 6000, "deposit": 6000, "availableBeds": 3, "totalBeds": 9}
  ]'::jsonb,
  '["3 Times Food (Kerala / Veg & Non-Veg)", "High Speed Wi-Fi (100+ Mbps)", "Air Conditioner (AC)", "Automatic Washing Machine", "24/7 CCTV & Security Guard", "Daily Housekeeping", "24x7 Geyser / Hot Water", "2 & 4 Wheeler Parking", "Full Power Backup (Generator / Inverter)"]'::jsonb,
  '[
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80"
  ]'::jsonb,
  '["https://www.youtube.com/watch?v=dQw4w9WgXcQ"]'::jsonb,
  'Moideen Kutty',
  '+91 98470 12345',
  '+91 98470 12345',
  'malabarpg.kochi@gmail.com',
  1420,
  45,
  18
),
(
  'pg_102',
  'Green Valley Premium Ladies Hostel & PG',
  'green-valley-premium-ladies-hostel-kakkanad',
  'Girls',
  'Active',
  'Limited',
  'Verified',
  true,
  2,
  'Kerala',
  'Kochi',
  'Kakkanad',
  'Plot 42, Edachira Junction, Infopark Phase 2 Road, Kakkanad, Kochi, Kerala 682037',
  'Opposite Carnival Infopark Food Court',
  '682037',
  'https://maps.google.com/?q=Edachira+Kakkanad+Kochi',
  'Ultra-safe and highly rated women''s hostel & PG with 24/7 female resident warden, CCTV surveillance, nutritious hygienic Kerala & North Indian meals, high-speed fiber internet, and dedicated study rooms.',
  '15 Days',
  '10:00 PM (Extension with prior warden intimation)',
  'Included in Rent (3 times food + evening tea/snacks)',
  ARRAY['Strict biometric access entry', 'Visitors only in visitor lounge', 'Silence hours post 10:30 PM'],
  '[
    {"id": "r102_1", "type": "2 Sharing", "price": 8000, "deposit": 8000, "availableBeds": 1, "totalBeds": 10},
    {"id": "r102_2", "type": "3 Sharing", "price": 6500, "deposit": 6500, "availableBeds": 2, "totalBeds": 12},
    {"id": "r102_3", "type": "4 Sharing", "price": 5500, "deposit": 5500, "availableBeds": 0, "totalBeds": 8}
  ]'::jsonb,
  '["3 Times Food (Kerala / Veg & Non-Veg)", "High Speed Wi-Fi (100+ Mbps)", "Automatic Washing Machine", "24/7 CCTV & Security Guard", "Daily Housekeeping", "24x7 Geyser / Hot Water", "Attached Bathroom in all rooms", "Full Power Backup (Generator / Inverter)", "Individual Study Table & Wardrobe"]'::jsonb,
  '[
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80"
  ]'::jsonb,
  '[]'::jsonb,
  'Mary Joseph & Warden Valsala',
  '+91 94471 23456',
  '+91 94471 23456',
  'greenvalley.ladiespg@gmail.com',
  2380,
  78,
  32
),
(
  'pg_103',
  'TechnoNest Executive Co-Living & PG',
  'technonest-executive-coliving-technopark-tvm',
  'Coliving',
  'Active',
  'Available',
  'Verified',
  true,
  3,
  'Kerala',
  'Thiruvananthapuram',
  'Kazhakkoottam (Technopark)',
  'Near Main Gate, Technopark Phase 1, Kazhakkoottam, Thiruvananthapuram 695581',
  'Walkable from Technopark Main Entrance',
  '695581',
  'https://maps.google.com/?q=Technopark+Kazhakkoottam',
  'Modern co-living space designed for IT professionals working in Technopark. Features fully air-conditioned rooms, gaming lounge with PlayStation, rooftop cafeteria, gym, and high-speed Wi-Fi.',
  '30 Days',
  '24/7 Open with Keycard Access',
  'Optional Food Plan / Cafe on premise',
  ARRAY['Respect fellow co-living residents', 'Parties only on rooftop with prior booking', 'No drugs or illegal substances'],
  '[
    {"id": "r103_1", "type": "1 Sharing (Studio)", "price": 12000, "deposit": 15000, "availableBeds": 3, "totalBeds": 6},
    {"id": "r103_2", "type": "2 Sharing", "price": 7500, "deposit": 9000, "availableBeds": 5, "totalBeds": 16}
  ]'::jsonb,
  '["High Speed Wi-Fi (100+ Mbps)", "Air Conditioner (AC)", "Automatic Washing Machine", "24/7 CCTV & Security Guard", "Daily Housekeeping", "24x7 Geyser / Hot Water", "2 & 4 Wheeler Parking", "Elevator / Lift", "Fitness Gym", "Full Power Backup (Generator / Inverter)"]'::jsonb,
  '[
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80"
  ]'::jsonb,
  '[]'::jsonb,
  'Arun Varma',
  '+91 97460 77889',
  '+91 97460 77889',
  'technonest.tvm@gmail.com',
  980,
  34,
  14
)
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Banners
INSERT INTO public.banners (id, title, subtitle, image_url, target_url, placement, city, is_active)
VALUES
(
  'ban_01',
  'Best Girls PGs in Kochi Infopark & SmartCity',
  'Verified hostels with food, Wi-Fi & 24/7 security',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
  '/search?city=Kochi&type=Girls',
  'Homepage Hero Top',
  'Kochi',
  true
),
(
  'ban_02',
  'Premium Boys & Co-Living Spaces in Electronic City, Bangalore',
  'Zero brokerage • High speed internet • Food included',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  '/search?city=Bangalore',
  'Search Results Header',
  'Bangalore',
  true
)
ON CONFLICT (id) DO NOTHING;

-- 8. Insert CMS Content
INSERT INTO public.cms_content (key, title, content)
VALUES
(
  'aboutUs',
  'About KeralaPG.com',
  '{
    "title": "About KeralaPG.com",
    "subtitle": "Kerala & Bangalore''s #1 Dedicated Paying Guest & Hostel Discovery Platform",
    "content": "KeralaPG.com was founded with a single mission: to make finding verified, safe, and comfortable Paying Guest (PG) accommodations completely hassle-free for students and working professionals. Whether you are moving to Kochi''s Infopark, Trivandrum''s Technopark, Kozhikode Cyberpark, or tech hubs across Bangalore, we connect you directly with genuine property owners with zero fake broker commissions.",
    "statsHighlight": [
      {"label": "Verified Properties", "value": "500+"},
      {"label": "Happy Residents", "value": "10,000+"},
      {"label": "Cities Covered", "value": "15+"},
      {"label": "Direct Owner Connect", "value": "100%"}
    ]
  }'::jsonb
),
(
  'contactUs',
  'Contact Us',
  '{
    "phone": "+91 98470 00000",
    "whatsapp": "+91 98470 00000",
    "email": "support@keralapg.com",
    "officeAddress": "4th Floor, Infopark TBC, Kakkanad, Kochi, Kerala 682030",
    "operatingHours": "Monday – Saturday: 9:00 AM – 8:00 PM IST",
    "supportNote": "For urgent listing updates or owner verifications, reach out directly on our WhatsApp helpline."
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
