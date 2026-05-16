"use client";

import { useState, useEffect } from "react";
import { Mail, CheckCircle, Eye, Trash2, RefreshCw } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  lang: string;
  is_read: boolean;
  created_at: string;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchMessages = async () => {
    setLoading(true);
    const supabase = getSupabase();
    let q = supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (filter === "unread") q = q.eq("is_read", false);
    const { data } = await q;
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, [filter]);

  const markRead = async (id: string) => {
    const supabase = getSupabase();
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, is_read: true } : null);
  };

  const deleteMsg = async (id: string) => {
    if (!confirm("Bu mesajı silmek istiyor musunuz?")) return;
    const supabase = getSupabase();
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A]">Mesajlar</h1>
          <p className="text-gray-500 text-sm">{unreadCount} okunmamış · {messages.length} toplam</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl overflow-hidden border border-gray-200">
            {(["all", "unread"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${filter === f ? "bg-[#C0202A] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
              >
                {f === "all" ? "Tümü" : "Okunmamış"}
              </button>
            ))}
          </div>
          <button onClick={fetchMessages} className="p-2 text-gray-400 hover:text-[#C0202A] transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Message list */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Yükleniyor...</div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Mail size={32} className="mx-auto mb-2 opacity-30" />
              <p>Mesaj yok</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => { setSelected(msg); if (!msg.is_read) markRead(msg.id); }}
                  className={`flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === msg.id ? "bg-red-50 border-l-2 border-[#C0202A]" : ""}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${msg.is_read ? "bg-gray-200" : "bg-[#C0202A]"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-semibold truncate ${msg.is_read ? "text-gray-600" : "text-[#0D1B2A]"}`}>{msg.name}</p>
                      <span className="text-xs text-gray-400 shrink-0">{new Date(msg.created_at).toLocaleDateString("tr-TR")}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{msg.email}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message detail */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-oswald font-semibold text-lg text-[#0D1B2A]">{selected.name}</h2>
                  <p className="text-sm text-gray-400">{new Date(selected.created_at).toLocaleString("tr-TR")}</p>
                </div>
                <div className="flex gap-2">
                  {!selected.is_read && (
                    <button
                      onClick={() => markRead(selected.id)}
                      className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100"
                    >
                      <CheckCircle size={12} /> Okundu işaretle
                    </button>
                  )}
                  <button
                    onClick={() => deleteMsg(selected.id)}
                    className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 size={12} /> Sil
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 w-16 shrink-0">E-posta:</span>
                  <a href={`mailto:${selected.email}`} className="text-[#C0202A] hover:underline">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-16 shrink-0">Telefon:</span>
                    <a href={`tel:${selected.phone}`} className="text-[#0D1B2A]">{selected.phone}</a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 w-16 shrink-0">Dil:</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs uppercase">{selected.lang}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mt-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={`mailto:${selected.email}?subject=Re: Jozuf Diesel`}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#C0202A] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#a81b23] transition-colors"
                >
                  <Mail size={16} /> E-posta Yanıtla
                </a>
                {selected.phone && (
                  <a
                    href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1ebe5a] transition-colors"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
              <Eye size={32} className="mb-2 opacity-30" />
              <p className="text-sm">Bir mesaj seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
