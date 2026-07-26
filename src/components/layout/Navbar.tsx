"use client";

import Link from "next/link";
// 1. Wajib import Image untuk optimasi
import Image from "next/image"; 
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero"); 
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const navLinks = [
    { name: "Beranda", id: "hero" },
    { name: "Fitur", id: "fitur" },
    { name: "Kalkulator ROI", id: "kalkulator" },
    { name: "Harga", id: "harga" },
    { name: "Tentang Kami", id: "tentang-kami" },
  ];

  // Efek Scroll (Blur Navbar & Scrollspy)
  useEffect(() => {
    const handleScroll = () => {
      // Blur Navbar
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Scrollspy Logic
      const sections = navLinks.map(link => link.id);
      let current = "hero";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); 

  // Efek Magic Line (Garis Geser)
  useEffect(() => {
    const targetId = hoveredSection || activeSection;
    const activeElement = document.getElementById(`nav-link-${targetId}`);
    
    if (activeElement) {
      setIndicatorStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
        opacity: 1
      });
    }
  }, [activeSection, hoveredSection, isScrolled]); 

  // Smooth Scroll on Click
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setActiveSection(targetId); 
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ease-in-out ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 py-0" 
          : "bg-transparent py-2"
      }`}
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 max-w-[1400px]">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center transform transition-transform duration-300 hover:scale-105">
            <Link href="#hero" onClick={(e) => handleScrollTo(e, 'hero')} className="flex items-center gap-2">
              {/* 2. PAKAI LOGO GAMBAR SEKARANG */}
              <Image 
                src="/image/Logo AiMoo.png" // Path dari folder public
                alt="Logo AiMoo" 
                width={90} 
                height={42} 
                className="object-contain" // Biar gambarnya gak gepeng
                priority // Penting buat logo LCP optimization
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav 
            className="hidden md:flex items-center gap-8 relative"
            onMouseLeave={() => setHoveredSection(null)} 
          >
            {/* MAGIC LINE-NYA (Retained) */}
            <div 
              className="absolute -bottom-1 h-0.5 bg-emerald-500 rounded-full transition-all duration-300 ease-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity
              }}
            />

            {navLinks.map((link) => {
              const isActive = (hoveredSection === link.id) || (!hoveredSection && activeSection === link.id);
              return (
                <Link
                  key={link.id}
                  id={`nav-link-${link.id}`} 
                  href={`#${link.id}`}
                  onClick={(e) => handleScrollTo(e, link.id)}
                  onMouseEnter={() => setHoveredSection(link.id)} 
                  className={`transition-colors duration-300 tracking-wide py-1 ${
                    isActive
                      ? "text-emerald-600 font-bold" 
                      : "text-slate-600 font-semibold hover:text-emerald-600" 
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons (Masuk / Daftar) */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login" 
              className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${
                isScrolled 
                  ? "text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400" 
                  : "text-slate-800 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white shadow-sm"
              }`}
            >
              Masuk
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-500 rounded-full hover:bg-emerald-400 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 tracking-wide"
            >
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button className="text-slate-800 hover:text-emerald-600 focus:outline-none transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}