import { languages } from "@/lib/translations";

export default function AdminLanguagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A]">Dil Yönetimi</h1>
        <p className="text-gray-500 text-sm">Aktif dilleri yönetin</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(languages).map(([code, info]) => (
          <div key={code} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{info.flag}</span>
                <div>
                  <p className="font-oswald font-semibold text-[#0D1B2A] text-lg">{info.name}</p>
                  <p className="text-xs text-gray-400">{code.toUpperCase()} · {info.dir.toUpperCase()}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C0202A]" />
              </label>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Çevrilen Ürünler:</span>
                <span className="font-medium text-[#0D1B2A]">—</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Çevrilen Kategoriler:</span>
                <span className="font-medium text-[#0D1B2A]">—</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Yön:</span>
                <span className="font-medium text-[#0D1B2A]">{info.dir.toUpperCase()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-800 mb-2">Çeviri Sistemi</h3>
        <p className="text-blue-700 text-sm">
          Ürün ve kategori çevirileri, ürün/kategori ekleme/düzenleme formlarındaki dil sekmeleri üzerinden yönetilir.
          Her ürün için 4 dilde ayrı isim, açıklama ve teknik özellik girebilirsiniz.
        </p>
      </div>
    </div>
  );
}
