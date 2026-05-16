"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Translations } from "@/lib/translations";

interface SearchBarProps {
  lang: string;
  t: Translations;
  initialQuery?: string;
}

export default function SearchBar({ lang, t, initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${lang}/arama?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search.placeholder}
          className="w-full pl-12 pr-4 py-4 rounded-xl text-[#0D1B2A] font-medium focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
        />
      </div>
      <button
        type="submit"
        className="bg-[#C0202A] hover:bg-[#a81b23] text-white px-8 py-4 rounded-xl font-semibold transition-colors"
      >
        {t.nav.search}
      </button>
    </form>
  );
}
