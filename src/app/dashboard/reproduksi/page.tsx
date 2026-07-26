"use client";

import Image from "next/image";

export default function ReproduksiPage() {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Reproduksi</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Pantau siklus reproduksi dan tingkat kebuntingan sapi Anda.</p>
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

      {/* 2. TABS NAVIGATION */}
      <div className="border-b border-slate-200 mb-6 flex overflow-x-auto no-scrollbar">
        {["Ringkasan", "Deteksi Birahi", "IB & Kebuntingan", "Riwayat Reproduksi", "Analisis"].map((tab, idx) => (
          <button 
            key={idx} 
            className={`whitespace-nowrap pb-4 px-4 text-sm font-bold transition-colors ${
              idx === 0 
                ? "text-emerald-600 border-b-2 border-emerald-500" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Sapi Birahi</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">8 <span className="text-sm font-semibold text-slate-400">ekor</span></p>
            <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700 mt-0.5">Lihat detail →</button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Perlu IB</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">5 <span className="text-sm font-semibold text-slate-400">ekor</span></p>
            <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700 mt-0.5">Lihat detail →</button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Bunting</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">27 <span className="text-sm font-semibold text-slate-400">ekor</span></p>
            <p className="text-[10px] font-medium text-slate-400 mt-0.5">28.4% dari total sapi</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Mendekati Beranak</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">6 <span className="text-sm font-semibold text-slate-400">ekor</span></p>
            <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700 mt-0.5">Lihat detail →</button>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 mb-0.5">Repeat Breeder</p>
            <p className="text-2xl font-black text-red-600 tracking-tight">4 <span className="text-sm font-semibold text-red-400">ekor</span></p>
            <p className="text-[10px] font-bold text-red-500 mt-0.5">Perlu perhatian</p>
          </div>
        </div>

      </div>

      {/* 4. MIDDLE SECTION (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
        
        {/* Kolom Kiri: Sapi Perlu Perhatian */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Sapi Perlu Perhatian</h3>
          <div className="space-y-3 flex-1">
            {/* Sapi 1 */}
            <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                <Image src="/image/Logo AiMoo.png" alt="Cow" width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-0.5">
                  <p className="text-xs font-bold text-slate-900">#1021 - Mona</p>
                  <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[9px] font-bold rounded">Repeat Breeder</span>
                </div>
                <p className="text-[10px] text-slate-500">IB terakhir: 25 Apr 2026 (Hari ke-23)</p>
                <p className="text-[10px] text-slate-500">Siklus: 3x</p>
              </div>
              <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
            {/* Sapi 2 */}
            <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                <Image src="/image/Logo AiMoo.png" alt="Cow" width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-0.5">
                  <p className="text-xs font-bold text-slate-900">#1007 - Lela</p>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold rounded">Belum Bunting</span>
                </div>
                <p className="text-[10px] text-slate-500">IB terakhir: 10 Apr 2026 (Hari ke-38)</p>
                <p className="text-[10px] text-slate-500">Siklus: 2x</p>
              </div>
              <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
            {/* Sapi 3 */}
            <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                <Image src="/image/Logo AiMoo.png" alt="Cow" width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-0.5">
                  <p className="text-xs font-bold text-slate-900">#1045 - Sinta</p>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded">Perlu IB</span>
                </div>
                <p className="text-[10px] text-slate-500">Birahi terakhir: 16 Mei 2026 (Hari ke-2)</p>
              </div>
              <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat semua sapi perlu perhatian →</button>
        </div>

        {/* Kolom Tengah: Kalender Reproduksi (Custom CSS Grid) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Kalender Reproduksi</h3>
          
          <div className="flex justify-between items-center mb-4">
            <button className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-xs font-bold text-slate-800">Mei 2026</span>
            <button className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button className="ml-auto text-[10px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50">Hari ini</button>
          </div>

          <div className="grid grid-cols-7 text-center mb-2">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(day => (
              <span key={day} className="text-[10px] font-bold text-slate-400">{day}</span>
            ))}
          </div>

          {/* Kalender Grid Murni (Tampilan presisi) */}
          <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-semibold text-slate-700 flex-1 content-start">
            {/* Minggu 1 (Kosong & Tanggal 1-4) */}
            <div className="p-2 text-slate-300">28</div><div className="p-2 text-slate-300">29</div><div className="p-2 text-slate-300">30</div>
            <div className="p-2">1</div><div className="p-2">2</div><div className="p-2">3</div><div className="p-2">4</div>
            
            {/* Minggu 2 */}
            <div className="p-2 relative">5<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-400"></span></div>
            <div className="p-2 relative">6<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600"></span></div>
            <div className="p-2">7</div>
            <div className="p-2 relative">8<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400"></span></div>
            <div className="p-2 relative">9<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400"></span></div>
            <div className="p-2 relative">10<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400"></span></div>
            <div className="p-2">11</div>
            
            {/* Minggu 3 */}
            <div className="p-2 relative">12<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400"></span></div>
            <div className="p-2">13</div>
            <div className="p-2 relative">14<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"></span></div>
            <div className="p-2">15</div>
            <div className="p-2 relative"><span className="absolute inset-0 m-1 rounded-full bg-emerald-500 text-white flex items-center justify-center">16</span></div>
            <div className="p-2">17</div>
            <div className="p-2 relative text-red-500">18<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500"></span></div>
            
            {/* Minggu 4 & 5 */}
            <div className="p-2">19</div><div className="p-2">20</div><div className="p-2">21</div><div className="p-2">22</div><div className="p-2">23</div><div className="p-2">24</div><div className="p-2">25</div>
            <div className="p-2">26</div><div className="p-2">27</div><div className="p-2">28</div><div className="p-2">29</div><div className="p-2">30</div><div className="p-2">31</div><div className="p-2 text-slate-300">1</div>
          </div>

          {/* Legend Kalender */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 text-[9px] font-bold text-slate-500 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Birahi</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Perlu IB</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400"></span> IB Terjadwal</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Periksa Kebuntingan</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Perkiraan Beranak</div>
          </div>
        </div>

        {/* Kolom Kanan: AI Insight */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-emerald-500 text-lg">🤖</span> AI Insight Reproduksi
          </h3>
          
          <div className="mb-5">
            <h4 className="text-xs font-bold text-slate-800 mb-2">Insight Hari Ini</h4>
            <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
              5 sapi terdeteksi akan birahi dalam 24-48 jam ke depan.<br/>
              Tingkat kebuntingan saat ini <b className="text-slate-900">28.4%</b>, masih di bawah target ideal (35%).
            </p>
          </div>

          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-800 mb-3">Rekomendasi AI</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-[11px] font-medium text-slate-700 leading-relaxed">Fokus IB pada 5 sapi yang terdeteksi birahi untuk meningkatkan peluang kebuntingan.</p>
              </div>
              <div className="flex items-start gap-3 p-3">
                <svg className="w-5 h-5 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                <p className="text-[11px] font-medium text-slate-700 leading-relaxed">Evaluasi pakan dan manajemen pada sapi repeat breeder.</p>
              </div>
              <div className="flex items-start gap-3 p-3">
                <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-[11px] font-medium text-slate-700 leading-relaxed">Jadwalkan pemeriksaan kebuntingan untuk 7 sapi dalam minggu ini.</p>
              </div>
            </div>
          </div>
          
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat semua rekomendasi →</button>
        </div>

      </div>

      {/* 5. BOTTOM SECTION (2 Columns) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
        
        {/* Table: Aktivitas Reproduksi Terbaru */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Aktivitas Reproduksi Terbaru</h3>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Tanggal</th>
                  <th className="pb-3 font-semibold">ID Sapi</th>
                  <th className="pb-3 font-semibold">Aktivitas</th>
                  <th className="pb-3 font-semibold">Detail</th>
                  <th className="pb-3 font-semibold">Oleh</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-3">18 Mei 2026 07:30</td>
                  <td className="py-3 font-semibold">#1021 - Mona</td>
                  <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded font-bold text-[9px]">Birahi</span></td>
                  <td className="py-3">Skor birahi: 85 (Tinggi)</td>
                  <td className="py-3">Siti</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3">17 Mei 2026 09:15</td>
                  <td className="py-3 font-semibold">#1003 - Caca</td>
                  <td className="py-3"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded font-bold text-[9px]">IB</span></td>
                  <td className="py-3">IB ke-1, Semen ABS 1234</td>
                  <td className="py-3">Andi</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3">16 Mei 2026 10:45</td>
                  <td className="py-3 font-semibold">#1005 - Rara</td>
                  <td className="py-3"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-bold text-[9px]">PKB</span></td>
                  <td className="py-3">Positif bunting (± 32 hari)</td>
                  <td className="py-3">Dr. Budi</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3">15 Mei 2026 08:20</td>
                  <td className="py-3 font-semibold">#1012 - Dinda</td>
                  <td className="py-3"><span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-bold text-[9px]">Cek Bunting</span></td>
                  <td className="py-3">Negatif bunting</td>
                  <td className="py-3">Dr. Budi</td>
                </tr>
                <tr>
                  <td className="py-3">14 Mei 2026 07:10</td>
                  <td className="py-3 font-semibold">#1040 - Puspa</td>
                  <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded font-bold text-[9px]">Birahi</span></td>
                  <td className="py-3">Skor birahi: 78 (Tinggi)</td>
                  <td className="py-3">Siti</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat semua riwayat reproduksi →</button>
        </div>

        {/* List: Sapi Mendekati Beranak */}
        <div className="xl:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Sapi Mendekati Beranak</h3>
          <div className="space-y-4 flex-1">
            {/* Item 1 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                <Image src="/image/Logo AiMoo.png" alt="Cow" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">#1008 - Bunga</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Perkiraan: 28 Mei 2026</p>
              </div>
              <span className="px-2 py-1 bg-red-50 text-red-600 text-[9px] font-bold rounded">10 hari lagi</span>
            </div>
            {/* Item 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                <Image src="/image/Logo AiMoo.png" alt="Cow" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">#1030 - Melati</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Perkiraan: 30 Mei 2026</p>
              </div>
              <span className="px-2 py-1 bg-red-50 text-red-600 text-[9px] font-bold rounded">12 hari lagi</span>
            </div>
            {/* Item 3 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                <Image src="/image/Logo AiMoo.png" alt="Cow" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">#1015 - Cindy</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Perkiraan: 2 Jun 2026</p>
              </div>
              <span className="px-2 py-1 bg-red-50 text-red-600 text-[9px] font-bold rounded">15 hari lagi</span>
            </div>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-6 text-left">Lihat semua →</button>
        </div>

      </div>

    </div>
  );
}