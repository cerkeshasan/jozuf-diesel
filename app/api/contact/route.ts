import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const ContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1).max(5000),
  lang: z.string().default("en"),
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "validation_error" }, { status: 400 });
    }

    const { name, email, phone, message, lang } = parsed.data;

    const supabase = createServiceClient();
    await supabase.from("contact_messages").insert({
      name,
      email,
      phone: phone || null,
      message,
      lang,
      is_read: false,
    });

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "contact@jozufdiesel.com",
            to: "info@jozufdiesel.com",
            subject: `New Contact Form — ${escapeHtml(name)}`,
            html: `
              <h2>New Message from Jozuf Diesel Website</h2>
              <p><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>Phone:</strong> ${escapeHtml(phone || "-")}</p>
              <p><strong>Lang:</strong> ${escapeHtml(lang)}</p>
              <p><strong>Message:</strong></p>
              <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
            `,
          }),
        });
      } catch (e) {
        console.error("Email send error:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
