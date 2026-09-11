-- ==============================================================================
-- KeralaPG.com - PostgreSQL Database Schema for Supabase
-- Covers: Properties, Locations, Facilities, Enquiries, Payments, Banners, CMS,
--         Notifications, Reports, Customers, and User Profiles (with Auth Sync).
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. USER PROFILES TABLE (Linked with Supabase Auth)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY DEFAULT ('usr_' || substr(md5(random()::text), 1, 8)),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'Staff' CHECK (role IN ('Super Admin', 'Admin', 'Staff', 'Seeker', 'Customer')),
  avatar_url TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended', 'Inactive')),
  permissions JSONB NOT NULL DEFAULT '{"canAddPG": true, "canEditPG": true, "canDeletePG": false, "canVerifyPG": false, "canManageLocations": false, "canManageFacilities": false, "canManageEnquiries": true, "canManageCustomers": false, "canModerateReports": false, "canManagePayments": false, "canManageCMS": false, "canManageBanners": false, "canManageUsers": false}'::jsonb,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick lookups by email and role
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ==============================================================================
-- 2. HIERARCHICAL LOCATIONS TABLES (States -> Cities -> Areas)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.locations_states (
  id TEXT PRIMARY KEY DEFAULT ('state_' || substr(md5(random()::text), 1, 6)),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.locations_cities (
  id TEXT PRIMARY KEY DEFAULT ('city_' || substr(md5(random()::text), 1, 6)),
  state_id TEXT REFERENCES public.locations_states(id) ON DELETE CASCADE,
  state_name TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(state_id, name)
);

CREATE TABLE IF NOT EXISTS public.locations_areas (
  id TEXT PRIMARY KEY DEFAULT ('area_' || substr(md5(random()::text), 1, 6)),
  city_id TEXT REFERENCES public.locations_cities(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  name TEXT NOT NULL,
  pincode TEXT DEFAULT '',
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(city_id, name)
);

CREATE INDEX IF NOT EXISTS idx_cities_state ON public.locations_cities(state_name);
CREATE INDEX IF NOT EXISTS idx_areas_city ON public.locations_areas(city_name);

-- ==============================================================================
-- 3. FACILITIES & AMENITIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.facilities (
  id TEXT PRIMARY KEY DEFAULT ('fac_' || substr(md5(random()::text), 1, 6)),
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  category TEXT NOT NULL DEFAULT 'General',
  is_default BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. PG PROPERTIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.properties (
  id TEXT PRIMARY KEY DEFAULT ('pg_' || substr(md5(random()::text), 1, 8)),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'Boys' CHECK (type IN ('Boys', 'Girls', 'Coliving', 'Unisex')),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Draft')),
  availability_status TEXT NOT NULL DEFAULT 'Available' CHECK (availability_status IN ('Available', 'Limited', 'Full')),
  verification_status TEXT NOT NULL DEFAULT 'Pending' CHECK (verification_status IN ('Verified', 'Pending', 'Rejected')),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  featured_order INT DEFAULT 0,
  
  -- Geographic & Address
  state TEXT NOT NULL DEFAULT 'Kerala',
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  full_address TEXT NOT NULL,
  landmark TEXT DEFAULT '',
  pincode TEXT DEFAULT '',
  map_url TEXT DEFAULT '',
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  
  -- Description & Rules
  description TEXT DEFAULT '',
  notice_period TEXT DEFAULT '30 Days',
  gate_closing_time TEXT DEFAULT '10:30 PM',
  food_availability TEXT DEFAULT 'Included in Rent',
  rules TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- JSONB Detailed Structures
  rooms JSONB NOT NULL DEFAULT '[]'::jsonb,               -- [{ type: '1 Sharing', price: 9000, deposit: 10000, availableBeds: 2, totalBeds: 4 }]
  facilities JSONB NOT NULL DEFAULT '[]'::jsonb,          -- ['3 Times Food', 'High Speed Wi-Fi', 'AC']
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,              -- ['https://...', 'https://...']
  videos JSONB NOT NULL DEFAULT '[]'::jsonb,              -- ['https://...']
  
  -- Contact & Owner Info
  owner_name TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  whatsapp_number TEXT DEFAULT '',
  owner_email TEXT DEFAULT '',
  
  -- Platform Analytics
  view_count INT NOT NULL DEFAULT 0,
  inquiry_count INT NOT NULL DEFAULT 0,
  unlock_count INT NOT NULL DEFAULT 0,
  
  created_by TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_properties_city_area ON public.properties(city, area);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(is_featured, featured_order);

-- ==============================================================================
-- 5. CUSTOMER REGISTRY TABLE (Seekers / Portal Users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY DEFAULT ('cust_' || substr(md5(random()::text), 1, 8)),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  city TEXT DEFAULT 'Kochi',
  saved_pgs JSONB NOT NULL DEFAULT '[]'::jsonb,
  unlocked_pgs JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_enquiries INT NOT NULL DEFAULT 0,
  total_paid INT NOT NULL DEFAULT 0,
  date_joined DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);

-- ==============================================================================
-- 6. ENQUIRIES & LEADS CRM TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY DEFAULT ('enq_' || substr(md5(random()::text), 1, 8)),
  pg_id TEXT REFERENCES public.properties(id) ON DELETE SET NULL,
  pg_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT DEFAULT '',
  room_type TEXT DEFAULT '2 Sharing',
  message TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Scheduled Visit', 'Converted', 'Lost')),
  scheduled_date DATE,
  assigned_to TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  internal_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_pg_id ON public.enquiries(pg_id);

-- ==============================================================================
-- 7. REPORTED LISTINGS (Trust & Safety) TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY DEFAULT ('rep_' || substr(md5(random()::text), 1, 8)),
  pg_id TEXT REFERENCES public.properties(id) ON DELETE CASCADE,
  pg_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('Wrong price', 'Fake photos', 'Full/unavailable', 'Wrong contact number', 'Harassment', 'Other')),
  complaint TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Resolved', 'Ignored', 'Deactivated')),
  action_taken TEXT,
  resolved_by TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

-- ==============================================================================
-- 8. PAYMENTS & ₹19 UNLOCK TRANSACTIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY DEFAULT ('pay_' || substr(md5(random()::text), 1, 8)),
  transaction_id TEXT UNIQUE NOT NULL,
  customer_id TEXT REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  pg_id TEXT REFERENCES public.properties(id) ON DELETE SET NULL,
  pg_name TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'Owner Direct Contact Unlock (₹19 Plan)',
  amount NUMERIC(10, 2) NOT NULL DEFAULT 19.00,
  status TEXT NOT NULL DEFAULT 'Success' CHECK (status IN ('Success', 'Failed', 'Pending', 'Refunded')),
  payment_gateway TEXT NOT NULL DEFAULT 'UPI / Razorpay',
  raw_gateway_response JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_txn ON public.payments(transaction_id);

-- ==============================================================================
-- 9. MARKETING BANNERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.banners (
  id TEXT PRIMARY KEY DEFAULT ('ban_' || substr(md5(random()::text), 1, 6)),
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  target_url TEXT NOT NULL DEFAULT '/search',
  placement TEXT NOT NULL DEFAULT 'Homepage Hero Top' CHECK (placement IN ('Homepage Hero Top', 'Search Results Header', 'City Spotlight Carousel', 'Footer Banner')),
  city TEXT NOT NULL DEFAULT 'All Cities',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE DEFAULT (CURRENT_DATE + INTERVAL '90 days'),
  clicks_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. CMS CONTENT TABLE (About, Terms, Privacy, FAQs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.cms_content (
  key TEXT PRIMARY KEY,
  title TEXT DEFAULT '',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. ACTIVITY & SYSTEM NOTIFICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY DEFAULT ('notif_' || substr(md5(random()::text), 1, 8)),
  type TEXT NOT NULL CHECK (type IN ('enquiry', 'report', 'payment', 'system', 'verification')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT DEFAULT '',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- ==============================================================================
-- 12. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_properties_updated_at ON public.properties;
CREATE TRIGGER trg_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_enquiries_updated_at ON public.enquiries;
CREATE TRIGGER trg_enquiries_updated_at BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_customers_updated_at ON public.customers;
CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_reports_updated_at ON public.reports;
CREATE TRIGGER trg_reports_updated_at BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_banners_updated_at ON public.banners;
CREATE TRIGGER trg_banners_updated_at BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ==============================================================================
-- 13. AUTOMATIC SUPABASE AUTH SYNC TRIGGER
-- When a user registers via Supabase Auth, automatically insert/sync to public.profiles
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_supabase_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    auth_user_id,
    email,
    name,
    role,
    phone,
    status
  ) VALUES (
    'usr_' || substr(md5(NEW.id::text), 1, 8),
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'Seeker'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'Active'
  )
  ON CONFLICT (email) DO UPDATE SET
    auth_user_id = NEW.id,
    updated_at = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Connect trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_supabase_user();

-- ==============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Allow Public READ for public-facing discovery
CREATE POLICY "Public Read Active Properties" ON public.properties FOR SELECT USING (status = 'Active' OR auth.role() = 'authenticated');
CREATE POLICY "Public Read Facilities" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Public Read States" ON public.locations_states FOR SELECT USING (true);
CREATE POLICY "Public Read Cities" ON public.locations_cities FOR SELECT USING (true);
CREATE POLICY "Public Read Areas" ON public.locations_areas FOR SELECT USING (true);
CREATE POLICY "Public Read Banners" ON public.banners FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Public Read CMS" ON public.cms_content FOR SELECT USING (true);

-- Allow Authenticated / Service Role full access across all operations
CREATE POLICY "Full Access For Service Role Profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Full Access For Service Role Properties" ON public.properties FOR ALL USING (true);
CREATE POLICY "Full Access For Service Role Facilities" ON public.facilities FOR ALL USING (true);
CREATE POLICY "Full Access For Service Role Locations" ON public.locations_states FOR ALL USING (true);
CREATE POLICY "Full Access For Service Role Cities" ON public.locations_cities FOR ALL USING (true);
CREATE POLICY "Full Access For Service Role Areas" ON public.locations_areas FOR ALL USING (true);
CREATE POLICY "Full Access For Service Role Banners" ON public.banners FOR ALL USING (true);
CREATE POLICY "Full Access For Service Role CMS" ON public.cms_content FOR ALL USING (true);
CREATE POLICY "Full Access For Service Role Enquiries" ON public.enquiries FOR ALL USING (true);
CREATE POLICY "Full Access For Service Role Reports" ON public.reports FOR ALL USING (true);
CREATE POLICY "Full Access For Service Role Payments" ON public.payments FOR ALL USING (true);
CREATE POLICY "Full Access For Service Role Notifications" ON public.notifications FOR ALL USING (true);
CREATE POLICY "Full Access For Service Role Customers" ON public.customers FOR ALL USING (true);
