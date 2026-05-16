import { getTranslations } from "@/lib/translations";
import { supabase } from "@/lib/supabase";
import { Globe, Users, CheckCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const t = getTranslations(lang);
  return { title: `${t.corporate.title} | Jozuf Diesel` };
}

export default async function CorporatePage({ params }: PageProps) {
  const { lang } = await params;
  const t = getTranslations(lang);

  const { data: dbContent } = await supabase
    .from("corporate_content")
    .select("*")
    .eq("lang", lang)
    .single();

  const pageTitle = dbContent?.title || t.corporate.title;
  const pageSubtitle = dbContent?.subtitle || t.corporate.subtitle;
  const pageBody = dbContent?.body || null;
  const heroImage = dbContent?.hero_image_url || null;

  const milestones: { year: string; event: Record<string, string> }[] = [
    { year: "1993", event: { en: "Jozuf Diesel was founded in Istanbul", tr: "Jozuf Diesel İstanbul'da kuruldu", ru: "Основание Jozuf Diesel в Стамбуле", ar: "تأسست Jozuf Diesel في إسطنبول" } },
    { year: "2000", event: { en: "Expanded to international markets", tr: "Uluslararası pazarlara açıldı", ru: "Выход на международные рынки", ar: "التوسع في الأسواق الدولية" } },
    { year: "2010", event: { en: "Reached 2,000+ product catalog", tr: "2.000+ ürün kataloğuna ulaşıldı", ru: "Достигнут каталог 2000+ товаров", ar: "الوصول إلى كتالوج يضم 2000+ منتج" } },
    { year: "2015", event: { en: "Reached 10,000+ product catalog", tr: "10.000+ ürün kataloğuna ulaşıldı", ru: "Достигнут каталог 10 000+ товаров", ar: "الوصول إلى كتالوج يضم أكثر من 10,000 منتج" } },
    { year: "2020", event: { en: "Serving 50+ countries worldwide", tr: "50+ ülkeye hizmet veriliyor", ru: "Обслуживание 50+ стран мира", ar: "خدمة أكثر من 50 دولة حول العالم" } },
    { year: "2024", event: { en: "Digital transformation & new platform", tr: "Dijital dönüşüm & yeni platform", ru: "Цифровая трансформация и новая платформа", ar: "التحول الرقمي والمنصة الجديدة" } },
  ];

  const stats = [
    { icon: Users, value: "30+", label: { en: "Years Experience", tr: "Yıl Deneyim", ru: "Лет опыта", ar: "سنة خبرة" } },
    { icon: Globe, value: "50+", label: { en: "Countries Served", tr: "Hizmet Verilen Ülke", ru: "Стран охвата", ar: "دولة نخدمها" } },
    { icon: CheckCircle, value: "5,000+", label: { en: "Product Variants", tr: "Ürün Çeşidi", ru: "Наименований товаров", ar: "متغير من المنتجات" } },
    { icon: CheckCircle, value: "B2B", label: { en: "Wholesale Supply", tr: "Toptan Tedarik", ru: "Оптовые поставки", ar: "توريد الجملة" } },
  ];

  const checklistItems: Record<string, string[]> = {
    en: ["Authorized distributor for major brands", "All parts tested before shipment", "Dedicated technical support team", "Fast worldwide shipping", "14-day return policy"],
    tr: ["Büyük markalar için yetkili distribütör", "Tüm parçalar gönderimden önce test edilir", "Uzman teknik destek ekibi", "Hızlı dünya geneli kargo", "14 günlük iade politikası"],
    ru: ["Авторизованный дистрибьютор ведущих брендов", "Все детали тестируются перед отправкой", "Специализированная техническая поддержка", "Быстрая доставка по всему миру", "Политика возврата 14 дней"],
    ar: ["موزع معتمد للماركات الكبرى", "جميع القطع تُختبر قبل الشحن", "فريق دعم فني متخصص", "شحن سريع في جميع أنحاء العالم", "سياسة إرجاع لمدة 14 يوماً"],
  };

  const productGroups: Record<string, { title: string; items: string[] }[]> = {
    en: [
      { title: "Common Rail Injectors", items: ["Bosch CRI", "Delphi EM", "Denso G3", "Siemens Piezo"] },
      { title: "Repair Kits & Seals", items: ["Nozzles", "Valve Sets", "Sealing Kits", "Springs"] },
      { title: "Tools & Equipment", items: ["Test Kits", "Adaptor Sets", "Pressure Tools", "Cleaning Equipment"] },
    ],
    tr: [
      { title: "Common Rail Enjektörler", items: ["Bosch CRI", "Delphi EM", "Denso G3", "Siemens Piezo"] },
      { title: "Tamir Setleri & Contalar", items: ["Nozullar", "Valf Setleri", "Conta Setleri", "Yaylar"] },
      { title: "Araçlar & Ekipman", items: ["Test Setleri", "Adaptör Setleri", "Basınç Araçları", "Temizleme Ekipmanı"] },
    ],
    ru: [
      { title: "Инжекторы Common Rail", items: ["Bosch CRI", "Delphi EM", "Denso G3", "Siemens Piezo"] },
      { title: "Ремкомплекты и уплотнения", items: ["Форсунки", "Наборы клапанов", "Уплотнительные наборы", "Пружины"] },
      { title: "Инструменты и оборудование", items: ["Наборы для тестирования", "Адаптерные наборы", "Инструменты давления", "Очистительное оборудование"] },
    ],
    ar: [
      { title: "حاقنات Common Rail", items: ["Bosch CRI", "Delphi EM", "Denso G3", "Siemens Piezo"] },
      { title: "طقم الإصلاح والمانعات", items: ["الفوهات", "مجموعات الصمامات", "طقم الإحكام", "الزنبركات"] },
      { title: "الأدوات والمعدات", items: ["طقم الاختبار", "مجموعات المحولات", "أدوات الضغط", "معدات التنظيف"] },
    ],
  };

  const isRtl = lang === "ar";
  const checklist = checklistItems[lang] || checklistItems.en;
  const groups = productGroups[lang] || productGroups.en;

  const storyHeadings: Record<string, string> = {
    en: "Our Story",
    tr: "Hikayemiz",
    ru: "Наша история",
    ar: "قصتنا",
  };

  const timelineHeadings: Record<string, string> = {
    en: "Company Timeline",
    tr: "Şirket Kronolojisi",
    ru: "История компании",
    ar: "الجدول الزمني للشركة",
  };

  const productsHeadings: Record<string, string> = {
    en: "Products We Cover",
    tr: "Kapsadığımız Ürünler",
    ru: "Наша продукция",
    ar: "المنتجات التي نغطيها",
  };

  return (
    <div className="min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero */}
      <div
        className="bg-[#0D1B2A] py-20 bg-cover bg-center"
        style={heroImage ? { backgroundImage: `linear-gradient(rgba(13,27,42,0.85),rgba(13,27,42,0.85)), url(${heroImage})` } : {}}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-oswald text-5xl font-bold text-white mb-4">{pageTitle}</h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">{pageSubtitle}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#C0202A] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center text-white">
                <stat.icon size={28} className="mx-auto mb-2 opacity-80" />
                <div className="font-oswald text-3xl font-bold">{stat.value}</div>
                <div className="text-red-100 text-sm">{stat.label[lang as keyof typeof stat.label] || stat.label.en}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-oswald text-4xl font-bold text-[#0D1B2A] mb-6">{storyHeadings[lang] || storyHeadings.en}</h2>
              {pageBody ? (
                <div
                  className="prose prose-gray max-w-none text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: pageBody }}
                />
              ) : (
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>Jozuf Diesel was established in 1993 in Istanbul, Turkey, with a mission to provide high-quality diesel injection spare parts to mechanics, distributors, and fleet operators worldwide.</p>
                  <p>With over three decades of experience, we have built an extensive catalog of more than 5,000 product variants covering all major brands: Bosch, Delphi, Denso, Siemens/Continental, and VDO.</p>
                </div>
              )}
              <div className="mt-8 space-y-3">
                {checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-[#C0202A] shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#0D1B2A] to-[#1a2f45] rounded-3xl p-8 text-white">
              <h3 className="font-oswald text-2xl font-bold mb-6">{timelineHeadings[lang] || timelineHeadings.en}</h3>
              <div className="space-y-4">
                {milestones.map((m, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="font-oswald font-bold text-[#C0202A] w-12 shrink-0">{m.year}</span>
                    <span className="text-gray-300 text-sm">{m.event[lang as keyof typeof m.event] || m.event.en}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products we cover */}
      <div className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-oswald text-4xl font-bold text-[#0D1B2A] mb-12">{productsHeadings[lang] || productsHeadings.en}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {groups.map((group, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-oswald font-semibold text-[#0D1B2A] text-lg mb-4">{group.title}</h3>
                <ul className="space-y-2">
                  {group.items.map((item, j) => (
                    <li key={j} className="text-gray-500 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C0202A]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
