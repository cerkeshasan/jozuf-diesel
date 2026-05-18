"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Check, Plus, Minus } from "lucide-react";
import type { Product } from "@/lib/supabase";
import { getProductName } from "@/lib/translations";
import { useCartStore } from "@/lib/cart-store";
import Badge from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
  lang: string;
  t: { addToCart: string; inStock: string; outOfStock: string; onOrder: string };
}

export default function ProductCard({ product, lang, t }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [hovering, setHovering] = useState(false);
  const hasSecondImage = (product.images?.length ?? 0) > 1;

  const minQty = product.min_order_qty || 1;
  const step = product.qty_step || 1;
  const [qty, setQty] = useState(minQty);

  const adjustQty = (delta: number, e: React.MouseEvent) => {
    e.preventDefault();
    setQty(prev => {
      const next = prev + delta * step;
      return Math.max(minQty, next);
    });
  };

  const stockVariant = {
    in_stock: "success" as const,
    out_of_stock: "danger" as const,
    on_order: "warning" as const,
  };

  const stockLabel = {
    in_stock: t.inStock,
    out_of_stock: t.outOfStock,
    on_order: t.onOrder,
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addItem({
      product_id: product.id,
      product_name: getProductName(product, lang),
      oem_code: product.oem_code || "",
      quantity: qty,
      image: product.images?.[0],
    });

    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 - 40,
      y: Math.random() * -60 - 10,
    }));
    setParticles(newParticles);
    setAdded(true);
    setTimeout(() => { setAdded(false); setParticles([]); }, 1800);
  };

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 12px 36px rgba(192,32,42,0.18)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={`/${lang}/urunler/${product.slug}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-[#C0202A] group">
          {/* Image */}
          <div
            className="aspect-square bg-gray-50 relative overflow-hidden"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {product.images?.[0] ? (
              <>
                <Image
                  src={product.images[0]}
                  alt={getProductName(product, lang)}
                  fill
                  className={`object-contain p-4 transition-all duration-300 ${hovering ? "scale-105" : "scale-100"} ${hovering && hasSecondImage ? "opacity-0" : "opacity-100"}`}
                />
                {hasSecondImage && (
                  <Image
                    src={product.images[1]}
                    alt={getProductName(product, lang)}
                    fill
                    className={`object-contain p-4 transition-all duration-300 scale-105 ${hovering ? "opacity-100" : "opacity-0"}`}
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">
                ⚙️
              </div>
            )}
            {product.is_featured && (
              <span className="absolute top-2 left-2 bg-[#C0202A] text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                ★ Featured
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {product.brand && (
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                {product.brand}
              </span>
            )}
            {product.oem_code && (
              <p className="text-xs text-[#C0202A] font-mono font-semibold">{product.oem_code}</p>
            )}
            <h3 className="font-semibold text-[#0D1B2A] text-sm mt-1 line-clamp-2 group-hover:text-[#C0202A] transition-colors">
              {getProductName(product, lang)}
            </h3>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant={stockVariant[product.stock_status]}>
                  {stockLabel[product.stock_status]}
                </Badge>
              </div>
              {product.rating > 0 && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs text-gray-500">{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Quantity selector */}
            <div className="flex items-center justify-between mt-3" onClick={e => e.preventDefault()}>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={e => adjustQty(-1, e)}
                  className="px-2 py-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
                  type="button"
                >
                  <Minus size={12} />
                </button>
                <span className="text-sm font-semibold text-[#0D1B2A] min-w-[2rem] text-center">{qty}</span>
                <button
                  onClick={e => adjustQty(1, e)}
                  className="px-2 py-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
                  type="button"
                >
                  <Plus size={12} />
                </button>
              </div>
              {step > 1 && (
                <span className="text-xs text-gray-400">×{step}</span>
              )}
            </div>

            {/* Sepete Ekle Butonu */}
            <div className="relative mt-2">
              <AnimatePresence>
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    className="absolute left-1/2 bottom-full w-2 h-2 rounded-full pointer-events-none"
                    style={{ backgroundColor: Math.random() > 0.5 ? "#C0202A" : "#0D1B2A" }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                ))}
              </AnimatePresence>

              <motion.button
                onClick={handleAddToCart}
                animate={added ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-[#0D1B2A] hover:bg-[#C0202A] text-white"
                }`}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span
                      key="added"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check size={16} />
                      {lang === "tr" ? "Eklendi!" : lang === "ru" ? "Добавлено!" : lang === "ar" ? "أُضيف!" : "Added!"}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ShoppingCart size={16} />
                      {t.addToCart}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
