"use client";

import { useState, useEffect, useRef } from "react";

// 1. KOMPONEN RAHASIA: Counter Angka Dinamis (Animasi Halus)
const AnimatedValue = ({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    if (startValue === endValue) return;

    let startTime: number | null = null;
    const duration = 500; 

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
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

  // State Input
  const [cows, setCows] = useState(50); 
  const [milkPerDay, setMilkPerDay] = useState(15);
  const [milkPrice, setMilkPrice] = useState(8500); 

  // Kalkulasi Bisnis
  const currentMonthlyRevenue = cows * milkPerDay * milkPrice * 30;
  const productivityIncrease = 0.18; // 18% AiMoo Boost
  const extraRevenue = currentMonthlyRevenue * productivityIncrease;
  const totalProjectedRevenue = currentMonthlyRevenue + extraRevenue;

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

  // Fungsi pengisi warna slider (Clean Emerald & Slate-100)
  const getSliderStyle = (value: number, min: number, max: number) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, #10b981 ${percentage}%, #f1f5f9 ${percentage}%)`
    };
  };

  return (
    <section id="kalkulator" className="bg-slate-50 py-24 lg:py-32 relative z-10" ref={sectionRef}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 max-w-[1400px]">
        
        {/* HEADER SECTION */}
        <div 
          className={`flex flex-col items-center text-center mb-16 transform transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-800 font-bold text-sm mb-5 border border-slate-200 shadow-sm">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            Kalkulator ROI Interaktif
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Proyeksikan <span className="text-emerald-600">Pertumbuhan Profit</span> Anda
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl font-medium">
            Sesuaikan metrik di bawah ini untuk melihat potensi peningkatan pendapatan peternakan Anda hingga <b className="text-slate-900">18%</b> per bulan bersama AiMoo.
          </p>
        </div>

        {/* KALKULATOR CARD CONTAINER */}
        <div 
          className={`w-full mx-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200 overflow-hidden flex flex-col lg:flex-row transform transition-all duration-1000 delay-200 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
        >
          
          {/* BAGIAN KIRI: Input Sliders */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 bg-white">
            <h3 className="text-xl font-bold text-slate-900 mb-10 tracking-tight">
              Kondisi Peternakan Saat Ini
            </h3>

            <div className="space-y-10">
              {/* Slider 1: Jumlah Sapi */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-semibold text-slate-600 flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Total Sapi Laktasi
                  </label>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
                    {cows} <span className="text-sm font-semibold text-slate-400">ekor</span>
                  </span>
                </div>
                <input 
                  type="range" 
                  min="5" max="500" step="5"
                  value={cows} 
                  onChange={(e) => setCows(Number(e.target.value))}
                  style={getSliderStyle(cows, 5, 500)}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-emerald-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md transition-all"
                />
              </div>

              {/* Slider 2: Produksi Susu */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-semibold text-slate-600 flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Produksi Harian
                  </label>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
                    {milkPerDay} <span className="text-sm font-semibold text-slate-400">L / ekor</span>
                  </span>
                </div>
                <input 
                  type="range" 
                  min="5" max="30" step="1"
                  value={milkPerDay} 
                  onChange={(e) => setMilkPerDay(Number(e.target.value))}
                  style={getSliderStyle(milkPerDay, 5, 30)}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-emerald-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md transition-all"
                />
              </div>

              {/* Slider 3: Harga Susu */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-semibold text-slate-600 flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Harga per Liter
                  </label>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
                    Rp {milkPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="5000" max="15000" step="500"
                  value={milkPrice} 
                  onChange={(e) => setMilkPrice(Number(e.target.value))}
                  style={getSliderStyle(milkPrice, 5000, 15000)}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-emerald-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md transition-all"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN KANAN: Hasil (Deep Navy Blue / Slate) */}
          <div className="w-full lg:w-1/2 bg-[#0B1221] p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            
            <div className="flex flex-col h-full justify-between space-y-8">
              
              {/* Pendapatan Saat Ini */}
              <div className="border-b border-slate-700/50 pb-6">
                <p className="text-slate-400 text-sm font-medium mb-2 tracking-wide">Estimasi Saat Ini (Bulanan)</p>
                <p className="text-3xl lg:text-4xl font-bold text-white tracking-tight whitespace-nowrap">
                  <AnimatedValue value={currentMonthlyRevenue} prefix="Rp " />
                </p>
              </div>

              {/* Ekstra Profit (High Contrast Clean Card) */}
              <div className="bg-[#131D33] rounded-2xl p-6 border border-slate-700/60 shadow-inner">
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-emerald-400 text-sm font-bold tracking-wide uppercase">Potensi Ekstra Profit</p>
                  <span className="flex items-center justify-center px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    +18%
                  </span>
                </div>
                <p className="text-3xl sm:text-4xl lg:text-[2.5rem] font-black text-emerald-400 tracking-tighter whitespace-nowrap leading-none">
                  <span className="font-medium mr-1">+</span>
                  <AnimatedValue value={extraRevenue} prefix="Rp " />
                </p>
              </div>

              {/* Total Pendapatan Baru */}
              <div className="pt-2">
                <p className="text-slate-400 text-sm font-medium mb-2 tracking-wide">Total Proyeksi Pendapatan Baru</p>
                <p className="text-4xl sm:text-5xl lg:text-[3rem] font-black text-white tracking-tighter leading-none whitespace-nowrap">
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