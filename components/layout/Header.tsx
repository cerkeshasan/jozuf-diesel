"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useCartStore } from "@/lib/cart-store";
import { Search, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import type { Category } from "@/lib/supabase";
import type { Translations } from "@/lib/translations";
import { getCategoryName } from "@/lib/translations";
import MegaMenu from "./MegaMenu";
import Image from "next/image";

interface HeaderProps {
  lang: string;
  t: Translations;
  categories: Category[];
  settings?: Record<string, string>;
}

interface SearchResult {
  id: string;
  slug: string;
  name_en: string;
  name_tr: string | null;
  oem_code: string | null;
  brand: string | null;
  images: string[];
}

export default function Header({ lang, t, categories, settings = {} }: HeaderProps) {
  const logoUrl = settings["logo_url"] || "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 20));
    return unsub;
  }, [scrollY]);

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (value.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    setSearchLoading(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      window.location.href = `/${lang}/arama?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const fixEncoding = (str: string): string => {
    try {
      const bytes = Uint8Array.from(str, (c) => c.charCodeAt(0));
      return new TextDecoder("utf-8").decode(bytes);
    } catch {
      return str;
    }
  };

  const getDisplayName = (r: SearchResult): string => {
    const name = lang === "tr" && r.name_tr ? r.name_tr : r.name_en;
    return name.includes("Ã") ? fixEncoding(name) : name;
  };

  const navLinks = [
    { href: `/${lang}/kurumsal`, label: t.nav.corporate },
    { href: `/${lang}/iletisim`, label: t.nav.contact },
  ];

  return (
    <header
      className={`bg-white sticky top-0 z-40 border-b-2 border-[#C0202A] transition-shadow duration-300 ${scrolled ? "shadow-xl" : "shadow-md"}`}
      onMouseLeave={() => setMegaOpen(false)}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-13" : "h-16"}`}>
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2 shrink-0">
            {logoUrl ? (
              <Image src={logoUrl} alt="Jozuf Diesel" width={200} height={50} className="h-10 w-auto object-contain" />
            ) : (
              <Image src="/logo.svg" alt="Jozuf Diesel" width={300} height={52} className="h-10 w-auto" priority />
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href={`/${lang}`} className="relative group text-[#0D1B2A] hover:text-[#C0202A] font-medium transition-colors">
              {t.nav.home}
              <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-[#C0202A] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
            >
              <Link
                href={`/${lang}/urunler`}
                className="relative group flex items-center gap-1 text-[#0D1B2A] hover:text-[#C0202A] font-medium transition-colors py-6"
              >
                {t.nav.products} <ChevronDown size={16} className={`transition-transform ${megaOpen ? "rotate-180" : ""}`} />
                <span className="absolute bottom-4 left-0 w-full h-0.5 bg-[#C0202A] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
              </Link>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative group text-[#0D1B2A] hover:text-[#C0202A] font-medium transition-colors"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-[#C0202A] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Live Search */}
            <div ref={searchRef} className="relative">
              {searchOpen ? (
                <div className="relative">
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder={t.hero.searchPlaceholder}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-36 sm:w-52 focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
                    />
                    {searchLoading && (
                      <span className="absolute right-8 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-[#C0202A] border-t-transparent rounded-full animate-spin" />
                    )}
                    <button
                      type="button"
                      onClick={() => { setSearchOpen(false); setShowDropdown(false); setSearchQuery(""); }}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  </form>

                  {/* Dropdown Results */}
                  {showDropdown && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                      {searchResults.map((r) => (
                        <Link
                          key={r.id}
                          href={`/${lang}/urunler/${r.slug}`}
                          onClick={() => { setShowDropdown(false); setSearchOpen(false); setSearchQuery(""); }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                            {r.images?.[0] ? (
                              <Image src={r.images[0]} alt={r.name_en} width={40} height={40} className="object-contain" />
                            ) : (
                              <span className="text-lg">⚙️</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#0D1B2A] truncate">{getDisplayName(r)}</p>
                            {r.oem_code && <p className="text-xs text-[#C0202A] font-mono">{r.oem_code}</p>}
                            {r.brand && <p className="text-xs text-gray-400">{r.brand}</p>}
                          </div>
                        </Link>
                      ))}
                      <Link
                        href={`/${lang}/arama?q=${encodeURIComponent(searchQuery)}`}
                        onClick={() => { setShowDropdown(false); setSearchOpen(false); }}
                        className="block px-4 py-3 text-center text-sm text-[#C0202A] font-medium hover:bg-red-50 transition-colors"
                      >
                        {lang === "tr" ? "Tüm sonuçları gör →" : lang === "ru" ? "Все результаты →" : lang === "ar" ? "← عرض الكل" : "View all results →"}
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-[#0D1B2A] hover:text-[#C0202A] transition-colors"
                  aria-label="Search"
                >
                  <Search size={22} />
                </button>
              )}
            </div>

            <Link href={`/${lang}/sepet`} className="relative text-[#0D1B2A] hover:text-[#C0202A] transition-colors">
              <ShoppingCart size={22} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.4, 1] }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.35, times: [0, 0.6, 1] }}
                    className="absolute -top-2 -right-2 bg-[#C0202A] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <button
              className="lg:hidden text-[#0D1B2A]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden border-t border-gray-100 overflow-hidden"
          >
            <nav className="flex flex-col gap-1 py-4">
              <Link
                href={`/${lang}`}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-[#0D1B2A] hover:text-[#C0202A] hover:bg-gray-50 rounded-xl font-medium"
              >
                {t.nav.home}
              </Link>
              <Link
                href={`/${lang}/urunler`}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-[#0D1B2A] hover:text-[#C0202A] hover:bg-gray-50 rounded-xl font-medium"
              >
                {t.nav.products}
              </Link>
              {/* Mobile categories */}
              <div className="pl-6 space-y-1">
                {categories.filter(c => !c.parent_id).slice(0, 6).map(cat => (
                  <Link
                    key={cat.id}
                    href={`/${lang}/kategori/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-1.5 text-sm text-gray-500 hover:text-[#C0202A] hover:bg-gray-50 rounded-lg"
                  >
                    {getCategoryName(cat, lang)}
                  </Link>
                ))}
                <Link
                  href={`/${lang}/urunler`}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-1.5 text-sm text-[#C0202A] font-medium hover:bg-red-50 rounded-lg"
                >
                  {t.home.explore}
                </Link>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-[#0D1B2A] hover:text-[#C0202A] hover:bg-gray-50 rounded-xl font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* MegaMenu - full width relative to header */}
      <MegaMenu
        categories={categories}
        lang={lang}
        isOpen={megaOpen}
        t={{ explore: t.home.explore }}
      />
    </header>
  );
}
