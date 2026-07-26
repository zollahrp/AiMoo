"use client";

export default function LaporanPage() {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Laporan</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Analisis performa dan ringkasan data peternakan sapi perah Anda.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Date Picker */}
          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-sm font-bold text-slate-700">1 Mei - 18 Mei 2026</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          
          {/* Filter */}
          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-emerald-600 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm font-bold text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filter
          </button>
        </div>
      </div>

      {/* 2. TABS NAVIGASI MODUL */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <button className="flex items-center gap-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-left transition-colors">
          <div className="text-emerald-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></div>
          <div>
            <p className="text-[11px] font-bold text-emerald-800">Ringkasan</p>
            <p className="text-[9px] text-emerald-600 font-medium">Gambaran umum performa</p>
          </div>
        </button>
        <button className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-left transition-colors">
          <div className="text-slate-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div>
          <div>
            <p className="text-[11px] font-bold text-slate-800">Produksi Susu</p>
            <p className="text-[9px] text-slate-500 font-medium">Laporan harian & bulanan</p>
          </div>
        </button>
        <button className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-left transition-colors">
          <div className="text-slate-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
          <div>
            <p className="text-[11px] font-bold text-slate-800">Kesehatan</p>
            <p className="text-[9px] text-slate-500 font-medium">Riwayat & treatment</p>
          </div>
        </button>
        <button className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-left transition-colors">
          <div className="text-slate-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></div>
          <div>
            <p className="text-[11px] font-bold text-slate-800">Reproduksi</p>
            <p className="text-[9px] text-slate-500 font-medium">Status & kebuntingan</p>
          </div>
        </button>
        <button className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-left transition-colors">
          <div className="text-slate-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
          <div>
            <p className="text-[11px] font-bold text-slate-800">Pakan</p>
            <p className="text-[9px] text-slate-500 font-medium">Konsumsi & efisiensi</p>
          </div>
        </button>
        <button className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-left transition-colors">
          <div className="text-slate-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
          <div>
            <p className="text-[11px] font-bold text-slate-800">Keuangan</p>
            <p className="text-[9px] text-slate-500 font-medium">Pendapatan & laba</p>
          </div>
        </button>
      </div>

      {/* 3. KPI CARDS (6 Columns) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <p className="text-[10px] font-bold text-slate-600">Total Produksi Susu</p>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight">2.456 <span className="text-sm font-semibold text-slate-400">L</span></p>
          <p className="text-[9px] font-bold text-emerald-500 mt-1">↑ 12,4% <br/><span className="text-slate-400 font-medium font-normal">vs 1 Apr - 30 Apr 2026</span></p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-[10px] font-bold text-slate-600">Rata-rata Produksi</p>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight">18,7 <span className="text-sm font-semibold text-slate-400">L</span></p>
          <p className="text-[9px] font-bold text-emerald-500 mt-1">↑ 8,6% <br/><span className="text-slate-400 font-medium font-normal">vs 1 Apr - 30 Apr 2026</span></p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
            </div>
            <p className="text-[10px] font-bold text-slate-600">Sapi Aktif</p>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight">131 <span className="text-sm font-semibold text-slate-400">ekor</span></p>
          <p className="text-[9px] font-bold text-emerald-500 mt-1">↑ 3 ekor <br/><span className="text-slate-400 font-medium font-normal">vs 1 Apr - 30 Apr 2026</span></p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <p className="text-[10px] font-bold text-slate-600">Sapi Sakit</p>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight">4 <span className="text-sm font-semibold text-slate-400">ekor</span></p>
          <p className="text-[9px] font-bold text-emerald-500 mt-1">↓ 2 ekor <br/><span className="text-slate-400 font-medium font-normal">vs 1 Apr - 30 Apr 2026</span></p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-[10px] font-bold text-slate-600">Biaya Pakan / Liter</p>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight">Rp 2.850</p>
          <p className="text-[9px] font-bold text-emerald-500 mt-1">↓ 5,1% <br/><span className="text-slate-400 font-medium font-normal">vs 1 Apr - 30 Apr 2026</span></p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
            </div>
            <p className="text-[10px] font-bold text-slate-600">Laba Bersih</p>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight">Rp 61.520.000</p>
          <p className="text-[9px] font-bold text-emerald-500 mt-1">↑ 17,2% <br/><span className="text-slate-400 font-medium font-normal">vs 1 Apr - 30 Apr 2026</span></p>
        </div>

      </div>

      {/* 4. MIDDLE SECTION (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
        
        {/* Tren Produksi Susu */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Tren Produksi Susu <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </h3>
            <select className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded outline-none">
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          
          <div className="flex-1 relative min-h-[160px]">
             {/* Y-Axis */}
             <div className="absolute left-0 top-0 bottom-8 w-6 flex flex-col justify-between text-[9px] font-medium text-slate-400">
               <span>140</span><span>120</span><span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
             </div>
             {/* X-Axis */}
             <div className="absolute left-8 right-0 bottom-0 flex justify-between text-[9px] font-medium text-slate-400">
               <span>19 Apr</span><span>24 Apr</span><span>29 Apr</span><span>4 Mei</span><span>9 Mei</span><span>14 Mei</span><span>18 Mei</span>
             </div>
             {/* SVG Chart */}
             <div className="absolute left-8 right-2 top-2 bottom-6">
               <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-100">
                 {[...Array(7)].map((_,i) => <div key={i} className="w-full border-t border-slate-100/60 h-0"></div>)}
                 <div className="w-full h-0"></div>
               </div>
               <svg viewBox="0 0 500 150" className="absolute inset-0 w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
                 {/* Mock Line Data */}
                 <polyline points="0,90 25,70 50,50 75,55 100,80 125,90 150,60 175,65 200,80 225,85 250,75 275,50 300,45 325,70 350,65 375,60 400,90 425,80 450,100 475,85 500,60" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                 {/* Select dots */}
                 <circle cx="0" cy="90" r="3" fill="white" stroke="#22c55e" strokeWidth="1.5" />
                 <circle cx="50" cy="50" r="3" fill="white" stroke="#22c55e" strokeWidth="1.5" />
                 <circle cx="150" cy="60" r="3" fill="white" stroke="#22c55e" strokeWidth="1.5" />
                 <circle cx="275" cy="50" r="3" fill="white" stroke="#22c55e" strokeWidth="1.5" />
                 <circle cx="300" cy="45" r="4" fill="#22c55e" stroke="white" strokeWidth="1.5" /> {/* Tooltip point */}
                 <circle cx="400" cy="90" r="3" fill="white" stroke="#22c55e" strokeWidth="1.5" />
                 <circle cx="500" cy="60" r="3" fill="white" stroke="#22c55e" strokeWidth="1.5" />
               </svg>
               {/* Tooltip */}
               <div className="absolute left-[60%] top-[30%] -translate-x-1/2 -translate-y-full mt-2 bg-white border border-slate-200 text-slate-800 text-[9px] font-medium px-2 py-1 rounded shadow text-center z-10">
                 <p>8 Mei 2026</p><p className="font-bold">Produksi: 98 L</p>
               </div>
             </div>
          </div>
          
          <div className="flex items-center justify-center gap-1.5 mt-2 text-[9px] font-bold text-slate-500">
            <div className="w-3 h-0.5 bg-emerald-500 relative"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute -top-0.5 left-0.5"></div></div> Produksi Susu (Liter)
          </div>
        </div>

        {/* Produksi Susu per Sapi (Top 5) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900">Produksi Susu per Sapi (Top 5)</h3>
            <select className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded outline-none">
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          <div className="flex-1">
            <table className="w-full text-left text-[11px] whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-2 font-semibold">No</th>
                  <th className="pb-2 font-semibold">ID Sapi</th>
                  <th className="pb-2 font-semibold">Nama Sapi</th>
                  <th className="pb-2 font-semibold text-center">Rata-rata (L/hari)</th>
                  <th className="pb-2 font-semibold text-center">Total (L)</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 font-medium">
                <tr className="border-b border-slate-50">
                  <td className="py-2.5">1</td><td className="py-2.5 text-slate-900 font-bold">#1030</td><td className="py-2.5">Melati</td><td className="py-2.5 text-center">27,4</td><td className="py-2.5 text-center font-bold text-slate-900">822</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2.5">2</td><td className="py-2.5 text-slate-900 font-bold">#1042</td><td className="py-2.5">Rosa</td><td className="py-2.5 text-center">24,1</td><td className="py-2.5 text-center font-bold text-slate-900">723</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2.5">3</td><td className="py-2.5 text-slate-900 font-bold">#1012</td><td className="py-2.5">Dinda</td><td className="py-2.5 text-center">23,7</td><td className="py-2.5 text-center font-bold text-slate-900">710</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2.5">4</td><td className="py-2.5 text-slate-900 font-bold">#1005</td><td className="py-2.5">Rara</td><td className="py-2.5 text-center">22,5</td><td className="py-2.5 text-center font-bold text-slate-900">675</td>
                </tr>
                <tr>
                  <td className="py-2.5">5</td><td className="py-2.5 text-slate-900 font-bold">#1015</td><td className="py-2.5">Cindy</td><td className="py-2.5 text-center">21,3</td><td className="py-2.5 text-center font-bold text-slate-900">639</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 mt-2 text-left">Lihat seluruh laporan produksi →</button>
        </div>

        {/* Ringkasan Kesehatan */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-900">Ringkasan Kesehatan</h3>
            <select className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded outline-none">
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          <div className="flex items-center gap-6 flex-1 justify-center">
            {/* CSS Donut Chart */}
            <div className="relative w-32 h-32 shrink-0 rounded-full flex items-center justify-center" 
                 style={{ background: 'conic-gradient(#ef4444 0% 41.7%, #f97316 41.7% 66.7%, #fbbf24 66.7% 83.4%, #22c55e 83.4% 91.7%, #3b82f6 91.7% 100%)' }}>
               <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-inner text-center">
                 <span className="text-[9px] font-bold text-slate-500">Total Kasus</span>
                 <span className="text-xl font-black text-slate-900">12</span>
               </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] gap-6">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="font-semibold text-slate-700">Mastitis</span></div>
                <span className="text-slate-500 font-medium">5 (41,7%)</span>
              </div>
              <div className="flex justify-between items-center text-[10px] gap-6">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span><span className="font-semibold text-slate-700">Demam</span></div>
                <span className="text-slate-500 font-medium">3 (25,0%)</span>
              </div>
              <div className="flex justify-between items-center text-[10px] gap-6">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span><span className="font-semibold text-slate-700">Diare</span></div>
                <span className="text-slate-500 font-medium">2 (16,7%)</span>
              </div>
              <div className="flex justify-between items-center text-[10px] gap-6">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="font-semibold text-slate-700">Cacingan</span></div>
                <span className="text-slate-500 font-medium">1 (8,3%)</span>
              </div>
              <div className="flex justify-between items-center text-[10px] gap-6">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="font-semibold text-slate-700">Lainnya</span></div>
                <span className="text-slate-500 font-medium">1 (8,3%)</span>
              </div>
            </div>
          </div>
          <button className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat laporan kesehatan →</button>
        </div>

      </div>

      {/* 5. BOTTOM SECTION (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
        
        {/* Ringkasan Reproduksi */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900">Ringkasan Reproduksi</h3>
            <select className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded outline-none">
              <option>30 Hari Terakhir</option>
            </select>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-green-50/50 border border-green-100 p-2 rounded-lg text-center flex flex-col items-center">
              <span className="text-green-600 mb-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></span>
              <p className="text-[9px] font-bold text-slate-600">IB Dilakukan</p>
              <p className="text-xs font-black text-slate-900 leading-tight">8 <span className="font-semibold text-slate-500 text-[9px]">ekor</span></p>
              <p className="text-[8px] font-bold text-emerald-500 mt-0.5">↑ 1 ekor</p>
            </div>
            <div className="bg-purple-50/50 border border-purple-100 p-2 rounded-lg text-center flex flex-col items-center">
              <span className="text-purple-600 mb-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></span>
              <p className="text-[9px] font-bold text-slate-600">Bunting</p>
              <p className="text-xs font-black text-slate-900 leading-tight">5 <span className="font-semibold text-slate-500 text-[9px]">ekor</span></p>
              <p className="text-[8px] font-bold text-purple-500 mt-0.5">↑ 2 ekor</p>
            </div>
            <div className="bg-amber-50/50 border border-amber-100 p-2 rounded-lg text-center flex flex-col items-center">
              <span className="text-amber-500 mb-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg></span>
              <p className="text-[9px] font-bold text-slate-600">Tidak Bunting</p>
              <p className="text-xs font-black text-slate-900 leading-tight">2 <span className="font-semibold text-slate-500 text-[9px]">ekor</span></p>
              <p className="text-[8px] font-bold text-red-500 mt-0.5">↓ 1 ekor</p>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 p-2 rounded-lg text-center flex flex-col items-center">
              <span className="text-blue-500 mb-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></span>
              <p className="text-[9px] font-bold text-slate-600">Kosong</p>
              <p className="text-xs font-black text-slate-900 leading-tight">3 <span className="font-semibold text-slate-500 text-[9px]">ekor</span></p>
            </div>
          </div>

          <div className="flex-1">
            <table className="w-full text-left text-[10px] whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-2 font-semibold">ID Sapi</th>
                  <th className="pb-2 font-semibold">Nama Sapi</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Tanggal IB</th>
                  <th className="pb-2 font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-2 font-bold">#1030</td><td>Melati</td><td className="font-bold text-emerald-600">Bunting</td><td>21 Apr 2026</td><td>-</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2 font-bold">#1042</td><td>Rosa</td><td className="font-bold text-emerald-600">Bunting</td><td>20 Apr 2026</td><td>-</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2 font-bold">#1015</td><td>Cindy</td><td className="font-bold text-amber-500">Tidak Bunting</td><td>16 Apr 2026</td><td>Ulang IB</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2 font-bold">#1012</td><td>Dinda</td><td className="font-bold text-blue-500">Kosong</td><td>19 Apr 2026</td><td>-</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold">#1008</td><td>Bunga</td><td className="font-bold text-emerald-600">Bunting</td><td>18 Apr 2026</td><td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 mt-2 text-left">Lihat laporan reproduksi →</button>
        </div>

        {/* Konsumsi Pakan (Bar Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-900">Konsumsi Pakan</h3>
            <select className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded outline-none">
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end gap-2 text-center h-40 border-b border-slate-200 relative pb-6 mb-4">
            {/* Y-Axis */}
            <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[9px] font-medium text-slate-400 text-left">
              <span className="-mt-3">(Kg)</span><span>2.500</span><span>2.000</span><span>1.500</span><span>1.000</span><span>500</span><span>0</span>
            </div>
            
            <div className="ml-10 flex-1 h-full flex items-end justify-around gap-2 px-2 relative z-10">
              {/* Bar 1 */}
              <div className="flex flex-col items-center w-full relative group">
                <span className="text-[10px] font-bold text-slate-900 mb-1 absolute -top-5">2.120</span>
                <div className="w-10 bg-emerald-500 rounded-t-sm" style={{height: '85%'}}></div>
                <span className="text-[9px] font-medium text-slate-500 mt-2 absolute -bottom-5">Hijauan</span>
              </div>
              {/* Bar 2 */}
              <div className="flex flex-col items-center w-full relative group">
                <span className="text-[10px] font-bold text-slate-900 mb-1 absolute -top-5">1.450</span>
                <div className="w-10 bg-emerald-500 rounded-t-sm" style={{height: '58%'}}></div>
                <span className="text-[9px] font-medium text-slate-500 mt-2 absolute -bottom-5">Konsentrat</span>
              </div>
              {/* Bar 3 */}
              <div className="flex flex-col items-center w-full relative group">
                <span className="text-[10px] font-bold text-slate-900 mb-1 absolute -top-5">480</span>
                <div className="w-10 bg-emerald-500 rounded-t-sm" style={{height: '19%'}}></div>
                <span className="text-[9px] font-medium text-slate-500 mt-2 absolute -bottom-5">Silase</span>
              </div>
              {/* Bar 4 */}
              <div className="flex flex-col items-center w-full relative group">
                <span className="text-[10px] font-bold text-slate-900 mb-1 absolute -top-5">250</span>
                <div className="w-10 bg-emerald-500 rounded-t-sm" style={{height: '10%'}}></div>
                <span className="text-[9px] font-medium text-slate-500 mt-2 absolute -bottom-5">Mineral</span>
              </div>
              {/* Bar 5 */}
              <div className="flex flex-col items-center w-full relative group">
                <span className="text-[10px] font-bold text-slate-900 mb-1 absolute -top-5">180</span>
                <div className="w-10 bg-emerald-500 rounded-t-sm" style={{height: '7%'}}></div>
                <span className="text-[9px] font-medium text-slate-500 mt-2 absolute -bottom-5">Lainnya</span>
              </div>
            </div>
          </div>
          
          <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex items-start gap-3">
             <div className="text-emerald-500 mt-0.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
             <div>
               <p className="text-[10px] font-bold text-slate-700">Total konsumsi pakan: <span className="text-emerald-600">4.480 kg</span></p>
               <p className="text-[10px] font-medium text-slate-600">Rata-rata konsumsi per ekor: <b className="text-slate-900">34,2 kg/hari</b></p>
             </div>
          </div>

          <button className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat laporan pakan →</button>
        </div>

        {/* Ringkasan Keuangan */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-900">Ringkasan Keuangan</h3>
            <select className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded outline-none">
              <option>30 Hari Terakhir</option>
            </select>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 17l-4 4m0 0l-4-4m4 4V3" transform="scale(0.5) translate(18, 18)" /></svg>
                </div>
                <span className="text-[11px] font-medium text-slate-700">Total Pendapatan</span>
              </div>
              <span className="text-[11px] font-black text-slate-900">Rp 128.750.000</span>
            </div>
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-red-50 text-red-500 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7l4-4m0 0l4 4m-4-4v18" transform="scale(0.5) translate(18, 18)" /></svg>
                </div>
                <span className="text-[11px] font-medium text-slate-700">Total Biaya</span>
              </div>
              <span className="text-[11px] font-black text-slate-900">Rp 67.230.000</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <span className="text-[11px] font-medium text-slate-700">Laba Bersih</span>
              </div>
              <span className="text-[11px] font-black text-slate-900">Rp 61.520.000</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-amber-50 text-amber-500 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                </div>
                <span className="text-[11px] font-medium text-slate-700">Margin Laba</span>
              </div>
              <span className="text-[11px] font-black text-slate-900">47,8%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </div>
                <span className="text-[11px] font-medium text-slate-700">Arus Kas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-slate-900">Rp 61.520.000</span>
                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 font-bold text-[8px] rounded">Positif</span>
              </div>
            </div>
          </div>
          
          <button className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat laporan keuangan →</button>
        </div>

      </div>

      {/* 6. UNDUH LAPORAN SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/3">
            <h3 className="text-base font-bold text-slate-900 mb-1">Unduh Laporan</h3>
            <p className="text-xs font-medium text-slate-500">Unduh laporan detail dalam format yang Anda butuhkan.</p>
          </div>
          
          <div className="w-full md:w-2/3 flex gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {/* Buttons array */}
            <button className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-sm rounded-xl transition-all shrink-0">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-800">Ringkasan</p>
                <p className="text-[8px] font-semibold text-slate-400">PDF / Excel</p>
              </div>
            </button>
            <button className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all shrink-0">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-800">Produksi Susu</p>
                <p className="text-[8px] font-semibold text-slate-400">PDF / Excel</p>
              </div>
            </button>
            <button className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all shrink-0">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-800">Kesehatan</p>
                <p className="text-[8px] font-semibold text-slate-400">PDF / Excel</p>
              </div>
            </button>
            <button className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all shrink-0">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-800">Reproduksi</p>
                <p className="text-[8px] font-semibold text-slate-400">PDF / Excel</p>
              </div>
            </button>
            <button className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all shrink-0">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-800">Pakan</p>
                <p className="text-[8px] font-semibold text-slate-400">PDF / Excel</p>
              </div>
            </button>
            <button className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all shrink-0">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-800">Keuangan</p>
                <p className="text-[8px] font-semibold text-slate-400">PDF / Excel</p>
              </div>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}