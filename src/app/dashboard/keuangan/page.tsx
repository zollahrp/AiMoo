"use client";

import Image from "next/image";

export default function KeuanganPage() {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Keuangan</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola arus kas, pendapatan, biaya, dan profitabilitas peternakan sapi perah Anda.</p>
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

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 17l-4 4m0 0l-4-4m4 4V3" transform="scale(0.6) translate(18, 18)" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Total Pendapatan</p>
            <p className="text-xl font-black text-slate-900 tracking-tight">Rp 128.750.000</p>
            <p className="text-[10px] font-bold text-emerald-500 mt-0.5">↑ 12.5% <span className="text-slate-400 font-medium">vs 1 Apr - 30 Apr 2026</span></p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7l4-4m0 0l4 4m-4-4v18" transform="scale(0.6) translate(18, 18)" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Total Biaya</p>
            <p className="text-xl font-black text-slate-900 tracking-tight">Rp 67.230.000</p>
            <p className="text-[10px] font-bold text-red-500 mt-0.5">↑ 8.3% <span className="text-slate-400 font-medium">vs 1 Apr - 30 Apr 2026</span></p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Laba Bersih</p>
            <p className="text-xl font-black text-slate-900 tracking-tight">Rp 61.520.000</p>
            <p className="text-[10px] font-bold text-emerald-500 mt-0.5">↑ 17.2% <span className="text-slate-400 font-medium">vs 1 Apr - 30 Apr 2026</span></p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Margin Laba</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">47,8%</p>
            <p className="text-[10px] font-bold text-emerald-500 mt-0.5">↑ 3.6% <span className="text-slate-400 font-medium">vs 1 Apr - 30 Apr 2026</span></p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Arus Kas</p>
            <p className="text-xl font-black text-slate-900 tracking-tight mb-1">Rp 61.520.000</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-green-100 text-green-700 font-bold text-[9px] rounded">Sehat</span>
              <span className="text-[10px] font-medium text-slate-500">Positif</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. MIDDLE SECTION (Chart, Arus Kas, Ringkasan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-stretch">
        
        {/* Left: Tren Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Tren Pendapatan, Biaya & Laba Bersih
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </h3>
            <select className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg outline-none cursor-pointer">
              <option>3 Bulan Terakhir</option>
              <option>6 Bulan Terakhir</option>
            </select>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-6 mb-6 text-[11px] font-bold text-slate-600">
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-emerald-500 relative"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute -top-0.5 left-0.5"></div></div> Pendapatan</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-red-500 relative"><div className="w-1.5 h-1.5 rounded-full bg-red-500 absolute -top-0.5 left-0.5"></div></div> Biaya</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-blue-500 relative"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 absolute -top-0.5 left-0.5"></div></div> Laba Bersih</div>
          </div>
          
          {/* Custom SVG Line Chart */}
          <div className="flex-1 relative min-h-[220px]">
             {/* Y-Axis */}
             <div className="absolute left-0 top-0 bottom-6 w-16 flex flex-col justify-between text-[9px] font-medium text-slate-400">
               <span>(Rp)</span>
               <span>140.000.000</span><span>120.000.000</span><span>100.000.000</span>
               <span>80.000.000</span><span>60.000.000</span><span>40.000.000</span>
               <span>20.000.000</span><span>0</span>
             </div>
             {/* X-Axis */}
             <div className="absolute left-20 right-0 bottom-0 flex justify-between text-[10px] font-medium text-slate-400 px-8">
               <span>Mar 2026</span><span>Apr 2026</span><span>Mei 2026</span>
             </div>
             {/* SVG Container */}
             <div className="absolute left-20 right-4 top-4 bottom-8">
               {/* Grid lines */}
               <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-100">
                 <div className="w-full border-t border-slate-100/60 h-0"></div><div className="w-full border-t border-slate-100/60 h-0"></div>
                 <div className="w-full border-t border-slate-100/60 h-0"></div><div className="w-full border-t border-slate-100/60 h-0"></div>
                 <div className="w-full border-t border-slate-100/60 h-0"></div><div className="w-full border-t border-slate-100/60 h-0"></div>
                 <div className="w-full border-t border-slate-100/60 h-0"></div>
                 <div className="w-full h-0"></div>
               </div>
               
               <svg viewBox="0 0 400 150" className="absolute inset-0 w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
                 {/* Green Line (Pendapatan) -> ~98M, ~114M, ~128M */}
                 <polyline points="40,50 200,35 360,20" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                 {/* Red Line (Biaya) -> ~56M, ~62M, ~67M */}
                 <polyline points="40,90 200,85 360,78" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                 {/* Blue Line (Laba) -> ~42M, ~52M, ~61M */}
                 <polyline points="40,105 200,95 360,85" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                 
                 {/* Data Points - Green */}
                 <circle cx="40" cy="50" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                 <text x="40" y="40" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">98.250.000</text>
                 <circle cx="200" cy="35" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                 <text x="200" y="25" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">114.350.000</text>
                 <circle cx="360" cy="20" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                 <text x="360" y="10" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">128.750.000</text>

                 {/* Data Points - Red */}
                 <circle cx="40" cy="90" r="4" fill="#ef4444" stroke="white" strokeWidth="2" />
                 <text x="40" y="80" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">56.120.000</text>
                 <circle cx="200" cy="85" r="4" fill="#ef4444" stroke="white" strokeWidth="2" />
                 <text x="200" y="75" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">62.050.000</text>
                 <circle cx="360" cy="78" r="4" fill="#ef4444" stroke="white" strokeWidth="2" />
                 <text x="360" y="68" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">67.230.000</text>

                 {/* Data Points - Blue */}
                 <circle cx="40" cy="105" r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                 <text x="40" y="118" fill="#3b82f6" fontSize="10" fontWeight="bold" textAnchor="middle">42.130.000</text>
                 <circle cx="200" cy="95" r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                 <text x="200" y="108" fill="#3b82f6" fontSize="10" fontWeight="bold" textAnchor="middle">52.300.000</text>
                 <circle cx="360" cy="85" r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                 <text x="360" y="98" fill="#3b82f6" fontSize="10" fontWeight="bold" textAnchor="middle">61.520.000</text>
               </svg>
             </div>
          </div>
        </div>

        {/* Center: Rincian Arus Kas */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Rincian Arus Kas</h3>
          
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Saldo Awal</span>
              <span className="font-bold text-slate-900">Rp 48.250.000</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Total Penerimaan</span>
              <span className="font-bold text-emerald-500">Rp 128.750.000</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Total Pengeluaran</span>
              <span className="font-bold text-red-500">Rp 67.230.000</span>
            </div>
            
            <div className="border-t border-slate-200 my-2 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-black text-slate-900">Saldo Akhir</span>
                <span className="font-black text-slate-900">Rp 109.770.000</span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-emerald-50/70 border border-emerald-100 rounded-xl p-4 flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Positif</p>
              <p className="text-[10px] text-slate-600 font-medium">Arus kas dalam kondisi sehat.</p>
            </div>
          </div>
        </div>

        {/* Right: Ringkasan (Donut) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Ringkasan</h3>
          
          <div className="flex flex-col items-center flex-1">
            {/* CSS Donut Chart */}
            <div className="relative w-40 h-40 shrink-0 rounded-full flex items-center justify-center mb-6" 
                 style={{ background: 'conic-gradient(#3b82f6 0% 46.2%, #ef4444 46.2% 64.8%, #10b981 64.8% 74.6%, #f59e0b 74.6% 81%, #fbbf24 81% 86.3%, #f97316 86.3% 91.2%, #94a3b8 91.2% 100%)' }}>
               <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-inner text-center">
                 <span className="text-[10px] font-bold text-slate-500">Total Biaya</span>
                 <span className="text-[11px] font-black text-slate-900 leading-tight">Rp 67.230.000</span>
               </div>
            </div>
            
            {/* Legend Grid */}
            <div className="w-full grid grid-cols-2 gap-x-2 gap-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span className="font-semibold text-slate-700">Pakan</span></div>
                <span className="text-slate-500 font-medium">46,2%</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="font-semibold text-slate-700">Tenaga Kerja</span></div>
                <span className="text-slate-500 font-medium">18,6%</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span><span className="font-semibold text-slate-700">Obat & Kesh.</span></div>
                <span className="text-slate-500 font-medium">9,8%</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="font-semibold text-slate-700">Reproduksi</span></div>
                <span className="text-slate-500 font-medium">6,4%</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span><span className="font-semibold text-slate-700">Listrik & Air</span></div>
                <span className="text-slate-500 font-medium">5,3%</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span><span className="font-semibold text-slate-700">Pemeliharaan</span></div>
                <span className="text-slate-500 font-medium">4,9%</span>
              </div>
              <div className="flex justify-between items-center text-[10px] col-span-2">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span><span className="font-semibold text-slate-700">Lainnya</span></div>
                <span className="text-slate-500 font-medium">8,8%</span>
              </div>
            </div>
          </div>
          
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat detail biaya →</button>
        </div>

      </div>

      {/* 4. BOTTOM SECTION (4 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Rincian Pendapatan */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-900">Rincian Pendapatan</h3>
            <select className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg outline-none">
              <option>Bulan Ini</option>
            </select>
          </div>
          
          <div className="flex-1">
            <table className="w-full text-left text-[11px] whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Sumber Pendapatan</th>
                  <th className="pb-3 font-semibold text-right">Jumlah (Rp)</th>
                  <th className="pb-3 font-semibold text-right">Persentase</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-3 flex items-center gap-2 font-semibold"><span className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-sm">🥛</span> Penjualan Susu</td>
                  <td className="py-3 text-right font-medium">Rp 97.650.000</td>
                  <td className="py-3 text-right font-bold text-slate-900">75,8%</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 flex items-center gap-2 font-semibold"><span className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-sm">🐄</span> Penjualan Pedet</td>
                  <td className="py-3 text-right font-medium">Rp 18.500.000</td>
                  <td className="py-3 text-right font-bold text-slate-900">14,4%</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 flex items-center gap-2 font-semibold"><span className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-sm">🛖</span> Penjualan Sapi Afkir</td>
                  <td className="py-3 text-right font-medium">Rp 9.000.000</td>
                  <td className="py-3 text-right font-bold text-slate-900">7,0%</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 flex items-center gap-2 font-semibold"><span className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-blue-500 text-sm">＋</span> Lainnya</td>
                  <td className="py-3 text-right font-medium">Rp 3.600.000</td>
                  <td className="py-3 text-right font-bold text-slate-900">2,8%</td>
                </tr>
                <tr>
                  <td className="py-4 font-black text-slate-900">Total Pendapatan</td>
                  <td className="py-4 text-right font-black text-slate-900">Rp 128.750.000</td>
                  <td className="py-4 text-right font-black text-slate-900">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 mt-2 text-left">Lihat semua pendapatan →</button>
        </div>

        {/* Rincian Biaya */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-900">Rincian Biaya</h3>
            <select className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg outline-none">
              <option>Bulan Ini</option>
            </select>
          </div>
          
          <div className="flex-1">
            <table className="w-full text-left text-[11px] whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Kategori Biaya</th>
                  <th className="pb-3 font-semibold text-right">Jumlah (Rp)</th>
                  <th className="pb-3 font-semibold text-right">Persentase</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-2.5 flex items-center gap-2 font-semibold"><span className="w-5 h-5 rounded bg-green-50 flex items-center justify-center text-[10px]">🌾</span> Pakan</td>
                  <td className="py-2.5 text-right font-medium">Rp 31.050.000</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">46,2%</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2.5 flex items-center gap-2 font-semibold"><span className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center text-[10px]">👥</span> Tenaga Kerja</td>
                  <td className="py-2.5 text-right font-medium">Rp 12.500.000</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">18,6%</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2.5 flex items-center gap-2 font-semibold"><span className="w-5 h-5 rounded bg-purple-50 flex items-center justify-center text-[10px]">💊</span> Obat & Kesehatan</td>
                  <td className="py-2.5 text-right font-medium">Rp 6.580.000</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">9,8%</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2.5 flex items-center gap-2 font-semibold"><span className="w-5 h-5 rounded bg-amber-50 flex items-center justify-center text-[10px]">⚥</span> Reproduksi</td>
                  <td className="py-2.5 text-right font-medium">Rp 4.300.000</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">6,4%</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2.5 flex items-center gap-2 font-semibold"><span className="w-5 h-5 rounded bg-yellow-50 flex items-center justify-center text-[10px]">⚡</span> Listrik & Air</td>
                  <td className="py-2.5 text-right font-medium">Rp 3.560.000</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">5,3%</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2.5 flex items-center gap-2 font-semibold"><span className="w-5 h-5 rounded bg-orange-50 flex items-center justify-center text-[10px]">🔧</span> Pemeliharaan</td>
                  <td className="py-2.5 text-right font-medium">Rp 3.290.000</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">4,9%</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2.5 flex items-center gap-2 font-semibold"><span className="w-5 h-5 rounded bg-slate-50 flex items-center justify-center text-blue-500 text-[10px]">＋</span> Lainnya</td>
                  <td className="py-2.5 text-right font-medium">Rp 5.950.000</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">8,8%</td>
                </tr>
                <tr>
                  <td className="py-3 font-black text-slate-900">Total Biaya</td>
                  <td className="py-3 text-right font-black text-slate-900">Rp 67.230.000</td>
                  <td className="py-3 text-right font-black text-slate-900">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 mt-2 text-left">Lihat semua biaya →</button>
        </div>

        {/* Profitabilitas & Target */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Profitabilitas</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-slate-600">Gross Profit</span>
              <span className="font-bold text-slate-900">Rp 81.520.000</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-slate-600">EBITDA</span>
              <span className="font-bold text-slate-900">Rp 68.360.000</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-slate-600">Net Profit Margin</span>
              <span className="font-bold text-slate-900">47,8%</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-slate-600">ROI (12 Bulan)</span>
              <span className="font-bold text-slate-900">68,4%</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Target Bulanan
          </h3>

          <div className="space-y-5 flex-1">
            {/* Target Pendapatan */}
            <div>
              <div className="flex justify-between items-end mb-1.5 text-[10px]">
                <div>
                  <p className="font-semibold text-slate-600">Target Pendapatan</p>
                  <p className="font-medium text-slate-400">Rp 120.000.000</p>
                </div>
                <p className="font-bold text-emerald-600">107,3%</p>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            {/* Target Laba */}
            <div>
              <div className="flex justify-between items-end mb-1.5 text-[10px]">
                <div>
                  <p className="font-semibold text-slate-600">Target Laba Bersih</p>
                  <p className="font-medium text-slate-400">Rp 50.000.000</p>
                </div>
                <p className="font-bold text-emerald-600">123,0%</p>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <button className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 mt-6 text-left">Atur target →</button>
        </div>

        {/* AI Insight */}
        <div className="lg:col-span-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
            <span className="text-emerald-500 text-lg">🤖</span> AI Insight
          </h3>
          
          <div className="bg-white/60 border border-emerald-100/50 rounded-xl p-3 mb-5 relative z-10">
            <p className="text-[11px] font-medium text-slate-700 leading-relaxed">
              Margin laba <b className="text-slate-900">meningkat 3,6%</b> dibanding bulan lalu.
            </p>
          </div>

          <div className="flex-1 relative z-10">
            <h4 className="text-xs font-bold text-slate-800 mb-3">Rekomendasi</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-white p-1.5 rounded shadow-sm border border-slate-100 shrink-0">
                  <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </div>
                <p className="text-[10px] font-medium text-slate-700 leading-relaxed">Biaya pakan menyumbang 46,2% dari total biaya. Pertimbangkan optimasi formulasi pakan untuk menekan biaya.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white p-1.5 rounded shadow-sm border border-slate-100 shrink-0">
                  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <p className="text-[10px] font-medium text-slate-700 leading-relaxed">Penjualan susu meningkat 12,8%. Pertahankan kualitas dan volume produksi.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white p-1.5 rounded shadow-sm border border-slate-100 shrink-0">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-[10px] font-medium text-slate-700 leading-relaxed">Arus kas positif. Pertimbangkan investasi pada perbaikan kandang untuk efisiensi jangka panjang.</p>
              </div>
            </div>
          </div>
          
          <button className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 mt-6 text-left relative z-10">Lihat semua insight →</button>
        </div>

      </div>

    </div>
  );
}