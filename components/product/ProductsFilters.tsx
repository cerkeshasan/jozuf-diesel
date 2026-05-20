"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Category } from "@/lib/supabase";
import type { Translations } from "@/lib/translations";
import CategoryTree from "./CategoryTree";

interface ProductsFiltersProps {
  categories: Category[];
  brands: string[];
  lang: string;
  currentCategory?: string;
  currentBrand?: string;
  currentStock?: string;
  t: Translations;
}

const categoryLabels: Record<string, string> = {
  en: "Categories", tr: "Kategoriler", ru: "Категории", ar: "الفئات",
};

export default function ProductsFilters({
  categories,
  brands,
  lang,
  currentCategory,
  currentBrand,
  currentStock,
  t,
}: ProductsFiltersProps) {
  const router = useRouter();

  const navigate = (updates: Record<string, string>) => {
    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    Object.entries(updates).forEach(([k, v]) => {
      if (!v) params.delete(k);
      else params.set(k, v);
    });
    params.delete("page");
    router.push(`/${lang}/urunler?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-oswald font-semibold text-[#0D1B2A] text-lg">{t.filters.title}</h3>
        {(currentCategory || currentBrand || currentStock) && (
          <Link href={`/${lang}/urunler`} className="text-xs text-[#C0202A] hover:underline">
            {t.filters.clear}
          </Link>
        )}
      </div>

      {/* Kategori ağacı */}
      <div>
        <h4 className="font-medium text-xs text-gray-500 mb-2 uppercase tracking-wide">
          {categoryLabels[lang] || categoryLabels.en}
        </h4>
        {/* Tümü seçeneği */}
        <button
          type="button"
          onClick={() => navigate({ category: "" })}
          className={`w-full flex items-center gap-2 px-2 py-2 rounded-xl text-sm font-medium text-left mb-1 transition-colors ${
            !currentCategory ? "bg-[#C0202A]/10 text-[#C0202A]" : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {t.filters.all}
        </button>
        <CategoryTree
          categories={categories}
          lang={lang}
          activeCategoryId={currentCategory}
          onParentClick={(cat) => navigate({ category: cat.id })}
        />
      </div>

      <div className="border-t border-gray-100" />

      {/* Stok */}
      <div>
        <h4 className="font-medium text-xs text-gray-500 mb-2 uppercase tracking-wide">{t.filters.stockStatus}</h4>
        <div className="space-y-1.5">
          {[
            { value: "", label: t.filters.all },
            { value: "in_stock", label: t.product.inStock },
            { value: "on_order", label: t.product.onOrder },
            { value: "out_of_stock", label: t.product.outOfStock },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="stock"
                checked={(currentStock || "") === opt.value}
                onChange={() => navigate({ stock: opt.value })}
                className="accent-[#C0202A]"
              />
              <span className="text-sm text-gray-600 group-hover:text-[#C0202A] transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Marka */}
      {brands.length > 0 && (
        <>
          <div className="border-t border-gray-100" />
          <div>
            <h4 className="font-medium text-xs text-gray-500 mb-2 uppercase tracking-wide">{t.filters.brand}</h4>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="brand"
                  checked={!currentBrand}
                  onChange={() => navigate({ brand: "" })}
                  className="accent-[#C0202A]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#C0202A]">{t.filters.all}</span>
              </label>
              {brands.slice(0, 10).map((brand) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="brand"
                    checked={currentBrand === brand}
                    onChange={() => navigate({ brand })}
                    className="accent-[#C0202A]"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-[#C0202A] transition-colors">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
