"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-16 bg-[#C0202A]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-oswald text-4xl font-bold text-white mb-4">
            Need Help Finding the Right Part?
          </h2>
          <p className="text-red-100 text-lg mb-8">
            Our experts are ready to help. Contact us via WhatsApp or phone — we respond in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="https://wa.me/905517042268"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 18 }}
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5a] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
            >
              <MessageCircle size={24} />
              WhatsApp
            </motion.a>
            <motion.a
              href="tel:+905517042268"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 18 }}
              className="inline-flex items-center justify-center gap-3 bg-white text-[#C0202A] hover:bg-red-50 px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
            >
              <Phone size={24} />
              +90 551 704 22 68
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
