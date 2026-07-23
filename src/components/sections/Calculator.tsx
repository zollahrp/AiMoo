"use client";

import { useState, useEffect, useRef } from "react";

// 1. KOMPONEN RAHASIA: Counter Angka Dinamis (Animasi setiap value berubah)
const AnimatedValue = ({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    if (startValue === endValue) return;

    let startTime: number | null = null;
    const duration = 400; // Durasi muter 0.4 detik (ngebut & responsif)

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Efek easing halus
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startValue + (endValue - startValue) * easeOut;
      
      setDisplayValue(Math.floor(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValueRef.current = endValue;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {prefix}{displayValue.toLocaleString('id-ID')}{suffix}
    </span>
  );
};

// 2. KOMPONEN UTAMA KALKULATOR
export default function Calculator() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // State untuk input kalkulator
  const [cows, setCows] = useState(50); // Default 50 ekor
  const [milkPerDay, setMilkPerDay] = useState(15); // Default 15 Liter/hari
  const [milkPrice, setMilkPrice] = useState(8500); // Default Rp 8.500/Liter

  // Logika Bisnis (Perhitungan)
  const currentMonthlyRevenue = cows * milkPerDay * milkPrice * 30;
  // AiMoo diproyeksikan ningkatin produktivitas 18% (berdasarkan data Libelium di proposal lu)
  const productivityIncrease = 0.18; 
  const extraRevenue = currentMonthlyRevenue * productivityIncrease;
  const totalProjectedRevenue = currentMonthlyRevenue + extraRevenue;

  // Efek Deteksi Scroll untuk Animasi Muncul Awal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section id="kalkulator" className="bg-gray-50 py-20 lg:py-28 relative z-10" ref={sectionRef}>
      <div className="w-full mx-auto px-6 lg:px-16 xl:px-24 max-w-[1600px]">
        
        {/* Header Section */}
        <div 
          className={`max-w-3xl mx-auto text-center mb-12 lg:mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Kalkulasikan Potensi <span className="text-green-600">Profit Anda</span>
          </h2>
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            Lihat bagaimana AiMoo dapat meningkatkan produktivitas dan pendapatan peternakan Anda hingga <b className="text-gray-900">18%</b> melalui deteksi dini dan monitoring presisi.
          </p>
        </div>

        {/* Kalkulator Card Container */}
        <div 
          className={`w-full max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col lg:flex-row transition-all duration-1000 delay-200 ease-out ${
            isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-12"
          }`}
        >
          
          {/* BAGIAN KIRI: Input Sliders */}
          <div className="w-full lg:w-7/12 p-8 md:p-12">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              Sesuaikan Data Peternakan
            </h3>

            <div className="space-y-10">
              {/* Slider 1: Jumlah Sapi */}
              <div className="group">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-sm font-semibold text-gray-700">Total Sapi Laktasi</label>
                  <span className="text-xl font-bold text-green-600">{cows} <span className="text-sm font-medium text-gray-500">ekor</span></span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="500" 
                  step="5"
                  value={cows} 
                  onChange={(e) => setCows(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all"
                />
              </div>

              {/* Slider 2: Produksi Susu */}
              <div className="group">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-sm font-semibold text-gray-700">Rata-rata Produksi Harian</label>
                  <span className="text-xl font-bold text-green-600">{milkPerDay} <span className="text-sm font-medium text-gray-500">L / ekor</span></span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="30" 
                  step="1"
                  value={milkPerDay} 
                  onChange={(e) => setMilkPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all"
                />
              </div>

              {/* Slider 3: Harga Susu */}
              <div className="group">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-sm font-semibold text-gray-700">Harga Susu Koperasi / Liter</label>
                  <span className="text-xl font-bold text-green-600">Rp {milkPrice.toLocaleString('id-ID')}</span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="15000" 
                  step="500"
                  value={milkPrice} 
                  onChange={(e) => setMilkPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN KANAN: Hasil (Result Panel) */}
          <div className="w-full lg:w-5/12 bg-gradient-to-br from-[#114629] to-[#165a36] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Ornamen Background (Bulatan transparan biar mewah) */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-green-900/40 rounded-full blur-2xl"></div>

            <div className="relative z-10 space-y-8">
              {/* Pendapatan Saat Ini */}
              <div className="border-b border-green-700/50 pb-6">
                <p className="text-green-200 text-sm font-medium mb-1">Estimasi Pendapatan Saat Ini (Bulan)</p>
                <p className="text-2xl font-bold text-green-50">
                  <AnimatedValue value={currentMonthlyRevenue} prefix="Rp " />
                </p>
              </div>

              {/* Ekstra Profit (Highlight) */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <p className="text-yellow-400 text-sm font-bold">Potensi Ekstra Profit AiMoo</p>
                </div>
                <p className="text-3xl font-extrabold text-white">
                  <span className="text-yellow-400 mr-1">+</span>
                  <AnimatedValue value={extraRevenue} prefix="Rp " />
                </p>
              </div>

              {/* Total Pendapatan Baru */}
              <div className="pt-2">
                <p className="text-green-200 text-sm font-medium mb-1">Total Proyeksi Pendapatan Baru</p>
                <p className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                  <AnimatedValue value={totalProjectedRevenue} prefix="Rp " />
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}