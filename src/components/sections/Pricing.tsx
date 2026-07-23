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
      unit: "/ ekor / bulan",
      isPopular: false,
      features: [
        "Monitoring Suhu & Aktivitas",
        "Dashboard Web Dasar",
        "Penyimpanan Data 30 Hari",
        "Dukungan via Email",
      ],
      buttonText: "Pilih Trace",
      buttonStyle: "bg-green-50 text-green-700 hover:bg-green-100",
    },
    {
      id: "pulse",
      name: "AiMoo Pulse",
      description: "Analisis cerdas dengan peringatan AI untuk efisiensi maksimal.",
      price: "25.000",
      unit: "/ ekor / bulan",
      isPopular: true, // Paket ini yang bakal di-highlight
      features: [
        "Semua fitur di AiMoo Trace",
        "Deteksi Dini Birahi & Mastitis (AI)",
        "Notifikasi Real-time (WhatsApp/Push)",
        "Penyimpanan Data 1 Tahun",
        "Laporan Produktivitas Otomatis",
      ],
      buttonText: "Coba Gratis 14 Hari",
      buttonStyle: "bg-white text-green-800 hover:bg-gray-50 shadow-lg",
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
      buttonStyle: "bg-green-50 text-green-700 hover:bg-green-100",
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
    <section id="harga" className="bg-gray-50 py-24 relative z-10" ref={sectionRef}>
      <div className="w-full mx-auto px-6 lg:px-16 xl:px-24 max-w-[1600px]">
        
        {/* Header Section */}
        <div 
          className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Investasi Fleksibel untuk <br />
            <span className="text-green-600">Pertumbuhan Peternakan</span>
          </h2>
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            Pilih paket langganan SaaS yang paling sesuai dengan skala dan kebutuhan manajemen peternakan Anda.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {tiers.map((tier, index) => (
            <div 
              key={tier.id}
              // Animasi Stagger & Styling Pop-out untuk yang Populer
              className={`relative rounded-3xl p-8 xl:p-10 transition-all duration-700 ease-out flex flex-col h-full
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
                ${tier.isPopular 
                  ? "bg-gradient-to-b from-[#165a36] to-[#0e3b23] text-white shadow-2xl shadow-green-900/30 md:-translate-y-4 md:hover:-translate-y-6 border border-green-700" 
                  : "bg-white text-gray-900 shadow-xl shadow-gray-200/50 hover:-translate-y-2 border border-gray-100"
                }
              `}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Badge Popular (Khusus AiMoo Pulse) */}
              {tier.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm tracking-wide uppercase">
                    Paling Direkomendasikan
                  </span>
                </div>
              )}

              {/* Tier Header */}
              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${tier.isPopular ? "text-green-100" : "text-green-700"}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm h-10 ${tier.isPopular ? "text-green-100/80" : "text-gray-500"}`}>
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8 border-b pb-8 border-opacity-20 border-current">
                <div className="flex items-end gap-1">
                  {tier.price !== "Kustom" && <span className={`text-2xl font-semibold ${tier.isPopular ? "text-white" : "text-gray-900"}`}>Rp</span>}
                  <span className={`text-5xl font-black tracking-tight ${tier.isPopular ? "text-white" : "text-gray-900"}`}>
                    {tier.price}
                  </span>
                </div>
                <span className={`text-sm font-medium mt-2 block ${tier.isPopular ? "text-green-200" : "text-gray-500"}`}>
                  {tier.unit}
                </span>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-10 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className={`w-5 h-5 shrink-0 ${tier.isPopular ? "text-yellow-400" : "text-green-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={`text-sm font-medium leading-tight ${tier.isPopular ? "text-green-50" : "text-gray-700"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link 
                href="/register" 
                className={`w-full text-center py-3.5 rounded-full font-bold transition-all duration-300 block ${tier.buttonStyle}`}
              >
                {tier.buttonText}
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}