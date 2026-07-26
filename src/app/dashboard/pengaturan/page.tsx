export default function PengaturanPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Pengaturan Sistem</h1>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 max-w-2xl">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Profil Peternakan</h3>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Nama Peternakan</label>
            <input type="text" defaultValue="Sukasari Dairy Farm" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Lokasi</label>
            <input type="text" defaultValue="Batu, Jawa Timur" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Zona Waktu</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Waktu Indonesia Barat (WIB)</option>
              <option>Waktu Indonesia Tengah (WITA)</option>
              <option>Waktu Indonesia Timur (WIT)</option>
            </select>
          </div>
          <button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}