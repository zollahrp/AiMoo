"use client";

import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      
      {/* 1. HEADER (Title, Search, Notif, Date) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Ringkasan kondisi peternakan</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative group">
            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Cari sapi..." className="w-56 pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded bg-slate-100 text-[10px] font-bold text-slate-500 border border-slate-200">/</div>
          </div>
          
          {/* Notif Bell */}
          <button className="relative p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Date Picker */}
          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-sm font-bold text-slate-700">18 Mei 2026</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </div>

      {/* 2. KPI CARDS (5 Kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M5 4h14v2H5V4zm1 4h12v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8zm3 2v6h2v-6H9zm4 0v6h2v-6h-2z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1 leading-tight">Produksi Susu Hari Ini</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">1.250 <span className="text-sm font-semibold text-slate-400">L</span></p>
            <p className="text-[10px] font-bold text-emerald-500 mt-1">↑ 4.3% <span className="text-slate-400 font-medium">dari kemarin</span></p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 10h3v4H3v-4zm4-4h14a1 1 0 011 1v9h-3v4h-2v-4h-5v4H9v-4H7V7a1 1 0 011-1zm3 3v2h2V9h-2z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1 leading-tight">Rata-rata Produksi</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">23,5 <span className="text-sm font-semibold text-slate-400">L/ekor</span></p>
            <p className="text-[10px] font-bold text-emerald-500 mt-1">↑ 2.1% <span className="text-slate-400 font-medium">dari minggu lalu</span></p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM11 7v4h2V7h-2zm0 6v2h2v-2h-2z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1 leading-tight">Sapi Perlu Perhatian</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">8 <span className="text-sm font-semibold text-slate-400">ekor</span></p>
            <button className="text-[10px] font-bold text-slate-500 mt-1 hover:text-slate-700">Lihat detail →</button>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1 leading-tight">Bunting</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">27 <span className="text-sm font-semibold text-slate-400">ekor</span></p>
            <p className="text-[10px] font-medium text-slate-400 mt-1">28.4% dari total sapi</p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1 leading-tight">Total Sapi</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">95 <span className="text-sm font-semibold text-slate-400">ekor</span></p>
            <p className="text-[10px] font-medium text-slate-400 mt-1">7 jantan / 88 betina</p>
          </div>
        </div>

      </div>

      {/* 3. MIDDLE SECTION (Warnings, Chart, AI Advice) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-stretch">
        
        {/* Left: AI Warnings */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="text-amber-500 text-lg">⚠️</span> Peringatan AI (5)
          </h3>
          <div className="space-y-2 flex-1">
            {/* Warning Item 1 */}
            <div className="flex items-center gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100 hover:bg-red-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                {/* Pakai kotak warna kalau foto sapi ga ada */}
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=100&auto=format&fit=crop')] bg-cover bg-center"></div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-red-600">Risiko Mastitis Tinggi</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Sapi #1034 • Penurunan produksi 18%</p>
              </div>
              <span className="text-[10px] font-bold text-red-500">07:20</span>
            </div>
            {/* Warning Item 2 */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=100&auto=format&fit=crop')] bg-cover bg-center"></div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-600">Kemungkinan Birahi</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Sapi #1021 • Aktivitas meningkat</p>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">06:45</span>
            </div>
            {/* Warning Item 3 */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                 <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1596733430284-f74372808c10?q=80&w=100&auto=format&fit=crop')] bg-cover bg-center"></div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-600">Penurunan Nafsu Makan</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Sapi #1047 • Konsumsi turun 15%</p>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">06:30</span>
            </div>
             {/* Warning Item 4 */}
             <div className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                 <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?q=80&w=100&auto=format&fit=crop')] bg-cover bg-center"></div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-700">Suhu Tubuh Tinggi</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Sapi #1055 • Suhu 40.2°C</p>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">06:15</span>
            </div>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left inline-block">Lihat semua peringatan →</button>
        </div>

        {/* Center: Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-500">📊</span> Produksi Susu
            </h3>
            <select className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg outline-none cursor-pointer">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          
          {/* Dummy Chart Area */}
          <div className="w-full h-48 relative mb-6">
             {/* Y-Axis labels */}
             <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] font-medium text-slate-400">
               <span>2.000</span><span>1.500</span><span>1.000</span><span>500</span><span>0</span>
             </div>
             {/* X-Axis labels */}
             <div className="absolute left-10 right-0 bottom-0 flex justify-between text-[10px] font-medium text-slate-400 pl-4 pr-2">
               <span>12 Mei</span><span>13 Mei</span><span>14 Mei</span><span>15 Mei</span><span>16 Mei</span><span>17 Mei</span><span>18 Mei</span>
             </div>
             {/* SVG Line */}
             <div className="absolute left-12 right-0 top-2 bottom-8">
               {/* Grid lines */}
               <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-100">
                 <div className="w-full border-t border-slate-100/60 h-0"></div>
                 <div className="w-full border-t border-slate-100/60 h-0"></div>
                 <div className="w-full border-t border-slate-100/60 h-0"></div>
                 <div className="w-full border-t border-slate-100/60 h-0"></div>
                 <div className="w-full h-0"></div>
               </div>
               {/* Chart Line */}
               <svg viewBox="0 0 400 150" className="absolute inset-0 w-full h-full preserve-3d overflow-visible" preserveAspectRatio="none">
                 <path d="M 10 70 L 70 60 L 130 100 L 190 90 L 250 50 L 310 110 L 380 70" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                 {/* Points */}
                 <circle cx="10" cy="70" r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                 <circle cx="70" cy="60" r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                 <circle cx="130" cy="100" r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                 <circle cx="190" cy="90" r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                 <circle cx="250" cy="50" r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                 <circle cx="310" cy="110" r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                 <circle cx="380" cy="70" r="5" fill="#3b82f6" stroke="white" strokeWidth="2" />
               </svg>
               {/* Tooltip on last point */}
               <div className="absolute right-0 top-[40%] -translate-y-full mr-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">1.250 L</div>
             </div>
          </div>

          {/* Chart Bottom Stats */}
          <div className="grid grid-cols-4 gap-2 mt-auto pt-4 border-t border-slate-100 text-center">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 mb-1">Total 7 Hari</p>
              <p className="text-sm font-bold text-slate-900">8.750 L</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 mb-1">Rata-rata / Hari</p>
              <p className="text-sm font-bold text-slate-900">1.250 L</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 mb-1">Tertinggi</p>
              <p className="text-sm font-bold text-slate-900">1.380 L</p>
              <p className="text-[9px] text-slate-400">16 Mei</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 mb-1">Terendah</p>
              <p className="text-sm font-bold text-slate-900">1.120 L</p>
              <p className="text-[9px] text-slate-400">18 Mei</p>
            </div>
          </div>
        </div>

        {/* Right: AI Advice */}
        <div className="lg:col-span-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 relative z-10">
            <span className="text-blue-600 text-lg">🤖</span> AI Advice
          </h3>
          <p className="text-xs font-medium text-slate-600 mb-6 leading-relaxed relative z-10">
            Berdasarkan analisis data hari ini, berikut rekomendasi untuk peternakan Anda:
          </p>
          
          <div className="space-y-5 flex-1 relative z-10">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-[11px] font-medium text-slate-700 leading-relaxed"><b className="text-slate-900">Periksa sapi #1034</b> untuk mastitis. Produksi turun 18% dalam 2 hari terakhir.</p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-[11px] font-medium text-slate-700 leading-relaxed">Sapi #1021 kemungkinan birahi dalam 24-48 jam ke depan. Siapkan untuk IB.</p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              <p className="text-[11px] font-medium text-slate-700 leading-relaxed">Perhatikan <b className="text-slate-900">kualitas pakan</b>, penurunan konsumsi terdeteksi pada 3 ekor sapi.</p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              <p className="text-[11px] font-medium text-slate-700 leading-relaxed">Suhu lingkungan hari ini cukup tinggi (26°C). Pastikan ventilasi dan ketersediaan air.</p>
            </div>
          </div>
          
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-6 text-left relative z-10">Lihat semua rekomendasi →</button>
        </div>
      </div>

      {/* 4. BOTTOM SECTION (Donut, Bars, Tasks) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Reproduksi (Donut) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
           <h3 className="text-sm font-bold text-slate-900 mb-6">Reproduksi</h3>
           <div className="flex items-center gap-6 flex-1">
             {/* CSS Donut Chart Hack */}
             <div className="relative w-28 h-28 shrink-0 rounded-full flex items-center justify-center" 
                  style={{ background: 'conic-gradient(#4ade80 0% 28%, #94a3b8 28% 75%, #fbbf24 75% 94%, #f87171 94% 100%)' }}>
                {/* Inner white circle */}
                <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                  <span className="text-2xl font-black text-slate-900 leading-none">95</span>
                  <span className="text-[9px] font-semibold text-slate-500">Total Sapi</span>
                </div>
             </div>
             
             {/* Legend */}
             <div className="space-y-3 flex-1">
               <div className="flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-400"></span><span className="font-semibold text-slate-700">Bunting</span></div>
                 <span className="text-slate-500 font-medium">27 (28,4%)</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span><span className="font-semibold text-slate-700">Kosong</span></div>
                 <span className="text-slate-500 font-medium">45 (47,4%)</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span><span className="font-semibold text-slate-700">Laktasi</span></div>
                 <span className="text-slate-500 font-medium">18 (18,9%)</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span><span className="font-semibold text-slate-700">Kering</span></div>
                 <span className="text-slate-500 font-medium">5 (5,3%)</span>
               </div>
             </div>
           </div>
           <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-6 text-left">Lihat detail reproduksi →</button>
        </div>

        {/* Center: Status Bars */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
           <h3 className="text-sm font-bold text-slate-900 mb-6">Sapi Berdasarkan Status</h3>
           <div className="space-y-5 flex-1">
             {/* Bar 1 */}
             <div className="flex items-center gap-4">
               <span className="text-xs font-semibold text-slate-700 w-16">Laktasi</span>
               <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500 rounded-full" style={{ width: '35%' }}></div>
               </div>
               <span className="text-xs font-bold text-slate-700 w-12 text-right">18 ekor</span>
             </div>
             {/* Bar 2 */}
             <div className="flex items-center gap-4">
               <span className="text-xs font-semibold text-slate-700 w-16">Kering</span>
               <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-amber-400 rounded-full" style={{ width: '15%' }}></div>
               </div>
               <span className="text-xs font-bold text-slate-700 w-12 text-right">5 ekor</span>
             </div>
             {/* Bar 3 */}
             <div className="flex items-center gap-4">
               <span className="text-xs font-semibold text-slate-700 w-16">Bunting</span>
               <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
               </div>
               <span className="text-xs font-bold text-slate-700 w-12 text-right">27 ekor</span>
             </div>
             {/* Bar 4 */}
             <div className="flex items-center gap-4">
               <span className="text-xs font-semibold text-slate-700 w-16">Kosong</span>
               <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-slate-300 rounded-full" style={{ width: '85%' }}></div>
               </div>
               <span className="text-xs font-bold text-slate-700 w-12 text-right">45 ekor</span>
             </div>
           </div>
           <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-6 text-left">Lihat semua sapi →</button>
        </div>

        {/* Right: Tasks & Schedule */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Tasks */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Tugas Hari Ini</h3>
            <div className="space-y-3 flex-1">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center group-hover:border-emerald-500 transition-colors"></div>
                  <span className="text-xs font-medium text-slate-700">Periksa kebuntingan kelompok 3</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">08:00</span>
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded border-none bg-emerald-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-xs font-medium text-slate-400 line-through">Vaksinasi PMK</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 line-through">10:00</span>
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center group-hover:border-emerald-500 transition-colors"></div>
                  <span className="text-xs font-medium text-slate-700">Pemeriksaan ambing sore</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">16:00</span>
              </label>
            </div>
            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat semua tugas →</button>
          </div>
          
          {/* Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Jadwal Mendatang
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                <span className="text-sm font-black text-slate-900 leading-none">20</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Mei</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 mb-0.5">IB untuk sapi #1012</p>
                <p className="text-[10px] text-slate-500 font-medium">Estimasi birahi: 20 Mei 2026</p>
              </div>
            </div>
            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat kalender →</button>
          </div>
        </div>

      </div>

    </div>
  );
}