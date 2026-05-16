"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, X } from "lucide-react";
import Image from "next/image";
import type { Translations } from "@/lib/translations";

interface SearchResult {
  id: string;
  slug: string;
  name_en: string;
  name_tr?: string;
  name_ru?: string;
  name_ar?: string;
  oem_code?: string;
  images?: string[];
  categories?: { name_en: string; name_tr?: string };
}

interface ActionSearchBarProps {
  lang: string;
  t: Translations;
}

function getProductName(product: SearchResult, lang: string): string {
  const key = `name_${lang}` as keyof SearchResult;
  return (product[key] as string) || product.name_en;
}

export default function ActionSearchBar({ lang, t }: ActionSearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&lang=${lang}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        setResults(data || []);
        setOpen(true);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, [lang]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
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
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard: Escape closes
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          {loading ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" size={20} />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          )}
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder={t.hero.searchPlaceholder}
            className="w-full pl-10 pr-10 py-4 rounded-xl text-[#0D1B2A] font-medium focus:outline-none focus:ring-2 focus:ring-[#C0202A] text-base"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-[#C0202A] hover:bg-[#a81b23] text-white px-6 py-4 rounded-xl font-semibold transition-colors whitespace-nowrap"
        >
          {t.nav.search}
        </button>
      </form>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.slug)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.images?.[0] ? (
                    <Image src={item.images[0]} alt="" width={40} height={40} className="object-contain w-full h-full p-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">⚙️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0D1B2A] truncate">{getProductName(item, lang)}</p>
                  <div className="flex items-center gap-2">
                    {item.oem_code && (
                      <span className="text-xs text-[#C0202A] font-mono">{item.oem_code}</span>
                    )}
                    {item.categories && (
                      <span className="text-xs text-gray-400">{(item.categories as Record<string, string>)[`name_${lang}`] || item.categories.name_en}</span>
                    )}
                  </div>
                </div>
                <Search size={14} className="text-gray-300 flex-shrink-0" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setOpen(false); router.push(`/${lang}/arama?q=${encodeURIComponent(query)}`); }}
              className="w-full px-4 py-2.5 text-sm text-[#C0202A] font-semibold hover:bg-red-50 transition-colors text-center"
            >
              Tüm sonuçları gör →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
