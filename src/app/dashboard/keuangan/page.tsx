export default function KeuanganPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Laporan Keuangan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
          <p className="text-sm font-bold text-emerald-700 mb-1">Pemasukan Bulan Ini</p>
          <p className="text-2xl font-black text-emerald-900">Rp 45.500.000</p>
        </div>
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
          <p className="text-sm font-bold text-red-700 mb-1">Pengeluaran Bulan Ini</p>
          <p className="text-2xl font-black text-red-900">Rp 12.300.000</p>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center text-slate-400">
        <p>Buku kas, invoice, dan rincian transaksi akan muncul di sini.</p>
      </div>
    </div>
  );
}