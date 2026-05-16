import { getTranslations } from "@/lib/translations";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/product/ProductCard";
import SearchBar from "@/components/layout/SearchBar";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const { q } = await searchParams;
  const t = getTranslations(lang);

  let products: any[] = [];

  if (q && q.trim()) {
    const term = q.trim();
    const { data } = await supabase
      .from("products")
      .select("*, categories(*)")
      .eq("is_active", true)
      .or(`name_en.ilike.%${term}%,name_tr.ilike.%${term}%,oem_code.ilike.%${term}%,sku.ilike.%${term}%,brand.ilike.%${term}%`)
      .order("view_count", { ascending: false })
      .limit(48);
    products = data || [];
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[#0D1B2A] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-oswald text-4xl font-bold text-white mb-6">{t.search.title}</h1>
          <SearchBar lang={lang} t={t} initialQuery={q || ""} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {q ? (
          <>
            <p className="text-gray-500 text-sm mb-6">
              &ldquo;{q}&rdquo; — {products.length} {t.search.results}
            </p>
            {products.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl">{t.search.noResults}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    lang={lang}
                    t={{
                      addToCart: t.product.addToCart,
                      inStock: t.product.inStock,
                      outOfStock: t.product.outOfStock,
                      onOrder: t.product.onOrder,
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl">{t.search.placeholder}</p>
          </div>
        )}
      </div>
    </div>
  );
}
