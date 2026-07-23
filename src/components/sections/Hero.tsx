"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  // STATE BARU: Buat nahan animasi sampai preloader selesai
  const [isPreloaderDone, setIsPreloaderDone] = useState(false); 
  const heroRef = useRef<HTMLElement>(null);

  // 1. Logika nunggu Preloader kelar (2.5 detik = 2500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreloaderDone(true);
    }, 2500); // Harus sama dengan total waktu removeTimer di Preloader.tsx
    return () => clearTimeout(timer);
  }, []);

  // 2. Logika deteksi scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  // VARIABEL BANTUAN: Animasi cuma jalan KALAU kelihatan di layar DAN preloader udah kelar
  const shouldAnimate = isVisible && isPreloaderDone;

  return (
    <section id="hero" ref={heroRef} className="relative w-full min-h-screen flex items-center py-20 overflow-hidden bg-gray-50">
      
      {/* 1. LAYER BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/image/bg-hero.jpg" 
          alt="Latar belakang peternakan sapi"
          fill
          className={`object-cover object-bottom transition-transform duration-[15000ms] ease-out ${
            shouldAnimate ? "scale-105" : "scale-100"
          }`}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/40 to-transparent/10"></div>
      </div>

      {/* 2. LAYER KONTEN (Teks & Dashboard) */}
      <div className="w-full relative z-10 mx-auto px-6 lg:px-16 xl:px-24 max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* KOLOM KIRI: Copywriting */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            
            {/* Badge dengan Icon Petir */}
            <div 
              className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-green-100/90 backdrop-blur-sm text-green-800 font-bold text-sm shadow-sm border border-green-200/50 transform transition-all duration-1000 ease-out ${
                shouldAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="bg-white rounded-full p-1 shadow-sm">
                <svg className="w-4 h-4 text-yellow-500 animate-pulse fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />
                </svg>
              </div>
              Smart Livestock Monitoring
            </div>

            {/* Headline */}
            <h1 
              className={`text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight transform transition-all duration-1000 delay-150 ease-out ${
                shouldAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Pantau Kesehatan & <br className="hidden lg:block" />
              Produktivitas Sapi <br className="hidden lg:block" />
              Secara <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700">Real-time</span>
            </h1>

            {/* Deskripsi */}
            <p 
              className={`text-lg text-gray-600 max-w-lg leading-relaxed font-medium transform transition-all duration-1000 delay-300 ease-out ${
                shouldAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              AiMoo membantu peternak memantau kondisi sapi lebih mudah, cepat, dan akurat dengan teknologi AI & IoT kelas *Enterprise*.
            </p>

            {/* List Fitur */}
            <div 
              className={`flex flex-col gap-4 pt-2 transform transition-all duration-1000 delay-500 ease-out ${
                shouldAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-start gap-3 group cursor-default">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-600 shadow-sm border border-green-100 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <p className="font-extrabold text-gray-900 leading-tight">Monitoring Real-time</p>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">Pantau kondisi sapi kapan saja</p>
                </div>
              </div>
              <div className="flex items-start gap-3 group cursor-default">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-600 shadow-sm border border-green-100 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <p className="font-extrabold text-gray-900 leading-tight">Analisis AI Cerdas</p>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">Deteksi dini & rekomendasi medis</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div 
              className={`flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto transform transition-all duration-1000 delay-700 ease-out ${
                shouldAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Link href="/register" className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-white bg-green-600 rounded-full hover:bg-green-700 transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_30px_rgba(22,163,74,0.5)] flex items-center justify-center gap-2 hover:-translate-y-0.5">
                Mulai Sekarang
              </Link>
              <button className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-gray-800 bg-white/80 backdrop-blur-md border border-gray-300 rounded-full hover:border-green-600 hover:text-green-700 hover:bg-green-50 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                Lihat Demo
              </button>
            </div>
          </div>

          {/* KOLOM KANAN: DUMMY DASHBOARD UI */}
          <div 
            className={`lg:col-span-6 w-full flex justify-end mt-12 lg:mt-0 lg:translate-x-16 xl:translate-x-32 transform transition-all duration-1000 delay-500 ease-out ${
              shouldAnimate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
            }`}
          >
            <div className="w-full max-w-[34rem] bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/60 p-6 hover:-translate-y-2 transition-transform duration-700 relative group">
              
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition duration-1000 -z-10"></div>

              {/* Header Dashboard Mini */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100/80">
                <div>
                  <h3 className="font-black text-gray-900 text-lg tracking-tight">Dashboard</h3>
                  <p className="text-xs font-semibold text-gray-500">Ringkasan kondisi peternakan</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative cursor-pointer hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl shadow-sm text-xs font-bold text-gray-700">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    18 Mei 2026
                  </div>
                </div>
              </div>

              {/* 3 KPI Cards */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold leading-tight">Produksi Susu<br/>Hari Ini</p>
                  </div>
                  <p className="text-2xl font-black text-gray-900 tracking-tight">1.250 <span className="text-xs font-semibold text-gray-400">L</span></p>
                  <p className="text-[10px] text-green-600 font-bold mt-1">↑ 4.3% <span className="text-gray-400 font-medium">vs kemarin</span></p>
                </div>
                <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold leading-tight">Sapi Perlu<br/>Perhatian</p>
                  </div>
                  <p className="text-2xl font-black text-gray-900 tracking-tight">8 <span className="text-xs font-semibold text-gray-400">ekor</span></p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 hover:text-gray-600 cursor-pointer transition-colors">Lihat detail →</p>
                </div>
                <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold leading-tight">Total<br/>Sapi</p>
                  </div>
                  <p className="text-2xl font-black text-gray-900 tracking-tight">95 <span className="text-xs font-semibold text-gray-400">ekor</span></p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">7 jantan / 88 betina</p>
                </div>
              </div>

              {/* Middle & Bottom: Split Grid */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Kiri: Grafik & Peringatan */}
                <div className="space-y-4">
                  <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                        <span className="text-blue-500">📊</span> Produksi Susu
                      </p>
                    </div>
                    <div className="h-12 w-full relative">
                      <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible stroke-blue-500 drop-shadow-md" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M0,15 L16,12 L33,20 L50,18 L66,10 L83,22 L100,8" />
                        <circle cx="100" cy="8" r="3" className="fill-white stroke-[3px]" />
                      </svg>
                      <div className="absolute top-0 right-0 -mt-3 bg-gray-900 text-white text-[9px] px-2 py-1 rounded-lg font-bold shadow-lg">1.250 L</div>
                    </div>
                  </div>

                  {/* Peringatan AI */}
                  <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <p className="text-xs font-extrabold text-gray-900 mb-3 flex items-center gap-1.5">
                      <span className="text-yellow-500">⚠️</span> Peringatan AI (5)
                    </p>
                    <div className="bg-red-50/80 rounded-xl p-2.5 flex items-start gap-2.5 border border-red-100/50 hover:bg-red-100 transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-red-200/50 shrink-0 border border-red-200 flex items-center justify-center text-xs">🐄</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-[11px] font-black text-red-700">Risiko Mastitis Tinggi</p>
                          <p className="text-[9px] text-red-500 font-bold">07:20</p>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">Sapi #1034 • Penurunan 18%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kanan: AI Advice */}
                <div className="bg-gradient-to-b from-green-50 to-emerald-50/30 border border-green-100 rounded-2xl p-5 h-full flex flex-col shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/40 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  
                  <div className="flex items-center gap-2 mb-3 relative z-10">
                    <span className="text-blue-600 text-base">🤖</span>
                    <h4 className="text-xs font-black text-gray-900 tracking-tight">AI Advice</h4>
                  </div>
                  <p className="text-[10px] text-gray-600 mb-4 font-medium leading-relaxed relative z-10">
                    Berdasarkan analisis data hari ini, berikut rekomendasi untuk Anda:
                  </p>
                  
                  <div className="space-y-4 flex-1 relative z-10">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      <p className="text-[10px] text-gray-700 font-medium leading-relaxed">Periksa sapi <b className="text-gray-900">#1034</b> untuk mastitis. Produksi turun 18%.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      <p className="text-[10px] text-gray-700 font-medium leading-relaxed">Sapi <b className="text-gray-900">#1021</b> kemungkinan birahi 24-48 jam ke depan.</p>
                    </div>
                  </div>
                  
                  <button className="text-[10px] font-extrabold text-green-600 hover:text-green-800 text-left mt-4 relative z-10 transition-colors flex items-center gap-1">
                    Lihat semua rekomendasi 
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}