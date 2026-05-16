import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const InquirySchema = z.object({
  product_id: z.string().uuid().optional().nullable(),
  product_name: z.string().optional(),
  customer_name: z.string().min(1, "Ad Soyad zorunludur."),
  email: z.string().email("Geçerli bir e-posta giriniz."),
  phone: z.string().min(6, "Telefon zorunludur."),
  message: z.string().min(5, "Mesaj en az 5 karakter olmalıdır."),
});

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const supabase = createServiceClient();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data, count, error } = await supabase
    .from("inquiries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, count });
}

// Public: product inquiry form
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`inquiry:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Çok fazla istek. Lütfen daha sonra tekrar deneyin." }, { status: 429 });
  }

  const supabase = createServiceClient();
  const body = await req.json();
  const parsed = InquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Geçersiz veri." }, { status: 400 });
  }

  const { data, error } = await supabase.from("inquiries").insert(parsed.data).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const supabase = createServiceClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { error } = await supabase.from("inquiries").update({ is_read: true }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
