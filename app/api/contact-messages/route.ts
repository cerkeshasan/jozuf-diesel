import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const supabase = createServiceClient();
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter");

  let q = supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
  if (filter === "unread") q = q.eq("is_read", false);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function PUT(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const supabase = createServiceClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const supabase = createServiceClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
