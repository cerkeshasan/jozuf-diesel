"use client";

import { motion } from "framer-motion";
import { useCartStore } from "@/lib/cart-store";
import { buildWhatsAppUrl, buildDirectWhatsAppUrl } from "@/lib/whatsapp";

function WhatsAppSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28">
      <path
        d="M16 2C8.268 2 2 8.268 2 16c0 2.494.655 4.84 1.8 6.87L2 30l7.34-1.92A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.4a11.37 11.37 0 01-5.8-1.59l-.42-.25-4.35 1.14 1.16-4.24-.27-.43A11.36 11.36 0 014.6 16c0-6.29 5.11-11.4 11.4-11.4S27.4 9.71 27.4 16 22.29 27.4 16 27.4zm6.25-8.53c-.34-.17-2.02-.99-2.33-1.1-.31-.12-.54-.17-.77.17-.22.35-.87 1.1-1.07 1.33-.2.22-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.69-.01-.01-.01-.01-.02-.02a9.7 9.7 0 01-1.89-2.36c-.2-.34-.02-.52.15-.69.15-.15.34-.39.52-.59.17-.2.22-.34.34-.57.11-.22.06-.42-.03-.59-.09-.17-.77-1.85-1.05-2.53-.28-.66-.57-.57-.77-.58h-.66c-.22 0-.58.08-.89.42-.31.34-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.22 2.42 3.69 5.86 5.18.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.09 2.02-.82 2.31-1.61.29-.79.29-1.47.2-1.61-.09-.13-.31-.21-.65-.38z"
        fill="#fff"
      />
    </svg>
  );
}

interface WhatsAppFloatProps {
  lang: string;
  whatsappNumber?: string;
}

export default function WhatsAppFloat({ lang, whatsappNumber }: WhatsAppFloatProps) {
  const items = useCartStore((s) => s.items);
  const note = useCartStore((s) => s.note);

  const handleClick = () => {
    const num = whatsappNumber || undefined;
    const url =
      items.length > 0
        ? buildWhatsAppUrl(items, note, lang, num)
        : buildDirectWhatsAppUrl(num);
    window.open(url, "_blank");
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(37,211,102,0.7)",
          "0 0 0 16px rgba(37,211,102,0)",
        ],
      }}
      transition={{
        boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeOut" },
      }}
      aria-label="WhatsApp"
    >
      <WhatsAppSVG />
      {items.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#C0202A] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {items.length}
        </span>
      )}
    </motion.button>
  );
}
