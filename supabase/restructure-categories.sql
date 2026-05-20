-- =============================================
-- KATEGORİ YENİDEN YAPILANDIRMA
-- Bu script scripts/seed-categories.mjs ile çalıştırıldı.
-- Manuel çalıştırmak için Supabase SQL Editor kullanın.
-- =============================================

-- Ürünleri temizle
DELETE FROM products;

-- Alt kategorileri sil
DELETE FROM categories WHERE parent_id IS NOT NULL;

-- Ana kategorileri sil
DELETE FROM categories WHERE parent_id IS NULL;

-- =============================================
-- ANA KATEGORİLER
-- =============================================
INSERT INTO categories (slug, name_en, name_tr, name_ru, name_ar, order_index, is_active) VALUES
  ('injector-parts',     'Injector Parts',     'Enjektör Malzemeleri', 'Детали инжектора',              'قطع الحاقن',             1, true),
  ('fuel-filter-system', 'Fuel Filter System', 'Yakıt Filtre Sistemi', 'Система топливного фильтра',    'نظام فلتر الوقود',       2, true),
  ('pipes-fittings',     'Pipes & Fittings',   'Boru & Bağlantı',      'Трубы и фитинги',               'الأنابيب والتوصيلات',    3, true),
  ('sealing-elements',   'Sealing Elements',   'Sızdırmazlık',         'Уплотнительные элементы',       'عناصر الإحكام',          4, true);

-- =============================================
-- ALT KATEGORİLER — Enjektör Malzemeleri
-- =============================================
INSERT INTO categories (slug, name_en, name_tr, name_ru, name_ar, parent_id, order_index, is_active) VALUES
  ('leak-off-connectors', 'Leak-Off Connectors', 'Geri Dönüş Plastikleri', 'Обратные клапаны',        'موصلات التسرب',         (SELECT id FROM categories WHERE slug='injector-parts'), 1, true),
  ('injector-clamps',     'Injector Clamps',     'Enjektör Kelepçeleri',   'Зажимы форсунок',         'مشابك الحاقن',          (SELECT id FROM categories WHERE slug='injector-parts'), 2, true),
  ('injector-nuts',       'Injector Nuts',       'Enjektör Somunları',     'Гайки форсунок',          'صواميل الحاقن',         (SELECT id FROM categories WHERE slug='injector-parts'), 3, true),
  ('injector-washers',    'Injector Washers',    'Enjektör Pulları',       'Шайбы форсунок',          'غسالات الحاقن',         (SELECT id FROM categories WHERE slug='injector-parts'), 4, true),
  ('injector-seals',      'Injector Seals',      'Enjektör Lastikleri',    'Уплотнители форсунок',    'مانعات تسرب الحاقن',    (SELECT id FROM categories WHERE slug='injector-parts'), 5, true),
  ('valve-sibop',         'Valve & Sibop',       'Sibop & Valf',           'Клапаны',                 'الصمامات',              (SELECT id FROM categories WHERE slug='injector-parts'), 6, true);

-- =============================================
-- ALT KATEGORİLER — Yakıt Filtre Sistemi
-- =============================================
INSERT INTO categories (slug, name_en, name_tr, name_ru, name_ar, parent_id, order_index, is_active) VALUES
  ('filters-strainers',  'Filters & Strainers',       'Filtreler & Süzgeçler',          'Фильтры и сетки',              'الفلاتر والمصافي',        (SELECT id FROM categories WHERE slug='fuel-filter-system'), 1, true),
  ('hand-primer-pump',   'Hand Primer Pump',           'Şase Dinlendirme & El Pompası',  'Ручной подкачивающий насос',   'مضخة التعبئة اليدوية',    (SELECT id FROM categories WHERE slug='fuel-filter-system'), 2, true),
  ('separator-bowl',     'Separator & Bowl',           'Separ & Otomatik Cam',           'Сепаратор и стакан',           'الفاصل والكوب',           (SELECT id FROM categories WHERE slug='fuel-filter-system'), 3, true),
  ('fuel-tap',           'Fuel Tap',                   'Mazot Otomatiği',                'Топливный кран',               'صنبور الوقود',            (SELECT id FROM categories WHERE slug='fuel-filter-system'), 4, true),
  ('filter-caps',        'Filter Caps',                'Filtre Kapakları',               'Крышки фильтров',              'أغطية الفلاتر',           (SELECT id FROM categories WHERE slug='fuel-filter-system'), 5, true),
  ('check-valves',       'Check Valves',               'Çek Valfler',                    'Обратные клапаны',             'صمامات الاسترداد',        (SELECT id FROM categories WHERE slug='fuel-filter-system'), 6, true);

-- =============================================
-- ALT KATEGORİLER — Boru & Bağlantı
-- =============================================
INSERT INTO categories (slug, name_en, name_tr, name_ru, name_ar, parent_id, order_index, is_active) VALUES
  ('banjo-bolt',          'Banjo Bolt',              'Rekor',                  'Штуцер',                 'براغي البانجو',          (SELECT id FROM categories WHERE slug='pipes-fittings'), 1, true),
  ('ring-banjo',          'Ring Banjo',              'Halkalı Rekor',          'Кольцевой штуцер',       'براغي البانجو الحلقي',   (SELECT id FROM categories WHERE slug='pipes-fittings'), 2, true),
  ('nipple',              'Nipple',                  'Nipel',                  'Ниппель',                'النيبل',                 (SELECT id FROM categories WHERE slug='pipes-fittings'), 3, true),
  ('bleed-screw',         'Bleed Screw',             'Hava Alma Rekoru',       'Винт прокачки',          'برغي التنفيس',           (SELECT id FROM categories WHERE slug='pipes-fittings'), 4, true),
  ('pipe-fittings-plugs', 'Pipe Fittings & Plugs',   'Boru Ekleri & Tapalar',  'Фитинги и заглушки',     'التركيبات والسدادات',    (SELECT id FROM categories WHERE slug='pipes-fittings'), 5, true),
  ('throttle-lever',      'Throttle Lever',          'Gaz Kolu',               'Рычаг газа',             'ذراع الغاز',             (SELECT id FROM categories WHERE slug='pipes-fittings'), 6, true),
  ('pin-tool',            'Pin & Tool',              'Pim & Aparat',           'Штифт и инструмент',     'الدبوس والأداة',         (SELECT id FROM categories WHERE slug='pipes-fittings'), 7, true);

-- =============================================
-- ALT KATEGORİLER — Sızdırmazlık
-- =============================================
INSERT INTO categories (slug, name_en, name_tr, name_ru, name_ar, parent_id, order_index, is_active) VALUES
  ('gaskets',                 'Gaskets',                   'Contalar',                    'Прокладки',                'الحشيات',                   (SELECT id FROM categories WHERE slug='sealing-elements'), 1, true),
  ('washers',                 'Washers',                   'Pullar',                      'Шайбы',                    'الغسالات',                  (SELECT id FROM categories WHERE slug='sealing-elements'), 2, true),
  ('plug-washers',            'Plug Washers',              'Tapa Pulları',                'Шайбы заглушек',           'غسالات السدادات',           (SELECT id FROM categories WHERE slug='sealing-elements'), 3, true),
  ('hollow-leak-off-washers', 'Hollow Leak-Off Washers',   'Delikli Geri Dönüş Pulları',  'Полые возвратные шайбы',   'غسالات التسرب المجوفة',     (SELECT id FROM categories WHERE slug='sealing-elements'), 4, true),
  ('rubbers-o-rings',         'Rubbers & O-Rings',         'Lastikler & O-Ring',          'Резинки и О-кольца',       'المطاط والحلقات',           (SELECT id FROM categories WHERE slug='sealing-elements'), 5, true);
