"use client"; 

import { useEffect, useState, useRef } from "react";

// 1. KOMPONEN RAHASIA: Counter Animasi Premium (Ease-Out)
const AnimatedNumber = ({ endValue, suffix, isVisible }: { endValue: number, suffix: string, isVisible: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Kalau belum masuk layar, jangan mulai ngitung
    if (!isVisible) return;

    let startTime: number | null = null;
    const duration = 2500; // Durasi animasi muter: 2.5 detik

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Rumus Ease-Out Expo: Ngebut di awal, ngerem halus di akhir
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeOut * endValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, endValue]);

  return (
    <span>
      {count.toLocaleString('id-ID')}
      {suffix}
    </span>
  );
};

// 2. KOMPONEN UTAMA
export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      id: 1,
      numericValue: 32, 
      suffix: "+",
      label: "Perusahaan Peternakan",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: 2,
      numericValue: 59,
      suffix: "+",
      label: "Koperasi Peternakan",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5V4a2 2 0 00-2-2h-4m-4 18H2V6a2 2 0 012-2h4m4 16v-6h4v6M6 10h2m-2 4h2" />
        </svg>
      ),
    },
    {
      id: 3,
      numericValue: 254591, 
      suffix: "+",
      label: "Total Pasar Potensial (Ekor)",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 4,
      stringValue: "Dipercaya Peternak", 
      label: "di Seluruh Indonesia",
      isTextHeavy: true, 
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
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
      { threshold: 0.3 } 
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section id="stats" className="bg-white pb-20 relative z-20" ref={sectionRef}>
      <div className="w-full mx-auto px-6 lg:px-16 xl:px-24 max-w-[1600px]">
        
        {/* Banner utama HANYA pakai efek FADE IN (opacity) */}
        <div 
          className={`group relative w-full bg-gradient-to-r from-[#114629] via-[#165a36] to-[#114629] rounded-[2rem] p-8 lg:p-12 shadow-2xl hover:shadow-[0_0_40px_rgba(22,163,74,0.3)] transition-opacity duration-1000 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-y md:divide-y-0 md:divide-x divide-green-700/50">
            
            {stats.map((stat, index) => (
              <div 
                key={stat.id} 
                // Item di dalamnya juga HANYA pakai efek FADE IN (opacity) secara berurutan (stagger)
                className={`flex items-center gap-4 group/item cursor-default transition-opacity duration-700 ease-out
                  ${index === 0 ? "lg:pr-8" : ""}
                  ${index > 0 && index < 3 ? "lg:px-8" : ""}
                  ${index === 3 ? "lg:pl-8" : ""}
                  ${index > 0 ? "pt-6 md:pt-0" : ""}
                  ${isVisible ? "opacity-100" : "opacity-0"}
                `}
                style={{ transitionDelay: `${400 + index * 150}ms` }}
              >
                {/* Icon HANYA beranimasi saat di-hover */}
                <div className="flex-shrink-0 text-green-300 transform group-hover/item:scale-110 group-hover/item:rotate-3 transition-transform duration-500">
                  {stat.icon}
                </div>
                
                {/* Text HANYA beranimasi saat di-hover */}
                <div className="flex flex-col transform group-hover/item:-translate-y-1 transition-transform duration-300">
                  <h4 className={`text-white leading-tight ${stat.isTextHeavy ? 'text-lg font-bold' : 'text-3xl font-extrabold'}`}>
                    {stat.numericValue !== undefined ? (
                      <AnimatedNumber 
                        endValue={stat.numericValue} 
                        suffix={stat.suffix || ""} 
                        isVisible={isVisible} 
                      />
                    ) : (
                      stat.stringValue
                    )}
                  </h4>
                  <p className="text-green-100/80 text-sm mt-1 font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </div>
    </section>
  );
}