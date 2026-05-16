"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Category } from "@/lib/supabase";
import type { Translations } from "@/lib/translations";
import { getCategoryName } from "@/lib/translations";

interface ProductsFiltersProps {
  categories: Category[];
  brands: string[];
  lang: string;
  currentCategory?: string;
  currentBrand?: string;
  currentStock?: string;
  t: Translations;
}

const filterLabels: Record<string, { filters: string; clear: string; categories: string; all: string; stock: string; brand: string }> = {
  en: { filters: "Filters", clear: "Clear", categories: "Categories", all: "All", stock: "Stock Status", brand: "Brand" },
  tr: { filters: "Filtreler", clear: "Temizle", categories: "Kategoriler", all: "Tümü", stock: "Stok Durumu", brand: "Marka" },
  ru: { filters: "Фильтры", clear: "Сбросить", categories: "Категории", all: "Все", stock: "Наличие", brand: "Бренд" },
  ar: { filters: "الفلاتر", clear: "مسح", categories: "الفئات", all: "الكل", stock: "حالة المخزون", brand: "الماركة" },
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
  const labels = filterLabels[lang] || filterLabels.en;

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

  const parents = categories.filter(c => !c.parent_id);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-oswald font-semibold text-[#0D1B2A] text-lg">{labels.filters}</h3>
        {(currentCategory || currentBrand || currentStock) && (
          <Link href={`/${lang}/urunler`} className="text-xs text-[#C0202A] hover:underline">
            {labels.clear}
          </Link>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium text-xs text-gray-500 mb-3 uppercase tracking-wide">{labels.categories}</h4>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="category"
              checked={!currentCategory}
              onChange={() => navigate({ category: "" })}
              className="accent-[#C0202A]"
            />
            <span className="text-sm text-gray-600 group-hover:text-[#C0202A]">{labels.all}</span>
          </label>
          {parents.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={currentCategory === cat.id}
                onChange={() => navigate({ category: cat.id })}
                className="accent-[#C0202A]"
              />
              <span className="text-sm text-gray-600 group-hover:text-[#C0202A] transition-colors">
                {getCategoryName(cat, lang)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Stock */}
      <div>
        <h4 className="font-medium text-xs text-gray-500 mb-3 uppercase tracking-wide">{labels.stock}</h4>
        <div className="space-y-1.5">
          {[
            { value: "", label: labels.all },
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

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h4 className="font-medium text-xs text-gray-500 mb-3 uppercase tracking-wide">{labels.brand}</h4>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="brand"
                checked={!currentBrand}
                onChange={() => navigate({ brand: "" })}
                className="accent-[#C0202A]"
              />
              <span className="text-sm text-gray-600 group-hover:text-[#C0202A]">{labels.all}</span>
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
      )}
    </div>
  );
}
