"use client";

import Image from "next/image";

export default function PakanPage() {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Pakan</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola ransum, konsumsi, stok pakan, dan efisiensi pakan ternak Anda.</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Total Konsumsi Hari Ini</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">1.245 <span className="text-sm font-semibold text-slate-400">kg</span></p>
            <p className="text-[10px] font-bold text-emerald-500 mt-0.5">↑ 3.2% <span className="text-slate-400 font-medium">dari kemarin</span></p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Rata-rata Konsumsi / Sapi</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">18,2 <span className="text-sm font-semibold text-slate-400">kg/hari</span></p>
            <p className="text-[10px] font-bold text-emerald-500 mt-0.5">↑ 2.1% <span className="text-slate-400 font-medium">dari kemarin</span></p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Biaya Pakan Hari Ini</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight"><span className="text-sm font-semibold text-slate-400">Rp</span> 2.650.000</p>
            <p className="text-[10px] font-bold text-emerald-500 mt-0.5">↓ 1.8% <span className="text-slate-400 font-medium">dari kemarin</span></p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Stok Pakan Tersedia</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">12.540 <span className="text-sm font-semibold text-slate-400">kg</span></p>
            <p className="text-[10px] font-medium text-purple-600 mt-0.5">Cukup untuk <b className="font-bold">8 hari</b></p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Feed Efficiency <span className="font-medium">(7 hari)</span></p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">1,28 <span className="text-sm font-semibold text-slate-400">kg/L</span></p>
            <p className="text-[10px] font-bold text-emerald-500 mt-0.5">↑ 0.08 <span className="text-slate-400 font-medium">dari minggu lalu</span></p>
          </div>
        </div>

      </div>

      {/* 3. MIDDLE SECTION (Chart & Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Area Chart: Konsumsi Pakan */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-900">Konsumsi Pakan (7 Hari Terakhir)</h3>
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
            <div className="absolute left-10 right-0 bottom-0 flex justify-between text-[10px] font-medium text-slate-400">
              <span>12 Mei</span><span>13 Mei</span><span>14 Mei</span><span>15 Mei</span><span>16 Mei</span><span>17 Mei</span><span>18 Mei</span>
            </div>
            
            {/* Chart Area */}
            <div className="absolute left-10 right-2 top-2 bottom-8">
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
                  <linearGradient id="chartGreenPakan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area and Line (Mock points 1000 - 1500) */}
                <polygon points="0,150 0,60 83,50 166,40 250,75 333,65 416,20 500,45 500,150" fill="url(#chartGreenPakan)" />
                <polyline points="0,60 83,50 166,40 250,75 333,65 416,20 500,45" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Points */}
                <circle cx="0" cy="60" r="4" fill="#22c55e" stroke="white" strokeWidth="2" />
                <circle cx="83" cy="50" r="4" fill="#22c55e" stroke="white" strokeWidth="2" />
                <circle cx="166" cy="40" r="4" fill="#22c55e" stroke="white" strokeWidth="2" />
                <circle cx="250" cy="75" r="4" fill="#22c55e" stroke="white" strokeWidth="2" />
                <circle cx="333" cy="65" r="4" fill="#22c55e" stroke="white" strokeWidth="2" />
                <circle cx="416" cy="20" r="4" fill="#22c55e" stroke="white" strokeWidth="2" />
                <circle cx="500" cy="45" r="4.5" fill="#22c55e" stroke="white" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-600">
             <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Total Konsumsi (kg)
          </div>
        </div>

        {/* Donut Chart: Komposisi Ransum */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Komposisi Ransum Saat Ini</h3>
          
          <div className="flex flex-col sm:flex-row items-center gap-8 flex-1 justify-center">
            {/* CSS Donut Chart */}
            <div className="relative w-48 h-48 shrink-0 rounded-full flex items-center justify-center" 
                 style={{ background: 'conic-gradient(#22c55e 0% 40%, #3b82f6 40% 75%, #94a3b8 75% 90%, #f59e0b 90% 95%, #f97316 95% 100%)' }}>
               <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                 <span className="text-[10px] font-bold text-slate-500">Total</span>
                 <span className="text-2xl font-black text-slate-900 leading-tight">18,2 <span className="text-sm font-bold text-slate-500">kg</span></span>
                 <span className="text-[10px] font-semibold text-slate-400 mt-0.5">/sapi/hari</span>
               </div>
            </div>
            
            {/* Legend List */}
            <div className="w-full sm:w-auto space-y-3 flex-1">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></span><span className="font-semibold text-slate-700">Hijauan (Rumput/Ksilase)</span></div>
                <span className="text-slate-500 font-medium">40% (7,3 kg)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span><span className="font-semibold text-slate-700">Konsentrat</span></div>
                <span className="text-slate-500 font-medium">35% (6,4 kg)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0"></span><span className="font-semibold text-slate-700">Silase</span></div>
                <span className="text-slate-500 font-medium">15% (2,7 kg)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span><span className="font-semibold text-slate-700">Mineral & Vitamin</span></div>
                <span className="text-slate-500 font-medium">5% (0,9 kg)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span><span className="font-semibold text-slate-700">Lainnya</span></div>
                <span className="text-slate-500 font-medium">5% (0,9 kg)</span>
              </div>
            </div>
          </div>
          
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-6 text-right w-full sm:text-left">Lihat detail ransum →</button>
        </div>

      </div>

      {/* 4. LOWER SECTION (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
        
        {/* Ransum Digunakan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900">Ransum yang Digunakan</h3>
            <button className="text-[10px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50">Lihat Semua</button>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Nama Ransum</th>
                  <th className="pb-3 font-semibold">Kategori</th>
                  <th className="pb-3 font-semibold text-center">Target Konsumsi<br/><span className="text-[9px] font-normal">(kg/sapi/hari)</span></th>
                  <th className="pb-3 font-semibold">Sapi</th>
                  <th className="pb-3 font-semibold">Digunakan</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-3 pr-2">
                    <p className="font-bold text-slate-900">Ransum Laktasi Tinggi</p>
                    <p className="text-[9px] text-slate-500">Untuk sapi laktasi &gt; 15L</p>
                  </td>
                  <td className="py-3"><span className="px-2 py-1 bg-green-50 text-green-700 rounded text-[10px] font-bold border border-green-100">Laktasi</span></td>
                  <td className="py-3 text-center font-medium">20,0</td>
                  <td className="py-3 font-medium">45 ekor</td>
                  <td className="py-3 min-w-[80px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-700">90%</span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-green-500" style={{width: '90%'}}></div></div>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 pr-2">
                    <p className="font-bold text-slate-900">Ransum Laktasi Sedang</p>
                    <p className="text-[9px] text-slate-500">Untuk sapi laktasi 10-15L</p>
                  </td>
                  <td className="py-3"><span className="px-2 py-1 bg-green-50 text-green-700 rounded text-[10px] font-bold border border-green-100">Laktasi</span></td>
                  <td className="py-3 text-center font-medium">17,0</td>
                  <td className="py-3 font-medium">32 ekor</td>
                  <td className="py-3 min-w-[80px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-700">85%</span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-green-400" style={{width: '85%'}}></div></div>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 pr-2">
                    <p className="font-bold text-slate-900">Ransum Kering</p>
                    <p className="text-[9px] text-slate-500">Untuk sapi kering</p>
                  </td>
                  <td className="py-3"><span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-[10px] font-bold border border-amber-100">Kering</span></td>
                  <td className="py-3 text-center font-medium">14,0</td>
                  <td className="py-3 font-medium">18 ekor</td>
                  <td className="py-3 min-w-[80px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-700">80%</span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400" style={{width: '80%'}}></div></div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-2">
                    <p className="font-bold text-slate-900">Ransum Pedet</p>
                    <p className="text-[9px] text-slate-500">Untuk pedet 3-6 bulan</p>
                  </td>
                  <td className="py-3"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-bold border border-blue-100">Pedet</span></td>
                  <td className="py-3 text-center font-medium">4,5</td>
                  <td className="py-3 font-medium">12 ekor</td>
                  <td className="py-3 min-w-[80px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-700">75%</span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-400" style={{width: '75%'}}></div></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Kelola ransum →</button>
        </div>

        {/* Stok Pakan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900">Stok Pakan</h3>
            <button className="text-[10px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50">Lihat Semua</button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Nama Pakan</th>
                  <th className="pb-3 font-semibold text-center">Stok Tersedia</th>
                  <th className="pb-3 font-semibold text-center">Satuan</th>
                  <th className="pb-3 font-semibold text-center">Hari Cukup</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-3 flex items-center gap-2 font-bold text-slate-800"><span className="text-lg">🌾</span> Rumput Gajah</td>
                  <td className="py-3 text-center font-medium">4.250</td>
                  <td className="py-3 text-center text-slate-500">kg</td>
                  <td className="py-3 text-center font-bold text-amber-500">6 hari</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 flex items-center gap-2 font-bold text-slate-800"><span className="text-lg">🌿</span> Silase Jagung</td>
                  <td className="py-3 text-center font-medium">3.125</td>
                  <td className="py-3 text-center text-slate-500">kg</td>
                  <td className="py-3 text-center font-bold text-green-500">8 hari</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 flex items-center gap-2 font-bold text-slate-800"><span className="text-lg">🥣</span> Konsentrat</td>
                  <td className="py-3 text-center font-medium">2.180</td>
                  <td className="py-3 text-center text-slate-500">kg</td>
                  <td className="py-3 text-center font-bold text-green-500">7 hari</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 flex items-center gap-2 font-bold text-slate-800"><span className="text-lg">🍚</span> Dedak Halus</td>
                  <td className="py-3 text-center font-medium">1.540</td>
                  <td className="py-3 text-center text-slate-500">kg</td>
                  <td className="py-3 text-center font-bold text-green-500">9 hari</td>
                </tr>
                <tr>
                  <td className="py-3 flex items-center gap-2 font-bold text-slate-800"><span className="text-lg">🧆</span> Bungkil Kedelai</td>
                  <td className="py-3 text-center font-medium">980</td>
                  <td className="py-3 text-center text-slate-500">kg</td>
                  <td className="py-3 text-center font-bold text-amber-500">6 hari</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Kelola stok pakan →</button>
        </div>

        {/* AI Insight Pakan */}
        <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
            <span className="text-emerald-500 text-lg">🤖</span> AI Insight Pakan
          </h3>
          
          <p className="text-[11px] font-medium text-slate-700 mb-6 leading-relaxed relative z-10 bg-white/60 p-3 rounded-xl border border-emerald-100/50">
            Feed efficiency minggu ini <b className="text-slate-900">meningkat 0.08 kg/L</b> dibanding minggu lalu. Konsumsi konsentrat pada sapi laktasi tinggi berada dalam rentang optimal.
          </p>

          <div className="flex-1 relative z-10">
            <h4 className="text-xs font-bold text-slate-800 mb-3">Rekomendasi</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-white p-1.5 rounded shadow-sm border border-slate-100 shrink-0">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-[11px] font-medium text-slate-700 leading-relaxed">Stok Rumput Gajah menipis, disarankan tambah stok untuk menjaga ketersediaan minimal 10 hari.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white p-1.5 rounded shadow-sm border border-slate-100 shrink-0">
                  <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                </div>
                <p className="text-[11px] font-medium text-slate-700 leading-relaxed">Perhatikan peningkatan konsumsi konsentrat pada sapi #1042 (Rosa), naik 12% dari rata-rata kelompok.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white p-1.5 rounded shadow-sm border border-slate-100 shrink-0">
                  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                </div>
                <p className="text-[11px] font-medium text-slate-700 leading-relaxed">Evaluasi kualitas silase, beberapa sapi menunjukkan penurunan konsumsi hijauan.</p>
              </div>
            </div>
          </div>
          
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-6 text-left relative z-10">Lihat semua rekomendasi →</button>
        </div>

      </div>

      {/* 5. BOTTOM SECTION (2 Columns) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Riwayat Konsumsi */}
        <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Riwayat Konsumsi Pakan</h3>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Tanggal</th>
                  <th className="pb-3 font-semibold text-center">Total Konsumsi (kg)</th>
                  <th className="pb-3 font-semibold text-center">Rata-rata / Sapi (kg)</th>
                  <th className="pb-3 font-semibold text-center">Biaya (Rp)</th>
                  <th className="pb-3 font-semibold text-center">Feed Efficiency (kg/L)</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-3 font-medium">18 Mei 2026</td>
                  <td className="py-3 text-center">1.245</td>
                  <td className="py-3 text-center">18,2</td>
                  <td className="py-3 text-center">2.650.000</td>
                  <td className="py-3 text-center font-bold text-slate-900">1,28</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 font-medium">17 Mei 2026</td>
                  <td className="py-3 text-center">1.206</td>
                  <td className="py-3 text-center">17,8</td>
                  <td className="py-3 text-center">2.698.000</td>
                  <td className="py-3 text-center font-bold text-slate-900">1,20</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 font-medium">16 Mei 2026</td>
                  <td className="py-3 text-center">1.190</td>
                  <td className="py-3 text-center">17,6</td>
                  <td className="py-3 text-center">2.610.000</td>
                  <td className="py-3 text-center font-bold text-slate-900">1,22</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 font-medium">15 Mei 2026</td>
                  <td className="py-3 text-center">1.152</td>
                  <td className="py-3 text-center">17,0</td>
                  <td className="py-3 text-center">2.542.000</td>
                  <td className="py-3 text-center font-bold text-slate-900">1,18</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">14 Mei 2026</td>
                  <td className="py-3 text-center">1.101</td>
                  <td className="py-3 text-center">16,2</td>
                  <td className="py-3 text-center">2.433.000</td>
                  <td className="py-3 text-center font-bold text-slate-900">1,15</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat semua riwayat →</button>
        </div>

        {/* Distribusi Pakan */}
        <div className="xl:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-900">Distribusi Pakan Hari Ini</h3>
            <button className="text-[10px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50">Lihat Detail</button>
          </div>
          
          <div className="flex items-center gap-6 flex-1 justify-center">
            {/* Donut Kecil */}
            <div className="relative w-28 h-28 shrink-0 rounded-full flex items-center justify-center" 
                 style={{ background: 'conic-gradient(#22c55e 0% 49.8%, #f97316 49.8% 84.7%, #94a3b8 84.7% 95.5%, #8b5cf6 95.5% 98.3%, #14b8a6 98.3% 100%)' }}>
               <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                 <span className="text-[9px] font-bold text-slate-500">Total</span>
                 <span className="text-sm font-black text-slate-900 leading-tight">1.245 <span className="text-[9px] font-bold text-slate-500">kg</span></span>
               </div>
            </div>
            
            {/* Legend */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="font-semibold text-slate-700">Hijauan</span></div>
                <span className="text-slate-500 font-medium">620 kg (49.8%)</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span><span className="font-semibold text-slate-700">Konsentrat</span></div>
                <span className="text-slate-500 font-medium">435 kg (34.9%)</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400"></span><span className="font-semibold text-slate-700">Silase</span></div>
                <span className="text-slate-500 font-medium">135 kg (10.8%)</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span><span className="font-semibold text-slate-700">Mineral & Vitamin</span></div>
                <span className="text-slate-500 font-medium">35 kg (2.8%)</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-500"></span><span className="font-semibold text-slate-700">Lainnya</span></div>
                <span className="text-slate-500 font-medium">20 kg (1.7%)</span>
              </div>
            </div>
          </div>
          
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-6 text-left">Lihat riwayat distribusi →</button>
        </div>

      </div>

    </div>
  );
}