"use client"; // Wajib pakai ini buat interaksi klik & scroll

import Link from "next/link";

export default function Footer() {
  // Fungsi untuk smooth scroll saat link diklik
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-8 border-t border-slate-800 relative overflow-hidden">
      
      {/* Aksen Cahaya Premium di Background */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 max-w-[1400px] relative z-10">
        
        {/* TOP SECTION: Grid Links & Deskripsi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Kolom 1: Brand & Deskripsi (Lebih Lebar) */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <Link 
              href="#hero" 
              onClick={(e) => handleScrollTo(e, 'hero')} 
              className="flex items-center gap-2 mb-6 transition-transform hover:scale-105 inline-block"
            >
              {/* Logo AiMoo Text */}
              <span className="text-3xl font-black text-white tracking-tighter">
                Ai<span className="text-emerald-500">Moo</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm font-medium">
              Ekosistem digital terintegrasi untuk peternakan cerdas. Tingkatkan efisiensi, deteksi dini penyakit, dan maksimalkan potensi bisnis peternakan Anda dengan teknologi AI & IoT.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/50 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/50 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 21h9a4.5 4.5 0 004.5-4.5v-9A4.5 4.5 0 0016.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21z" /></svg>
              </a>
            </div>
          </div>

          {/* Kolom 2: Navigasi Produk */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Produk</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li><Link href="#fitur" onClick={(e) => handleScrollTo(e, 'fitur')} className="hover:text-emerald-400 transition-colors">Fitur Unggulan</Link></li>
              <li><Link href="#kalkulator" onClick={(e) => handleScrollTo(e, 'kalkulator')} className="hover:text-emerald-400 transition-colors">Kalkulator ROI</Link></li>
              <li><Link href="#harga" onClick={(e) => handleScrollTo(e, 'harga')} className="hover:text-emerald-400 transition-colors">Harga & Paket</Link></li>
              <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Login Dashboard</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Perusahaan */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Perusahaan</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li><Link href="#tentang-kami" onClick={(e) => handleScrollTo(e, 'tentang-kami')} className="hover:text-emerald-400 transition-colors">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Institut Pertanian Bogor</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Hubungi Sales</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Pusat Bantuan</Link></li>
            </ul>
          </div>

          {/* Kolom 4: Legal */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Legal</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Keamanan Data</Link></li>
            </ul>
          </div>

        </div>

        {/* BOTTOM SECTION: Copyright & Tagline Tim */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500 font-medium text-center md:text-left">
            &copy; {new Date().getFullYear()} AiMoo - Institut Pertanian Bogor. All rights reserved.
          </p>
          
          {/* Tagline Tim */}
          <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 py-2 px-4 rounded-full border border-slate-800">
            Dibuat dengan <span className="text-red-500 animate-pulse">❤️</span> oleh 
            <span className="font-bold text-emerald-400 tracking-tight ml-1">Tim Fadhli Cinta Sapi</span>
          </div>
        </div>

      </div>
    </footer>
  );
}