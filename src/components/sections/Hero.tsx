import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section id="hero" className="relative w-full min-h-screen flex items-center py-20 overflow-hidden">
      
      {/* 1. LAYER BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/bg-hero.jpg" 
          alt="Latar belakang peternakan sapi"
          fill
          className="object-cover object-bottom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/30 to-transparent/10"></div>
      </div>

      {/* 2. LAYER KONTEN (Teks & Dashboard) */}
      <div className="w-full relative z-10 mx-auto px-6 lg:px-16 xl:px-24 max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* KOLOM KIRI: Copywriting */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100/90 backdrop-blur-sm text-green-700 font-semibold text-sm shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Smart Livestock Monitoring
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1]">
              Pantau Kesehatan & <br className="hidden lg:block" />
              Produktivitas Sapi <br className="hidden lg:block" />
              Secara <span className="text-green-600">Real-time</span>
            </h1>

            <p className="text-lg text-gray-700 max-w-lg leading-relaxed font-medium">
              AiMoo membantu peternak memantau kondisi sapi lebih mudah, cepat, dan akurat dengan teknologi AI & IoT.
            </p>

            {/* List Fitur */}
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-md">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div><p className="font-bold text-gray-900 leading-tight">Monitoring Real-time</p><p className="text-sm text-gray-700">Pantau kondisi sapi kapan saja</p></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-md">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div><p className="font-bold text-gray-900 leading-tight">Analisis AI Cerdas</p><p className="text-sm text-gray-700">Deteksi dini & rekomendasi medis</p></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 transition-all shadow-lg shadow-green-600/40 flex items-center justify-center gap-2">
                Mulai Sekarang
              </Link>
              <button className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-gray-800 bg-white/80 backdrop-blur-md border border-gray-300 rounded-full hover:border-green-600 hover:text-green-600 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                Lihat Demo
              </button>
            </div>
          </div>

          {/* KOLOM KANAN: DUMMY DASHBOARD UI */}
          {/* PERUBAHAN DI SINI: translate-x dibesarin biar makin kedorong ke kanan */}
          <div className="lg:col-span-6 w-full flex justify-end mt-12 lg:mt-0 lg:translate-x-24 xl:translate-x-34">
            <div className="w-full max-w-[34rem] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-5 transform hover:-translate-y-2 transition-transform duration-500">
              
              {/* Header Dashboard Mini */}
              <div className="flex justify-between items-start mb-5 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg">Dashboard</h3>
                  <p className="text-[11px] text-gray-500">Ringkasan kondisi peternakan</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-semibold text-gray-700">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    18 Mei 2026
                  </div>
                </div>
              </div>

              {/* 3 KPI Cards (Produksi, Perhatian, Total Sapi) */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {/* Card 1 */}
                <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center text-blue-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                    </div>
                    <p className="text-[10px] text-gray-600 font-semibold leading-tight">Produksi Susu<br/>Hari Ini</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">1.250 <span className="text-xs font-normal text-gray-500">L</span></p>
                  <p className="text-[9px] text-green-600 font-semibold mt-0.5">↑ 4.3% dari kemarin</p>
                </div>
                {/* Card 2 */}
                <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded bg-orange-50 flex items-center justify-center text-orange-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                    </div>
                    <p className="text-[10px] text-gray-600 font-semibold leading-tight">Sapi Perlu<br/>Perhatian</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">8 <span className="text-xs font-normal text-gray-500">ekor</span></p>
                  <p className="text-[9px] text-gray-500 font-semibold mt-0.5 hover:text-gray-700 cursor-pointer">Lihat detail →</p>
                </div>
                {/* Card 3 */}
                <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>
                    </div>
                    <p className="text-[10px] text-gray-600 font-semibold leading-tight">Total<br/>Sapi</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">95 <span className="text-xs font-normal text-gray-500">ekor</span></p>
                  <p className="text-[9px] text-gray-500 font-semibold mt-0.5">7 jantan / 88 betina</p>
                </div>
              </div>

              {/* Middle & Bottom: Split Grid for Chart and AI */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Kiri: Grafik & Peringatan */}
                <div className="space-y-4">
                  {/* Fake Line Chart */}
                  <div className="border border-gray-100 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-xs font-bold text-gray-800 flex items-center gap-1">
                        <span className="text-blue-500">📊</span> Produksi Susu
                      </p>
                    </div>
                    <div className="h-14 w-full relative">
                      {/* SVG untuk simulasi garis grafik */}
                      <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible stroke-blue-500 drop-shadow-sm" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M0,15 L16,12 L33,20 L50,18 L66,10 L83,22 L100,8" />
                        <circle cx="100" cy="8" r="2.5" className="fill-blue-500" />
                      </svg>
                      {/* Tooltip kotak biru di ujung grafik */}
                      <div className="absolute top-0 right-0 -mt-2 bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded font-bold">1.250 L</div>
                    </div>
                  </div>

                  {/* Peringatan AI */}
                  <div className="border border-gray-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1">
                      <span className="text-yellow-500">⚠️</span> Peringatan AI (5)
                    </p>
                    <div className="bg-red-50 rounded-lg p-2 flex items-start gap-2 border border-red-100/50">
                      <div className="w-7 h-7 rounded bg-red-200 shrink-0 border border-red-300 flex items-center justify-center text-[10px]">🐄</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-bold text-red-700">Risiko Mastitis Tinggi</p>
                          <p className="text-[8px] text-red-500">07:20</p>
                        </div>
                        <p className="text-[9px] text-gray-600 mt-0.5">Sapi #1034 • Penurunan 18%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kanan: AI Advice */}
                <div className="bg-green-50/40 border border-green-100 rounded-xl p-4 h-full flex flex-col">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-blue-600 text-sm">🤖</span>
                    <h4 className="text-xs font-extrabold text-gray-900">AI Advice</h4>
                  </div>
                  <p className="text-[10px] text-gray-600 mb-3 leading-relaxed">
                    Berdasarkan analisis data hari ini, berikut rekomendasi untuk peternakan Anda:
                  </p>
                  
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      <p className="text-[10px] text-gray-800 leading-tight">Periksa sapi <b>#1034</b> untuk mastitis. Produksi turun 18% dalam 2 hari.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      <p className="text-[10px] text-gray-800 leading-tight">Sapi <b>#1021</b> kemungkinan birahi 24-48 jam ke depan. Siapkan IB.</p>
                    </div>
                  </div>
                  
                  <button className="text-[10px] font-bold text-green-600 hover:text-green-700 text-left mt-3">
                    Lihat semua rekomendasi →
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