"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  label?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/x-icon", "image/vnd.microsoft.icon"];
const MAX_SIZE = 5 * 1024 * 1024;

export default function ImageUpload({ value, onChange, bucket = "products", label = "Görsel Yükle" }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError("");
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Sadece JPG, PNG, WebP, GIF veya SVG yükleyebilirsiniz.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Dosya boyutu 5MB'dan büyük olamaz.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Yükleme başarısız.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  return (
    <div>
      {value ? (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 group">
          <Image src={value} alt="Yüklenen görsel" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-gray-800 text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-gray-100"
            >
              Değiştir
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 flex items-center gap-1"
            >
              <X size={12} /> Kaldır
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !loading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragging ? "border-[#C0202A] bg-red-50" : "border-gray-300 hover:border-gray-400 bg-gray-50"
          } ${loading ? "pointer-events-none" : ""}`}
        >
          {loading ? (
            <Loader2 size={28} className="text-gray-400 animate-spin mb-2" />
          ) : (
            <Upload size={28} className="text-gray-400 mb-2" />
          )}
          <p className="text-sm text-gray-500 font-medium">{loading ? "Yükleniyor..." : label}</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, SVG — maks. 5MB</p>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/x-icon,.svg,.ico"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
