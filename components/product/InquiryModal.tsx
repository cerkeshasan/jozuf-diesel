"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface InquiryModalProps {
  productId: string;
  productName: string;
  lang?: string;
  onClose: () => void;
}

export default function InquiryModal({ productId, productName, lang = "tr", onClose }: InquiryModalProps) {
  const [form, setForm] = useState({ customer_name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [kvkkError, setKvkkError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customer_name.trim()) e.customer_name = "Ad Soyad zorunludur.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Geçerli e-posta giriniz.";
    if (!form.phone.trim() || form.phone.trim().length < 6) e.phone = "Telefon zorunludur.";
    if (!form.message.trim() || form.message.trim().length < 5) e.message = "Mesajınız en az 5 karakter olmalı.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (!kvkkConsent) { setKvkkError(true); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          product_name: productName,
          ...form,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => { setSuccess(false); onClose(); }, 3000);
      } else {
        const data = await res.json();
        setErrors({ message: data.error || "Gönderim başarısız. Tekrar deneyin." });
      }
    } catch {
      setErrors({ message: "Bağlantı hatası. Tekrar deneyin." });
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: "" })); }}
        placeholder={placeholder}
        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A] ${errors[key] ? "border-red-400" : "border-gray-200"}`}
      />
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

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
              <h2 className="font-oswald font-bold text-[#0D1B2A] text-xl">Soru Sor</h2>
              <p className="text-sm text-gray-400 mt-0.5 truncate max-w-xs">{productName}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          {success ? (
            <div className="p-8 text-center">
              <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
              <h3 className="font-oswald font-bold text-[#0D1B2A] text-xl mb-1">Sorunuz Alındı!</h3>
              <p className="text-gray-500 text-sm">En kısa sürede size dönüş yapacağız.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {field("customer_name", "Ad Soyad", "text", "Ahmet Yılmaz")}
              {field("email", "E-posta", "email", "ahmet@ornek.com")}
              {field("phone", "Telefon", "tel", "+90 555 000 00 00")}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mesajınız <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: "" })); }}
                  placeholder="Bu ürün hakkında sormak istediğiniz soruyu yazın..."
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A] resize-none ${errors.message ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
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
                className="w-full bg-[#0D1B2A] hover:bg-[#1a2f45] text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Gönderiliyor...</> : <><Send size={18} /> Soruyu Gönder</>}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
