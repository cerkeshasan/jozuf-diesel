import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://jcwnuahiblzvetofauml.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjd251YWhpYmx6dmV0b2ZhdW1sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjI1MzYzNCwiZXhwIjoyMDkxODI5NjM0fQ.EqNCodpjrRQHox8wqsHAvbuVvUXs5KGQiwfh2jQ8raQ"
);

async function seed() {
  console.log("🗑️  Ürünler siliniyor...");
  const { error: prodErr } = await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (prodErr) console.error("Ürün silme hatası:", prodErr.message);
  else console.log("✅ Ürünler silindi.");

  console.log("🗑️  Alt kategoriler siliniyor...");
  const { error: subErr } = await supabase.from("categories").delete().not("parent_id", "is", null);
  if (subErr) console.error("Alt kategori silme hatası:", subErr.message);
  else console.log("✅ Alt kategoriler silindi.");

  console.log("🗑️  Ana kategoriler siliniyor...");
  const { error: mainErr } = await supabase.from("categories").delete().is("parent_id", null);
  if (mainErr) console.error("Ana kategori silme hatası:", mainErr.message);
  else console.log("✅ Ana kategoriler silindi.");

  // Ana kategoriler
  console.log("📂 Ana kategoriler ekleniyor...");
  const { data: mainCats, error: insertMainErr } = await supabase
    .from("categories")
    .insert([
      { slug: "injector-parts",     name_en: "Injector Parts",          name_tr: "Enjektör Malzemeleri",       name_ru: "Детали инжектора",                name_ar: "قطع الحاقن",                order_index: 1, is_active: true },
      { slug: "fuel-filter-system", name_en: "Fuel Filter System",       name_tr: "Yakıt Filtre Sistemi",       name_ru: "Система топливного фильтра",      name_ar: "نظام فلتر الوقود",          order_index: 2, is_active: true },
      { slug: "pipes-fittings",     name_en: "Pipes & Fittings",         name_tr: "Boru & Bağlantı",            name_ru: "Трубы и фитинги",                 name_ar: "الأنابيب والتوصيلات",       order_index: 3, is_active: true },
      { slug: "sealing-elements",   name_en: "Sealing Elements",         name_tr: "Sızdırmazlık",               name_ru: "Уплотнительные элементы",         name_ar: "عناصر الإحكام",             order_index: 4, is_active: true },
    ])
    .select();

  if (insertMainErr) { console.error("Ana kategori ekleme hatası:", insertMainErr.message); return; }
  console.log("✅ Ana kategoriler eklendi:", mainCats.map(c => c.slug));

  const get = (slug) => mainCats.find(c => c.slug === slug)?.id;

  // Alt kategoriler
  const subCategories = [
    // Enjektör Malzemeleri
    { slug: "leak-off-connectors",  name_en: "Leak-Off Connectors",   name_tr: "Geri Dönüş Plastikleri",  name_ru: "Обратные клапаны",              name_ar: "موصلات التسرب",             parent_id: get("injector-parts"),     order_index: 1 },
    { slug: "injector-clamps",      name_en: "Injector Clamps",       name_tr: "Enjektör Kelepçeleri",    name_ru: "Зажимы форсунок",               name_ar: "مشابك الحاقن",              parent_id: get("injector-parts"),     order_index: 2 },
    { slug: "injector-nuts",        name_en: "Injector Nuts",         name_tr: "Enjektör Somunları",      name_ru: "Гайки форсунок",                name_ar: "صواميل الحاقن",             parent_id: get("injector-parts"),     order_index: 3 },
    { slug: "injector-washers",     name_en: "Injector Washers",      name_tr: "Enjektör Pulları",        name_ru: "Шайбы форсунок",                name_ar: "غسالات الحاقن",             parent_id: get("injector-parts"),     order_index: 4 },
    { slug: "injector-seals",       name_en: "Injector Seals",        name_tr: "Enjektör Lastikleri",     name_ru: "Уплотнители форсунок",           name_ar: "مانعات تسرب الحاقن",        parent_id: get("injector-parts"),     order_index: 5 },
    { slug: "valve-sibop",          name_en: "Valve & Sibop",         name_tr: "Sibop & Valf",            name_ru: "Клапаны",                       name_ar: "الصمامات",                  parent_id: get("injector-parts"),     order_index: 6 },

    // Yakıt Filtre Sistemi
    { slug: "filters-strainers",    name_en: "Filters & Strainers",   name_tr: "Filtreler & Süzgeçler",   name_ru: "Фильтры и сетки",               name_ar: "الفلاتر والمصافي",           parent_id: get("fuel-filter-system"), order_index: 1 },
    { slug: "hand-primer-pump",     name_en: "Hand Primer Pump",      name_tr: "Şase Dinlendirme & El Pompası", name_ru: "Ручной подкачивающий насос", name_ar: "مضخة التعبئة اليدوية",    parent_id: get("fuel-filter-system"), order_index: 2 },
    { slug: "separator-bowl",       name_en: "Separator & Bowl",      name_tr: "Separ & Otomatik Cam",    name_ru: "Сепаратор и стакан",            name_ar: "الفاصل والكوب",             parent_id: get("fuel-filter-system"), order_index: 3 },
    { slug: "fuel-tap",             name_en: "Fuel Tap",              name_tr: "Mazot Otomatiği",         name_ru: "Топливный кран",                name_ar: "صنبور الوقود",              parent_id: get("fuel-filter-system"), order_index: 4 },
    { slug: "filter-caps",          name_en: "Filter Caps",           name_tr: "Filtre Kapakları",        name_ru: "Крышки фильтров",               name_ar: "أغطية الفلاتر",             parent_id: get("fuel-filter-system"), order_index: 5 },
    { slug: "check-valves",         name_en: "Check Valves",          name_tr: "Çek Valfler",             name_ru: "Обратные клапаны",              name_ar: "صمامات الاسترداد",          parent_id: get("fuel-filter-system"), order_index: 6 },

    // Boru & Bağlantı
    { slug: "banjo-bolt",           name_en: "Banjo Bolt",            name_tr: "Rekor",                   name_ru: "Штуцер",                        name_ar: "براغي البانجو",             parent_id: get("pipes-fittings"),     order_index: 1 },
    { slug: "ring-banjo",           name_en: "Ring Banjo",            name_tr: "Halkalı Rekor",           name_ru: "Кольцевой штуцер",              name_ar: "براغي البانجو الحلقي",      parent_id: get("pipes-fittings"),     order_index: 2 },
    { slug: "nipple",               name_en: "Nipple",                name_tr: "Nipel",                   name_ru: "Ниппель",                       name_ar: "النيبل",                    parent_id: get("pipes-fittings"),     order_index: 3 },
    { slug: "bleed-screw",          name_en: "Bleed Screw",           name_tr: "Hava Alma Rekoru",        name_ru: "Винт прокачки",                 name_ar: "برغي التنفيس",              parent_id: get("pipes-fittings"),     order_index: 4 },
    { slug: "pipe-fittings-plugs",  name_en: "Pipe Fittings & Plugs", name_tr: "Boru Ekleri & Tapalar",   name_ru: "Фитинги и заглушки",            name_ar: "التركيبات والسدادات",       parent_id: get("pipes-fittings"),     order_index: 5 },
    { slug: "throttle-lever",       name_en: "Throttle Lever",        name_tr: "Gaz Kolu",                name_ru: "Рычаг газа",                    name_ar: "ذراع الغاز",                parent_id: get("pipes-fittings"),     order_index: 6 },
    { slug: "pin-tool",             name_en: "Pin & Tool",            name_tr: "Pim & Aparat",            name_ru: "Штифт и инструмент",            name_ar: "الدبوس والأداة",            parent_id: get("pipes-fittings"),     order_index: 7 },

    // Sızdırmazlık
    { slug: "gaskets",              name_en: "Gaskets",               name_tr: "Contalar",                name_ru: "Прокладки",                     name_ar: "الحشيات",                   parent_id: get("sealing-elements"),   order_index: 1 },
    { slug: "washers",              name_en: "Washers",               name_tr: "Pullar",                  name_ru: "Шайбы",                         name_ar: "الغسالات",                  parent_id: get("sealing-elements"),   order_index: 2 },
    { slug: "plug-washers",         name_en: "Plug Washers",          name_tr: "Tapa Pulları",            name_ru: "Шайбы заглушек",                name_ar: "غسالات السدادات",           parent_id: get("sealing-elements"),   order_index: 3 },
    { slug: "hollow-leak-off-washers", name_en: "Hollow Leak-Off Washers", name_tr: "Delikli Geri Dönüş Pulları", name_ru: "Полые возвратные шайбы", name_ar: "غسالات التسرب المجوفة",   parent_id: get("sealing-elements"),   order_index: 4 },
    { slug: "rubbers-o-rings",      name_en: "Rubbers & O-Rings",     name_tr: "Lastikler & O-Ring",      name_ru: "Резинки и О-кольца",            name_ar: "المطاط والحلقات",           parent_id: get("sealing-elements"),   order_index: 5 },
  ];

  console.log("📂 Alt kategoriler ekleniyor...");
  const { data: subCats, error: insertSubErr } = await supabase
    .from("categories")
    .insert(subCategories.map(c => ({ ...c, is_active: true })))
    .select();

  if (insertSubErr) { console.error("Alt kategori ekleme hatası:", insertSubErr.message); return; }
  console.log(`✅ ${subCats.length} alt kategori eklendi.`);
  console.log("\n🎉 Seed tamamlandı!");
}

seed().catch(console.error);
