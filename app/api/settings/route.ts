import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-server";

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("settings").select("key, value");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

function parseBody(body: Record<string, string>): { key: string; value: string }[] {
  if (
    typeof body.key === "string" &&
    body.key.trim() !== "" &&
    Object.keys(body).length === 2 &&
    "value" in body
  ) {
    return [{ key: body.key.trim(), value: body.value ?? "" }];
  }
  return Object.entries(body)
    .filter(([key]) => key && key.trim() !== "")
    .map(([key, value]) => ({ key: key.trim(), value: value ?? "" }));
}

async function saveSettings(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const supabase = createServiceClient();

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
  }

  const upserts = parseBody(body);
  if (upserts.length === 0) return NextResponse.json({ success: true, count: 0 });

  const { error } = await supabase.from("settings").upsert(upserts, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  try { revalidatePath("/", "layout"); } catch { /* fine in dev */ }

  return NextResponse.json({ success: true, count: upserts.length });
}

export async function PUT(req: NextRequest) { return saveSettings(req); }
export async function POST(req: NextRequest) { return saveSettings(req); }
