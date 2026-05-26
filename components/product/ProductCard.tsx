"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Check, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
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

  const images = (product.images || []).filter(Boolean);
  const hasMultiple = images.length > 1;
  const [imgIndex, setImgIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);
  const didSwipe = useRef(false);

  const goTo = (dir: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDirection(dir);
    setImgIndex(i => Math.max(0, Math.min(i + dir, images.length - 1)));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    didSwipe.current = false;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40 && hasMultiple) {
      didSwipe.current = true;
      goTo(diff > 0 ? 1 : -1);
    }
  };


  const minQty = product.min_order_qty || 1;
  const step = product.qty_step || 1;
  const [qty, setQty] = useState(minQty);
  const [qtyInput, setQtyInput] = useState(String(minQty));

  const adjustQty = (delta: number, e: React.MouseEvent) => {
    e.preventDefault();
    setQty(prev => {
      const next = Math.max(minQty, prev + delta * step);
      setQtyInput(String(next));
      return next;
    });
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setQtyInput(e.target.value);
    const parsed = parseInt(e.target.value);
    if (!isNaN(parsed) && parsed >= minQty) setQty(parsed);
  };

  const handleQtyBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const parsed = parseInt(qtyInput);
    const valid = isNaN(parsed) || parsed < minQty ? minQty : parsed;
    setQty(valid);
    setQtyInput(String(valid));
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
          {/* Image Carousel */}
          <div
            className="aspect-square bg-gray-50 relative overflow-hidden"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {images.length > 0 ? (
              <>
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={imgIndex}
                    custom={direction}
                    variants={{
                      enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={images[imgIndex]}
                      alt={getProductName(product, lang)}
                      fill
                      className="object-contain p-4"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Masaüstü ok tuşları */}
                {hasMultiple && hovering && (
                  <>
                    {imgIndex > 0 && (
                      <button
                        onClick={e => goTo(-1, e)}
                        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                      >
                        <ChevronLeft size={14} />
                      </button>
                    )}
                    {imgIndex < images.length - 1 && (
                      <button
                        onClick={e => goTo(1, e)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                      >
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </>
                )}

                {/* Dot indikatörler */}
                {hasMultiple && (
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={e => { e.preventDefault(); e.stopPropagation(); setDirection(i > imgIndex ? 1 : -1); setImgIndex(i); }}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? "bg-[#C0202A] w-3" : "bg-gray-300"}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">
                ⚙️
              </div>
            )}
            {product.is_featured && (
              <span className="absolute top-2 left-2 bg-[#C0202A] text-white text-xs px-2 py-0.5 rounded-full font-semibold z-10">
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
                <input
                  type="text"
                  inputMode="numeric"
                  value={qtyInput}
                  onChange={handleQtyChange}
                  onBlur={handleQtyBlur}
                  onClick={e => e.preventDefault()}
                  className="text-sm font-semibold text-[#0D1B2A] w-10 text-center bg-transparent outline-none"
                />
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
