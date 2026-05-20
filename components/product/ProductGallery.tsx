"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
  // Varyant bazlı görsel altyapısı — ileride ProductDetailClient'tan gelecek
  variantImages?: Record<string, string[]>;
  selectedVariant?: string | null;
}

export default function ProductGallery({ images, name, variantImages, selectedVariant }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  // Eğer seçili varyanta ait özel görsel varsa onu kullan
  const activeImages =
    selectedVariant && variantImages?.[selectedVariant]?.length
      ? variantImages[selectedVariant]
      : images;

  // Varyant değişince ilk görsele dön
  const displayImages = activeImages.length > 0 ? activeImages : images;
  const safeIndex = activeIndex < displayImages.length ? activeIndex : 0;

  const hasMultiple = displayImages.length > 1;
  const hoverIndex = hasMultiple ? (safeIndex + 1) % displayImages.length : safeIndex;

  const prev = () => setActiveIndex((i) => (i === 0 ? displayImages.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === displayImages.length - 1 ? 0 : i + 1));

  return (
    <div>
      {/* Main Image */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-3 relative group">
        <div
          className="aspect-square relative"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {displayImages.length > 0 && displayImages[safeIndex] ? (
            <>
              <Image
                src={displayImages[safeIndex]}
                alt={`${name} ${safeIndex + 1}`}
                fill
                className={`object-contain p-8 transition-all duration-300 ${hovering && hasMultiple ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {hasMultiple && (
                <Image
                  src={displayImages[hoverIndex]}
                  alt={`${name} ${hoverIndex + 1}`}
                  fill
                  className={`object-contain p-8 transition-all duration-300 scale-105 ${hovering ? "opacity-100" : "opacity-0"}`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 text-8xl">
              ⚙️
            </div>
          )}
        </div>

        {/* Prev/Next arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-[#0D1B2A]" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-[#0D1B2A]" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {displayImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === safeIndex ? "bg-[#C0202A]" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.slice(0, 8).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`bg-white rounded-xl overflow-hidden shadow-sm transition-all ${
                i === safeIndex
                  ? "ring-2 ring-[#C0202A] shadow-md"
                  : "hover:ring-2 hover:ring-gray-200 opacity-70 hover:opacity-100"
              }`}
            >
              <div className="aspect-square relative">
                <Image
                  src={img}
                  alt={`${name} ${i + 1}`}
                  fill
                  className="object-contain p-2"
                  sizes="80px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
