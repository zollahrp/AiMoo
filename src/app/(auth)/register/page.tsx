import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md p-8 sm:p-10 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center my-8">
      
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Link href="/">
          <Image 
            src="/image/Logo AiMoo.png" 
            alt="AiMoo" 
            width={140} 
            height={45} 
            className="object-contain hover:scale-105 transition-transform" 
          />
        </Link>
      </div>
      
      <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Daftar Akun Baru</h2>
      <p className="text-slate-500 mb-8 font-medium text-sm">Mulai digitalisasi peternakan Anda hari ini.</p>
      
      {/* Form Dummy */}
      <div className="space-y-4 mb-8 text-left">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Nama Lengkap</label>
          <input type="text" placeholder="Andi Setiawan" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Nama Peternakan</label>
          <input type="text" placeholder="Sukasari Dairy Farm" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Email</label>
          <input type="email" placeholder="contoh@email.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Password</label>
          <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
        </div>
      </div>
      
      {/* Tombol Simulasi ke Dashboard */}
      <Link 
        href="/dashboard" 
        className="block w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-md hover:shadow-emerald-500/25"
      >
        Daftar Sekarang
      </Link>
      
      <p className="mt-8 text-sm font-medium text-slate-500">
        Sudah punya akun? <Link href="/login" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">Masuk di sini</Link>
      </p>
    </div>
  );
}