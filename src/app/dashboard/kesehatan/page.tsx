export default function KesehatanPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Monitoring Kesehatan</h1>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <h3 className="text-lg font-bold text-slate-800">Perhatian Khusus (2 Ekor)</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl border border-red-100">
            <div>
              <p className="font-bold text-red-700">Sapi #1034 - Risiko Mastitis</p>
              <p className="text-sm text-red-500/80">Suhu tubuh naik 1.5°C, produksi susu turun 18%.</p>
            </div>
            <button className="px-3 py-1.5 bg-red-100 text-red-700 text-sm font-bold rounded-lg hover:bg-red-200">Periksa</button>
          </div>
          <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div>
              <p className="font-bold text-orange-700">Sapi #0988 - Indikasi Pincang</p>
              <p className="text-sm text-orange-500/80">Aktivitas berjalan turun drastis sejak pagi.</p>
            </div>
            <button className="px-3 py-1.5 bg-orange-100 text-orange-700 text-sm font-bold rounded-lg hover:bg-orange-200">Periksa</button>
          </div>
        </div>
      </div>
    </div>
  );
}