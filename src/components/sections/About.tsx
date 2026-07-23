"use client";

import Image from "next/image"; // Wajib import untuk manggil .jpg
import { useEffect, useState, useRef } from "react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Data Tim (Update: Tambah link Instagram)
  const team = [
    {
      id: 1,
      name: "Muhammad Fadhli Ramadhan",
      nim: "J0409251038",
      role: "Chief Executive Officer (CEO)",
      major: "Teknologi dan Manajemen Ternak",
      image: "/image/fadhli.jpg", 
      instagram: "https://www.instagram.com/fadlii.rmdhan/",
      linkedin: "#", // Isi link linkedin fadhli di sini nanti
    },
    {
      id: 2,
      name: "Salsa Putri Azzahra",
      nim: "J0414251185",
      role: "Chief Marketing Officer (CMO)",
      major: "Akuntansi",
      image: "/image/salsa.jpg", 
      instagram: "https://www.instagram.com/salsaputriazr/",
      linkedin: "#", // Isi link linkedin salsa di sini nanti
    },
    {
      id: 3,
      name: "Zolla Perdana Putra Harahap",
      nim: "J0403231156",
      role: "Chief Operating Officer (COO)",
      major: "Teknologi Rekayasa Perangkat Lunak",
      image: "/image/zolla.png", 
      instagram: "https://www.instagram.com/zollahrp/",
      linkedin: "#", // Isi link linkedin zolla di sini nanti
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
    <section id="tentang-kami" className="bg-white py-24 lg:py-32 relative z-10" ref={sectionRef}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 max-w-[1400px]">
        
        {/* HEADER SECTION */}
        <div 
          className={`flex flex-col items-center text-center mb-20 transform transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-800 font-bold text-sm mb-5 border border-slate-200 shadow-sm">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Profil Eksekutif
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Kepemimpinan di <span className="text-emerald-600">AiMoo</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl font-medium">
            Kombinasi keahlian Teknologi Perangkat Lunak, Manajemen Ternak, dan Akuntansi untuk membangun masa depan peternakan presisi di Indonesia.
          </p>
        </div>

        {/* TEAM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {team.map((member, index) => (
            <div 
              key={member.id}
              className={`transform transition-all duration-1000 ease-out flex ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
              }`}
              style={{ transitionDelay: `${index * 200 + 200}ms` }}
            >
              <div className="group h-full w-full bg-white rounded-3xl p-8 xl:p-10 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden">
                
                {/* Aksen Premium saat Hover */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                {/* FOTO PROFIL JPG */}
                <div className="relative w-28 h-28 mb-6 rounded-full p-1 bg-white border border-slate-200 shadow-sm group-hover:border-emerald-200 transition-colors duration-500 overflow-hidden">
                  <Image 
                    src={member.image}
                    alt={member.name}
                    width={112} // 28 * 4
                    height={112}
                    className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Status Online Dot */}
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full z-10"></div>
                </div>

                {/* Nama & C-Level Role */}
                <h3 className="text-xl font-extrabold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-sm font-bold text-emerald-600 tracking-tight">
                  {member.role}
                </p>
                {/* Jurusan Teks Halus */}
                <p className="text-xs font-medium text-slate-500 mt-1 mb-6">
                  {member.major}
                </p>

                {/* Badge NIM (Sejajar di bawah) */}
                <div className="mt-auto px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg border border-slate-200 text-xs font-bold font-mono tracking-widest shadow-inner">
                  ID: {member.nim}
                </div>

                {/* SOCIAL LINKS */}
                <div className="flex items-center gap-3.5 mt-6 pt-6 border-t border-slate-100 w-full justify-center">
                  
                  {/* Linkedin (Memanggil member.linkedin) */}
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
                    <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  
                  {/* Instagram (Memanggil member.instagram) */}
                  <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-yellow-50 hover:text-yellow-600 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 21h9a4.5 4.5 0 004.5-4.5v-9A4.5 4.5 0 0016.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21z" />
                    </svg>
                  </a>

                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}