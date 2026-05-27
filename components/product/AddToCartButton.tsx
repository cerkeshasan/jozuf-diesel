"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, MessageCircle, Plus, Minus, HelpCircle, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { buildWhatsAppUrl, buildTelegramUrl } from "@/lib/whatsapp";
import { getProductName } from "@/lib/translations";
import type { Product, VariantGroup } from "@/lib/supabase";
import type { Translations } from "@/lib/translations";
import Button from "@/components/ui/Button";
import InquiryModal from "@/components/product/InquiryModal";

interface AddToCartButtonProps {
  product: Product;
  lang: string;
  t: Translations;
}

function getVariantLabel(variant: VariantGroup, lang: string): string {
  if (lang === "tr" && variant.label_tr) return variant.label_tr;
  if (lang === "ru" && variant.label_ru) return variant.label_ru;
  if (lang === "ar" && variant.label_ar) return variant.label_ar;
  return variant.label_en;
}

export default function AddToCartButton({ product, lang, t }: AddToCartButtonProps) {
  const [qty, setQty] = useState(1);
  const [qtyInput, setQtyInput] = useState("1");

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQtyInput(e.target.value);
    const parsed = parseInt(e.target.value);
    if (!isNaN(parsed) && parsed >= 1) setQty(parsed);
  };

  const handleQtyBlur = () => {
    const parsed = parseInt(qtyInput);
    const valid = isNaN(parsed) || parsed < 1 ? 1 : parsed;
    setQty(valid);
    setQtyInput(String(valid));
  };
  const [added, setAdded] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showInquiry, setShowInquiry] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const addItem = useCartStore((s) => s.addItem);

  const variants: VariantGroup[] = product.variants || [];
  const allSelected = variants.every(v => selectedVariants[v.label_en]);

  const productName = getProductName(product, lang);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    addItem({
      product_id: product.id,
      product_name: productName,
      oem_code: product.oem_code || "",
      quantity: qty,
      image: product.images?.[0],
      selected_variants: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined,
    });
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 120 - 60,
      y: Math.random() * -80 - 10,
    }));
    setParticles(newParticles);
    setAdded(true);
    setTimeout(() => { setAdded(false); setParticles([]); }, 2000);
  };

  const handleBuyNow = () => {
    const orderItems = [{ product_id: product.id, product_name: productName, oem_code: product.oem_code || "", quantity: qty }];
    const url = lang === "ru"
      ? buildTelegramUrl(orderItems, undefined, lang)
      : buildWhatsAppUrl(orderItems, undefined, lang);
    window.open(url, "_blank");
  };

  return (
    <div>
      {showInquiry && (
        <InquiryModal
          productId={product.id}
          productName={productName}
          lang={lang}
          onClose={() => setShowInquiry(false)}
        />
      )}

      {/* Variant selectors */}
      {variants.length > 0 && (
        <div className="space-y-3 mb-4">
          {variants.map((variant) => {
            const label = getVariantLabel(variant, lang);
            const selected = selectedVariants[variant.label_en];
            return (
              <div key={variant.label_en}>
                <p className="text-sm font-medium text-gray-700 mb-1.5">
                  {label}
                  {!selected && <span className="text-red-500 ml-1 text-xs">*</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.label_en]: opt }))}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                        selected === opt
                          ? "bg-[#C0202A] border-[#C0202A] text-white"
                          : "border-gray-200 text-gray-700 hover:border-[#C0202A] hover:text-[#C0202A]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quantity selector */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm font-medium text-gray-600">{t.cart.quantity}:</span>
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => { const v = Math.max(1, qty - 1); setQty(v); setQtyInput(String(v)); }}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            <Minus size={16} />
          </button>
          <input
            type="text"
            inputMode="numeric"
            value={qtyInput}
            onChange={handleQtyChange}
            onBlur={handleQtyBlur}
            className="px-2 py-2 font-semibold w-14 text-center outline-none bg-transparent"
          />
          <button
            onClick={() => { const v = qty + 1; setQty(v); setQtyInput(String(v)); }}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* 3 Buttons */}
      <div className="grid grid-cols-1 gap-2">
        <div className="relative">
          {/* Parçacık efektleri */}
          <AnimatePresence>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute left-1/2 bottom-full w-2.5 h-2.5 rounded-full pointer-events-none z-10"
                style={{ backgroundColor: p.id % 2 === 0 ? "#C0202A" : "#0D1B2A" }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>

          <motion.button
            onClick={handleAddToCart}
            disabled={variants.length > 0 && !allSelected}
            animate={added ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-base font-semibold transition-colors duration-300 ${
              added
                ? "bg-green-500 text-white"
                : variants.length > 0 && !allSelected
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#C0202A] hover:bg-red-700 text-white"
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
                  <Check size={20} />
                  Sepete Eklendi!
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
                  <ShoppingCart size={20} />
                  {t.product.addToCart}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <button
          onClick={handleBuyNow}
          className={`w-full inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-lg px-8 py-4 text-lg text-white ${lang === "ru" ? "bg-[#229ED9] hover:bg-[#1a8ec2]" : "bg-[#25D366] hover:bg-[#1ebe5a]"}`}
        >
          {lang === "ru" ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.925 8.175l-2.025 9.525c-.15.675-.548.84-1.11.525l-3-2.21-1.448 1.395c-.158.158-.293.293-.6.293l.21-3.045 5.528-4.995c.24-.21-.052-.33-.368-.12L6.45 13.89l-2.948-.923c-.64-.2-.653-.638.135-.945l11.475-4.425c.533-.203 1 .123.813.578z"/></svg>
          ) : (
            <MessageCircle size={20} />
          )}
          {lang === "ru" ? "Написать в Telegram" : (t.product.buyNow || "Hemen Al")}
        </button>

        <button
          onClick={() => setShowInquiry(true)}
          className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <HelpCircle size={18} />
          {t.product.askQuestion || "Soru Sor"}
        </button>
      </div>
    </div>
  );
}
