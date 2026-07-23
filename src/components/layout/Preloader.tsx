"use client";

import { useState, useEffect } from "react";

export default function Preloader() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Waktu tunggu sebelum preloader mulai memudar (contoh: 2 detik)
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 2000);

    // Waktu tunggu sebelum elemen preloader benar-benar dihapus dari layar (2.5 detik)
    const removeTimer = setTimeout(() => {
      setShow(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // Kalau show false, komponen ini hilang sepenuhnya dari layar
  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        src="https://lottie.host/e86ba369-7444-4bc5-99ed-20df50724134/rKDinT0Dm0.mov"
        autoPlay
        muted
        playsInline
        loop
        // PERUBAHAN DI SINI: Teks dihapus dan ukuran video diperbesar signifikan
        className="w-72 h-72 md:w-96 md:h-96 lg:w-[600px] lg:h-[400px] object-contain"
      ></video>
    </div>
  );
}