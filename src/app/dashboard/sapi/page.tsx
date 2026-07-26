"use client";

import Image from "next/image";
import Link from "next/link";

export default function SapiPage() {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      
      {/* 1. TOP NAV (Kembali & Search/Date) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-semibold text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Kembali
        </button>
        
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative group hidden sm:block">
            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Cari sapi..." className="w-56 pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" />
          </div>
          
          {/* Notif */}
          <button className="relative p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Date Picker */}
          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-sm font-bold text-slate-700">18 Mei 2026</span>
          </button>
        </div>
      </div>

      {/* 2. HEADER PROFILE & BUTTONS */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">#1047 – Lara</h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg border border-green-200">Aktif</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-1.5"><span className="text-slate-400">🐄</span> Holstein Friesian</div>
            <div className="flex items-center gap-1.5"><span className="text-slate-400">♀</span> Betina</div>
            <div className="flex items-center gap-1.5"><span className="text-slate-400">📅</span> 3 Tahun 2 Bulan</div>
            <div className="flex items-center gap-1.5"><span className="text-slate-400">⊕</span> Laktasi ke-2</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Edit Data
          </button>
          <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors shadow-md flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Catat Aktivitas
          </button>
        </div>
      </div>

      {/* 3. TABS NAVIGATION */}
      <div className="border-b border-slate-200 mb-6 flex overflow-x-auto no-scrollbar">
        {["Ringkasan", "Identitas", "Produksi", "Reproduksi", "Kesehatan", "Pakan", "Vaksinasi & Obat", "Riwayat"].map((tab, idx) => (
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

      {/* 4. ROW 1: PROFILE, AI SUMMARY, PERFORMA */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6 items-stretch">
        
        {/* Box A: Info Sapi */}
        <div className="xl:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6">
          {/* Gambar Sapi (Placeholder Unsplash) */}
          <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
            <Image 
              src="/image/Logo AiMoo.png"
              alt="Foto Sapi" 
              width={160} height={160} 
              className="w-full h-full object-cover" 
            />
          </div>
          {/* List Metadata */}
          <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
            <div className="text-slate-500 font-medium">ID Sapi</div>
            <div className="font-bold text-slate-900">1047</div>
            <div className="text-slate-500 font-medium">Nama</div>
            <div className="font-bold text-slate-900">Lara</div>
            <div className="text-slate-500 font-medium">Breed</div>
            <div className="font-bold text-slate-900">Holstein Friesian</div>
            <div className="text-slate-500 font-medium">Jenis Kelamin</div>
            <div className="font-bold text-slate-900">Betina</div>
            <div className="text-slate-500 font-medium">Tanggal Lahir</div>
            <div className="font-bold text-slate-900">10 Maret 2023</div>
            <div className="text-slate-500 font-medium">Umur</div>
            <div className="font-bold text-slate-900">3 Tahun 2 Bulan</div>
            <div className="text-slate-500 font-medium">Laktasi</div>
            <div className="font-bold text-slate-900">2</div>
            <div className="text-slate-500 font-medium">Status</div>
            <div className="font-bold text-emerald-600">Aktif</div>
            <div className="text-slate-500 font-medium">Kelompok</div>
            <div className="font-bold text-slate-900">Laktasi</div>
            <div className="text-slate-500 font-medium">Lokasi</div>
            <div className="font-bold text-slate-900">Kandang A - Baris 2</div>
          </div>
        </div>

        {/* Box B: AI Ringkasan */}
        <div className="xl:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-purple-500 text-lg">✨</span> AI Ringkasan Hari Ini
            </h3>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-200 flex items-center gap-1">
              ⚠️ Perlu Perhatian
            </span>
          </div>
          
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50 mb-4 flex-1">
            <p className="text-xs text-slate-700 leading-relaxed mb-3">
              Produksi susu turun 12% dalam 3 hari terakhir.<br/>Aktivitas makan menurun.
            </p>
            <p className="text-xs text-slate-800 leading-relaxed">
              <span className="font-bold">Kemungkinan:</span> Mastitis awal<br/>
              <span className="font-bold">Saran:</span> Lakukan pemeriksaan ambing dan monitor produksi.
            </p>
          </div>
          
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 text-left">
            Lihat Analisis Detail &gt;
          </button>
        </div>

        {/* Box C: Performa Hari Ini */}
        <div className="xl:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Performa Hari Ini</h3>
          <div className="space-y-4 flex-1">
            {/* Item 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <span className="w-6 h-6 rounded bg-blue-50 text-blue-500 flex items-center justify-center">🥛</span> Produksi Susu
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">18,6 L</span>
                <span className="text-[10px] font-bold text-red-500">↓ 12%</span>
              </div>
            </div>
            <div className="border-t border-slate-100"></div>
            {/* Item 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <span className="w-6 h-6 rounded bg-green-50 text-green-500 flex items-center justify-center">🌾</span> Konsumsi Pakan
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">20,2 kg</span>
                <span className="text-[10px] font-bold text-red-500">↓ 8%</span>
              </div>
            </div>
            <div className="border-t border-slate-100"></div>
            {/* Item 3 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <span className="w-6 h-6 rounded bg-indigo-50 text-indigo-500 flex items-center justify-center">📈</span> Aktivitas
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">72 menit</span>
                <span className="text-[10px] font-bold text-red-500">↓ 15%</span>
              </div>
            </div>
            <div className="border-t border-slate-100"></div>
            {/* Item 4 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <span className="w-6 h-6 rounded bg-blue-50 text-blue-500 flex items-center justify-center">🔄</span> Ruminasi
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">410 menit</span>
                <span className="text-[10px] font-bold text-emerald-500">↑ 5%</span>
              </div>
            </div>
            <div className="border-t border-slate-100"></div>
            {/* Item 5 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <span className="w-6 h-6 rounded bg-red-50 text-red-500 flex items-center justify-center">🌡️</span> Suhu Tubuh
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">38,7 °C</span>
                <span className="text-[10px] font-bold text-red-500">↑ 0,6°C</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 5. ROW 2: CHART & CATATAN */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
        
        {/* Grafik (Kiri) */}
        <div className="xl:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-900">Grafik Produksi Susu</h3>
            <select className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg outline-none cursor-pointer">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 flex-1">
            {/* Area Chart SVG */}
            <div className="flex-1 relative h-48 lg:h-auto min-h-[200px]">
              {/* Y-Axis */}
              <div className="absolute left-0 top-0 bottom-6 w-6 flex flex-col justify-between text-[10px] font-medium text-slate-400">
                <span>30</span><span>20</span><span>10</span><span>0</span>
              </div>
              {/* X-Axis */}
              <div className="absolute left-10 right-0 bottom-0 flex justify-between text-[10px] font-medium text-slate-400">
                <span>12 Mei</span><span>13 Mei</span><span>14 Mei</span><span>15 Mei</span><span>16 Mei</span><span>17 Mei</span><span>18 Mei</span>
              </div>
              {/* Chart Graphics */}
              <div className="absolute left-10 right-0 top-2 bottom-6">
                {/* SVG Trick */}
                <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid background */}
                  <line x1="0" y1="0" x2="500" y2="0" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="33" x2="500" y2="33" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="66" x2="500" y2="66" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                  
                  {/* Shaded Area */}
                  <polygon points="0,100 0,30 83,20 166,40 250,30 333,45 416,30 500,45 500,100" fill="url(#chartGreen)" />
                  {/* Line */}
                  <polyline points="0,30 83,20 166,40 250,30 333,45 416,30 500,45" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Data Points */}
                  <circle cx="0" cy="30" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                  <circle cx="83" cy="20" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                  <circle cx="166" cy="40" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                  <circle cx="250" cy="30" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                  <circle cx="333" cy="45" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                  <circle cx="416" cy="30" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                  <circle cx="500" cy="45" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            </div>
            
            {/* Stats Sidebar */}
            <div className="w-full lg:w-48 flex flex-col justify-center space-y-4 shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium text-slate-500">Rata-rata 7 hari</span>
                <span className="text-sm font-bold text-slate-900">20,8 L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium text-slate-500">Rata-rata Laktasi</span>
                <span className="text-sm font-bold text-slate-900">21,4 L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium text-slate-500">Puncak Laktasi</span>
                <span className="text-sm font-bold text-slate-900">28,6 L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium text-slate-500">Hari di Laktasi</span>
                <span className="text-sm font-bold text-slate-900">123 hari</span>
              </div>
            </div>
          </div>
        </div>

        {/* Catatan Terbaru (Kanan) */}
        <div className="xl:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Catatan Terbaru</h3>
          <div className="space-y-4 flex-1">
            {/* Note 1 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">📉</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-slate-900">Penurunan Produksi</p>
                  <span className="text-[9px] font-medium text-slate-400">18 Mei 2026, 07:30</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Produksi turun 12% dari rata-rata.</p>
              </div>
            </div>
            {/* Note 2 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-green-50 text-green-500 flex items-center justify-center shrink-0 mt-0.5">🌾</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-slate-900">Aktivitas Makan Menurun</p>
                  <span className="text-[9px] font-medium text-slate-400">18 Mei 2026, 07:20</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Konsumsi pakan turun 8%.</p>
              </div>
            </div>
            {/* Note 3 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 mt-0.5">🌡️</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-slate-900">Suhu Tubuh Tinggi</p>
                  <span className="text-[9px] font-medium text-slate-400">18 Mei 2026, 07:15</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Suhu 38,7°C (di atas normal).</p>
              </div>
            </div>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat semua catatan →</button>
        </div>

      </div>

      {/* 6. ROW 3: RIWAYAT & AKSI CEPAT */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Riwayat Reproduksi */}
        <div className="xl:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Riwayat Reproduksi</h3>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-2 font-semibold">Tanggal</th>
                  <th className="pb-2 font-semibold">Aktivitas</th>
                  <th className="pb-2 font-semibold">Detail</th>
                  <th className="pb-2 font-semibold">Oleh</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-2.5">10 Mei 2026</td>
                  <td className="py-2.5">IB</td>
                  <td className="py-2.5">Semen ABS 1234</td>
                  <td className="py-2.5">Andi</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2.5">25 Apr 2026</td>
                  <td className="py-2.5">Birahi Terdeteksi</td>
                  <td className="py-2.5">Durasi 14 jam</td>
                  <td className="py-2.5">Siti</td>
                </tr>
                <tr>
                  <td className="py-2.5">20 Apr 2026</td>
                  <td className="py-2.5">Pemeriksaan PK</td>
                  <td className="py-2.5">Negatif</td>
                  <td className="py-2.5">Dr. Budi</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat semua riwayat →</button>
        </div>

        {/* Riwayat Kesehatan */}
        <div className="xl:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Riwayat Kesehatan</h3>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-2 font-semibold">Tanggal</th>
                  <th className="pb-2 font-semibold">Aktivitas</th>
                  <th className="pb-2 font-semibold">Detail</th>
                  <th className="pb-2 font-semibold">Oleh</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-2.5">05 Mei 2026</td>
                  <td className="py-2.5">Pengobatan</td>
                  <td className="py-2.5">Mastitis - Antibiotik</td>
                  <td className="py-2.5">Dr. Budi</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2.5">02 Mei 2026</td>
                  <td className="py-2.5">Pemeriksaan</td>
                  <td className="py-2.5">Ambing - Normal</td>
                  <td className="py-2.5">Dr. Budi</td>
                </tr>
                <tr>
                  <td className="py-2.5">15 Apr 2026</td>
                  <td className="py-2.5">Pengobatan</td>
                  <td className="py-2.5">Cacingan</td>
                  <td className="py-2.5">Dr. Budi</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left">Lihat semua riwayat →</button>
        </div>

        {/* Aksi Cepat */}
        <div className="xl:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-4 gap-3 flex-1">
            <button className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 transition-colors group">
              <span className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">🥛</span>
              <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">Catat<br/>Produksi</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 transition-colors group">
              <span className="w-10 h-10 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center group-hover:bg-purple-100 transition-colors">⚥</span>
              <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">Catat<br/>Reproduksi</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 transition-colors group">
              <span className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm3 4h2v2h2v2H9v2H7v-2H5V8h2V6z" clipRule="evenodd" /></svg>
              </span>
              <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">Catat<br/>Kesehatan</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 transition-colors group">
              <span className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-100 transition-colors">🌾</span>
              <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">Catat<br/>Pakan</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}