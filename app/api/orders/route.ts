import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-server";
import { z } from "zod";

const OrderSchema = z.object({
  order_number: z.string(),
  lang: z.string().default("en"),
  items: z.array(z.object({
    product_id: z.string(),
    product_name: z.string(),
    oem_code: z.string(),
    quantity: z.number().int().min(1),
  })),
  note: z.string().optional(),
  wa_message: z.string().optional(),
  customer_name: z.string().optional(),
  customer_phone: z.string().optional(),
  customer_email: z.string().optional(),
  customer_country: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const supabase = createServiceClient();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabase.from("orders").select("*", { count: "exact" });
  if (status) query = query.eq("status", status);

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, total: count, page, limit });
}

// Public: customers place orders via WhatsApp cart
export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();
  const parsed = OrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { data, error } = await supabase.from("orders").insert(parsed.data).select().single();
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

  const body = await req.json();
  const { data, error } = await supabase
    .from("orders")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
