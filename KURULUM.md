# Joseph Diesel — Kurulum Kılavuzu

## 1. Supabase Kurulum

1. [supabase.com](https://supabase.com) üzerinde yeni proje oluşturun
2. Supabase Dashboard → SQL Editor'a gidin
3. `supabase/schema.sql` dosyasının tüm içeriğini yapıştırın ve çalıştırın
4. Authentication → Users → "Invite User" ile admin kullanıcı oluşturun

## 2. Environment Variables

`.env.local.example` dosyasını `.env.local` olarak kopyalayın:

```bash
cp .env.local.example .env.local
```

Sonra değerleri doldurun:
- `NEXT_PUBLIC_SUPABASE_URL` → Supabase proje URL'si (Settings → API)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Supabase anon key (Settings → API)
- `SUPABASE_SERVICE_ROLE_KEY` → Supabase service role key (Settings → API)
- `NEXT_PUBLIC_WHATSAPP` → WhatsApp numaranız (örn: `905517042268`)
- `NEXT_PUBLIC_SITE_URL` → Site URL'si (örn: `https://josephdiesel.com`)
- `RESEND_API_KEY` → [resend.com](https://resend.com) API key (isteğe bağlı)

## 3. Geliştirme Ortamı

```bash
npm install
npm run dev
```

Site: http://localhost:3000
Admin: http://localhost:3000/admin

## 4. Cloudflare Pages Deploy

### Manuel Deploy:
```bash
npm run build
npx wrangler pages deploy .next --project-name=joseph-diesel
```

### GitHub Actions ile Otomatik:
1. GitHub repository → Settings → Secrets'a ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WHATSAPP`
   - `NEXT_PUBLIC_SITE_URL`
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
2. `main` branch'e push yapınca otomatik deploy tetiklenir

## 5. Admin Paneli

URL: `yourdomain.com/admin`

- Supabase'de oluşturduğunuz email/şifre ile giriş yapın
- Dashboard → Ürün Ekle → Kategori Ekle → Siparişleri Yönet

## 6. Dil Yapısı

- `/en` → İngilizce
- `/tr` → Türkçe  
- `/ru` → Rusça
- `/ar` → Arapça (RTL)

## 7. Özellikler

✅ 4 dil desteği (EN/TR/RU/AR + RTL)
✅ WhatsApp sepet sistemi (fiyatsız B2B)
✅ Admin paneli (ürün/kategori/sipariş yönetimi)
✅ Framer Motion animasyonları
✅ Supabase Auth (admin girişi)
✅ SEO (sitemap, robots, meta tags, hreflang)
✅ Güvenlik başlıkları (XSS, clickjacking koruması)
✅ Cloudflare Pages deploy konfigürasyonu
✅ GitHub Actions CI/CD
✅ Responsive tasarım
