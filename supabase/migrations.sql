-- =============================================
-- JOSEPH DIESEL — MIGRATIONS
-- Run this in Supabase SQL Editor after schema.sql
-- =============================================

-- =============================================
-- CONTACT MESSAGES
-- =============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  lang VARCHAR(5) DEFAULT 'en',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role full access contact_messages" ON contact_messages FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- CORPORATE CONTENT (per-language)
-- =============================================
CREATE TABLE IF NOT EXISTS corporate_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lang VARCHAR(5) NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  body TEXT,
  hero_image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE corporate_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read corporate_content" ON corporate_content FOR SELECT USING (true);
CREATE POLICY "Service role full access corporate_content" ON corporate_content FOR ALL USING (auth.role() = 'service_role');

-- Seed default corporate content
INSERT INTO corporate_content (lang, title, subtitle, body) VALUES
  ('en', 'About Joseph Diesel', '30+ years of experience in diesel injection parts',
   '<h2>Our Story</h2><p>Joseph Diesel was established in 1993 in Istanbul, Turkey, with a mission to provide high-quality diesel injection spare parts to mechanics, distributors, and fleet operators worldwide.</p><p>With over three decades of experience, we have built an extensive catalog of more than 5,000 product variants covering all major brands: Bosch, Delphi, Denso, Siemens/Continental, and VDO.</p>'),
  ('tr', 'Joseph Diesel Hakkında', 'Dizel enjeksiyon parçalarında 30+ yıl deneyim',
   '<h2>Hikayemiz</h2><p>Joseph Diesel, 1993 yılında İstanbul''da kurulmuş olup dünya genelindeki tamircilere, distribütörlere ve filo işletmecilerine yüksek kaliteli dizel enjeksiyon yedek parçaları sunmayı misyon edinmiştir.</p><p>Otuz yılı aşkın deneyimimizle Bosch, Delphi, Denso, Siemens/Continental ve VDO dahil tüm büyük markaları kapsayan 5.000''den fazla ürün çeşidinden oluşan kapsamlı bir katalog oluşturduk.</p>'),
  ('ru', 'О компании Joseph Diesel', '30+ лет опыта в области запчастей Common Rail',
   '<h2>Наша история</h2><p>Компания Joseph Diesel была основана в 1993 году в Стамбуле, Турция, с целью предоставления высококачественных запасных частей для дизельных инжекторов механикам, дистрибьюторам и операторам парков по всему миру.</p><p>За более чем три десятилетия опыта мы создали обширный каталог из более чем 5 000 наименований продукции, охватывающий все основные бренды: Bosch, Delphi, Denso, Siemens/Continental и VDO.</p>'),
  ('ar', 'عن شركة Joseph Diesel', 'أكثر من 30 عاماً من الخبرة في قطع غيار الحاقن',
   '<h2>قصتنا</h2><p>تأسست شركة Joseph Diesel عام 1993 في إسطنبول، تركيا، بهدف توفير قطع غيار عالية الجودة لحاقنات الديزل للميكانيكيين والموزعين ومشغّلي الأساطيل حول العالم.</p><p>على مدار أكثر من ثلاثة عقود من الخبرة، بنينا كتالوجاً شاملاً يضم أكثر من 5000 متغير من المنتجات يغطي جميع الماركات الكبرى: Bosch وDelphi وDenso وSiemens/Continental وVDO.</p>')
ON CONFLICT (lang) DO NOTHING;

-- =============================================
-- LEGAL PAGES (privacy, terms, kvkk per language)
-- =============================================
CREATE TABLE IF NOT EXISTS legal_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) NOT NULL,
  lang VARCHAR(5) NOT NULL,
  title TEXT,
  content TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slug, lang)
);

ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read legal_pages" ON legal_pages FOR SELECT USING (true);
CREATE POLICY "Service role full access legal_pages" ON legal_pages FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- PRODUCTS: new columns for quantity variants
-- =============================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_order_qty INT DEFAULT 1;
ALTER TABLE products ADD COLUMN IF NOT EXISTS qty_step INT DEFAULT 1;
ALTER TABLE products ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';

-- =============================================
-- SETTINGS: new keys
-- =============================================
INSERT INTO settings (key, value) VALUES
  ('logo_url', ''),
  ('favicon_url', ''),
  ('maps_embed_url', ''),
  ('maps_address_url', ''),
  ('working_hours_en', 'Mon-Sat 08:00-18:00'),
  ('working_hours_tr', 'Pzt-Cmt 08:00-18:00'),
  ('working_hours_ru', 'Пн-Сб 08:00-18:00'),
  ('working_hours_ar', 'الاثنين-السبت 08:00-18:00')
ON CONFLICT (key) DO NOTHING;
