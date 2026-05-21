"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { Translations } from "@/lib/translations";

interface FooterProps {
  lang: string;
  t: Translations;
  /** Supabase settings tablosundan gelen tüm ayarlar (key → value) */
  settings?: Record<string, string>;
}

/* ── Inline SVG ikonlar ── */
function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r="16" fill="#1877F2" />
      <path
        d="M22.676 20.633l.726-4.733h-4.54v-3.072c0-1.295.634-2.557 2.668-2.557h2.064V6.294S21.668 6 19.834 6c-3.742 0-6.19 2.268-6.19 6.374v3.526H9.5v4.733h4.144V32h5.098V20.633h3.934z"
        fill="#fff"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <defs>
        <radialGradient id="ig" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#ffd600" />
          <stop offset="25%" stopColor="#ff6930" />
          <stop offset="50%" stopColor="#fe3b96" />
          <stop offset="75%" stopColor="#c837ab" />
          <stop offset="100%" stopColor="#4a00d4" />
        </radialGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#ig)" />
      <rect x="6" y="6" width="20" height="20" rx="5.5" fill="none" stroke="#fff" strokeWidth="2" />
      <circle cx="16" cy="16" r="4.5" fill="none" stroke="#fff" strokeWidth="2" />
      <circle cx="22" cy="10" r="1.2" fill="#fff" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <rect width="32" height="32" rx="6" fill="#0A66C2" />
      <path d="M7 12.5h4V25H7V12.5zm2-6.5a2.3 2.3 0 110 4.6A2.3 2.3 0 019 6z" fill="#fff" />
      <path
        d="M14.5 12.5H18v1.7c.6-1 1.9-2 3.9-2C25.2 12.2 26 14.6 26 18v7h-4v-6.4c0-1.5-.5-2.6-2-2.6-1.6 0-2.5 1.1-2.5 2.7V25h-3V12.5z"
        fill="#fff"
      />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <rect width="32" height="32" rx="7" fill="#FF0000" />
      <path
        d="M25.8 11.1a2.7 2.7 0 00-1.9-1.9C22.3 8.8 16 8.8 16 8.8s-6.3 0-7.9.4a2.7 2.7 0 00-1.9 1.9C5.8 12.7 5.8 16 5.8 16s0 3.3.4 4.9a2.7 2.7 0 001.9 1.9c1.6.4 7.9.4 7.9.4s6.3 0 7.9-.4a2.7 2.7 0 001.9-1.9c.4-1.6.4-4.9.4-4.9s0-3.3-.4-4.9z"
        fill="#fff"
      />
      <polygon points="13.5,19.5 20.5,16 13.5,12.5" fill="#FF0000" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r="16" fill="#25D366" />
      <path
        d="M23.5 8.5A10.4 10.4 0 0016 5.6C10.25 5.6 5.6 10.25 5.6 16c0 1.84.48 3.63 1.39 5.21L5.5 26.5l5.42-1.42A10.38 10.38 0 0016 26.4c5.75 0 10.4-4.65 10.4-10.4 0-2.78-1.08-5.39-3.04-7.35l.14-.15zm-7.5 16a8.6 8.6 0 01-4.39-1.2l-.31-.19-3.22.84.86-3.14-.2-.32A8.6 8.6 0 017.4 16c0-4.74 3.86-8.6 8.6-8.6 2.3 0 4.46.9 6.08 2.53A8.55 8.55 0 0124.6 16c0 4.74-3.86 8.6-8.6 8.6zm4.72-6.44c-.26-.13-1.53-.75-1.77-.84-.24-.09-.41-.13-.58.13-.17.26-.66.84-.81 1.01-.15.17-.3.19-.56.06a7.06 7.06 0 01-2.08-1.28 7.77 7.77 0 01-1.44-1.79c-.15-.26-.02-.4.11-.53.12-.11.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.8-1.92-.21-.5-.43-.43-.58-.44h-.5c-.17 0-.45.06-.69.32-.24.26-.91.89-.91 2.17s.93 2.52 1.06 2.69c.13.17 1.83 2.8 4.44 3.93.62.27 1.1.43 1.48.55.62.2 1.19.17 1.63.1.5-.07 1.53-.62 1.74-1.22.21-.6.21-1.12.15-1.22-.06-.1-.23-.16-.5-.29z"
        fill="#fff"
      />
    </svg>
  );
}

const socialConfig: { key: string; label: string; Icon: () => React.ReactElement }[] = [
  { key: "whatsapp", label: "WhatsApp", Icon: WhatsappIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinIcon },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon },
];

export default function Footer({ lang, t, settings = {} }: FooterProps) {
  // İletişim bilgileri — DB'den gelir, yoksa varsayılan
  const phone = settings["phone"] || "+90 551 704 22 68";
  const email = settings["email"] || "info@jozufdiesel.com";
  const address = settings["address"] || "Istanbul, Turkey";
  const langKey = `working_hours_${lang}` as keyof typeof settings;
  const workingHours = settings[langKey] || settings["working_hours"] || "Mon–Sat 08:00–18:00";
  const whatsappNum = (settings["whatsapp"] || "905517042268").replace(/\D/g, "");
  const phoneTel = phone.replace(/\s/g, "");
  const mapsUrl = settings["maps_address_url"] || `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  const quickLinks = [
    { href: `/${lang}/urunler`, label: t.footer.products },
    { href: `/${lang}/kurumsal`, label: t.footer.corporate },
    { href: `/${lang}/iletisim`, label: t.footer.contact },
    { href: `/${lang}/arama`, label: t.nav.search },
  ];

  const legalLinks = [
    { href: `/${lang}/gizlilik`, label: lang === "tr" ? "Gizlilik Politikası" : lang === "ru" ? "Конфиденциальность" : lang === "ar" ? "الخصوصية" : "Privacy Policy" },
    { href: `/${lang}/kullanim-sartlari`, label: lang === "tr" ? "Kullanım Şartları" : lang === "ru" ? "Условия использования" : lang === "ar" ? "شروط الاستخدام" : "Terms of Use" },
    { href: `/${lang}/kvkk`, label: lang === "tr" ? "KVKK" : lang === "ru" ? "Защита данных" : lang === "ar" ? "حماية البيانات" : "Privacy Notice" },
  ];

  const colVariants = {
    hidden: { opacity: 0, y: 30 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    }),
  };

  return (
    <footer className="bg-[#0D1B2A] text-white">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >

          {/* ── Sol: Logo + Sosyal Medya ── */}
          <motion.div variants={colVariants} custom={0}>
            <Link href={`/${lang}`} className="inline-block mb-4 bg-white rounded-xl px-3 py-2">
              <Image
                src={settings["logo_url"] || "/logo.svg"}
                alt="Jozuf Diesel"
                width={300}
                height={52}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Common Rail & injector spare parts.<br />
              Bosch, Delphi, Denso, Siemens systems.<br />
              30+ years · 50+ countries.
            </p>

            {/* Sosyal medya ikonları */}
            <div className="flex gap-3 flex-wrap">
              {socialConfig.map(({ key, label, Icon }) => {
                const raw = (settings[key] || "").trim();
                let href = "#";
                if (raw) {
                  if (key === "whatsapp") {
                    href = `https://wa.me/${raw.replace(/\D/g, "")}`;
                  } else {
                    href = raw.startsWith("http") ? raw : `https://${raw}`;
                  }
                }
                return (
                  <a
                    key={key}
                    href={href}
                    target={href !== "#" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="transition-all duration-200 hover:scale-110 hover:opacity-90 rounded-lg"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* ── Orta: Hızlı Linkler ── */}
          <motion.div variants={colVariants} custom={1}>
            <h3 className="font-oswald font-semibold text-lg mb-5 text-white">
              {lang === "tr" ? "Hızlı Linkler" : lang === "ru" ? "Быстрые ссылки" : lang === "ar" ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2.5 mb-6">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-oswald font-semibold text-base mb-3 text-gray-300">
              {lang === "tr" ? "Yasal" : lang === "ru" ? "Правовая информация" : lang === "ar" ? "قانوني" : "Legal"}
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Sağ: İletişim ── */}
          <motion.div variants={colVariants} custom={2}>
            <h3 className="font-oswald font-semibold text-lg mb-5 text-white">{t.footer.contact}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <Phone size={16} className="mt-0.5 shrink-0 text-[#C0202A]" />
                <a href={`tel:${phoneTel}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <Mail size={16} className="mt-0.5 shrink-0 text-[#C0202A]" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors break-all">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#C0202A]" />
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {address}
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <Clock size={16} className="mt-0.5 shrink-0 text-[#C0202A]" />
                <span>{workingHours}</span>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${whatsappNum}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <WhatsappIcon />
              <span className="ml-1">WhatsApp</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Alt bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Jozuf Diesel. {t.footer.rights}
          </p>
          <div className="flex gap-4 text-xs text-gray-600">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-gray-400 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        {/* Yasal zorunluluk: tüzel kişilik bilgisi */}
        <div className="border-t border-white/5">
          <p className="max-w-7xl mx-auto px-4 py-2 text-[11px] text-gray-700 text-center">
            Üçler Otomotiv — Selçuk V.D. Vergi No: 5771 214 3662 &nbsp;·&nbsp; Horozluhan Mahallesi İhlamur Sk. No:10, Selçuklu / KONYA
          </p>
        </div>
      </div>
    </footer>
  );
}
