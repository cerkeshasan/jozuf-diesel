"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Category } from "@/lib/supabase";
import { getCategoryName } from "@/lib/translations";
import { ArrowRight } from "lucide-react";

interface MegaMenuProps {
  categories: Category[];
  lang: string;
  isOpen: boolean;
  t: { explore: string };
}

export default function MegaMenu({ categories, lang, isOpen, t }: MegaMenuProps) {
  const parents = categories.filter((c) => !c.parent_id);
  const children = categories.filter((c) => c.parent_id);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="absolute left-0 right-0 bg-white shadow-2xl border-t-2 border-[#C0202A] z-50"
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div
              className="grid gap-x-6 gap-y-4"
              style={{ gridTemplateColumns: `repeat(${Math.min(parents.length, 4)}, minmax(0, 1fr))` }}
            >
              {parents.map((cat) => {
                const catChildren = children.filter((c) => c.parent_id === cat.id);
                return (
                  <div key={cat.id} className="min-w-0">
                    <Link
                      href={`/${lang}/kategori/${cat.slug}`}
                      className="block font-oswald font-semibold text-[#0D1B2A] hover:text-[#C0202A] transition-colors mb-2 text-base"
                    >
                      {getCategoryName(cat, lang)}
                    </Link>
                    <div className="space-y-1">
                      {catChildren.map((child) => (
                        <Link
                          key={child.id}
                          href={`/${lang}/kategori/${child.slug}`}
                          className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#C0202A] py-0.5 transition-colors group"
                        >
                          <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-[#C0202A] transition-colors shrink-0" />
                          <span className="truncate">{getCategoryName(child, lang)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-400">{categories.length} {lang === "tr" ? "kategori" : lang === "ru" ? "категорий" : lang === "ar" ? "فئة" : "categories"}</p>
              <Link
                href={`/${lang}/urunler`}
                className="inline-flex items-center gap-2 bg-[#C0202A] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a81b23] transition-colors text-sm"
              >
                {lang === "tr" ? "Tüm Ürünleri Gör" : lang === "ru" ? "Все продукты" : lang === "ar" ? "عرض الكل" : "View All Products"} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
