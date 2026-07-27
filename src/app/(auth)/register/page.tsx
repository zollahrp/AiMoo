"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase"; 
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const router = useRouter();
  
  // State untuk nyimpen inputan user
  const [fullName, setFullName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State untuk UI
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validasi Password Real-time
  const isLengthValid = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>\-_]/.test(password); 
  
  const isPasswordValid = isLengthValid && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);

    // Validasi final sebelum ke Firebase
    if (!isPasswordValid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validasi Gagal',
        text: 'Password belum memenuhi semua syarat keamanan.',
        confirmButtonColor: '#059669',
      });
      setIsLoading(false);
      return;
    }

    try {
      // 0. RITUAL PENGUSIRAN SESI HANTU 👻
      // Bersihin cache token di browser sebelum daftar biar gak error "USER_NOT_FOUND"
      try {
        await signOut(auth);
      } catch (e) {
        console.log("Tidak ada sesi yang nyangkut, aman.");
      }

      console.log("1. Membuat akun di Firebase Auth...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("2. Menyiapkan ID Peternakan...");
      const farmId = `farm_${Date.now()}`;

      console.log("3. Menyimpan data Peternakan ke Firestore...");
      await setDoc(doc(db, "farms", farmId), {
        farmId: farmId,
        farmName: farmName,
        ownerUid: user.uid,
        settings: {
          timezone: "Asia/Jakarta"
        },
        subscription: {
          planName: "Free Trial",
          status: "active"
        },
        createdAt: serverTimestamp(),
      });

      console.log("4. Menyimpan data User ke Firestore...");
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: fullName,
        farmRoles: {
          [farmId]: "owner"
        },
        isActive: true,
        createdAt: serverTimestamp(),
      });

      console.log("5. Data berhasil disimpan! Mematikan loading...");
      setIsLoading(false); // MATIKAN LOADING DI SINI

      // 6. Tampilkan Alert Sukses
      Swal.fire({
        icon: 'success',
        title: 'Pendaftaran Berhasil!',
        text: 'Akun dan Peternakan Anda telah berhasil dibuat. Silakan login untuk melanjutkan.',
        confirmButtonColor: '#059669',
        confirmButtonText: 'Lanjut ke Login',
        allowOutsideClick: false // Paksa user klik tombol OK
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("6. User klik OK, melakukan proses Logout dan Redirect...");
          // Kita logout lagi dari sesi pendaftaran ini, lalu pindah halaman
          signOut(auth).then(() => {
            router.push("/login");
          });
        }
      });
      
    } catch (err: any) {
      console.error("❌ Error pendaftaran:", err);
      setIsLoading(false); // Pastikan loading mati kalau error
      
      let errorMessage = "Gagal mendaftar. Silakan coba lagi. (" + err.message + ")";
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "Email ini sudah terdaftar. Silakan gunakan email lain atau login.";
      }

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
        confirmButtonColor: '#059669',
      });
    }
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center my-8">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Link href="/">
          <Image src="/image/Logo AiMoo.png" alt="AiMoo" width={140} height={45} className="object-contain hover:scale-105 transition-transform" />
        </Link>
      </div>
      
      <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Daftar Akun Baru</h2>
      <p className="text-slate-500 mb-6 font-medium text-sm">Mulai digitalisasi peternakan Anda hari ini.</p>
      
      {/* Form Pendaftaran */}
      <form onSubmit={handleRegister} className="space-y-4 mb-8 text-left">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Nama Lengkap</label>
          <input 
            type="text" 
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Zolla Perdana Putra Harahap" 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Nama Peternakan</label>
          <input 
            type="text" 
            required
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            placeholder="Fadhli Cinta Sapi Farm" 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
          />
        </div>
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
              placeholder="Masukkan password yang kuat" 
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
            />
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

          {/* Indikator Validasi Real-time */}
          {password.length > 0 && (
            <div className="mt-3 ml-1 space-y-1.5">
              <div className={`flex items-center gap-2 text-[11px] font-semibold ${isLengthValid ? 'text-emerald-500' : 'text-slate-400'}`}>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                Minimal 6 karakter
              </div>
              <div className={`flex items-center gap-2 text-[11px] font-semibold ${hasUpperCase ? 'text-emerald-500' : 'text-slate-400'}`}>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                Mengandung huruf besar
              </div>
              <div className={`flex items-center gap-2 text-[11px] font-semibold ${hasLowerCase ? 'text-emerald-500' : 'text-slate-400'}`}>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                Mengandung huruf kecil
              </div>
              <div className={`flex items-center gap-2 text-[11px] font-semibold ${hasNumber ? 'text-emerald-500' : 'text-slate-400'}`}>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                Mengandung angka
              </div>
              <div className={`flex items-center gap-2 text-[11px] font-semibold ${hasSpecialChar ? 'text-emerald-500' : 'text-slate-400'}`}>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                Mengandung karakter spesial (!@#% dll)
              </div>
            </div>
          )}
        </div>
        
        {/* Tombol Register dengan Spinner Loading */}
        <button 
          type="submit" 
          disabled={isLoading || !isPasswordValid}
          className={`w-full py-3.5 mt-6 text-white rounded-xl font-bold transition-all shadow-md flex justify-center items-center gap-2 ${
            (isLoading || !isPasswordValid) ? "bg-emerald-400/60 cursor-not-allowed shadow-none" : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/25 cursor-pointer"
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
            "Daftar Sekarang"
          )}
        </button>
      </form>
      
      <p className="text-sm font-medium text-slate-500">
        Sudah punya akun? <Link href="/login" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">Masuk di sini</Link>
      </p>
    </div>
  );
}