export default function VaksinasiObatPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Vaksinasi & Obat</h1>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Jadwal Vaksinasi Bulan Ini</h3>
        <ul className="space-y-3">
          <li className="p-4 border border-slate-100 rounded-xl flex items-center justify-between">
            <span className="font-semibold text-slate-700">Vaksin PMK Dosis 2 (Pedet)</span>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">Besok, 08:00</span>
          </li>
          <li className="p-4 border border-slate-100 rounded-xl flex items-center justify-between">
            <span className="font-semibold text-slate-700">Pemberian Obat Cacing Rutin</span>
            <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">24 Mei 2026</span>
          </li>
        </ul>
      </div>
    </div>
  );
}