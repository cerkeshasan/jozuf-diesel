import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-oswald text-[180px] font-bold text-white/5 leading-none select-none">
          404
        </div>
        <div className="-mt-16 relative z-10">
          <div className="text-6xl mb-6">⚙️</div>
          <h1 className="font-oswald text-4xl font-bold text-white mb-3">
            Sayfa Bulunamadı
          </h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
            Ana sayfaya dönerek devam edebilirsiniz.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/en"
              className="bg-[#C0202A] hover:bg-[#a81b23] text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/en/urunler"
              className="border border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Ürünlere Bak
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
