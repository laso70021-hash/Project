-- =========================================================================
-- SWAHIVO LOGISTICS OS — SUPABASE POSTGRESQL RELATIONAL SCHEMA & RLS
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations & Profiles
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'customer', 'warehouse_manager', 'driver', 'transporter')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  customer_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Business',
  contact_person TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  region TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Warehouses & Floor Maps
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  total_capacity_pallets INT NOT NULL DEFAULT 2500,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS warehouse_racks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
  rack_code TEXT NOT NULL,
  zone TEXT NOT NULL,
  levels_count INT NOT NULL DEFAULT 3,
  bins_per_level INT NOT NULL DEFAULT 3,
  x_meters NUMERIC(5,2) DEFAULT 0,
  y_meters NUMERIC(5,2) DEFAULT 0,
  rotation_degrees INT DEFAULT 0,
  storage_type TEXT DEFAULT 'Standard',
  status TEXT DEFAULT 'Active',
  UNIQUE (warehouse_id, rack_code)
);

CREATE TABLE IF NOT EXISTS warehouse_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rack_id UUID REFERENCES warehouse_racks(id) ON DELETE CASCADE,
  location_code TEXT UNIQUE NOT NULL, -- e.g. WH001-A-R05-L02-B03
  zone TEXT NOT NULL,
  rack_code TEXT NOT NULL,
  level_code TEXT NOT NULL,
  bin_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Occupied', 'Partially Filled', 'Full', 'Blocked', 'Maintenance')),
  max_weight_kg NUMERIC(6,2) DEFAULT 100.0,
  current_weight_kg NUMERIC(6,2) DEFAULT 0.0,
  max_packages INT DEFAULT 5,
  current_packages INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Packages & Storage Bookings
CREATE TABLE IF NOT EXISTS storage_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  warehouse_id UUID REFERENCES warehouses(id),
  booking_number TEXT UNIQUE NOT NULL,
  expected_date DATE NOT NULL,
  items_description TEXT NOT NULL,
  cartons_count INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending Review',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id TEXT UNIQUE NOT NULL, -- e.g. PKG-1042
  customer_id UUID REFERENCES customers(id),
  booking_id UUID REFERENCES storage_bookings(id),
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  weight_kg NUMERIC(6,2) NOT NULL,
  dimensions TEXT,
  status TEXT NOT NULL DEFAULT 'Awaiting Putaway',
  location_id UUID REFERENCES warehouse_locations(id),
  received_at TIMESTAMPTZ DEFAULT NOW(),
  last_moved_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Shipments & Transporters
CREATE TABLE IF NOT EXISTS transporters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  code TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  region TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transporter_id UUID REFERENCES transporters(id),
  user_id UUID REFERENCES auth.users(id),
  driver_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  license_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transporter_id UUID REFERENCES transporters(id),
  plate_number TEXT UNIQUE NOT NULL,
  vehicle_type TEXT NOT NULL,
  capacity_kg INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  tracking_number TEXT UNIQUE NOT NULL,
  reference_number TEXT,
  customer_id UUID REFERENCES customers(id),
  service_type TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'Normal',
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  pickup_date TIMESTAMPTZ NOT NULL,
  expected_delivery_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending Pickup',
  total_weight_kg NUMERIC(7,2) NOT NULL,
  assigned_driver_id UUID REFERENCES drivers(id),
  assigned_vehicle_id UUID REFERENCES vehicles(id),
  total_amount_tzs NUMERIC(12,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Billing & Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  type TEXT NOT NULL,
  amount_tzs NUMERIC(12,2) NOT NULL,
  subtotal_tzs NUMERIC(12,2) NOT NULL,
  vat_tzs NUMERIC(12,2) DEFAULT 0,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Sample RLS Policies
CREATE POLICY "Users can view own organization data" ON customers
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );
