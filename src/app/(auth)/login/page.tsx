"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State untuk UI
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Fungsi otentikasi dari Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      setIsLoading(false);

      // SweetAlert Sukses (Otomatis hilang dalam 1.5 detik)
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        text: 'Mengarahkan ke dashboard...',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false
      }).then(() => {
        router.push("/dashboard");
      });

    } catch (err: any) {
      console.error(err);
      setIsLoading(false); // Matikan loading kalau error
      
      // Translate error Firebase
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = "Email atau password yang Anda masukkan salah.";
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "Terlalu banyak percobaan gagal. Akun dikunci sementara, silakan coba beberapa saat lagi.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "Format email tidak valid.";
      }

      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: errorMessage,
        confirmButtonColor: '#059669',
      });
    }
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Link href="/">
          <Image src="/image/Logo AiMoo.png" alt="AiMoo" width={140} height={45} className="object-contain hover:scale-105 transition-transform" />
        </Link>
      </div>
      
      <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Selamat Datang!</h2>
      <p className="text-slate-500 mb-8 font-medium text-sm">Masuk ke dashboard peternakan Anda.</p>

      {/* Form Login */}
      <form onSubmit={handleLogin} className="space-y-4 mb-8 text-left">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Email</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contoh@email.com" 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
            />
            {/* Tombol Mata */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.188-1.556c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Tombol Login dengan Spinner Loading */}
        <button 
          type="submit"
          disabled={isLoading}
          className={`w-full py-3.5 mt-6 text-white rounded-xl font-bold transition-all shadow-md flex justify-center items-center gap-2 ${
            isLoading ? "bg-emerald-400/60 cursor-not-allowed shadow-none" : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/25 cursor-pointer"
          }`}
        >
          {isLoading ? (
            <>
              {/* Animasi Spinner SVG */}
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </>
          ) : (
            "Masuk Dashboard"
          )}
        </button>
      </form>
      
      <p className="text-sm font-medium text-slate-500">
        Belum punya akun? <Link href="/register" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">Daftar Gratis</Link>
      </p>
    </div>
  );
}