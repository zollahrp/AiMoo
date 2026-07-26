export default function LaporanPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Generate Laporan</h1>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <p className="text-slate-600 mb-6">Pilih jenis laporan yang ingin Anda unduh (PDF/Excel).</p>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-5 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">
            📄 Laporan Produksi
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">
            🏥 Laporan Medis
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">
            💰 Laporan Finansial
          </button>
        </div>
      </div>
    </div>
  );
}