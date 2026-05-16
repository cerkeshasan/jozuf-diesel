-- =============================================
-- JOSEPH DIESEL — SUPABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  product_count INT DEFAULT 0,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name_en TEXT NOT NULL,
  name_tr TEXT,
  name_ru TEXT,
  name_ar TEXT,
  description_en TEXT,
  description_tr TEXT,
  description_ru TEXT,
  description_ar TEXT
);

-- =============================================
-- PRODUCTS
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand VARCHAR(100),
  sku VARCHAR(100),
  oem_code VARCHAR(255),
  stock_status VARCHAR(20) DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock', 'on_order')),
  stock_quantity INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  images TEXT[] DEFAULT '{}',
  compatible_vehicles TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name_en TEXT NOT NULL,
  name_tr TEXT,
  name_ru TEXT,
  name_ar TEXT,
  description_en TEXT,
  description_tr TEXT,
  description_ru TEXT,
  description_ar TEXT,
  specs_en JSONB,
  specs_tr JSONB,
  specs_ru JSONB,
  specs_ar JSONB
);

-- =============================================
-- ORDERS
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  customer_country TEXT,
  note TEXT,
  lang VARCHAR(5) DEFAULT 'en',
  wa_message TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SETTINGS
-- =============================================
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_status);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and products
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can read settings" ON settings FOR SELECT USING (true);

-- Public can insert orders (for WhatsApp cart system)
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Service role can do everything (for admin panel via API)
CREATE POLICY "Service role full access categories" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access products" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access orders" ON orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access settings" ON settings FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- SEED DATA — SETTINGS
-- =============================================
INSERT INTO settings (key, value) VALUES
  ('whatsapp', '905517042268'),
  ('phone', '+90 551 704 22 68'),
  ('email', 'info@jozufdiesel.com'),
  ('address', 'Istanbul, Turkey'),
  ('working_hours', 'Mon-Sat 08:00-18:00'),
  ('hero_title_en', 'Common Rail & Injector Spare Parts'),
  ('hero_title_tr', 'Common Rail & Enjektör Yedek Parça'),
  ('hero_title_ru', 'Запчасти Common Rail и инжектора'),
  ('hero_title_ar', 'قطع غيار Common Rail والحاقن'),
  ('hero_subtitle_en', 'Bosch, Delphi, Denso, Siemens — original quality parts. 30+ years experience.'),
  ('hero_subtitle_tr', 'Bosch, Delphi, Denso, Siemens sistemleri için orijinal kalite. 30+ yıl deneyim.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- =============================================
-- SEED DATA — CATEGORIES
-- =============================================
INSERT INTO categories (slug, name_en, name_tr, name_ru, name_ar, order_index, is_active) VALUES
  ('bosch-common-rail', 'Bosch Common Rail', 'Bosch Common Rail', 'Bosch Common Rail', 'بوش كومون ريل', 1, true),
  ('delphi-common-rail', 'Delphi Common Rail', 'Delphi Common Rail', 'Delphi Common Rail', 'دلفي كومون ريل', 2, true),
  ('denso-common-rail', 'Denso Common Rail', 'Denso Common Rail', 'Denso Common Rail', 'دنسو كومون ريل', 3, true),
  ('siemens-continental', 'Siemens / Continental', 'Siemens / Continental', 'Siemens / Continental', 'سيمنس / كونتيننتال', 4, true),
  ('piezo-injector', 'Piezo Injector Parts', 'Piezo Enjektör Parçaları', 'Запчасти Piezo Injector', 'قطع حاقن بيزو', 5, true),
  ('injector-holders', 'Injector Holders & Clamps', 'Enjektör Tutucular & Kelepçeler', 'Держатели и зажимы инжекторов', 'حاملات وأكواع الحاقنات', 6, true),
  ('test-tools', 'Test & Tool Kits', 'Test & Aparat Setleri', 'Наборы инструментов', 'طقم الأدوات والاختبارات', 7, true),
  ('fittings-connectors', 'Fittings & Connectors', 'Rakorlar & Bağlantılar', 'Фитинги и соединители', 'وصلات وتركيبات', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- SAMPLE PRODUCTS (3 products for testing)
-- =============================================
INSERT INTO products (
  slug, name_en, name_tr, name_ru, name_ar,
  description_en, description_tr,
  brand, oem_code, sku,
  category_id,
  stock_status, stock_quantity,
  is_featured, is_active,
  specs_en,
  compatible_vehicles
)
SELECT
  'bosch-cr-repair-kit-f00vc99002',
  'Bosch CR Injector Repair Kit',
  'Bosch CR Enjektör Tamir Seti',
  'Ремкомплект инжектора Bosch CR',
  'طقم إصلاح حاقن Bosch CR',
  'Complete repair kit for Bosch Common Rail injectors. Includes valve set, nozzle seat, spring, and seals. OEM quality.',
  'Bosch Common Rail enjektörler için komple tamir seti. Valf seti, nozul yuvası, yay ve contaları içerir. OEM kalite.',
  'Bosch',
  'F00VC99002',
  'JD-B001',
  (SELECT id FROM categories WHERE slug = 'bosch-common-rail' LIMIT 1),
  'in_stock',
  50,
  true,
  true,
  '{"System": "Common Rail", "Brand": "Bosch", "OEM No": "F00VC99002", "Includes": "Valve Set, Seal Kit, Spring", "Compatible": "All Bosch CRI"}',
  ARRAY['Mercedes C220 CDI', 'VW Golf TDI', 'BMW 320d', 'Audi A4 2.0 TDI']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'bosch-cr-repair-kit-f00vc99002');

INSERT INTO products (
  slug, name_en, name_tr, name_ru, name_ar,
  description_en, description_tr,
  brand, oem_code, sku,
  category_id,
  stock_status, stock_quantity,
  is_featured, is_active,
  specs_en,
  compatible_vehicles
)
SELECT
  'delphi-injector-seal-kit-7135-588',
  'Delphi Injector Seal Kit',
  'Delphi Enjektör Conta Seti',
  'Комплект уплотнений Delphi',
  'طقم إحكام حاقن دلفي',
  'Delphi injector seal kit for EM series injectors. High-quality seals for reliable performance.',
  'Delphi EM serisi enjektörler için conta seti. Güvenilir performans için yüksek kalite contalar.',
  'Delphi',
  '7135-588',
  'JD-D001',
  (SELECT id FROM categories WHERE slug = 'delphi-common-rail' LIMIT 1),
  'in_stock',
  75,
  true,
  true,
  '{"System": "Common Rail", "Brand": "Delphi", "OEM No": "7135-588", "Series": "EM", "Material": "Viton"}',
  ARRAY['Ford Transit 2.2 TDCI', 'Land Rover Freelander', 'Jaguar 2.7 TDV6', 'Opel Astra 1.7 CDTI']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'delphi-injector-seal-kit-7135-588');

INSERT INTO products (
  slug, name_en, name_tr, name_ru, name_ar,
  description_en, description_tr,
  brand, oem_code, sku,
  category_id,
  stock_status, stock_quantity,
  is_featured, is_active,
  specs_en,
  compatible_vehicles
)
SELECT
  'denso-injector-shim-kit-23670-0l010',
  'Denso Injector Return Shim Kit',
  'Denso Enjektör Geri Dönüş Sekman Seti',
  'Комплект регулировочных шайб Denso',
  'طقم شيمات إرجاع حاقن دنسو',
  'Denso G3 series injector return shim kit. Precision-ground shims for accurate fuel metering.',
  'Denso G3 serisi enjektör geri dönüş sekman seti. Hassas yakıt dozajı için hassas işlenmiş sekmanlar.',
  'Denso',
  '23670-0L010',
  'JD-DN001',
  (SELECT id FROM categories WHERE slug = 'denso-common-rail' LIMIT 1),
  'on_order',
  0,
  true,
  true,
  '{"System": "Common Rail", "Brand": "Denso", "OEM No": "23670-0L010", "Series": "G3", "Set Size": "12 pcs"}',
  ARRAY['Toyota Hilux 2.5 D4D', 'Toyota Land Cruiser', 'Isuzu D-Max', 'Mitsubishi L200']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'denso-injector-shim-kit-23670-0l010');

-- =============================================
-- UPDATED AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- DONE
-- =============================================
-- Now go to Supabase Dashboard → Authentication → Users
-- Create an admin user with your email and password
-- =============================================
