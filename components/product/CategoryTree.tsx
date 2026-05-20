"use client";

import Link from "next/link";
import type { Category } from "@/lib/supabase";
import { getCategoryName } from "@/lib/translations";

interface CategoryTreeProps {
  categories: Category[];   // tüm kategoriler (parent + child)
  lang: string;
  activeCategoryId?: string;  // aktif ana kategori filtresi (urunler sayfası)
  activeSlug?: string;        // aktif alt kategori sayfası (kategori sayfası)
  onParentClick?: (cat: Category) => void; // urunler sayfasında filtre için
}

export default function CategoryTree({
  categories,
  lang,
  activeCategoryId,
  activeSlug,
  onParentClick,
}: CategoryTreeProps) {
  const parents = [...categories.filter(c => !c.parent_id)].sort((a, b) => a.order_index - b.order_index);
  const children = categories.filter(c => c.parent_id);

  return (
    <div className="space-y-1">
      {parents.map((parent) => {
        const subs = children
          .filter(c => c.parent_id === parent.id)
          .sort((a, b) => a.order_index - b.order_index);

        const isParentActive = activeCategoryId === parent.id;
        const hasActiveChild =
          subs.some(s => s.id === activeCategoryId || s.slug === activeSlug);

        return (
          <div key={parent.id}>
            {/* Ana kategori */}
            {onParentClick ? (
              <button
                type="button"
                onClick={() => onParentClick(parent)}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-xl text-sm font-medium text-left transition-colors ${
                  isParentActive || hasActiveChild
                    ? "bg-[#C0202A]/10 text-[#C0202A]"
                    : "text-[#0D1B2A] hover:bg-gray-100"
                }`}
              >
                <span className="flex-1">{getCategoryName(parent, lang)}</span>
                {subs.length > 0 && (
                  <span className="text-xs text-gray-400 font-normal">{subs.length}</span>
                )}
              </button>
            ) : (
              <Link
                href={`/${lang}/kategori/${parent.slug}`}
                className={`flex items-center gap-2 px-2 py-2 rounded-xl text-sm font-medium transition-colors ${
                  parent.slug === activeSlug || hasActiveChild
                    ? "bg-[#C0202A]/10 text-[#C0202A]"
                    : "text-[#0D1B2A] hover:bg-gray-100"
                }`}
              >
                <span className="flex-1">{getCategoryName(parent, lang)}</span>
                {subs.length > 0 && (
                  <span className="text-xs text-gray-400 font-normal">{subs.length}</span>
                )}
              </Link>
            )}

            {/* Alt kategoriler — her zaman görünür */}
            {subs.length > 0 && (
              <div className="ml-3 mt-0.5 mb-1 border-l-2 border-gray-100 pl-3 space-y-0.5">
                {subs.map((sub) => {
                  const isActive =
                    sub.id === activeCategoryId || sub.slug === activeSlug;
                  return (
                    <Link
                      key={sub.id}
                      href={`/${lang}/kategori/${sub.slug}`}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "text-[#C0202A] font-medium bg-[#C0202A]/5"
                          : "text-gray-500 hover:text-[#C0202A] hover:bg-[#C0202A]/5"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                        isActive ? "bg-[#C0202A]" : "bg-gray-300"
                      }`} />
                      {getCategoryName(sub, lang)}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
