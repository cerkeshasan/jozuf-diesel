import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
  const supabase = createServiceClient();
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter");

  let query = supabase
    .from("products")
    .select("id, name_en, name_tr, sku, brand, stock_status, stock_quantity, is_active, updated_at")
    .order("name_en");

  if (filter === "out") query = query.eq("stock_status", "out_of_stock");
  else if (filter === "low") query = query.gt("stock_quantity", 0).lte("stock_quantity", 5);
  else if (filter === "draft") query = query.eq("is_active", false);
  else if (filter === "published") query = query.eq("is_active", true);

  const { data: products, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: movements } = await supabase
    .from("stock_movements")
    .select("id, product_id, type, quantity, note, created_at, products(name_en, sku)")
    .order("created_at", { ascending: false })
    .limit(30);

  return NextResponse.json({ products, movements: movements || [] });
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const supabase = createServiceClient();
  const body = await req.json();
  const { product_id, type, quantity, note } = body as {
    product_id: string;
    type: "in" | "out" | "set";
    quantity: number;
    note?: string;
  };

  if (!product_id || !type || quantity == null) {
    return NextResponse.json({ error: "product_id, type ve quantity zorunlu." }, { status: 400 });
  }
  if (!["in", "out", "set"].includes(type)) {
    return NextResponse.json({ error: "Geçersiz tip. in / out / set olmalı." }, { status: 400 });
  }
  if (quantity < 0) {
    return NextResponse.json({ error: "Miktar negatif olamaz." }, { status: 400 });
  }

  const { data: product, error: fetchErr } = await supabase
    .from("products")
    .select("id, stock_quantity")
    .eq("id", product_id)
    .single();

  if (fetchErr || !product) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }

  let newQty: number;
  if (type === "in") newQty = product.stock_quantity + quantity;
  else if (type === "out") newQty = Math.max(0, product.stock_quantity - quantity);
  else newQty = quantity;

  const newStatus = newQty === 0 ? "out_of_stock" : "in_stock";

  const { error: updateErr } = await supabase
    .from("products")
    .update({ stock_quantity: newQty, stock_status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", product_id);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  await supabase.from("stock_movements").insert({ product_id, type, quantity, note: note || null });

  return NextResponse.json({ stock_quantity: newQty, stock_status: newStatus });
}

export async function PATCH(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const supabase = createServiceClient();
  const { product_id, is_active } = await req.json() as { product_id: string; is_active: boolean };

  if (!product_id || is_active === undefined) {
    return NextResponse.json({ error: "product_id ve is_active zorunlu." }, { status: 400 });
  }

  const { error } = await supabase
    .from("products")
    .update({ is_active, updated_at: new Date().toISOString() })
    .eq("id", product_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ is_active });
}
