"use client"; // Wajib untuk efek scroll/animasi di Next.js

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      id: 1,
      title: "IoT Ear Tag Sensor",
      description: "Sensor pintar yang dipasang di telinga sapi mengumpulkan data suhu, aktivitas, dan kondisi secara real-time.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      link: "#",
    },
    {
      id: 2,
      title: "AI & Analisis Cerdas",
      description: "Teknologi AI menganalisis data untuk mendeteksi potensi penyakit dan memberikan rekomendasi.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      link: "#",
    },
    {
      id: 3,
      title: "Data di Cloud",
      description: "Semua data tersimpan aman di cloud dan dapat diakses kapan saja melalui dashboard web AiMoo.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      link: "#",
    },
    {
      id: 4,
      title: "Insight & Laporan",
      description: "Dapatkan insight mendalam dan laporan lengkap untuk membantu pengambilan keputusan berbasis data.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      link: "#",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); 
        }
      },
      {
        threshold: 0.1, 
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section id="fitur" className="bg-slate-50 pt-10 pb-20 lg:pt-12 lg:pb-28 relative z-20" ref={sectionRef}>
      <div className="w-full mx-auto px-6 lg:px-16 xl:px-24 max-w-[1600px]">
        
        {/* HEADER JUDUL FITUR */}
        <div 
          className={`flex flex-col items-center text-center mb-12 lg:mb-16 transform transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* BADGE PREMIUM BARU */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-800 font-bold text-sm mb-5 border border-slate-200 shadow-sm">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Fitur Unggulan AiMoo
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Teknologi Cerdas untuk <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700">
              Hasil Peternakan Maksimal
            </span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl font-medium">
            Tinggalkan cara manual. AiMoo menghadirkan ekosistem digital lengkap untuk memantau, menganalisis, dan meningkatkan produktivitas sapi Anda.
          </p>
        </div>

        {/* Grid untuk 4 kotak fitur */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              className={`transform transition-all duration-1000 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
              }`}
              style={{ transitionDelay: `${(index * 150) + 300}ms` }}
            >
              <div className="group h-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer flex flex-col">
                
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shrink-0">
                  {feature.icon}
                </div>
                
                {/* Title & Description */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                  {feature.description}
                </p>
                
                {/* Link CTA */}
                <Link 
                  href={feature.link}
                  className="inline-flex items-center text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors mt-auto"
                >
                  Pelajari lebih lanjut
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}