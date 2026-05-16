"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Link from "next/link";
import type { Translations } from "@/lib/translations";
import Button from "@/components/ui/Button";

interface ContactFormProps {
  t: Translations;
  lang: string;
}

const formHeadings: Record<string, string> = {
  en: "Send a Message",
  tr: "Mesaj Gönder",
  ru: "Отправить сообщение",
  ar: "أرسل رسالة",
};

const errorMessages: Record<string, string> = {
  en: "Something went wrong. Please try again.",
  tr: "Bir hata oluştu. Lütfen tekrar deneyin.",
  ru: "Что-то пошло не так. Пожалуйста, попробуйте снова.",
  ar: "حدث خطأ. يرجى المحاولة مرة أخرى.",
};

const successReplyMessages: Record<string, string> = {
  en: "We'll reply via email as soon as possible.",
  tr: "En kısa sürede e-posta ile yanıt vereceğiz.",
  ru: "Мы ответим вам по электронной почте как можно скорее.",
  ar: "سنرد عليك عبر البريد الإلكتروني في أقرب وقت ممكن.",
};

const placeholders: Record<string, { name: string; phone: string; email: string; message: string }> = {
  en: { name: "John Doe", phone: "+1 234 567 8900", email: "you@example.com", message: "Which parts are you looking for? Vehicle model?" },
  tr: { name: "Ad Soyad", phone: "+90 555 000 0000", email: "siz@ornek.com", message: "Hangi parçaları arıyorsunuz? Araç modeli?" },
  ru: { name: "Иван Иванов", phone: "+7 900 000 0000", email: "you@example.com", message: "Какие запчасти вам нужны? Модель автомобиля?" },
  ar: { name: "الاسم الكامل", phone: "+966 500 000 000", email: "you@example.com", message: "ما القطع التي تبحث عنها؟ موديل السيارة؟" },
};

export default function ContactForm({ t, lang }: ContactFormProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [kvkkError, setKvkkError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const ph = placeholders[lang] || placeholders.en;
  const heading = formHeadings[lang] || formHeadings.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kvkkConsent) {
      setKvkkError(true);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "validation_error") {
          setError(lang === "tr" ? "Lütfen tüm alanları doğru doldurun." : lang === "ru" ? "Пожалуйста, заполните все поля корректно." : lang === "ar" ? "يرجى ملء جميع الحقول بشكل صحيح." : "Please fill all fields correctly.");
        } else {
          setError(errorMessages[lang] || errorMessages.en);
        }
        return;
      }
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setError(errorMessages[lang] || errorMessages.en);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <p className="font-semibold text-green-800 text-lg">{t.contact.success}</p>
        <p className="text-green-600 text-sm mt-1">{successReplyMessages[lang] || successReplyMessages.en}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <h2 className="font-oswald text-2xl font-bold text-[#0D1B2A]">{heading}</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.name} *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A] focus:border-transparent"
            placeholder={ph.name}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.phone}</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A] focus:border-transparent"
            placeholder={ph.phone}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.email} *</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A] focus:border-transparent"
          placeholder={ph.email}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.message} *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A] focus:border-transparent resize-none"
          placeholder={ph.message}
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}

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
            {lang === "tr" ? "'ni okudum, kişisel verilerimin işlenmesine açık rıza veriyorum." : lang === "ru" ? " — я прочитал(а) и даю согласие на обработку моих персональных данных." : lang === "ar" ? " — لقد قرأت الإشعار وأوافق على معالجة بياناتي الشخصية." : " — I have read and consent to the processing of my personal data."}{" "}
            <span className="text-red-500">*</span>
          </span>
        </label>
        {kvkkError && (
          <p className="text-red-500 text-xs pl-5">
            {lang === "tr" ? "Devam etmek için onay vermeniz gerekmektedir." : lang === "ru" ? "Для продолжения необходимо ваше согласие." : lang === "ar" ? "يجب الموافقة للمتابعة." : "Consent is required to proceed."}
          </p>
        )}
      </div>

      <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full gap-2">
        <Send size={18} />
        {t.contact.send}
      </Button>
    </form>
  );
}
