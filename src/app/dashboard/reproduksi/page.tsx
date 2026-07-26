export default function ReproduksiPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Status Reproduksi</h1>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Peringatan AI: Deteksi Birahi</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800 text-sm font-medium">
          ⚠️ Sapi #1021 menunjukkan peningkatan aktivitas 40%. Prediksi birahi dalam 24 jam ke depan. Segera jadwalkan Inseminasi Buatan (IB).
        </div>
        <div className="mt-8 text-center text-slate-400 pt-8 border-t border-slate-100">
          <p>Kalender kebuntingan dan jadwal IB akan muncul di sini.</p>
        </div>
      </div>
    </div>
  );
}