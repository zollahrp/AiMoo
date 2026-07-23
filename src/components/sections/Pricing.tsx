"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function Pricing() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Data Paket Langganan (SaaS)
  const tiers = [
    {
      id: "trace",
      name: "AiMoo Trace",
      description: "Monitoring esensial untuk visibilitas data peternakan dasar.",
      price: "15.000",
      unit: "/ ekor / bln",
      isPopular: false,
      features: [
        "Monitoring Suhu & Aktivitas",
        "Dashboard Web Dasar",
        "Penyimpanan Data 30 Hari",
        "Dukungan via Email",
      ],
      buttonText: "Pilih Trace",
    },
    {
      id: "pulse",
      name: "AiMoo Pulse",
      description: "Analisis cerdas dengan peringatan AI untuk efisiensi maksimal.",
      price: "25.000",
      unit: "/ ekor / bln",
      isPopular: true, 
      features: [
        "Semua fitur di AiMoo Trace",
        "Deteksi Dini Birahi & Mastitis (AI)",
        "Notifikasi Real-time (WhatsApp/Push)",
        "Penyimpanan Data 1 Tahun",
        "Laporan Produktivitas Otomatis",
      ],
      buttonText: "Coba Gratis 14 Hari",
    },
    {
      id: "prime",
      name: "AiMoo Prime",
      description: "Solusi enterprise terintegrasi untuk GKSI dan skala besar.",
      price: "Kustom",
      unit: "Hubungi Sales",
      isPopular: false,
      features: [
        "Semua fitur di AiMoo Pulse",
        "Integrasi API & Sistem Eksternal",
        "Manajemen Multi-Peternakan (GKSI)",
        "Penyimpanan Data Unlimited",
        "Dukungan Prioritas 24/7",
      ],
      buttonText: "Hubungi Kami",
    },
  ];

  // Efek Deteksi Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section id="harga" className="bg-slate-50 py-24 lg:py-32 relative z-10" ref={sectionRef}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 max-w-[1400px]">
        
        {/* HEADER SECTION */}
        <div 
          className={`flex flex-col items-center text-center mb-20 transform transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-800 font-bold text-sm mb-5 border border-slate-200 shadow-sm">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Paket Berlangganan
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Investasi Cerdas untuk <br className="hidden md:block" />
            <span className="text-emerald-600">Skala Peternakan Apapun</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl font-medium">
            Pilih paket AiMoo yang sesuai dengan kebutuhan Anda. Bayar sesuai jumlah sapi yang dipantau, tanpa biaya tersembunyi.
          </p>
        </div>

        {/* PRICING CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6 xl:gap-8 max-w-6xl mx-auto items-stretch">
          {tiers.map((tier, index) => (
            <div 
              key={tier.id}
              className={`relative flex flex-col transition-all duration-700 ease-out 
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}
                ${tier.isPopular 
                  // PERUBAHAN UTAMA: Sesuai request Lu (Gradient hijau gelap & shadow glow)
                  ? "bg-gradient-to-r from-[#114629] via-[#165a36] to-[#114629] rounded-[2rem] p-8 lg:p-12 text-white shadow-2xl hover:shadow-[0_0_40px_rgba(22,163,74,0.3)] lg:-translate-y-4 lg:hover:-translate-y-6 z-10" 
                  : "bg-white rounded-[2rem] p-8 lg:p-10 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 hover:-translate-y-2 mt-0 lg:mt-4"
                }
              `}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              
              {/* Badge Popular (Kuning Emas biar nyala di hijau gelap) */}
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-950 text-xs font-black px-5 py-2 rounded-full shadow-lg shadow-yellow-500/30 tracking-wide uppercase flex items-center gap-1.5 whitespace-nowrap">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" /></svg>
                    Paling Diminati
                  </div>
                </div>
              )}

              {/* Tier Header */}
              <div className="mb-6">
                <h3 className={`text-xl font-black mb-2 tracking-tight ${tier.isPopular ? "text-white" : "text-slate-900"}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm h-10 leading-relaxed font-medium ${tier.isPopular ? "text-green-100/80" : "text-slate-500"}`}>
                  {tier.description}
                </p>
              </div>

              {/* Price Area */}
              <div className={`mb-8 border-b pb-8 ${tier.isPopular ? "border-green-700/50" : "border-slate-100"}`}>
                <div className="flex items-end gap-1.5 whitespace-nowrap">
                  {tier.price !== "Kustom" && <span className={`text-2xl font-bold mb-1 ${tier.isPopular ? "text-green-200" : "text-slate-400"}`}>Rp</span>}
                  <span className={`text-5xl font-black tracking-tighter ${tier.isPopular ? "text-white" : "text-slate-900"}`}>
                    {tier.price}
                  </span>
                </div>
                <span className={`text-sm font-semibold mt-2 block ${tier.isPopular ? "text-green-300" : "text-slate-500"}`}>
                  {tier.unit}
                </span>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-10 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${tier.isPopular ? "bg-green-500/30" : "bg-emerald-50"}`}>
                      <svg className={`w-3.5 h-3.5 ${tier.isPopular ? "text-yellow-400" : "text-emerald-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className={`text-sm font-medium leading-relaxed ${tier.isPopular ? "text-green-50" : "text-slate-700"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="mt-auto">
                <Link 
                  href="/register" 
                  className={`w-full flex items-center justify-center py-4 rounded-xl font-bold transition-all duration-300
                    ${tier.isPopular 
                      // Button jadi putih murni biar kontras sama hijau gelap
                      ? "bg-white text-[#114629] hover:bg-gray-100 shadow-lg" 
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    }
                  `}
                >
                  {tier.buttonText}
                </Link>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}