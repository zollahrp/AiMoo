"use client";

import Image from "next/image";

export default function VaksinasiObatPage() {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Vaksinasi & Obat</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola jadwal vaksinasi, pemberian obat, dan riwayat pengobatan sapi.</p>
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
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
             {/* Syringe Icon */}
             <svg className="w-6 h-6 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-6 6" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Jadwal Vaksinasi Mendatang</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">5 <span className="text-sm font-semibold text-slate-400">sapi</span></p>
            <p className="text-[10px] font-medium text-slate-500 mt-0.5">Dalam 7 hari ke depan</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
             {/* Medicine Bottle Icon */}
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v4m-2-2h4" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Jadwal Obat Mendatang</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">7 <span className="text-sm font-semibold text-slate-400">sapi</span></p>
            <p className="text-[10px] font-medium text-slate-500 mt-0.5">Dalam 7 hari ke depan</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Selesai Tepat Waktu</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">92%</p>
            <p className="text-[10px] font-medium text-slate-500 mt-0.5">Vaksinasi bulan ini</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-800 mb-0.5">Perlu Perhatian</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">3 <span className="text-sm font-semibold text-slate-400">sapi</span></p>
            <p className="text-[10px] font-bold text-amber-500 mt-0.5">Terlambat / hampir jadwal</p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Obat Stok Rendah</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">4 <span className="text-sm font-semibold text-slate-400">jenis</span></p>
            <p className="text-[10px] font-medium text-slate-500 mt-0.5">Perlu restock</p>
          </div>
        </div>

      </div>

      {/* 3. MIDDLE SECTION (List, Calendar, Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
        
        {/* Kolom Kiri: Jadwal Vaksinasi Mendatang */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Jadwal Vaksinasi Mendatang</h3>
          <div className="space-y-4 flex-1">
            {/* Item 1 */}
            <div className="flex items-center gap-3 bg-white hover:bg-slate-50 transition-colors group cursor-pointer border-b border-slate-50 pb-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                <Image src="/image/Logo AiMoo.png" alt="Cow" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">#1012 - Dinda</p>
                <p className="text-[10px] text-slate-500">IBR (Infectious Bovine Rhinotracheitis)</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-emerald-600">20 Mei 2026</p>
                <p className="text-[9px] font-bold text-emerald-500">2 hari lagi</p>
              </div>
            </div>
            {/* Item 2 */}
            <div className="flex items-center gap-3 bg-white hover:bg-slate-50 transition-colors group cursor-pointer border-b border-slate-50 pb-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                <Image src="/image/Logo AiMoo.png" alt="Cow" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">#1030 - Melati</p>
                <p className="text-[10px] text-slate-500">BVD (Bovine Viral Diarrhea)</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-emerald-600">21 Mei 2026</p>
                <p className="text-[9px] font-bold text-emerald-500">3 hari lagi</p>
              </div>
            </div>
            {/* Item 3 */}
            <div className="flex items-center gap-3 bg-white hover:bg-slate-50 transition-colors group cursor-pointer border-b border-slate-50 pb-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                <Image src="/image/Logo AiMoo.png" alt="Cow" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">#1008 - Bunga</p>
                <p className="text-[10px] text-slate-500">Leptospirosis</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-emerald-600">22 Mei 2026</p>
                <p className="text-[9px] font-bold text-emerald-500">4 hari lagi</p>
              </div>
            </div>
            {/* Item 4 */}
            <div className="flex items-center gap-3 bg-white hover:bg-slate-50 transition-colors group cursor-pointer border-b border-slate-50 pb-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                <Image src="/image/Logo AiMoo.png" alt="Cow" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">#1042 - Rosa</p>
                <p className="text-[10px] text-slate-500">BVD (Bovine Viral Diarrhea)</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-emerald-600">23 Mei 2026</p>
                <p className="text-[9px] font-bold text-emerald-500">5 hari lagi</p>
              </div>
            </div>
            {/* Item 5 */}
            <div className="flex items-center gap-3 bg-white hover:bg-slate-50 transition-colors group cursor-pointer">
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                <Image src="/image/Logo AiMoo.png" alt="Cow" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">#1005 - Rara</p>
                <p className="text-[10px] text-slate-500">IBR (Infectious Bovine Rhinotracheitis)</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-emerald-600">24 Mei 2026</p>
                <p className="text-[9px] font-bold text-emerald-500">6 hari lagi</p>
              </div>
            </div>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat semua jadwal vaksinasi →</button>
        </div>

        {/* Kolom Tengah: Kalender Vaksinasi (Custom CSS Grid) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Kalender Vaksinasi & Treatment</h3>
          
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

          <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-semibold text-slate-700 flex-1 content-start">
            {/* Minggu 1 */}
            <div className="p-2 text-slate-300">28</div><div className="p-2 text-slate-300">29</div><div className="p-2 text-slate-300">30</div>
            <div className="p-2">1</div><div className="p-2">2</div><div className="p-2">3</div><div className="p-2">4</div>
            
            {/* Minggu 2 */}
            <div className="p-2">5</div><div className="p-2">6</div><div className="p-2">7</div><div className="p-2">8</div><div className="p-2">9</div><div className="p-2">10</div><div className="p-2">11</div>
            
            {/* Minggu 3 */}
            <div className="p-2">12</div><div className="p-2">13</div><div className="p-2">14</div><div className="p-2">15</div><div className="p-2">16</div><div className="p-2">17</div>
            <div className="p-2 relative"><span className="absolute inset-0 m-1 rounded-full bg-emerald-500 text-white flex items-center justify-center">18</span></div>
            
            {/* Minggu 4 & 5 with dots */}
            <div className="p-2">19</div>
            <div className="p-2 relative">20<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"></span></div>
            <div className="p-2 relative">21<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-500"></span></div>
            <div className="p-2 relative">22<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500"></span></div>
            <div className="p-2">23</div>
            <div className="p-2 relative">24<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"></span></div>
            <div className="p-2 relative">25<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500"></span></div>
            
            <div className="p-2">26</div><div className="p-2">27</div><div className="p-2">28</div><div className="p-2">29</div><div className="p-2">30</div><div className="p-2">31</div><div className="p-2 text-slate-300">1</div>
          </div>

          {/* Legend Kalender */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 text-[9px] font-bold text-slate-500 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Vaksinasi</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Obat / Treatment</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Check-up</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Lewat Jadwal</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Pengambilan Susu (Withdrawal)</div>
          </div>
        </div>

        {/* Kolom Kanan: Pengingat & Peringatan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="text-amber-500 text-lg">🔔</span> Pengingat & Peringatan
          </h3>
          
          <div className="space-y-4 flex-1">
            {/* Alert 1 */}
            <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-4 flex gap-3">
              <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <p className="text-[11px] font-medium text-slate-800 leading-relaxed mb-1">3 sapi akan jatuh tempo vaksinasi dalam 3 hari.</p>
                <button className="text-[10px] font-bold text-amber-700 hover:text-amber-800">Lihat jadwal vaksinasi →</button>
              </div>
            </div>
            
            {/* Alert 2 */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 flex gap-3">
              <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <p className="text-[11px] font-medium text-slate-800 leading-relaxed mb-1">2 sapi masih dalam masa withdrawal obat.</p>
                <button className="text-[10px] font-bold text-blue-700 hover:text-blue-800">Lihat detail withdrawal →</button>
              </div>
            </div>
            
            {/* Alert 3 */}
            <div className="bg-red-50/70 border border-red-100 rounded-xl p-4 flex gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <div>
                <p className="text-[11px] font-medium text-slate-800 leading-relaxed mb-1">1 sapi terlambat vaksinasi (BVD). Segera tindakan →</p>
                <button className="text-[10px] font-bold text-red-700 hover:text-red-800">Segera tindakan →</button>
              </div>
            </div>

            {/* Alert 4 */}
            <div className="bg-green-50/70 border border-green-100 rounded-xl p-4 flex gap-3">
              <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <p className="text-[11px] font-medium text-slate-800 leading-relaxed mb-1">Stok obat "Oxytetracycline" hampir habis (tersisa 2 vial).</p>
                <button className="text-[10px] font-bold text-green-700 hover:text-green-800">Kelola stok obat →</button>
              </div>
            </div>
          </div>
          
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat semua pengingat →</button>
        </div>

      </div>

      {/* 4. BOTTOM SECTION (2 Tables + AI) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Riwayat Treatment */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900">Riwayat Treatment / Pengobatan</h3>
            <button className="text-[10px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Tanggal</th>
                  <th className="pb-3 font-semibold">ID Sapi</th>
                  <th className="pb-3 font-semibold">Masalah / Diagnosis</th>
                  <th className="pb-3 font-semibold">Obat / Treatment</th>
                  <th className="pb-3 font-semibold">Dosis</th>
                  <th className="pb-3 font-semibold">Oleh</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-3">17 Mei 2026 08:30</td>
                  <td className="py-3 font-semibold">#1030 - Melati</td>
                  <td className="py-3">Demam</td>
                  <td className="py-3 font-medium">Flunixin Meglumine</td>
                  <td className="py-3">10 ml</td>
                  <td className="py-3">Dr. Budi</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3">16 Mei 2026 07:15</td>
                  <td className="py-3 font-semibold">#1015 - Cindy</td>
                  <td className="py-3">Mastitis</td>
                  <td className="py-3 font-medium">Ceftiofur</td>
                  <td className="py-3">5 ml</td>
                  <td className="py-3">Siti</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3">15 Mei 2026 18:00</td>
                  <td className="py-3 font-semibold">#1042 - Rosa</td>
                  <td className="py-3">Diare</td>
                  <td className="py-3 font-medium">Oralit + Antidiare</td>
                  <td className="py-3">1 pack</td>
                  <td className="py-3">Andi</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3">14 Mei 2026 09:20</td>
                  <td className="py-3 font-semibold">#1007 - Leli</td>
                  <td className="py-3">Cacingan</td>
                  <td className="py-3 font-medium">Albendazole</td>
                  <td className="py-3">20 ml</td>
                  <td className="py-3">Dr. Budi</td>
                </tr>
                <tr>
                  <td className="py-3">13 Mei 2026 06:45</td>
                  <td className="py-3 font-semibold">#1005 - Rara</td>
                  <td className="py-3">Luka Kaki</td>
                  <td className="py-3 font-medium">Povidone Iodine</td>
                  <td className="py-3">Secukupnya</td>
                  <td className="py-3">Siti</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat semua riwayat pengobatan →</button>
        </div>

        {/* Stok Obat */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900">Stok Obat</h3>
            <button className="text-[10px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50">Kelola Stok</button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Nama Obat</th>
                  <th className="pb-3 font-semibold text-center">Satuan</th>
                  <th className="pb-3 font-semibold text-center">Stok</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-3 flex items-center gap-2 font-bold text-slate-800"><span className="text-base">💊</span> Oxytetracycline</td>
                  <td className="py-3 text-center text-slate-500">Vial</td>
                  <td className="py-3 text-center font-medium">2</td>
                  <td className="py-3 text-center font-bold text-red-500">Rendah</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 flex items-center gap-2 font-bold text-slate-800"><span className="text-base">💉</span> Ceftiofur</td>
                  <td className="py-3 text-center text-slate-500">Vial</td>
                  <td className="py-3 text-center font-medium">5</td>
                  <td className="py-3 text-center font-bold text-amber-500">Sedang</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 flex items-center gap-2 font-bold text-slate-800"><span className="text-base">💊</span> Flunixin Meglumine</td>
                  <td className="py-3 text-center text-slate-500">Vial</td>
                  <td className="py-3 text-center font-medium">8</td>
                  <td className="py-3 text-center font-bold text-emerald-500">Aman</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-3 flex items-center gap-2 font-bold text-slate-800"><span className="text-base">🧪</span> Albendazole</td>
                  <td className="py-3 text-center text-slate-500">Botol</td>
                  <td className="py-3 text-center font-medium">3</td>
                  <td className="py-3 text-center font-bold text-amber-500">Sedang</td>
                </tr>
                <tr>
                  <td className="py-3 flex items-center gap-2 font-bold text-slate-800"><span className="text-base">🧫</span> Povidone Iodine</td>
                  <td className="py-3 text-center text-slate-500">Botol</td>
                  <td className="py-3 text-center font-medium">6</td>
                  <td className="py-3 text-center font-bold text-emerald-500">Aman</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat semua stok obat →</button>
        </div>

        {/* AI Insight */}
        <div className="lg:col-span-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
            <span className="text-emerald-500 text-lg">🤖</span> AI Insight
          </h3>
          
          <p className="text-[11px] font-medium text-slate-700 mb-6 leading-relaxed relative z-10 bg-white/60 p-3 rounded-xl border border-emerald-100/50">
            Kepatuhan vaksinasi bulan ini <b className="text-slate-900">92%</b>, meningkat 6% dibanding bulan lalu.
          </p>

          <div className="flex-1 relative z-10">
            <h4 className="text-xs font-bold text-slate-800 mb-3">Rekomendasi</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-white p-1.5 rounded shadow-sm border border-slate-100 shrink-0">
                  <svg className="w-4 h-4 text-purple-500 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-6 6" /></svg>
                </div>
                <p className="text-[11px] font-medium text-slate-700 leading-relaxed">Fokus pada 3 sapi yang terlambat vaksinasi untuk menjaga kekebalan kelompok.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white p-1.5 rounded shadow-sm border border-slate-100 shrink-0">
                  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-[11px] font-medium text-slate-700 leading-relaxed">Pastikan masa withdrawal selesai sebelum susu dipasarkan.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white p-1.5 rounded shadow-sm border border-slate-100 shrink-0">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                <p className="text-[11px] font-medium text-slate-700 leading-relaxed">Pertimbangkan penambahan stok obat Oxytetracycline minggu ini.</p>
              </div>
            </div>
          </div>
          
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-6 text-left relative z-10">Lihat semua insight →</button>
        </div>

      </div>

    </div>
  );
}