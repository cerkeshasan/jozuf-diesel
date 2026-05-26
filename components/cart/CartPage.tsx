"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingCart, MessageCircle, CheckCircle } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import type { Translations } from "@/lib/translations";
import Button from "@/components/ui/Button";
import OrderFormModal from "@/components/cart/OrderFormModal";

function CartItemImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">⚙️</div>;
  return <Image src={src} alt={alt} width={80} height={80} className="object-contain p-2 w-full h-full" onError={() => setFailed(true)} />;
}

interface CartPageProps {
  lang: string;
  t: Translations;
}

export default function CartPage({ lang, t }: CartPageProps) {
  const { items, note, updateQuantity, removeItem, setNote, clearCart } = useCartStore();
  const [showModal, setShowModal] = useState(false);
  const [sent, setSent] = useState(false);

  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  const handleOrderSuccess = () => {
    setShowModal(false);
    setSent(true);
    setTimeout(() => { clearCart(); setSent(false); }, 3000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center py-20">
          <ShoppingCart size={64} className="mx-auto mb-4 text-gray-200" />
          <h2 className="font-oswald text-2xl font-bold text-[#0D1B2A] mb-2">{t.cart.empty}</h2>
          <p className="text-gray-400 mb-6">Add some products to get started</p>
          <Link href={`/${lang}/urunler`}>
            <Button variant="primary" size="lg">{t.cart.continue}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {showModal && (
        <OrderFormModal
          items={items}
          note={note}
          lang={lang}
          onClose={() => setShowModal(false)}
          onSuccess={handleOrderSuccess}
        />
      )}
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: "Product Selection", done: true },
              { num: 2, label: t.cart.title, active: true },
              { num: 3, label: "Get Quote", pending: true },
            ].map((step) => (
              <div key={step.num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step.done ? "bg-green-500 text-white" :
                    step.active ? "bg-[#C0202A] text-white" :
                    "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.done ? <CheckCircle size={16} /> : step.num}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${step.active ? "text-[#C0202A]" : "text-gray-400"}`}>
                  {step.label}
                </span>
                {step.num < 3 && <div className="w-8 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-oswald text-3xl font-bold text-[#0D1B2A] mb-8">{t.cart.title}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.product_id}
                layout
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-2xl p-4 shadow-sm flex gap-4"
              >
                {/* Image */}
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <CartItemImage src={item.image} alt={item.product_name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">⚙️</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0D1B2A] text-sm truncate">{item.product_name}</p>
                  {item.oem_code && (
                    <p className="text-[#C0202A] font-mono text-xs">{item.oem_code}</p>
                  )}

                  <div className="flex items-center gap-3 mt-3">
                    {/* Qty */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-100 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1 text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs"
                    >
                      <Trash2 size={14} />
                      {t.cart.remove}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Note */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block font-medium text-[#0D1B2A] mb-2">{t.cart.note}</label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.cart.notePlaceholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A] resize-none"
              />
            </div>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="font-oswald font-bold text-[#0D1B2A] text-xl mb-6">{t.cart.summary}</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t.cart.products}:</span>
                  <span className="font-medium">{items.length} {t.cart.items} ({totalQty} {t.cart.pieces})</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t.cart.shipping}:</span>
                  <span className="font-medium text-green-600">{t.cart.free}</span>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 italic">{t.cart.priceInfo}</p>
                </div>
              </div>

              {sent ? (
                <div className="text-center py-4">
                  <CheckCircle size={40} className="mx-auto text-green-500 mb-2" />
                  <p className="font-semibold text-green-700">Sent to WhatsApp!</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-colors mb-3"
                  >
                    <MessageCircle size={24} />
                    {t.cart.getQuote}
                  </button>
                  <p className="text-center text-xs text-gray-400 mb-4">{t.cart.avgReply}</p>

                  <a
                    href="tel:+905517042268"
                    className="w-full border border-gray-200 text-[#0D1B2A] py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    📞 +90 551 704 22 68
                  </a>
                </>
              )}

              {/* Trust */}
              <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs text-gray-400">
                <div>✅ {t.cart.secureOrder}</div>
                <div>🚚 {t.cart.fastShipping}</div>
                <div>↩️ {t.cart.easyReturn}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
