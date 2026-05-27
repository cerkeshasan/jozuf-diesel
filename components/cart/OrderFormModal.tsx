"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface CartItem {
  product_id: string;
  product_name: string;
  oem_code: string;
  quantity: number;
  image?: string;
}

interface OrderFormModalProps {
  items: CartItem[];
  note: string;
  lang: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  name: string;
  city: string;
  email: string;
  message: string;
}

function buildMessage(items: CartItem[], note: string, form: FormState, lang: string): string {
  const lines: string[] = [];
  lines.push(`🛒 *Jozuf Diesel — ${lang === "tr" ? "Sipariş" : lang === "ru" ? "Заказ" : lang === "ar" ? "طلب" : "Order"}*`);
  lines.push(`👤 ${form.name} | ${form.city}`);
  if (form.email) lines.push(`📧 ${form.email}`);
  lines.push("");
  lines.push("*Ürünler / Products:*");
  items.forEach((item) => {
    lines.push(`• ${item.product_name}${item.oem_code ? ` (${item.oem_code})` : ""} — x${item.quantity}`);
  });
  if (note || form.message) {
    lines.push("");
    lines.push(`📝 ${note || form.message}`);
  }
  return lines.join("\n");
}

export default function OrderFormModal({ items, note, lang, onClose, onSuccess }: OrderFormModalProps) {
  const [form, setForm] = useState<FormState>({ name: "", city: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [kvkkError, setKvkkError] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Ad Soyad zorunludur.";
    if (!form.city.trim()) e.city = "Şehir zorunludur.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (!kvkkConsent) { setKvkkError(true); return; }

    setLoading(true);
    const message = buildMessage(items, note, form, lang);
    const isRu = lang === "ru";
    let url: string;
    if (isRu) {
      const tgUsername = process.env.NEXT_PUBLIC_TELEGRAM || "";
      url = tgUsername
        ? `https://t.me/${tgUsername}?text=${encodeURIComponent(message)}`
        : `https://t.me/+${(process.env.NEXT_PUBLIC_WHATSAPP || "905517042268").replace(/\D/g, "")}`;
    } else {
      const waNumber = process.env.NEXT_PUBLIC_WHATSAPP || "905517042268";
      url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    }

    // Save order to DB (non-blocking)
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_number: `JD-${Date.now()}`,
          lang,
          items,
          note: form.message || note,
          customer_name: form.name,
          customer_city: form.city,
          customer_email: form.email,
          wa_message: message,
        }),
      });
    } catch { /* non-critical */ }

    window.open(url, "_blank");
    setLoading(false);
    onSuccess();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="font-oswald font-bold text-[#0D1B2A] text-xl">Sipariş Bilgileri</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {lang === "ru" ? "Получить предложение через Telegram" : "WhatsApp üzerinden teklif alın"}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Soyad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setErrors(e2 => ({ ...e2, name: "" })); }}
                placeholder="Ahmet Yılmaz"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A] ${errors.name ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Şehir <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => { setForm(f => ({ ...f, city: e.target.value })); setErrors(e2 => ({ ...e2, city: "" })); }}
                placeholder="İstanbul"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A] ${errors.city ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="ahmet@ornek.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Not / Özel İstek</label>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Özel bir notunuz varsa buraya yazabilirsiniz..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A] resize-none"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
              <p className="font-medium text-gray-700 mb-1">Sipariş içeriği ({items.length} ürün):</p>
              {items.slice(0, 3).map((item) => (
                <p key={item.product_id}>• {item.product_name} × {item.quantity}</p>
              ))}
              {items.length > 3 && <p>...ve {items.length - 3} ürün daha</p>}
            </div>

            <div className="space-y-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={kvkkConsent}
                  onChange={(e) => { setKvkkConsent(e.target.checked); setKvkkError(false); }}
                  className="mt-0.5 accent-[#C0202A] shrink-0"
                />
                <span className="text-xs text-gray-600">
                  <Link href={`/${lang}/kvkk`} className="text-[#C0202A] hover:underline font-medium" target="_blank">
                    {lang === "tr" ? "KVKK Aydınlatma Metni" : lang === "ru" ? "Уведомление о конфиденциальности" : lang === "ar" ? "إشعار الخصوصية" : "Privacy Notice"}
                  </Link>
                  {lang === "tr" ? "'ni okudum, kişisel verilerimin işlenmesine onay veriyorum." : lang === "ru" ? " — я прочитал(а) и даю согласие на обработку моих персональных данных." : lang === "ar" ? " — لقد قرأت الإشعار وأوافق على معالجة بياناتي الشخصية." : " — I have read and consent to the processing of my personal data."}{" "}
                  <span className="text-red-500">*</span>
                </span>
              </label>
              {kvkkError && (
                <p className="text-red-500 text-xs pl-5">
                  {lang === "tr" ? "Devam etmek için onay vermeniz gerekmektedir." : lang === "ru" ? "Для продолжения необходимо ваше согласие." : lang === "ar" ? "يجب الموافقة للمتابعة." : "Consent is required to proceed."}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-3 transition-colors disabled:opacity-50 ${lang === "ru" ? "bg-[#229ED9] hover:bg-[#1a8ec2]" : "bg-[#25D366] hover:bg-[#1ebe5a]"}`}
            >
              {loading ? (
                <><Loader2 size={20} className="animate-spin" /> Açılıyor...</>
              ) : lang === "ru" ? (
                <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.925 8.175l-2.025 9.525c-.15.675-.548.84-1.11.525l-3-2.21-1.448 1.395c-.158.158-.293.293-.6.293l.21-3.045 5.528-4.995c.24-.21-.052-.33-.368-.12L6.45 13.89l-2.948-.923c-.64-.2-.653-.638.135-.945l11.475-4.425c.533-.203 1 .123.813.578z"/></svg> Telegram&apos;da Devam Et</>
              ) : (
                <><MessageCircle size={20} /> WhatsApp&apos;ta Devam Et</>
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
