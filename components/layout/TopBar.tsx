"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Phone, Mail } from "lucide-react";
import { languages, type Lang } from "@/lib/translations";

interface TopBarProps {
  lang: string;
  settings?: Record<string, string>;
}

export default function TopBar({ lang, settings = {} }: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLang = (newLang: string) => {
    document.cookie = `lang-preference=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    const segments = pathname.split("/");
    segments[1] = newLang;
    router.push(segments.join("/"));
  };

  const phone = settings["phone"] || "+90 551 704 22 68";
  const email = settings["email"] || "info@jozufdiesel.com";
  // Telefon numarasından sadece rakamları al (tel: href için)
  const phoneTel = phone.replace(/\s/g, "");

  return (
    <div className="bg-[#0D1B2A] text-white text-sm py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href={`tel:${phoneTel}`} className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
            <Phone size={14} />
            <span>{phone}</span>
          </a>
          <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-red-400 transition-colors hidden sm:flex">
            <Mail size={14} />
            <span>{email}</span>
          </a>
        </div>
        <div className="flex items-center gap-1">
          {(Object.entries(languages) as [Lang, typeof languages[Lang]][]).map(([code, info]) => (
            <button
              key={code}
              onClick={() => switchLang(code)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                lang === code ? "bg-[#C0202A] text-white" : "hover:bg-white/10"
              }`}
            >
              <span>{info.flag}</span>
              <span className="hidden sm:inline">{code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
