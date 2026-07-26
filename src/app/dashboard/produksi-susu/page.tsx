"use client";

import Image from "next/image";

export default function ProduksiSusuPage() {
  // Data dummy untuk tabel agar kodenya lebih rapi
  const tableData = [
    { id: "#1001", name: "Bella", laktasi: 120, prod: "35,8", change: "↑ 6.2%", changeType: "up", avg: "32,1", img: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=100&auto=format&fit=crop" },
    { id: "#1002", name: "Mona", laktasi: 85, prod: "28,6", change: "↑ 3.1%", changeType: "up", avg: "27,4", img: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=100&auto=format&fit=crop" },
    { id: "#1003", name: "Caca", laktasi: 45, prod: "18,4", change: "↓ 5.4%", changeType: "down", avg: "20,1", img: "https://images.unsplash.com/photo-1596733430284-f74372808c10?q=80&w=100&auto=format&fit=crop" },
    { id: "#1004", name: "Dinda", laktasi: 210, prod: "32,0", change: "↑ 1.8%", changeType: "up", avg: "31,5", img: "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?q=80&w=100&auto=format&fit=crop" },
    { id: "#1005", name: "Rara", laktasi: 60, prod: "16,2", change: "↓ 8.7%", changeType: "down", avg: "17,8", img: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=100&auto=format&fit=crop" },
  ];

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Produksi Susu</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Pantau produksi susu harian dan performa sapi Anda.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Date Picker */}
          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-sm font-bold text-slate-700">18 Mei 2026</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          
          {/* Filter */}
          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-emerald-600 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm font-bold text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filter
          </button>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Total Produksi Hari Ini</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">1.250 <span className="text-sm font-semibold text-slate-400">L</span></p>
            <p className="text-[10px] font-bold text-emerald-500 mt-1">↑ 4.3% <span className="text-slate-400 font-medium">dari kemarin</span></p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Rata-rata per Sapi</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">23,5 <span className="text-sm font-semibold text-slate-400">L/ekor</span></p>
            <p className="text-[10px] font-bold text-emerald-500 mt-1">↑ 2.1% <span className="text-slate-400 font-medium">dari kemarin</span></p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Produksi Tertinggi</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">35,8 <span className="text-sm font-semibold text-slate-400">L</span></p>
            <p className="text-[10px] font-medium text-slate-500 mt-1">Sapi #1001 - Bella</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Penurunan Produksi</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">8 <span className="text-sm font-semibold text-slate-400">Ekor</span></p>
            <button className="text-[10px] font-bold text-slate-500 mt-1 hover:text-slate-700">Lihat daftar sapi →</button>
          </div>
        </div>

      </div>

      {/* 3. MIDDLE SECTION (Chart & AI Insight) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Left: Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-900">Grafik Produksi Harian</h3>
            <select className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg outline-none cursor-pointer">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          
          <div className="flex-1 relative min-h-[220px]">
            {/* Y-Axis */}
            <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] font-medium text-slate-400">
              <span>2.000</span><span>1.500</span><span>1.000</span><span>500</span><span>0</span>
            </div>
            {/* X-Axis */}
            <div className="absolute left-12 right-0 bottom-0 flex justify-between text-[10px] font-medium text-slate-400">
              <span>12 Mei</span><span>13 Mei</span><span>14 Mei</span><span>15 Mei</span><span>16 Mei</span><span>17 Mei</span><span>18 Mei</span>
            </div>
            
            {/* Chart Area */}
            <div className="absolute left-12 right-4 top-2 bottom-8">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-100">
                <div className="w-full border-t border-slate-100/60 h-0"></div>
                <div className="w-full border-t border-slate-100/60 h-0"></div>
                <div className="w-full border-t border-slate-100/60 h-0"></div>
                <div className="w-full border-t border-slate-100/60 h-0"></div>
                <div className="w-full h-0"></div>
              </div>

              <svg viewBox="0 0 500 150" className="absolute inset-0 w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGreenArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Area and Line */}
                <polygon points="0,150 0,60 83,60 166,45 250,71 333,48 416,78 500,56 500,150" fill="url(#chartGreenArea)" />
                <polyline points="0,60 83,60 166,45 250,71 333,48 416,78 500,56" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Points */}
                <circle cx="0" cy="60" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                <circle cx="83" cy="60" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                <circle cx="166" cy="45" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                <circle cx="250" cy="71" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                <circle cx="333" cy="48" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                <circle cx="416" cy="78" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                <circle cx="500" cy="56" r="4.5" fill="#10b981" stroke="white" strokeWidth="2" />
              </svg>
              
              {/* Tooltip on last point */}
              <div className="absolute right-0 top-[28%] -translate-y-full mr-1 bg-emerald-500 text-white text-[11px] font-bold px-2 py-1 rounded shadow-md">
                1.250 L
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Insight */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="text-emerald-500 text-lg">🤖</span> AI Insight
          </h3>
          
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-5">
            <p className="text-xs font-bold text-emerald-800 leading-relaxed">
              Produksi susu hari ini meningkat 4.3% dibandingkan kemarin.
            </p>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </div>
              <p className="text-[11px] font-medium text-slate-700 leading-relaxed">
                <b className="text-slate-900">3 ekor sapi</b> menunjukkan peningkatan produksi signifikan. Performa baik!
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
              <p className="text-[11px] font-medium text-slate-700 leading-relaxed">
                <b className="text-slate-900">8 ekor sapi</b> mengalami penurunan produksi. Periksa kesehatan dan pakan.
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <p className="text-[11px] font-medium text-slate-700 leading-relaxed">
                <b className="text-slate-900">Laktasi 60-120 hari</b> memberikan kontribusi produksi tertinggi (62%).
              </p>
            </div>
          </div>
          
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left inline-block">
            Lihat rekomendasi lengkap →
          </button>
        </div>

      </div>

      {/* 4. BOTTOM SECTION (Table) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900">Produksi per Sapi (Hari Ini)</h3>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Cari sapi..." className="w-48 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold shadow-sm transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50/50">
              <tr className="text-slate-500 border-b border-slate-100">
                <th className="py-3 px-5 font-semibold">No. Sapi</th>
                <th className="py-3 px-5 font-semibold">Nama</th>
                <th className="py-3 px-5 font-semibold text-center">Laktasi (Hari)</th>
                <th className="py-3 px-5 font-semibold text-center">Produksi Hari Ini (L)</th>
                <th className="py-3 px-5 font-semibold text-center">Perubahan</th>
                <th className="py-3 px-5 font-semibold text-center">Rata-rata 7 Hari (L)</th>
                <th className="py-3 px-5 font-semibold text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {tableData.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-slate-200 overflow-hidden shrink-0">
                        <img src={row.img} alt={row.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-slate-900">{row.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 font-medium">{row.name}</td>
                  <td className="py-3 px-5 text-center font-medium">{row.laktasi}</td>
                  <td className="py-3 px-5 text-center font-medium">{row.prod}</td>
                  <td className={`py-3 px-5 text-center font-bold ${row.changeType === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {row.change}
                  </td>
                  <td className="py-3 px-5 text-center font-medium">{row.avg}</td>
                  <td className="py-3 px-5 w-24">
                    {/* SVG Sparkline Mini */}
                    <div className="w-16 h-4 mx-auto flex items-center">
                      {row.changeType === 'up' ? (
                         <svg viewBox="0 0 30 10" className="w-full h-full preserve-3d overflow-visible">
                           <polyline points="0,8 5,5 10,7 15,3 20,5 25,1 30,2" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                         </svg>
                      ) : (
                        <svg viewBox="0 0 30 10" className="w-full h-full preserve-3d overflow-visible">
                           <polyline points="0,2 5,6 10,4 15,8 20,5 25,9 30,7" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-medium text-slate-500">Menampilkan 1 - 5 dari 95 sapi</p>
          
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-emerald-500 text-white font-bold text-[11px]">1</button>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-[11px]">2</button>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-[11px]">3</button>
            <span className="w-7 h-7 flex items-center justify-center text-slate-400 text-[11px]">...</span>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-[11px]">19</button>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}