"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  slug: string;
  name_en: string;
  name_tr: string | null;
  name_ru: string | null;
  name_ar: string | null;
  oem_code: string | null;
  brand: string | null;
  images: string[];
}

interface HeroSearchProps {
  lang: string;
  placeholder: string;
  popular: string;
}

export default function HeroSearch({ lang, placeholder, popular }: HeroSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const fixEncoding = (str: string): string => {
    try {
      const bytes = Uint8Array.from(str, (c) => c.charCodeAt(0));
      return new TextDecoder("utf-8").decode(bytes);
    } catch {
      return str;
    }
  };

  const getDisplayName = (r: SearchResult): string => {
    let name = r.name_en;
    if (lang === "tr" && r.name_tr) name = r.name_tr;
    else if (lang === "ru" && r.name_ru) name = r.name_ru;
    else if (lang === "ar" && r.name_ar) name = r.name_ar;
    // Mojibake tespiti: Ã harfi varsa encoding bozuk demektir
    return name.includes("Ã") ? fixEncoding(name) : name;
  };

  const handleChange = (value: string) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (value.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}&limit=6`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/${lang}/arama?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSelect = (slug: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/${lang}/urunler/${slug}`);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  // Dışarı tıklayınca kapat
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const popularTerms = ["F00VC99002", "Delphi Conta", "Denso Pul"];

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Arama Kutusu */}
      <form onSubmit={handleSubmit}>
        <div className={`bg-white flex items-center gap-2 px-3 py-2.5 rounded-xl shadow-lg transition-all duration-200 ${open ? "ring-2 ring-[#C0202A]" : ""}`}>
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => query.length >= 2 && results.length > 0 && setOpen(true)}
            placeholder={placeholder}
            className="flex-1 text-sm text-[#0D1B2A] outline-none bg-transparent placeholder-gray-400"
          />
          {loading && (
            <span className="w-4 h-4 border-2 border-[#C0202A] border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          {query && !loading && (
            <button type="button" onClick={handleClear} className="text-gray-300 hover:text-gray-500 shrink-0">
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            className="bg-[#C0202A] text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors whitespace-nowrap shrink-0"
          >
            Ara
          </button>
        </div>
      </form>

      {/* Dropdown Sonuçlar */}
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {results.map((r, i) => (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleSelect(r.slug)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left"
              >
                {/* Ürün Görseli */}
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                  {r.images?.[0] ? (
                    <Image src={r.images[0]} alt={r.name_en} width={40} height={40} className="object-contain" />
                  ) : (
                    <span className="text-xl">⚙️</span>
                  )}
                </div>
                {/* Bilgi */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0D1B2A] truncate">{getDisplayName(r)}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {r.oem_code && (
                      <span className="text-xs text-[#C0202A] font-mono">{r.oem_code}</span>
                    )}
                    {r.brand && (
                      <span className="text-xs text-gray-400">{r.brand}</span>
                    )}
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-300 shrink-0" />
              </motion.button>
            ))}

            {/* Tüm sonuçları gör */}
            <button
              onClick={() => { setOpen(false); router.push(`/${lang}/arama?q=${encodeURIComponent(query)}`); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[#C0202A] hover:bg-red-50 transition-colors border-t border-gray-100"
            >
              Tüm sonuçları gör
              <ArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popüler aramalar */}
      <p className="text-sm text-gray-400 mt-3">
        {popular}{" "}
        {popularTerms.map((term, i) => (
          <span key={term}>
            <button
              onClick={() => { setQuery(term); handleChange(term); }}
              className="text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
            >
              {term}
            </button>
            {i < popularTerms.length - 1 && <span className="mx-1 text-gray-600">|</span>}
          </span>
        ))}
      </p>
    </div>
  );
}
