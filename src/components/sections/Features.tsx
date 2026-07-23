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

  // Logika untuk mendeteksi apakah komponen ini sudah terlihat di layar
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Matikan observer setelah animasi jalan sekali biar performa ringan
          observer.unobserve(entry.target); 
        }
      },
      {
        threshold: 0.1, // Animasi mulai saat 10% bagian ini terlihat di layar
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
    <section id="fitur" className="bg-white py-16 lg:py-24 relative z-20" ref={sectionRef}>
      <div className="w-full mx-auto px-6 lg:px-16 xl:px-24 max-w-[1600px]">
        
        {/* Grid untuk 4 kotak fitur */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Di sini kita tambahin parameter 'index' buat ngatur jeda waktu (stagger) animasi */}
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              // Ini kelas buat animasi muncul awal (Fade Up)
              className={`transform transition-all duration-1000 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
              }`}
              // Delay animasi disesuaikan dengan urutan kotak (kotak ke-2 telat 150ms, kotak ke-3 telat 300ms, dst)
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Kotak Asli (Ini yang mengatur animasi Hover) */}
              <div className="group h-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-green-900/5 hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer">
                
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                
                {/* Title & Description */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 h-auto md:h-16 xl:h-20">
                  {feature.description}
                </p>
                
                {/* Link CTA */}
                <Link 
                  href={feature.link}
                  className="inline-flex items-center text-sm font-semibold text-green-600 group-hover:text-green-700 transition-colors mt-auto"
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