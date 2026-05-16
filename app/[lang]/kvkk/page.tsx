import Link from "next/link";

interface PageProps {
  params: Promise<{ lang: string }>;
}

const content = {
  tr: {
    title: "KİŞİSEL VERİLERİN KORUNMASI KANUNU (KVKK) AYDИНLATMA METNİ",
    updated: "Son güncelleme: Nisan 2025",
    back: "← Ana Sayfa",
    meta: "KVKK Aydınlatma Metni | Jozuf Diesel",
    intro: "Jozuf Diesel olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") ve ilgili mevzuat kapsamında kişisel verilerinizin güvenliğine büyük önem vermekteyiz. Bu aydınlatma metni, veri sorumlusu sıfatıyla kişisel verilerinizi nasıl işlediğimizi açıklamak amacıyla hazırlanmıştır.",
    sections: [
      {
        title: "1. Veri Sorumlusunun Kimliği",
        content: "Ticaret Unvanı: Jozuf Diesel\nAdres: İstanbul, Türkiye\nE-posta: info@jozufdiesel.com\nTelefon: +90 551 704 22 68",
      },
      {
        title: "2. İşlenen Kişisel Veriler",
        content: "Web sitemiz üzerinden toplanan kişisel veriler şunlardır:",
        list: [
          "Kimlik verileri: Ad, soyad",
          "İletişim verileri: E-posta adresi, telefon numarası",
          "Konum verileri: Şehir bilgisi",
          "İşlem verileri: Sipariş içeriği, ürün talepleri, mesaj içeriği",
          "Teknik veriler: IP adresi, tarayıcı bilgisi, çerez verileri (anonim)",
        ],
      },
      {
        title: "3. Kişisel Verilerin İşlenme Amaçları",
        content: "Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:",
        list: [
          "Sipariş ve teklif taleplerinizin değerlendirilmesi ve yerine getirilmesi",
          "Ürün soruları ve teknik destek taleplerinin yanıtlanması",
          "Müşteri ilişkilerinin yönetimi",
          "Yasal yükümlülüklerin yerine getirilmesi",
          "Sözleşmenin ifası",
          "Meşru menfaatlerimiz kapsamında hizmet kalitesinin iyileştirilmesi",
        ],
      },
      {
        title: "4. Hukuki Sebepler",
        content: "Kişisel verileriniz KVKK'nın 5. maddesi kapsamında aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:",
        list: [
          "Açık rızanızın bulunması (iletişim formları ve soru formları)",
          "Sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (sipariş işlemleri)",
          "Kanuni bir yükümlülüğün yerine getirilmesi",
          "Meşru menfaatlerimiz için veri işlemenin zorunlu olması",
        ],
      },
      {
        title: "5. Kişisel Verilerin Aktarılması",
        content: "Kişisel verileriniz; yasal zorunluluklar haricinde üçüncü kişilere satılmamakta, kiralanmamakta veya devredilmemektedir. Yalnızca aşağıdaki durumlarda aktarım söz konusu olabilir:",
        list: [
          "WhatsApp üzerinden sipariş iletilmesi (WhatsApp Inc. — Meta Platforms)",
          "Veri tabanı hizmeti (Supabase Inc.) — veriler şifreli olarak saklanmaktadır",
          "Yetkili kamu kurum ve kuruluşlarının talepleri",
        ],
        extra: "Yurt dışına veri aktarımlarında KVKK'nın 9. maddesi kapsamındaki güvenceler sağlanmaktadır.",
      },
      {
        title: "6. Saklama Süresi",
        content: "Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca ve ilgili yasal saklama süreleri dolana kadar muhafaza edilir. Sipariş ve iletişim kayıtları en fazla 5 yıl süreyle saklanır. Süre sonunda veriler güvenli biçimde imha edilir.",
      },
      {
        title: "7. KVKK Kapsamındaki Haklarınız",
        content: "KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:",
        list: [
          "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
          "İşlenmişse buna ilişkin bilgi talep etme",
          "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
          "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
          "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
          "KVKK'nın 7. maddesi çerçevesinde silinmesini veya yok edilmesini isteme",
          "Aleyhine sonuç doğuran otomatik sistemlere itiraz etme",
          "Kanuna aykırı işlenmesi sebebiyle zarara uğranılması hâlinde zararın giderilmesini talep etme",
        ],
      },
      {
        title: "8. Başvuru Yöntemi",
        content: "Haklarınızı kullanmak için kimliğinizi doğrulayan belgelerle birlikte aşağıdaki kanallardan bize ulaşabilirsiniz:\n\nE-posta: info@jozufdiesel.com (konu: KVKK Başvurusu)\nTelefon: +90 551 704 22 68\n\nBaşvurularınız talebin niteliğine göre en geç 30 gün içinde sonuçlandırılacaktır.",
      },
      {
        title: "9. Çerez Politikası",
        content: "Web sitemiz, dil tercihlerinizi hatırlamak ve site deneyimini iyileştirmek amacıyla teknik çerezler kullanmaktadır. Bu çerezler kişisel kimlik bilgisi içermez. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.",
      },
    ],
  },
  en: {
    title: "PRIVACY NOTICE & DATA PROTECTION DISCLOSURE",
    updated: "Last updated: April 2025",
    back: "← Home",
    meta: "Privacy Notice | Jozuf Diesel",
    intro: "At Jozuf Diesel, we are committed to protecting your personal data in accordance with the Turkish Personal Data Protection Law (KVKK No. 6698), the EU General Data Protection Regulation (GDPR), and all applicable data protection legislation. This notice explains how we collect, use, and protect your personal information as data controller.",
    sections: [
      {
        title: "1. Data Controller",
        content: "Company: Jozuf Diesel\nAddress: Istanbul, Turkey\nEmail: info@jozufdiesel.com\nPhone: +90 551 704 22 68",
      },
      {
        title: "2. Personal Data We Collect",
        content: "When you interact with our website, we may collect the following personal data:",
        list: [
          "Identity data: Full name",
          "Contact data: Email address, phone number",
          "Location data: City",
          "Transaction data: Order contents, product inquiries, message content",
          "Technical data: IP address, browser information, anonymous cookie data",
        ],
      },
      {
        title: "3. Purpose of Processing",
        content: "Your personal data is processed for the following purposes:",
        list: [
          "Processing and fulfilling your orders and quotation requests",
          "Responding to product inquiries and technical support requests",
          "Managing customer relationships",
          "Complying with legal obligations",
          "Performance of a contract",
          "Improving service quality based on our legitimate interests",
        ],
      },
      {
        title: "4. Legal Basis for Processing",
        content: "Your personal data is processed on the following legal bases:",
        list: [
          "Your explicit consent (contact forms and inquiry forms)",
          "Performance of a contract (order processing)",
          "Compliance with a legal obligation",
          "Legitimate interests pursued by the data controller",
        ],
      },
      {
        title: "5. Data Sharing",
        content: "Your personal data is not sold, rented, or transferred to third parties except in the following cases:",
        list: [
          "Order transmission via WhatsApp (WhatsApp Inc. — Meta Platforms)",
          "Database hosting service (Supabase Inc.) — data stored in encrypted form",
          "Requests from authorized public authorities",
        ],
        extra: "For international data transfers, appropriate safeguards are ensured in accordance with applicable regulations.",
      },
      {
        title: "6. Retention Period",
        content: "Your personal data is retained for as long as necessary for the purposes described and until the applicable legal retention periods expire. Order and communication records are retained for a maximum of 5 years, after which they are securely deleted.",
      },
      {
        title: "7. Your Rights",
        content: "Under KVKK Article 11 and GDPR, you have the following rights:",
        list: [
          "Right to know whether your personal data is being processed",
          "Right to request information if it is being processed",
          "Right to know the purpose of processing and whether it is used accordingly",
          "Right to know third parties to whom data is transferred",
          "Right to request correction of incomplete or inaccurate data",
          "Right to request erasure or destruction of data",
          "Right to object to decisions based solely on automated processing",
          "Right to seek compensation for damages caused by unlawful processing",
        ],
      },
      {
        title: "8. How to Exercise Your Rights",
        content: "To exercise your rights, please contact us with proof of identity through the following channels:\n\nEmail: info@jozufdiesel.com (subject: Privacy Request)\nPhone: +90 551 704 22 68\n\nWe will respond to your request within 30 days.",
      },
      {
        title: "9. Cookie Policy",
        content: "Our website uses technical cookies to remember your language preference and improve your browsing experience. These cookies do not contain personally identifiable information. You can disable cookies through your browser settings.",
      },
    ],
  },
  ru: {
    title: "УВЕДОМЛЕНИЕ О ЗАЩИТЕ ПЕРСОНАЛЬНЫХ ДАННЫХ",
    updated: "Последнее обновление: Апрель 2025",
    back: "← Главная",
    meta: "Защита персональных данных | Jozuf Diesel",
    intro: "В компании Jozuf Diesel мы серьёзно относимся к защите ваших персональных данных в соответствии с турецким Законом о защите персональных данных (KVKK № 6698) и применимым законодательством о защите данных. Настоящее уведомление объясняет, как мы собираем, используем и защищаем ваши персональные данные в качестве оператора данных.",
    sections: [
      {
        title: "1. Оператор персональных данных",
        content: "Компания: Jozuf Diesel\nАдрес: Стамбул, Турция\nEmail: info@jozufdiesel.com\nТелефон: +90 551 704 22 68",
      },
      {
        title: "2. Собираемые персональные данные",
        content: "При использовании нашего сайта мы можем собирать следующие персональные данные:",
        list: [
          "Идентификационные данные: Имя и фамилия",
          "Контактные данные: Адрес электронной почты, номер телефона",
          "Данные о местонахождении: Город",
          "Данные о транзакциях: Содержимое заказов, запросы по товарам, содержание сообщений",
          "Технические данные: IP-адрес, информация о браузере, анонимные данные cookie",
        ],
      },
      {
        title: "3. Цели обработки",
        content: "Ваши персональные данные обрабатываются в следующих целях:",
        list: [
          "Обработка и выполнение ваших заказов и запросов на коммерческие предложения",
          "Ответы на вопросы по товарам и запросы технической поддержки",
          "Управление отношениями с клиентами",
          "Соблюдение правовых обязательств",
          "Исполнение договора",
          "Улучшение качества обслуживания в рамках наших законных интересов",
        ],
      },
      {
        title: "4. Правовые основания обработки",
        content: "Ваши персональные данные обрабатываются на следующих правовых основаниях:",
        list: [
          "Ваше явное согласие (контактные формы и формы запросов)",
          "Исполнение договора (обработка заказов)",
          "Соблюдение правового обязательства",
          "Законные интересы оператора данных",
        ],
      },
      {
        title: "5. Передача данных",
        content: "Ваши персональные данные не продаются, не сдаются в аренду и не передаются третьим лицам, за исключением следующих случаев:",
        list: [
          "Передача заказа через WhatsApp (WhatsApp Inc. — Meta Platforms)",
          "Служба хостинга баз данных (Supabase Inc.) — данные хранятся в зашифрованном виде",
          "Запросы уполномоченных государственных органов",
        ],
        extra: "При международной передаче данных обеспечиваются соответствующие гарантии в соответствии с применимым законодательством.",
      },
      {
        title: "6. Сроки хранения",
        content: "Ваши персональные данные хранятся столько времени, сколько необходимо для указанных целей, и до истечения применимых законных сроков хранения. Записи о заказах и переписке хранятся не более 5 лет, после чего надёжно удаляются.",
      },
      {
        title: "7. Ваши права",
        content: "В соответствии с KVKK и применимым законодательством вы имеете следующие права:",
        list: [
          "Право знать, обрабатываются ли ваши персональные данные",
          "Право запрашивать информацию, если они обрабатываются",
          "Право знать цель обработки и соответствует ли она заявленным целям",
          "Право знать третьих лиц, которым переданы данные",
          "Право требовать исправления неполных или неточных данных",
          "Право требовать удаления или уничтожения данных",
          "Право возражать против решений, принятых исключительно на основе автоматизированной обработки",
          "Право на возмещение ущерба, причинённого незаконной обработкой",
        ],
      },
      {
        title: "8. Как воспользоваться своими правами",
        content: "Для реализации своих прав, пожалуйста, свяжитесь с нами, предоставив документ, подтверждающий личность, через следующие каналы:\n\nEmail: info@jozufdiesel.com (тема: Запрос о персональных данных)\nТелефон: +90 551 704 22 68\n\nМы ответим на ваш запрос в течение 30 дней.",
      },
      {
        title: "9. Политика использования файлов cookie",
        content: "Наш сайт использует технические файлы cookie для запоминания ваших языковых предпочтений и улучшения работы сайта. Эти файлы не содержат личных идентификационных данных. Вы можете отключить файлы cookie в настройках браузера.",
      },
    ],
  },
  ar: {
    title: "إشعار حماية البيانات الشخصية",
    updated: "آخر تحديث: أبريل 2025",
    back: "→ الرئيسية",
    meta: "حماية البيانات الشخصية | Jozuf Diesel",
    intro: "في شركة Jozuf Diesel، نلتزم بحماية بياناتك الشخصية وفقاً لقانون حماية البيانات الشخصية التركي (KVKK رقم 6698) والتشريعات المعمول بها لحماية البيانات. يوضح هذا الإشعار كيفية جمع بياناتك الشخصية واستخدامها وحمايتها بوصفنا مسؤولاً عن معالجة البيانات.",
    sections: [
      {
        title: "1. مسؤول معالجة البيانات",
        content: "الشركة: Jozuf Diesel\nالعنوان: إسطنبول، تركيا\nالبريد الإلكتروني: info@jozufdiesel.com\nالهاتف: +90 551 704 22 68",
      },
      {
        title: "2. البيانات الشخصية التي نجمعها",
        content: "عند تفاعلك مع موقعنا، قد نجمع البيانات الشخصية التالية:",
        list: [
          "بيانات الهوية: الاسم الكامل",
          "بيانات الاتصال: عنوان البريد الإلكتروني، رقم الهاتف",
          "بيانات الموقع: المدينة",
          "بيانات المعاملات: محتوى الطلبات، استفسارات المنتجات، محتوى الرسائل",
          "البيانات التقنية: عنوان IP، معلومات المتصفح، بيانات ملفات تعريف الارتباط المجهولة",
        ],
      },
      {
        title: "3. أغراض المعالجة",
        content: "تُعالَج بياناتك الشخصية للأغراض التالية:",
        list: [
          "معالجة طلباتك وتنفيذها وتلبية طلبات عروض الأسعار",
          "الرد على استفسارات المنتجات وطلبات الدعم الفني",
          "إدارة علاقات العملاء",
          "الامتثال للالتزامات القانونية",
          "تنفيذ العقد",
          "تحسين جودة الخدمة في إطار مصالحنا المشروعة",
        ],
      },
      {
        title: "4. الأساس القانوني للمعالجة",
        content: "تُعالَج بياناتك الشخصية على الأسس القانونية التالية:",
        list: [
          "موافقتك الصريحة (نماذج الاتصال ونماذج الاستفسار)",
          "تنفيذ عقد (معالجة الطلبات)",
          "الامتثال لالتزام قانوني",
          "المصالح المشروعة لمسؤول معالجة البيانات",
        ],
      },
      {
        title: "5. مشاركة البيانات",
        content: "لا تُباع بياناتك الشخصية أو تُؤجر أو تُنقل إلى أطراف ثالثة إلا في الحالات التالية:",
        list: [
          "إرسال الطلب عبر واتساب (WhatsApp Inc. — Meta Platforms)",
          "خدمة استضافة قواعد البيانات (Supabase Inc.) — البيانات مخزنة في صورة مشفرة",
          "طلبات السلطات العامة المخولة",
        ],
        extra: "عند نقل البيانات دولياً، تُضمن الضمانات المناسبة وفقاً للتشريعات المعمول بها.",
      },
      {
        title: "6. فترة الاحتفاظ بالبيانات",
        content: "تُحتفظ ببياناتك الشخصية طالما كان ذلك ضرورياً للأغراض الموضحة وحتى انتهاء فترات الاحتفاظ القانونية المعمول بها. تُحتفظ بسجلات الطلبات والمراسلات لمدة أقصاها 5 سنوات، وبعدها تُحذف بشكل آمن.",
      },
      {
        title: "7. حقوقك",
        content: "وفقاً للتشريعات المعمول بها، تتمتع بالحقوق التالية:",
        list: [
          "الحق في معرفة ما إذا كانت بياناتك الشخصية تُعالَج",
          "الحق في طلب المعلومات إذا كانت تُعالَج",
          "الحق في معرفة الغرض من المعالجة ومدى توافقها مع الأغراض المعلنة",
          "الحق في معرفة الأطراف الثالثة التي نُقلت إليها البيانات",
          "الحق في طلب تصحيح البيانات غير المكتملة أو غير الدقيقة",
          "الحق في طلب حذف البيانات أو إتلافها",
          "الحق في الاعتراض على القرارات المستندة إلى المعالجة الآلية فحسب",
          "الحق في المطالبة بالتعويض عن الأضرار الناجمة عن المعالجة غير المشروعة",
        ],
      },
      {
        title: "8. كيفية ممارسة حقوقك",
        content: "لممارسة حقوقك، يُرجى التواصل معنا مع تقديم ما يُثبت هويتك عبر القنوات التالية:\n\nالبريد الإلكتروني: info@jozufdiesel.com (الموضوع: طلب خصوصية البيانات)\nالهاتف: +90 551 704 22 68\n\nسنرد على طلبك في غضون 30 يوماً.",
      },
      {
        title: "9. سياسة ملفات تعريف الارتباط",
        content: "يستخدم موقعنا ملفات تعريف الارتباط التقنية لتذكر تفضيلات اللغة وتحسين تجربة التصفح. لا تحتوي هذه الملفات على بيانات تعريف شخصية. يمكنك تعطيل ملفات تعريف الارتباط من خلال إعدادات المتصفح.",
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const c = content[lang as keyof typeof content] || content.en;
  return { title: c.meta };
}

export default async function KvkkPage({ params }: PageProps) {
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
          <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A] mb-2 leading-tight">{c.title}</h1>
          <p className="text-gray-400 text-sm mb-6">{c.updated}</p>

          <p className="text-gray-600 text-sm leading-relaxed mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            {c.intro}
          </p>

          <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
            {c.sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-oswald text-lg font-semibold text-[#0D1B2A] mb-3">{section.title}</h2>
                {section.content.includes("\n") ? (
                  <div className="space-y-1">
                    {section.content.split("\n").map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <p>{section.content}</p>
                )}
                {section.list && (
                  <ul className="list-disc list-inside space-y-1 mt-2 text-gray-600">
                    {section.list.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                )}
                {section.extra && <p className="mt-2 text-gray-500 italic">{section.extra}</p>}
              </section>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <a
              href="mailto:info@jozufdiesel.com"
              className="inline-block bg-[#C0202A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#a81b23] transition-colors text-sm"
            >
              info@jozufdiesel.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
