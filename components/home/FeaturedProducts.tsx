"use client";

import { motion } from "framer-motion";
import type { Product } from "@/lib/supabase";
import type { Translations } from "@/lib/translations";
import ProductCard from "@/components/product/ProductCard";

interface FeaturedProductsProps {
  products: Product[];
  lang: string;
  t: Translations;
  isFeatured?: boolean;
}

export default function FeaturedProducts({ products, lang, t, isFeatured = true }: FeaturedProductsProps) {
  if (!products.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-oswald text-4xl font-bold text-[#0D1B2A] mb-2">
            {isFeatured ? t.home.featuredProducts : "Ürünlerimiz"}
          </h2>
          <p className="text-gray-500">
            {isFeatured ? t.home.featuredSubtitle : "Tüm stok ürünlerimizi keşfedin"}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.08, 0.4) }}
            >
              <ProductCard
                product={product}
                lang={lang}
                t={{
                  addToCart: t.product.addToCart,
                  inStock: t.product.inStock,
                  outOfStock: t.product.outOfStock,
                  onOrder: t.product.onOrder,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
