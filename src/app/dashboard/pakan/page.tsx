export default function PakanPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Pakan</h1>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Inventaris Gudang Pakan</h3>
        <p className="text-slate-500 mb-8 text-sm">Status ketersediaan konsentrat dan hijauan.</p>
        <div className="text-center text-slate-400 py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p>Modul formulasi ransum (TMR) dan stok pakan akan muncul di sini.</p>
        </div>
      </div>
    </div>
  );
}