export default function ProduksiSusuPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Produksi Susu</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 mb-2">Total Hari Ini</p>
          <p className="text-3xl font-black text-slate-900">1.250 <span className="text-lg text-slate-400">Liter</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 mb-2">Rata-rata per Ekor</p>
          <p className="text-3xl font-black text-slate-900">15.2 <span className="text-lg text-slate-400">L/ekor</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 mb-2">Estimasi Pendapatan</p>
          <p className="text-3xl font-black text-slate-900"><span className="text-lg text-slate-400">Rp</span> 10.6M</p>
        </div>
      </div>

      <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm h-64 flex items-center justify-center text-slate-400">
        <p>Grafik tren produksi susu 30 hari terakhir akan muncul di sini.</p>
      </div>
    </div>
  );
}