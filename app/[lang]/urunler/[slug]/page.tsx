import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, Shield, Zap, RotateCcw } from "lucide-react";
import { getTranslations, getProductName, getCategoryName } from "@/lib/translations";
import { supabase } from "@/lib/supabase";
import AddToCartButton from "@/components/product/AddToCartButton";
import ProductGallery from "@/components/product/ProductGallery";
import ProductCard from "@/components/product/ProductCard";
import Badge from "@/components/ui/Badge";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (!product) return {};
  return {
    title: `${getProductName(product, lang)} | Jozuf Diesel`,
    description: product[`description_${lang}`] || product.description_en || "",
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const t = getTranslations(lang);

  const { data: product } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .single();

  if (!product) notFound();

  // Increment view count (non-blocking)
  supabase.from("products").update({ view_count: (product.view_count || 0) + 1 }).eq("id", product.id).then(() => {});

  const { data: similarProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", product.category_id)
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(4);

  const specs = product[`specs_${lang}`] || product.specs_en;
  const compatibleVehicles: string[] =
    product[`compatible_vehicles_${lang}`]?.length
      ? product[`compatible_vehicles_${lang}`]
      : product.compatible_vehicles || [];
  const name = getProductName(product, lang);
  const description = product[`description_${lang}`] || product.description_en;

  const stockVariant = {
    in_stock: "success" as const,
    out_of_stock: "danger" as const,
    on_order: "warning" as const,
  };

  const stockLabel = {
    in_stock: t.product.inStock,
    out_of_stock: t.product.outOfStock,
    on_order: t.product.onOrder,
  };

  const images: string[] = product.images || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
            <Link href={`/${lang}`} className="hover:text-[#C0202A] transition-colors">{t.nav.home}</Link>
            <span>/</span>
            <Link href={`/${lang}/urunler`} className="hover:text-[#C0202A] transition-colors">{t.nav.products}</Link>
            {product.categories && (
              <>
                <span>/</span>
                <Link href={`/${lang}/kategori/${product.categories.slug}`} className="hover:text-[#C0202A] transition-colors">
                  {getCategoryName(product.categories, lang)}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-[#0D1B2A] font-medium truncate max-w-xs">{name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Interactive Gallery */}
          <ProductGallery images={images} name={name} />

          {/* Right: Details */}
          <div>
            {product.brand && (
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-1">{product.brand}</p>
            )}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <Badge variant={stockVariant[product.stock_status as keyof typeof stockVariant]}>
                {stockLabel[product.stock_status as keyof typeof stockLabel]}
              </Badge>
              {product.stock_status === "in_stock" && product.stock_quantity > 0 && (
                <span className="text-sm text-gray-500">({product.stock_quantity} {t.product.pieces})</span>
              )}
              {product.sku && (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg font-mono">
                  SKU: {product.sku}
                </span>
              )}
            </div>
            <h1 className="font-oswald text-3xl font-bold text-[#0D1B2A] mb-2">{name}</h1>
            {product.oem_code && (
              <p className="text-[#C0202A] font-mono font-semibold text-lg mb-3">
                {t.product.oemCode}: {product.oem_code}
              </p>
            )}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={18}
                      className={s <= Math.round(product.rating) ? "text-yellow-400" : "text-gray-200"}
                      fill={s <= Math.round(product.rating) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">({product.review_count} {t.product.reviews})</span>
              </div>
            )}

            {description && (
              <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
            )}

            {/* Keywords */}
            {product.keywords?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {(product.keywords as string[]).map((tag: string, i: number) => (
                  <span key={i} className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Compatible vehicles */}
            {compatibleVehicles.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">{t.product.compatible}:</p>
                <div className="flex flex-wrap gap-2">
                  {compatibleVehicles.map((v, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <AddToCartButton product={product} lang={lang} t={t} />

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: Zap, label: t.product.fastShipping },
                { icon: Shield, label: t.product.guarantee },
                { icon: RotateCcw, label: t.product.easyReturn },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                  <item.icon size={20} className="mx-auto mb-1 text-[#C0202A]" />
                  <p className="text-xs text-gray-600 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specs Tab */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg">{t.product.specs}</h2>
          </div>
          <div className="p-6">
            {specs && Object.keys(specs).length > 0 ? (
              <table className="w-full">
                <tbody>
                  {Object.entries(specs).map(([key, value], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="py-3 px-4 text-sm font-medium text-gray-600 w-48">{key}</td>
                      <td className="py-3 px-4 text-sm text-[#0D1B2A]">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400 text-sm">
                {lang === "tr" ? "Teknik özellik girilmemiş." : lang === "ru" ? "Нет данных." : lang === "ar" ? "لا توجد مواصفات." : "No specifications available."}
              </p>
            )}
          </div>
        </div>

        {/* Similar products */}
        {(similarProducts || []).length > 0 && (
          <div className="mt-12">
            <h2 className="font-oswald text-2xl font-bold text-[#0D1B2A] mb-6">{t.product.similar}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(similarProducts || []).map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
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
          </div>
        )}
      </div>
    </div>
  );
}
