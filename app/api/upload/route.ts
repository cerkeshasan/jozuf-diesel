import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-server";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "svg", "ico"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/x-icon", "image/vnd.microsoft.icon"];
const ALLOWED_BUCKETS = ["products", "categories", "media"];

const WATERMARK_PATH = path.join(process.cwd(), "public", "watermark.png");

async function applyWatermark(buffer: Buffer): Promise<Buffer> {
  const img = sharp(buffer);
  const { width = 800, height = 800 } = await img.metadata();

  // Filigranı görselin %70'i kadar boyutlandır, ortaya yerleştir
  const wmSize = Math.round(Math.min(width, height) * 0.70);
  const wmBuffer = await sharp(WATERMARK_PATH)
    .resize(wmSize, wmSize, { fit: "inside" })
    .toBuffer();

  const wmMeta = await sharp(wmBuffer).metadata();
  const left = Math.round((width - (wmMeta.width ?? wmSize)) / 2);
  const top = Math.round((height - (wmMeta.height ?? wmSize)) / 2);

  return img
    .composite([{ input: wmBuffer, top, left, blend: "over" }])
    .webp({ quality: 88 })
    .toBuffer();
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const supabase = createServiceClient();
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const bucketParam = (formData.get("bucket") as string) || "products";

  if (!file) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  const bucket = ALLOWED_BUCKETS.includes(bucketParam) ? bucketParam : "products";

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Sadece jpg, jpeg, png, webp ve gif dosyaları yüklenebilir." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json({ error: "Geçersiz dosya uzantısı." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Dosya boyutu 5MB'ı aşmamalıdır." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  let buffer: Buffer = Buffer.from(bytes);

  // Ürün görsellerine filigran uygula (SVG/ICO hariç)
  const canWatermark = bucket === "products" && !["svg", "ico"].includes(ext);
  if (canWatermark) {
    try {
      buffer = await applyWatermark(buffer);
    } catch {
      // Filigran başarısız olursa orijinal görseli yükle
    }
  }

  // Filigranlı görseller webp olarak kaydedilir
  const finalExt = canWatermark ? "webp" : ext;
  const finalMime = canWatermark ? "image/webp" : file.type;
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${finalExt}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, { contentType: finalMime, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename);
  return NextResponse.json({ url: urlData.publicUrl });
}
