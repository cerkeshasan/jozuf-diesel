"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div>
      {/* Main Image */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-3 relative group">
        <div className="aspect-square relative">
          {images.length > 0 && images[activeIndex] ? (
            <Image
              src={images[activeIndex]}
              alt={`${name} ${activeIndex + 1}`}
              fill
              className="object-contain p-8 transition-opacity duration-200"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 text-8xl">
              ⚙️
            </div>
          )}
        </div>

        {/* Prev/Next arrows - only when multiple images */}
        {images.length > 1 && (
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
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === activeIndex ? "bg-[#C0202A]" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 8).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`bg-white rounded-xl overflow-hidden shadow-sm transition-all ${
                i === activeIndex
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
