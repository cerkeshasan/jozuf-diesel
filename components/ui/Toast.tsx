"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "success", onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white ${
          type === "success" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
