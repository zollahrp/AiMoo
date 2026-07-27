"use client";

import Image from "next/image";
import { useState } from "react";

export default function PengaturanPage() {
  // State untuk mengontrol tab yang aktif
  const [activeTab, setActiveTab] = useState("Umum");

  const tabs = ["Umum", "Pengguna", "Peran & Akses", "Notifikasi", "Perangkat & Integrasi", "Keamanan", "Data & Backup"];

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Pengaturan</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola preferensi aplikasi, pengguna, perangkat, dan sistem sesuai kebutuhan Anda.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-sm font-bold text-slate-700">18 Mei 2026</span>
          </button>
        </div>
      </div>

      {/* 2. TABS NAVIGATION */}
      <div className="border-b border-slate-200 mb-6 flex overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap pb-4 px-5 text-sm font-bold transition-colors ${
              activeTab === tab 
                ? "text-emerald-600 border-b-2 border-emerald-500" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* =========================================
          TAB: UMUM (Tampilan Pengaturan Default)
          ========================================= */}
      {activeTab === "Umum" && (
        <>
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
                  <input type="text" defaultValue="Sukasari Dairy Farm" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Alamat</label>
                  <input type="text" defaultValue="Batu, Jawa Timur" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Kapasitas Populasi</label>
                  <div className="flex">
                    <input type="text" defaultValue="250" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-l-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all border-r-0" />
                    <span className="bg-slate-100 border border-slate-200 border-l-0 px-3 py-2 rounded-r-lg text-xs font-semibold text-slate-500 flex items-center justify-center">ekor</span>
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
              </div>
              <div className="mt-5 text-right">
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors">Simpan Perubahan</button>
              </div>
            </div>

            {/* Box 3: Profil Akun Utama */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
                <span className="text-emerald-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></span>
                Profil Akun Utama (Owner)
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
                    <input type="email" defaultValue="bos.andi@aimoo.com" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500" />
                  </div>
                </div>
              </div>
              <div className="mt-5 text-right">
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors">Perbarui Profil</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================
          TAB: PENGGUNA (Manajemen Karyawan)
          ========================================= */}
      {activeTab === "Pengguna" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Manajemen Karyawan</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">Kelola akses staf dan pekerja kandang di peternakan Anda.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Tambah Karyawan
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50">
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="py-4 px-6 font-semibold">Nama Lengkap</th>
                  <th className="py-4 px-6 font-semibold">Email / Username</th>
                  <th className="py-4 px-6 font-semibold">Peran (Role)</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {/* User 1: Bos */}
                <tr className="border-b border-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden"><Image src="/image/fadhli.jpg" alt="Profile" width={32} height={32} className="object-cover"/></div>
                      <span className="font-bold text-slate-900">Andi Setiawan (Anda)</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600">bos.andi@aimoo.com</td>
                  <td className="py-4 px-6"><span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100">Pemilik (Owner)</span></td>
                  <td className="py-4 px-6"><span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Aktif</span></td>
                  <td className="py-4 px-6 text-right"></td>
                </tr>
                {/* User 2: Karyawan */}
                <tr className="border-b border-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">BS</div>
                      <span className="font-bold text-slate-900">Budi Santoso</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600">budi.staff@aimoo.com</td>
                  <td className="py-4 px-6"><span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">Farm Manager</span></td>
                  <td className="py-4 px-6"><span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Aktif</span></td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-slate-400 hover:text-slate-800 transition-colors">Edit</button>
                  </td>
                </tr>
                {/* User 3: Karyawan */}
                <tr className="border-b border-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">ST</div>
                      <span className="font-bold text-slate-900">Siti Aminah</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600">siti.kandang@aimoo.com</td>
                  <td className="py-4 px-6"><span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">Staff Kandang</span></td>
                  <td className="py-4 px-6"><span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Aktif</span></td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-slate-400 hover:text-slate-800 transition-colors">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Konten Tab Lainnya (Placeholder) */}
      {activeTab !== "Umum" && activeTab !== "Pengguna" && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <p className="text-slate-400 font-medium">Pengaturan untuk modul <span className="font-bold text-slate-600">{activeTab}</span> akan dikembangkan pada tahap selanjutnya.</p>
        </div>
      )}

    </div>
  );
}