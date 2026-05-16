import type { OrderItem } from "./supabase";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || "905517042268";

export function buildWhatsAppMessage(items: OrderItem[], note?: string, lang = "en"): string {
  const greetings: Record<string, string> = {
    en: "Hello Jozuf Diesel,\nI would like to get a price quote for the following products:\n\n",
    tr: "Merhaba Jozuf Diesel,\nAşağıdaki ürünler için fiyat teklifi almak istiyorum:\n\n",
    ru: "Здравствуйте Jozuf Diesel,\nХочу получить предложение на следующие товары:\n\n",
    ar: "مرحباً Jozuf Diesel,\nأريد الحصول على عرض سعر للمنتجات التالية:\n\n",
  };

  const notePrefix: Record<string, string> = {
    en: "Note",
    tr: "Not",
    ru: "Примечание",
    ar: "ملاحظة",
  };

  const thanks: Record<string, string> = {
    en: "\nThank you.",
    tr: "\nTeşekkürler.",
    ru: "\nСпасибо.",
    ar: "\nشكراً.",
  };

  const greeting = greetings[lang] || greetings.en;
  let message = greeting;

  items.forEach((item, index) => {
    message += `${index + 1}. ${item.product_name}`;
    if (item.oem_code) message += ` (${item.oem_code})`;
    message += ` — ${item.quantity} ${lang === "tr" ? "adet" : lang === "ru" ? "шт" : lang === "ar" ? "قطعة" : "pcs"}\n`;
  });

  if (note) {
    message += `\n${notePrefix[lang] || notePrefix.en}: ${note}`;
  }

  message += thanks[lang] || thanks.en;

  return message;
}

export function buildWhatsAppUrl(items: OrderItem[], note?: string, lang = "en", number?: string): string {
  const message = buildWhatsAppMessage(items, note, lang);
  const num = (number || WA_NUMBER).replace(/\D/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export function buildDirectWhatsAppUrl(number?: string): string {
  const num = (number || WA_NUMBER).replace(/\D/g, "");
  return `https://wa.me/${num}`;
}

export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `JD${year}${month}${day}${random}`;
}
