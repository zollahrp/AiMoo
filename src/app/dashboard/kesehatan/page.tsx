"use client";

import Image from "next/image";

export default function KesehatanPage() {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Kesehatan</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Pantau kondisi kesehatan sapi dan deteksi dini potensi penyakit.</p>
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
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v4m0 0H9m3 0h3" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 mb-0.5">Sapi Risiko Tinggi</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">5 <span className="text-sm font-semibold text-slate-400">ekor</span></p>
            <p className="text-[10px] font-bold text-red-500 mt-0.5">Perlu penanganan segera →</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Sapi Risiko Sedang</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">12 <span className="text-sm font-semibold text-slate-400">ekor</span></p>
            <p className="text-[10px] font-bold text-amber-500 mt-0.5">Perlu perhatian →</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Sapi Sehat</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">78 <span className="text-sm font-semibold text-slate-400">ekor</span></p>
            <p className="text-[10px] font-bold text-green-500 mt-0.5">Kondisi baik</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Kasus Baru <span className="font-medium">(7 hari)</span></p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">3 <span className="text-sm font-semibold text-slate-400">kasus</span></p>
            <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700 mt-0.5">Lihat detail →</button>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 mb-0.5">Tindakan Hari Ini</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">6 <span className="text-sm font-semibold text-slate-400">tindakan</span></p>
            <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700 mt-0.5">Jadwal treatment →</button>
          </div>
        </div>

      </div>

      {/* 3. MIDDLE SECTION (Donut, Line Chart, AI Insight) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-stretch">
        
        {/* Left: Distribusi Kondisi */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
           <h3 className="text-sm font-bold text-slate-900 mb-6">Distribusi Kondisi Kesehatan</h3>
           <div className="flex flex-col items-center justify-center flex-1 mb-6">
             {/* CSS Donut Chart */}
             <div className="relative w-36 h-36 shrink-0 rounded-full flex items-center justify-center mb-6" 
                  style={{ background: 'conic-gradient(#ef4444 0% 5.3%, #f59e0b 5.3% 17.9%, #22c55e 17.9% 100%)' }}>
                <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                  <span className="text-3xl font-black text-slate-900 leading-none">95</span>
                  <span className="text-[10px] font-semibold text-slate-500 mt-1">Total Sapi</span>
                </div>
             </div>
             
             {/* Legend */}
             <div className="w-full space-y-3">
               <div className="flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="font-semibold text-slate-700">Risiko Tinggi</span></div>
                 <span className="text-slate-500 font-medium">5 (5.3%)</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="font-semibold text-slate-700">Risiko Sedang</span></div>
                 <span className="text-slate-500 font-medium">12 (12.6%)</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span><span className="font-semibold text-slate-700">Sehat</span></div>
                 <span className="text-slate-500 font-medium">78 (82.1%)</span>
               </div>
             </div>
           </div>
           <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-500">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             Periode: 18 Mei 2026
           </div>
        </div>

        {/* Center: Line Chart Tren Kasus */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900">Tren Kasus Kesehatan (30 Hari Terakhir)</h3>
            <select className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg outline-none cursor-pointer">
              <option>30 Hari Terakhir</option>
              <option>7 Hari Terakhir</option>
            </select>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-[10px] font-bold text-slate-600">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Mastitis</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Demam</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Gangguan Pencernaan</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Lainnya</div>
          </div>
          
          {/* Custom SVG Line Chart */}
          <div className="flex-1 relative min-h-[200px]">
             {/* Y-Axis labels */}
             <div className="absolute left-0 top-0 bottom-6 w-6 flex flex-col justify-between text-[10px] font-medium text-slate-400">
               <span>12</span><span>9</span><span>6</span><span>3</span><span>0</span>
             </div>
             {/* X-Axis labels */}
             <div className="absolute left-8 right-0 bottom-0 flex justify-between text-[10px] font-medium text-slate-400">
               <span>19 Apr</span><span>26 Apr</span><span>3 Mei</span><span>10 Mei</span><span>18 Mei</span>
             </div>
             {/* SVG Container */}
             <div className="absolute left-8 right-2 top-2 bottom-8">
               {/* Grid lines */}
               <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-100">
                 <div className="w-full border-t border-slate-100/60 h-0"></div>
                 <div className="w-full border-t border-slate-100/60 h-0"></div>
                 <div className="w-full border-t border-slate-100/60 h-0"></div>
                 <div className="w-full border-t border-slate-100/60 h-0"></div>
                 <div className="w-full h-0"></div>
               </div>
               
               <svg viewBox="0 0 500 150" className="absolute inset-0 w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
                 {/* Green Line (Lainnya) */}
                 <polyline points="0,120 45,120 90,100 135,120 180,120 225,120 270,100 315,120 360,100 405,120 450,120 500,120" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                 {/* Yellow Line (Pencernaan) */}
                 <polyline points="0,110 45,110 90,130 135,100 180,120 225,130 270,110 315,130 360,110 405,110 450,110 500,120" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                 {/* Blue Line (Demam) */}
                 <polyline points="0,130 45,110 90,140 135,130 180,140 225,120 270,140 315,130 360,140 405,130 450,140 500,140" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                 {/* Red Line (Mastitis) - Top */}
                 <polyline points="0,60 45,70 90,100 135,60 180,80 225,90 270,50 315,20 360,80 405,60 450,70 500,80" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                 
                 {/* Dots for Red Line (Example) */}
                 <circle cx="0" cy="60" r="3" fill="#ef4444" stroke="white" strokeWidth="1" />
                 <circle cx="45" cy="70" r="3" fill="#ef4444" stroke="white" strokeWidth="1" />
                 <circle cx="90" cy="100" r="3" fill="#ef4444" stroke="white" strokeWidth="1" />
                 <circle cx="135" cy="60" r="3" fill="#ef4444" stroke="white" strokeWidth="1" />
                 <circle cx="180" cy="80" r="3" fill="#ef4444" stroke="white" strokeWidth="1" />
                 <circle cx="225" cy="90" r="3" fill="#ef4444" stroke="white" strokeWidth="1" />
                 <circle cx="270" cy="50" r="3" fill="#ef4444" stroke="white" strokeWidth="1" />
                 <circle cx="315" cy="20" r="3" fill="#ef4444" stroke="white" strokeWidth="1" />
                 <circle cx="360" cy="80" r="3" fill="#ef4444" stroke="white" strokeWidth="1" />
                 <circle cx="405" cy="60" r="3" fill="#ef4444" stroke="white" strokeWidth="1" />
                 <circle cx="450" cy="70" r="3" fill="#ef4444" stroke="white" strokeWidth="1" />
                 <circle cx="500" cy="80" r="3" fill="#ef4444" stroke="white" strokeWidth="1" />

                 {/* Dots for Blue Line (Example) */}
                 <circle cx="45" cy="110" r="3" fill="#3b82f6" stroke="white" strokeWidth="1" />
                 <circle cx="225" cy="120" r="3" fill="#3b82f6" stroke="white" strokeWidth="1" />
                 <circle cx="405" cy="130" r="3" fill="#3b82f6" stroke="white" strokeWidth="1" />
               </svg>
             </div>
          </div>
        </div>

        {/* Right: AI Insight */}
        <div className="lg:col-span-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2 relative z-10">
            <span className="text-emerald-500 text-lg">🤖</span> AI Insight Kesehatan
          </h3>
          
          <div className="mb-5 relative z-10">
            <h4 className="text-xs font-bold text-slate-800 mb-2">Insight Hari Ini</h4>
            <div className="bg-white/60 p-3 rounded-xl border border-emerald-100/50">
              <p className="text-[11px] font-medium text-slate-700 leading-relaxed">
                <b className="text-slate-900">3 sapi terdeteksi memiliki risiko mastitis</b> berdasarkan penurunan produksi dan perubahan suhu tubuh.
              </p>
            </div>
          </div>

          <div className="flex-1 relative z-10">
            <h4 className="text-xs font-bold text-slate-800 mb-3">Rekomendasi</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-white p-1.5 rounded shadow-sm border border-slate-100 shrink-0">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <p className="text-[11px] font-medium text-slate-700 leading-relaxed">Periksa sapi #1015, #1030, #1042 untuk mastitis. Segera lakukan uji CMT.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white p-1.5 rounded shadow-sm border border-slate-100 shrink-0">
                  <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <p className="text-[11px] font-medium text-slate-700 leading-relaxed">Waspadai heat stress. Suhu lingkungan tinggi (29°C). Pastikan ventilasi dan air minum cukup.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white p-1.5 rounded shadow-sm border border-slate-100 shrink-0">
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <p className="text-[11px] font-medium text-slate-700 leading-relaxed">Jadwal vaksinasi 2 sapi dalam 3 hari ke depan.</p>
              </div>
            </div>
          </div>
          
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-6 text-left relative z-10">Lihat semua rekomendasi →</button>
        </div>

      </div>

      {/* 4. BOTTOM SECTION (Tables & Checklist) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Table 1: Sapi Risiko Tinggi */}
        <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Sapi Risiko Tinggi <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-[10px] flex items-center justify-center">5</span>
            </h3>
            <button className="text-[10px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">ID Sapi</th>
                  <th className="pb-3 font-semibold">Nama</th>
                  <th className="pb-3 font-semibold">Masalah Utama</th>
                  <th className="pb-3 font-semibold text-center">Skor Risiko</th>
                  <th className="pb-3 font-semibold">Tindakan Disarankan</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-3 font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded overflow-hidden bg-slate-100 shrink-0"><Image src="/image/Logo AiMoo.png" alt="Cow" width={24} height={24} className="object-cover w-full h-full"/></div>
                      #1015
                    </div>
                  </td>
                  <td className="py-3">Cindy</td>
                  <td className="py-3"><p className="font-bold text-slate-900">Mastitis</p><p className="text-[9px] text-slate-500">Produksi turun, CMT (+)</p></td>
                  <td className="py-3 text-center"><span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">85 Tinggi</span></td>
                  <td className="py-3 text-[10px] whitespace-normal min-w-[120px]">Periksa ambing & berikan treatment</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded overflow-hidden bg-slate-100 shrink-0"><Image src="/image/Logo AiMoo.png" alt="Cow" width={24} height={24} className="object-cover w-full h-full"/></div>
                      #1030
                    </div>
                  </td>
                  <td className="py-3">Melati</td>
                  <td className="py-3"><p className="font-bold text-slate-900">Demam</p><p className="text-[9px] text-slate-500">Suhu 40.1°C</p></td>
                  <td className="py-3 text-center"><span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">80 Tinggi</span></td>
                  <td className="py-3 text-[10px] whitespace-normal min-w-[120px]">Cek suhu & berikan anti inflamasi</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded overflow-hidden bg-slate-100 shrink-0"><Image src="/image/Logo AiMoo.png" alt="Cow" width={24} height={24} className="object-cover w-full h-full"/></div>
                      #1042
                    </div>
                  </td>
                  <td className="py-3">Rosa</td>
                  <td className="py-3"><p className="font-bold text-slate-900">Mastitis</p><p className="text-[9px] text-slate-500">Perubahan susu</p></td>
                  <td className="py-3 text-center"><span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">78 Tinggi</span></td>
                  <td className="py-3 text-[10px] whitespace-normal min-w-[120px]">Uji mastitis & obat intramammary</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded overflow-hidden bg-slate-100 shrink-0"><Image src="/image/Logo AiMoo.png" alt="Cow" width={24} height={24} className="object-cover w-full h-full"/></div>
                      #1008
                    </div>
                  </td>
                  <td className="py-3">Bunga</td>
                  <td className="py-3"><p className="font-bold text-slate-900">Nafsu Makan Turun</p><p className="text-[9px] text-slate-500">Konsumsi pakan ↓</p></td>
                  <td className="py-3 text-center"><span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">70 Tinggi</span></td>
                  <td className="py-3 text-[10px] whitespace-normal min-w-[120px]">Observasi & evaluasi pakan</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded overflow-hidden bg-slate-100 shrink-0"><Image src="/image/Logo AiMoo.png" alt="Cow" width={24} height={24} className="object-cover w-full h-full"/></div>
                      #1012
                    </div>
                  </td>
                  <td className="py-3">Dinda</td>
                  <td className="py-3"><p className="font-bold text-slate-900">Gangguan Pencernaan</p><p className="text-[9px] text-slate-500">Feses encer</p></td>
                  <td className="py-3 text-center"><span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">65 Tinggi</span></td>
                  <td className="py-3 text-[10px] whitespace-normal min-w-[120px]">Berikan probiotik & monitor</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat semua sapi risiko tinggi →</button>
        </div>

        {/* Table 2: Riwayat Kasus Terbaru */}
        <div className="xl:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900">Riwayat Kasus Terbaru</h3>
            <button className="text-[10px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Tanggal</th>
                  <th className="pb-3 font-semibold">ID Sapi</th>
                  <th className="pb-3 font-semibold">Kasus</th>
                  <th className="pb-3 font-semibold">Tindakan</th>
                  <th className="pb-3 font-semibold">Oleh</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-3">18 Mei 2026</td>
                  <td className="py-3 font-semibold">#1007</td>
                  <td className="py-3">Mastitis</td>
                  <td className="py-3">Infus & Antibiotik</td>
                  <td className="py-3">Dr. Budi</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3">17 Mei 2026</td>
                  <td className="py-3 font-semibold">#1033</td>
                  <td className="py-3">Demam</td>
                  <td className="py-3">Antiinflamasi</td>
                  <td className="py-3">Dr. Budi</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3">16 Mei 2026</td>
                  <td className="py-3 font-semibold">#1011</td>
                  <td className="py-3">Luka</td>
                  <td className="py-3">Desinfeksi Luka</td>
                  <td className="py-3">Siti</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3">15 Mei 2026</td>
                  <td className="py-3 font-semibold">#1045</td>
                  <td className="py-3">Kembung</td>
                  <td className="py-3">Drenching</td>
                  <td className="py-3">Andi</td>
                </tr>
                <tr>
                  <td className="py-3">14 Mei 2026</td>
                  <td className="py-3 font-semibold">#1022</td>
                  <td className="py-3">Diare</td>
                  <td className="py-3">Probiotik</td>
                  <td className="py-3">Siti</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat semua riwayat kasus →</button>
        </div>

        {/* Right Col: Warnings & Checklist */}
        <div className="xl:col-span-3 flex flex-col gap-6 items-stretch">
          
          {/* Peringatan Kesehatan */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-bold text-slate-900">Peringatan Kesehatan</h3>
              <button className="text-[10px] font-bold text-slate-500 hover:text-slate-800">Lihat Semua</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">🌡️</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-slate-900">Suhu lingkungan tinggi (29°C)</p>
                    <span className="text-[9px] font-semibold text-slate-400">08:30</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Risiko heat stress meningkat.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">📉</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-slate-900">5 sapi terdeteksi produksi turun &gt; 15%</p>
                    <span className="text-[9px] font-semibold text-slate-400">07:45</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Dibandingkan rata-rata 3 hari terakhir.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-slate-900">Jadwal pemeriksaan kebuntingan</p>
                    <span className="text-[9px] font-semibold text-slate-400">07:20</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">7 sapi due date dalam 7 hari ke depan.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist Kesehatan Harian */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Checklist Kesehatan Harian</h3>
              <button className="text-[10px] font-bold text-slate-500 hover:text-slate-800">Lihat Semua</button>
            </div>
            
            <div className="flex justify-between items-end mb-2">
              <p className="text-xs font-bold text-slate-700">Checklist Hari ini</p>
              <p className="text-xs font-bold text-slate-500">4 / 6 selesai</p>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '66%' }}></div>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px] font-semibold text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border-none bg-emerald-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                Pemeriksaan suhu tubuh
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border-none bg-emerald-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                Kebersihan kandang
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border-none bg-emerald-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                Pemeriksaan nafsu makan
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border-none bg-emerald-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                Kualitas air minum
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center group-hover:border-emerald-500 transition-colors"></div>
                Pemeriksaan ambing (CMT)
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center group-hover:border-emerald-500 transition-colors"></div>
                Pemeriksaan feses
              </label>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}