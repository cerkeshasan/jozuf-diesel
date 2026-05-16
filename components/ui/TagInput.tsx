"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
}

export default function TagInput({ value, onChange, placeholder = "Etiket ekle, Enter veya virgülle onayla", label }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="min-h-[42px] w-full border border-gray-300 rounded-xl px-3 py-2 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-[#C0202A] focus-within:border-transparent bg-white">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-[#0D1B2A] text-white text-xs px-2.5 py-1 rounded-full"
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-300 transition-colors">
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input.trim()) addTag(input); }}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none text-sm text-gray-800 bg-transparent placeholder:text-gray-400"
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">Enter veya virgül ile ekle, Backspace ile son etiketi sil</p>
    </div>
  );
}
