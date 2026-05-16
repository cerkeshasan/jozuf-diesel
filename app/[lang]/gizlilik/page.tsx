import Link from "next/link";

interface PageProps {
  params: Promise<{ lang: string }>;
}

const content = {
  tr: {
    title: "Gizlilik Politikası",
    updated: "Son güncelleme: Nisan 2025",
    back: "← Ana Sayfa",
    meta: "Gizlilik Politikası | Jozuf Diesel",
    kvkkNote: "6698 sayılı KVKK kapsamındaki haklarınız ve kişisel verilerinizin işlenme detayları için ",
    kvkkLink: "KVKK Aydınlatma Metni",
    kvkkLinkSuffix: "'ni inceleyiniz.",
    sections: [
      {
        title: "1. Toplanan Bilgiler",
        content: "Jozuf Diesel olarak, web sitemizi ziyaret ettiğinizde veya bizimle iletişime geçtiğinizde belirli bilgileri toplayabiliriz. Bu bilgiler şunları içerebilir: ad-soyad, e-posta adresi, telefon numarası, şehir bilgisi ve sipariş detayları.",
      },
      {
        title: "2. Bilgilerin Kullanımı",
        content: "Toplanan bilgiler yalnızca aşağıdaki amaçlarla kullanılır:",
        list: [
          "Sipariş ve teklif taleplerinizi işlemek",
          "Müşteri hizmetleri sağlamak",
          "Ürün ve hizmetlerimiz hakkında bilgilendirme yapmak (onayınız dahilinde)",
          "Web sitemizi geliştirmek",
        ],
      },
      {
        title: "3. Bilgi Paylaşımı",
        content: "Kişisel bilgileriniz; yasal zorunluluklar dışında üçüncü taraflarla satılmaz, kiralanmaz veya paylaşılmaz. WhatsApp üzerinden gönderilen sipariş bilgileri yalnızca sipariş işleme amacıyla kullanılır.",
      },
      {
        title: "4. Çerezler (Cookies)",
        content: "Web sitemiz, dil tercihlerinizi hatırlamak ve site deneyimini geliştirmek amacıyla çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.",
      },
      {
        title: "5. Güvenlik",
        content: "Kişisel verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri uygulanmaktadır. Verileriniz şifreli bağlantılar (HTTPS) üzerinden iletilmektedir.",
      },
      {
        title: "6. Haklarınız",
        content: "KVKK ve GDPR kapsamında; kişisel verilerinize erişme, düzeltme, silme veya işlenmesini kısıtlama hakkına sahipsiniz. Talepleriniz için info@jozufdiesel.com adresine yazabilirsiniz.",
      },
      {
        title: "7. İletişim",
        content: "Gizlilik politikamız hakkında sorularınız için:",
        contact: true,
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: April 2025",
    back: "← Home",
    meta: "Privacy Policy | Jozuf Diesel",
    kvkkNote: "For details on your rights under Turkish data protection law (KVKK), please see our ",
    kvkkLink: "Privacy Notice",
    kvkkLinkSuffix: ".",
    sections: [
      {
        title: "1. Information We Collect",
        content: "When you visit our website or contact us, we may collect certain information including: full name, email address, phone number, city, and order details.",
      },
      {
        title: "2. How We Use Information",
        content: "The collected information is used solely for the following purposes:",
        list: [
          "Processing your orders and quotation requests",
          "Providing customer service",
          "Informing you about products and services (with your consent)",
          "Improving our website",
        ],
      },
      {
        title: "3. Information Sharing",
        content: "Your personal information is not sold, rented, or shared with third parties except as required by law. Order information sent via WhatsApp is used solely for order processing.",
      },
      {
        title: "4. Cookies",
        content: "Our website uses cookies to remember your language preferences and improve your browsing experience. You can disable cookies through your browser settings.",
      },
      {
        title: "5. Security",
        content: "Industry-standard security measures are applied to protect your personal data. Your data is transmitted over encrypted connections (HTTPS).",
      },
      {
        title: "6. Your Rights",
        content: "Under KVKK and GDPR, you have the right to access, correct, delete, or restrict the processing of your personal data. Please contact info@jozufdiesel.com for requests.",
      },
      {
        title: "7. Contact",
        content: "For questions about our privacy policy:",
        contact: true,
      },
    ],
  },
  ru: {
    title: "Политика конфиденциальности",
    updated: "Последнее обновление: Апрель 2025",
    back: "← Главная",
    meta: "Политика конфиденциальности | Jozuf Diesel",
    kvkkNote: "Для получения подробной информации о ваших правах в соответствии с законодательством Турции о защите данных (KVKK) ознакомьтесь с нашим ",
    kvkkLink: "Уведомлением о конфиденциальности",
    kvkkLinkSuffix: ".",
    sections: [
      {
        title: "1. Собираемые данные",
        content: "При посещении нашего сайта или обращении к нам мы можем собирать определённую информацию: полное имя, адрес электронной почты, номер телефона, город и детали заказа.",
      },
      {
        title: "2. Использование информации",
        content: "Собранная информация используется исключительно для следующих целей:",
        list: [
          "Обработка ваших заказов и запросов на коммерческое предложение",
          "Предоставление клиентской поддержки",
          "Информирование о продуктах и услугах (с вашего согласия)",
          "Улучшение нашего сайта",
        ],
      },
      {
        title: "3. Передача информации",
        content: "Ваши персональные данные не продаются, не сдаются в аренду и не передаются третьим лицам, за исключением случаев, предусмотренных законодательством. Информация о заказах, отправленная через WhatsApp, используется исключительно для обработки заказов.",
      },
      {
        title: "4. Файлы cookie",
        content: "Наш сайт использует файлы cookie для запоминания ваших языковых предпочтений и улучшения работы сайта. Вы можете отключить файлы cookie в настройках браузера.",
      },
      {
        title: "5. Безопасность",
        content: "Для защиты ваших персональных данных применяются отраслевые стандарты безопасности. Ваши данные передаются по зашифрованным соединениям (HTTPS).",
      },
      {
        title: "6. Ваши права",
        content: "В соответствии с KVKK и GDPR вы имеете право на доступ, исправление, удаление или ограничение обработки ваших персональных данных. Для запросов пишите на info@jozufdiesel.com.",
      },
      {
        title: "7. Контакты",
        content: "По вопросам нашей политики конфиденциальности:",
        contact: true,
      },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: أبريل 2025",
    back: "→ الرئيسية",
    meta: "سياسة الخصوصية | Jozuf Diesel",
    kvkkNote: "للاطلاع على حقوقك بموجب قانون حماية البيانات التركي (KVKK)، يرجى الاطلاع على ",
    kvkkLink: "إشعار الخصوصية",
    kvkkLinkSuffix: " الخاص بنا.",
    sections: [
      {
        title: "١. المعلومات التي نجمعها",
        content: "عند زيارة موقعنا أو التواصل معنا، قد نجمع معلومات معينة تشمل: الاسم الكامل، عنوان البريد الإلكتروني، رقم الهاتف، المدينة، وتفاصيل الطلب.",
      },
      {
        title: "٢. كيفية استخدام المعلومات",
        content: "تُستخدم المعلومات المجمعة فقط للأغراض التالية:",
        list: [
          "معالجة طلباتك وطلبات عروض الأسعار",
          "تقديم خدمة العملاء",
          "إبلاغك بالمنتجات والخدمات (بموافقتك)",
          "تحسين موقعنا الإلكتروني",
        ],
      },
      {
        title: "٣. مشاركة المعلومات",
        content: "لا تُباع معلوماتك الشخصية أو تُؤجر أو تُشارك مع أطراف ثالثة إلا إذا اقتضى القانون ذلك. معلومات الطلبات المرسلة عبر واتساب تُستخدم فقط لمعالجة الطلبات.",
      },
      {
        title: "٤. ملفات تعريف الارتباط",
        content: "يستخدم موقعنا ملفات تعريف الارتباط لتذكر تفضيلات لغتك وتحسين تجربة التصفح. يمكنك تعطيل ملفات تعريف الارتباط من إعدادات المتصفح.",
      },
      {
        title: "٥. الأمان",
        content: "تُطبَّق معايير أمان صناعية لحماية بياناتك الشخصية. تُرسَل بياناتك عبر اتصالات مشفرة (HTTPS).",
      },
      {
        title: "٦. حقوقك",
        content: "وفقاً لـ KVKK وGDPR، يحق لك الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها أو تقييد معالجتها. للطلبات، تواصل معنا على info@jozufdiesel.com.",
      },
      {
        title: "٧. التواصل",
        content: "لأي استفسارات حول سياسة الخصوصية:",
        contact: true,
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const c = content[lang as keyof typeof content] || content.en;
  return { title: c.meta };
}

export default async function GizlilikPage({ params }: PageProps) {
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
          <p className="text-gray-400 text-sm mb-4">{c.updated}</p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-sm text-blue-800">
            {c.kvkkNote}
            <Link href={`/${lang}/kvkk`} className="font-semibold underline">{c.kvkkLink}</Link>
            {c.kvkkLinkSuffix}
          </div>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            {c.sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-oswald text-xl font-semibold text-[#0D1B2A] mb-3">{section.title}</h2>
                <p>{section.content}</p>
                {section.list && (
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {section.list.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                )}
                {section.contact && (
                  <p className="mt-2">
                    <strong>E-mail:</strong>{" "}
                    <a href="mailto:info@jozufdiesel.com" className="text-[#C0202A]">info@jozufdiesel.com</a>
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
