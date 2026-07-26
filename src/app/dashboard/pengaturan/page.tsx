"use client";

import Image from "next/image";

export default function PengaturanPage() {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Pengaturan</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola preferensi aplikasi, pengguna, perangkat, dan sistem sesuai kebutuhan Anda.</p>
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
        {["Umum", "Pengguna", "Peran & Akses", "Notifikasi", "Perangkat & Integrasi", "Keamanan", "Data & Backup"].map((tab, idx) => (
          <button 
            key={idx} 
            className={`whitespace-nowrap pb-4 px-5 text-sm font-bold transition-colors ${
              idx === 0 
                ? "text-emerald-600 border-b-2 border-emerald-500" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. SETTINGS GRID (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
        
        {/* Box 1: Informasi Peternakan */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="text-emerald-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></span>
            Informasi Peternakan
          </h3>
          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Nama Peternakan</label>
              <input type="text" defaultValue="DairyFarm Sejahtera" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Alamat</label>
              <input type="text" defaultValue="Jl. Peternakan No. 123, Malang, Jawa Timur" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Kapasitas Populasi</label>
              <div className="flex">
                <input type="text" defaultValue="250" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-l-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all border-r-0" />
                <span className="bg-slate-100 border border-slate-200 border-l-0 px-3 py-2 rounded-r-lg text-xs font-semibold text-slate-500 flex items-center justify-center">ekor</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Sistem Pemeliharaan</label>
                <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500">
                  <option>Free Stall</option>
                  <option>Tie Stall</option>
                  <option>Pasture</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Zona Waktu</label>
                <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500">
                  <option>(GMT+07:00) Jakarta</option>
                  <option>(GMT+08:00) Makassar</option>
                  <option>(GMT+09:00) Jayapura</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-5 text-right">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors">Simpan Perubahan</button>
          </div>
        </div>

        {/* Box 2: Preferensi Aplikasi */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="text-emerald-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg></span>
            Preferensi Aplikasi
          </h3>
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Bahasa</span>
              <select className="w-48 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500">
                <option>Bahasa Indonesia</option>
                <option>English (US)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Satuan Berat</span>
              <select className="w-48 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500">
                <option>Kilogram (kg)</option>
                <option>Pound (lb)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Satuan Volume</span>
              <select className="w-48 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500">
                <option>Liter (L)</option>
                <option>Gallon (gal)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Satuan Jarak</span>
              <select className="w-48 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500">
                <option>Kilometer (km)</option>
                <option>Mile (mi)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Format Tanggal</span>
              <select className="w-48 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500">
                <option>DD MMM YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-slate-700">Tema</span>
              <div className="flex gap-2 w-48">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 border border-emerald-500 rounded-lg text-[10px] font-bold text-emerald-600 bg-emerald-50">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  Terang
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-50">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  Gelap
                </button>
              </div>
            </div>
          </div>
          <div className="mt-5 text-right">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors">Simpan Perubahan</button>
          </div>
        </div>

        {/* Box 3: Profil Akun */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="text-emerald-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></span>
            Profil Akun
          </h3>
          <div className="flex flex-col sm:flex-row gap-5 flex-1">
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <Image src="/image/fadhli.jpg" alt="Profile" width={80} height={80} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Nama Lengkap</label>
                <input type="text" defaultValue="Andi Setiawan" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Email</label>
                <input type="email" defaultValue="andi.setiawan@dairyfarm.com" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Nomor Telepon</label>
                <input type="text" defaultValue="+62 812-3456-7890" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Jabatan</label>
                <input type="text" defaultValue="Farm Manager" disabled className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-400 cursor-not-allowed outline-none" />
              </div>
            </div>
          </div>
          <div className="mt-5 text-right">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors">Perbarui Profil</button>
          </div>
        </div>

      </div>

      {/* 4. SETTINGS GRID ROW 2 (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-6">
        
        {/* Box 4: Notifikasi */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="text-emerald-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></span>
            Notifikasi
          </h3>
          <div className="space-y-5 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Pengingat Vaksinasi</p>
                <p className="text-[10px] text-slate-500">Dapatkan notifikasi jadwal vaksinasi mendatang</p>
              </div>
              <div className="w-9 h-5 rounded-full bg-emerald-500 relative cursor-pointer shadow-inner shrink-0"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow"></div></div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Pengingat Estrus</p>
                <p className="text-[10px] text-slate-500">Dapatkan notifikasi sapi birahi</p>
              </div>
              <div className="w-9 h-5 rounded-full bg-emerald-500 relative cursor-pointer shadow-inner shrink-0"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow"></div></div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Pengingat Pemerahan</p>
                <p className="text-[10px] text-slate-500">Dapatkan notifikasi jadwal pemerahan</p>
              </div>
              <div className="w-9 h-5 rounded-full bg-emerald-500 relative cursor-pointer shadow-inner shrink-0"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow"></div></div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Stok Pakan Menipis</p>
                <p className="text-[10px] text-slate-500">Dapatkan notifikasi stok pakan rendah</p>
              </div>
              <div className="w-9 h-5 rounded-full bg-emerald-500 relative cursor-pointer shadow-inner shrink-0"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow"></div></div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Laporan Harian</p>
                <p className="text-[10px] text-slate-500">Kirim ringkasan laporan harian ke email</p>
              </div>
              <div className="w-9 h-5 rounded-full bg-slate-200 relative cursor-pointer shadow-inner shrink-0 border border-slate-300"><div className="w-4 h-4 bg-white rounded-full absolute top-[1px] left-0.5 shadow"></div></div>
            </div>
          </div>
          <div className="mt-5 text-right">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors">Simpan Pengaturan</button>
          </div>
        </div>

        {/* Box 5: Pengaturan Sistem */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="text-emerald-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg></span>
            Pengaturan Sistem
          </h3>
          <div className="space-y-5 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Auto Save Data</p>
                <p className="text-[10px] text-slate-500">Simpan data secara otomatis</p>
              </div>
              <div className="w-9 h-5 rounded-full bg-emerald-500 relative cursor-pointer shadow-inner shrink-0"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow"></div></div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Lock Session Otomatis</p>
                <p className="text-[10px] text-slate-500">Kunci session setelah tidak aktif</p>
              </div>
              <select className="w-28 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-800 outline-none focus:border-emerald-500">
                <option>30 menit</option>
                <option>60 menit</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Refresh Data Otomatis</p>
                <p className="text-[10px] text-slate-500">Perbarui data secara berkala</p>
              </div>
              <select className="w-28 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-800 outline-none focus:border-emerald-500">
                <option>5 menit</option>
                <option>10 menit</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Dashboard Default</p>
                <p className="text-[10px] text-slate-500">Halaman utama saat login</p>
              </div>
              <select className="w-28 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-800 outline-none focus:border-emerald-500">
                <option>Dashboard</option>
                <option>Sapi</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Reset Tour Aplikasi</p>
                <p className="text-[10px] text-slate-500">Mulai ulang panduan penggunaan</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-[11px] font-bold text-slate-700 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Reset Tour
              </button>
            </div>
          </div>
          <div className="mt-5 text-right">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors">Simpan Pengaturan</button>
          </div>
        </div>

        {/* Box 6: Informasi Sistem */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="text-emerald-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span>
            Informasi Sistem
          </h3>
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-semibold">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                Versi Aplikasi
              </div>
              <span className="font-bold text-slate-900">v1.2.3</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-semibold">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Terakhir Update
              </div>
              <span className="font-bold text-slate-900">15 Mei 2026</span>
            </div>
            
            <div className="pt-1">
              <div className="flex justify-between items-end mb-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-600 font-semibold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                  Penyimpanan Digunakan
                </div>
                <span className="font-bold text-slate-900 text-[10px]">2,45 GB / 10 GB</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '24.5%' }}></div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <div className="flex items-center gap-2 text-slate-600 font-semibold">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Status Layanan
              </div>
              <span className="font-bold text-emerald-600">Aktif</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-semibold">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Lisensi
              </div>
              <span className="font-bold text-slate-900">Premium Plan</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 text-left">
            <button className="flex items-center gap-2 text-[11px] font-bold text-red-500 hover:text-red-700 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Keluar Akun
            </button>
          </div>
        </div>

      </div>

      {/* 5. FOOTER BANNER (Support) */}
      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Butuh Bantuan?</h4>
            <p className="text-xs font-medium text-slate-600 mt-0.5">Jika Anda mengalami kendala atau membutuhkan bantuan, silakan hubungi tim support kami.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold text-xs transition-colors shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          Hubungi Support
        </button>
      </div>

    </div>
  );
}