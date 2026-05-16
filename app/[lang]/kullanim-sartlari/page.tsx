import Link from "next/link";

interface PageProps {
  params: Promise<{ lang: string }>;
}

const content = {
  tr: {
    title: "Kullanım Şartları",
    updated: "Son güncelleme: Nisan 2025",
    back: "← Ana Sayfa",
    meta: "Kullanım Şartları | Jozuf Diesel",
    sections: [
      {
        title: "1. Hizmetin Kapsamı",
        content: "Jozuf Diesel web sitesi, dizel enjeksiyon yedek parçaları hakkında bilgi sunmak ve B2B sipariş süreçlerini kolaylaştırmak amacıyla tasarlanmıştır. Sitemiz fiyat listesi sunmamakta olup teklifler WhatsApp ve e-posta yoluyla iletilmektedir.",
      },
      {
        title: "2. Ürün Bilgileri",
        content: "Ürün açıklamaları ve teknik bilgiler referans amaçlıdır. OEM numaraları ve uyumluluk bilgileri mümkün olan en güncel verilere dayanmakla birlikte, satın almadan önce teknik ekibimizle doğrulama yapılması önerilir.",
      },
      {
        title: "3. Sipariş Süreci",
        content: "Sepete eklenen ürünler, WhatsApp üzerinden gönderilen mesajla teklif talebine dönüşür. Sipariş, Jozuf Diesel ekibi tarafından onaylandıktan ve ödeme/teslimat koşulları mutabık kılındıktan sonra kesinleşir.",
      },
      {
        title: "4. İade ve Garanti",
        content: "Ürünler, teslimattan itibaren 14 gün içinde iade edilebilir. İade koşulları için satış ekibimizle iletişime geçiniz. Tüm orijinal ürünler üretici garantisi kapsamındadır.",
      },
      {
        title: "5. Fikri Mülkiyet",
        content: "Sitedeki tüm içerikler (metin, görsel, logo) Jozuf Diesel'e aittir. İzinsiz kopyalanması, dağıtılması veya ticari amaçla kullanılması yasaktır.",
      },
      {
        title: "6. Sorumluluk Sınırlaması",
        content: "Jozuf Diesel, sitedeki bilgilerin kullanımından kaynaklanabilecek doğrudan veya dolaylı zararlardan sorumlu tutulamaz. Teknik kararlar için uzman görüşü alınması önerilir.",
      },
      {
        title: "7. Uygulanacak Hukuk",
        content: "Bu şartlar Türkiye Cumhuriyeti yasalarına tabidir. Anlaşmazlıklarda İstanbul mahkemeleri yetkilidir.",
      },
      { title: "8. İletişim", content: "", contact: true },
    ],
  },
  en: {
    title: "Terms of Use",
    updated: "Last updated: April 2025",
    back: "← Home",
    meta: "Terms of Use | Jozuf Diesel",
    sections: [
      {
        title: "1. Scope of Service",
        content: "The Jozuf Diesel website is designed to provide information about diesel injection spare parts and to facilitate B2B ordering processes. Our site does not provide a price list; quotes are communicated via WhatsApp and email.",
      },
      {
        title: "2. Product Information",
        content: "Product descriptions and technical information are for reference purposes only. OEM numbers and compatibility information are based on the most up-to-date available data, but verification with our technical team is recommended before purchasing.",
      },
      {
        title: "3. Order Process",
        content: "Products added to the cart become a quotation request sent via WhatsApp. The order is confirmed after the Jozuf Diesel team reviews and payment/delivery terms are agreed upon.",
      },
      {
        title: "4. Returns & Warranty",
        content: "Products may be returned within 14 days of delivery. Please contact our sales team for return conditions. All genuine products are covered by the manufacturer's warranty.",
      },
      {
        title: "5. Intellectual Property",
        content: "All content on this site (text, images, logo) belongs to Jozuf Diesel. Unauthorized copying, distribution, or commercial use is prohibited.",
      },
      {
        title: "6. Limitation of Liability",
        content: "Jozuf Diesel shall not be held liable for any direct or indirect damages arising from the use of information on this site. Expert consultation is recommended for technical decisions.",
      },
      {
        title: "7. Governing Law",
        content: "These terms are governed by the laws of the Republic of Turkey. Istanbul courts have jurisdiction in case of disputes.",
      },
      { title: "8. Contact", content: "", contact: true },
    ],
  },
  ru: {
    title: "Условия использования",
    updated: "Последнее обновление: Апрель 2025",
    back: "← Главная",
    meta: "Условия использования | Jozuf Diesel",
    sections: [
      {
        title: "1. Сфера применения услуги",
        content: "Сайт Jozuf Diesel предназначен для предоставления информации о запасных частях для дизельных инжекторов и упрощения B2B-процессов заказа. Наш сайт не публикует прайс-листы; коммерческие предложения передаются через WhatsApp и электронную почту.",
      },
      {
        title: "2. Информация о продукции",
        content: "Описания товаров и технические характеристики носят справочный характер. Номера OEM и информация о совместимости основаны на наиболее актуальных данных, однако перед покупкой рекомендуется проверка с нашей технической командой.",
      },
      {
        title: "3. Процесс заказа",
        content: "Товары, добавленные в корзину, становятся запросом на коммерческое предложение, отправляемым через WhatsApp. Заказ подтверждается после согласования команды Jozuf Diesel с условиями оплаты и доставки.",
      },
      {
        title: "4. Возврат и гарантия",
        content: "Товары могут быть возвращены в течение 14 дней с момента получения. Пожалуйста, свяжитесь с нашей командой продаж для уточнения условий возврата. Все оригинальные товары покрываются гарантией производителя.",
      },
      {
        title: "5. Интеллектуальная собственность",
        content: "Всё содержимое сайта (текст, изображения, логотип) принадлежит Jozuf Diesel. Несанкционированное копирование, распространение или коммерческое использование запрещены.",
      },
      {
        title: "6. Ограничение ответственности",
        content: "Jozuf Diesel не несёт ответственности за прямой или косвенный ущерб, возникший в результате использования информации на данном сайте. Для технических решений рекомендуется консультация специалиста.",
      },
      {
        title: "7. Применимое право",
        content: "Настоящие условия регулируются законодательством Турецкой Республики. В случае споров компетентны суды Стамбула.",
      },
      { title: "8. Контакты", content: "", contact: true },
    ],
  },
  ar: {
    title: "شروط الاستخدام",
    updated: "آخر تحديث: أبريل 2025",
    back: "→ الرئيسية",
    meta: "شروط الاستخدام | Jozuf Diesel",
    sections: [
      {
        title: "١. نطاق الخدمة",
        content: "صُمِّم موقع Jozuf Diesel لتوفير معلومات حول قطع غيار حاقنات الديزل وتسهيل عمليات الطلب بين الشركات (B2B). لا يوفر موقعنا قوائم أسعار؛ إذ تُرسَل العروض عبر واتساب والبريد الإلكتروني.",
      },
      {
        title: "٢. معلومات المنتج",
        content: "أوصاف المنتجات والمعلومات التقنية هي لأغراض مرجعية فحسب. تستند أرقام OEM ومعلومات التوافق إلى أحدث البيانات المتاحة، غير أنه يُنصح بالتحقق مع فريقنا التقني قبل الشراء.",
      },
      {
        title: "٣. عملية الطلب",
        content: "تصبح المنتجات المضافة إلى السلة طلب عرض سعر يُرسَل عبر واتساب. يُؤكَّد الطلب بعد مراجعة فريق Jozuf Diesel والاتفاق على شروط الدفع والتسليم.",
      },
      {
        title: "٤. الإرجاع والضمان",
        content: "يمكن إرجاع المنتجات خلال 14 يوماً من تاريخ التسليم. يُرجى التواصل مع فريق المبيعات للاطلاع على شروط الإرجاع. جميع المنتجات الأصلية مشمولة بضمان الشركة المصنّعة.",
      },
      {
        title: "٥. الملكية الفكرية",
        content: "جميع المحتويات الموجودة في هذا الموقع (النصوص والصور والشعار) ملك لشركة Jozuf Diesel. يُحظر النسخ أو التوزيع أو الاستخدام التجاري غير المصرح به.",
      },
      {
        title: "٦. تحديد المسؤولية",
        content: "لا تتحمل Jozuf Diesel المسؤولية عن أي أضرار مباشرة أو غير مباشرة ناجمة عن استخدام المعلومات الواردة في هذا الموقع. يُنصح باستشارة متخصص للقرارات التقنية.",
      },
      {
        title: "٧. القانون الحاكم",
        content: "تخضع هذه الشروط لقوانين جمهورية تركيا. تختص محاكم إسطنبول بالنظر في النزاعات.",
      },
      { title: "٨. التواصل", content: "", contact: true },
    ],
  },
};

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const c = content[lang as keyof typeof content] || content.en;
  return { title: c.meta };
}

export default async function KullanimSartlariPage({ params }: PageProps) {
  const { lang } = await params;
  const c = content[lang as keyof typeof content] || content.en;
  const isRtl = lang === "ar";

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Link href={`/${lang}`} className="text-[#C0202A] hover:underline text-sm">{c.back}</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="font-oswald text-3xl font-bold text-[#0D1B2A] mb-2">{c.title}</h1>
          <p className="text-gray-400 text-sm mb-8">{c.updated}</p>

          <div className="space-y-6 text-gray-700">
            {c.sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-oswald text-xl font-semibold text-[#0D1B2A] mb-3">{section.title}</h2>
                {section.content && <p>{section.content}</p>}
                {section.contact && (
                  <p>
                    <strong>E-mail:</strong>{" "}
                    <a href="mailto:info@jozufdiesel.com" className="text-[#C0202A]">info@jozufdiesel.com</a>
                    <br />
                    <strong>{lang === "tr" ? "Telefon" : lang === "ru" ? "Телефон" : lang === "ar" ? "الهاتف" : "Phone"}:</strong> +90 551 704 22 68
                    <br />
                    <strong>{lang === "tr" ? "Adres" : lang === "ru" ? "Адрес" : lang === "ar" ? "العنوان" : "Address"}:</strong> Istanbul, Turkey
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
