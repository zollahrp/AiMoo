"use client"; // Wajib ditambahkan agar efek scroll berfungsi di Next.js App Router

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Mendeteksi saat layar di-scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      // KELAS AJAIBNYA DI SINI:
      // Menggunakan 'fixed' agar selalu ikut di layar.
      // Mengubah background & shadow secara dinamis berdasarkan state 'isScrolled'
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ease-in-out ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-0" 
          : "bg-transparent py-2"
      }`}
    >
      {/* 
        PERUBAHAN DI SINI:
        Disamakan persis dengan Hero -> w-full max-w-[1600px] px-6 lg:px-16 xl:px-24
      */}
      <div className="w-full mx-auto px-6 lg:px-16 xl:px-24 max-w-[1600px]">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center transform transition-transform duration-300 hover:scale-105">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/image/Logo AiMoo.png" 
                alt="Logo AiMoo" 
                width={120} 
                height={40} 
                className="object-contain"
                priority 
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-green-600 font-semibold relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-green-600 transition-colors"
            >
              Beranda
            </Link>
            <Link href="#fitur" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Fitur
            </Link>
            <Link href="#cara-kerja" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Cara Kerja
            </Link>
            <Link href="#solusi" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Solusi
            </Link>
            <Link href="#harga" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Harga
            </Link>
            <Link href="#tentang-kami" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Tentang Kami
            </Link>
          </nav>

          {/* Action Buttons (Masuk / Daftar) */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login" 
              className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                isScrolled 
                  ? "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400" 
                  : "text-gray-800 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white"
              }`}
            >
              Masuk
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-green-600/30 transform hover:-translate-y-0.5"
            >
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-800 hover:text-green-600 focus:outline-none transition-colors">
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