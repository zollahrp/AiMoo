"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, getDoc, addDoc, doc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function VaksinasiObatPage() {
  const [farmId, setFarmId] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data State
  const [cowsList, setCowsList] = useState<any[]>([]);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  
  // Stok Obat State (Simulasi)
  const [medicineStock, setMedicineStock] = useState([
    { name: "Oxytetracycline", unit: "Vial", stock: 2, status: "Rendah", icon: "💊" },
    { name: "Ceftiofur", unit: "Vial", stock: 5, status: "Sedang", icon: "💉" },
    { name: "Flunixin Meglumine", unit: "Vial", stock: 8, status: "Aman", icon: "💊" },
    { name: "Albendazole", unit: "Botol", stock: 3, status: "Sedang", icon: "🧪" },
    { name: "Povidone Iodine", unit: "Botol", stock: 6, status: "Aman", icon: "🧫" },
  ]);

  // 🔥 STATE UNTUK GEMINI AI 🔥
  const [aiInsight, setAiInsight] = useState<string>("STATUS: MEMPROSES...\nANALISIS: Mengumpulkan data kepatuhan vaksinasi dan inventaris obat...");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // =====================================================================
  // 1. INIT AUTH & FETCH DATA
  // =====================================================================
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        try {
          const userDocRef = doc(db, `users/${user.uid}`);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const uFarmId = Object.keys(userDoc.data().farmRoles || {})[0];
            if (uFarmId) setFarmId(uFarmId);
            else setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!farmId) return;

    // Ambil Data Sapi 
    const qCows = query(collection(db, "cows"), where("farmId", "==", farmId));
    const unsubCows = onSnapshot(qCows, (snap) => setCowsList(snap.docs.map(d => d.data())));

    // Ambil Data Rekam Medis (Kita butuh yang tipenya "Vaksinasi" atau "Pengobatan")
    const qHealth = query(collection(db, "health_records"), where("farmId", "==", farmId));
    const unsubHealth = onSnapshot(qHealth, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setHealthRecords(data);
      setIsLoading(false);
    });

    return () => { unsubCows(); unsubHealth(); };
  }, [farmId]);

  // =====================================================================
  // 2. LOGIKA MATEMATIKA KALENDER & KPI
  // =====================================================================
  const today = new Date();
  const currentMonth = today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({length: daysInMonth}, (_, i) => i + 1);

  // Filter khusus Pengobatan & Vaksin
  const treatments = healthRecords.filter(r => r.type === "Pengobatan" || r.type === "Obat");
  const vaccines = healthRecords.filter(r => r.type === "Vaksinasi");

  // KPI Hitungan
  const past7Days = new Date(today); past7Days.setDate(today.getDate() - 7);
  const future7Days = new Date(today); future7Days.setDate(today.getDate() + 7);

  // Simulasi Jadwal Mendatang (Kita buat acak dari sisa sapi yang belum divaksin bulan ini)
  const jadwalVaksinMendatang = cowsList.slice(0, 5); 
  const jadwalObatMendatang = cowsList.slice(2, 9);
  
  // Withdrawal Period (Sapi yang diobati dalam 7 hari terakhir, susunya gak boleh dijual)
  const withdrawalCows = treatments.filter(r => new Date(r.date) >= past7Days && new Date(r.date) <= today);
  const uniqueWithdrawal = [...new Set(withdrawalCows.map(r => r.cowId))];

  // Kalender Markings
  const calMarks: Record<number, { vaks: boolean, med: boolean }> = {};
  
  healthRecords.forEach(r => {
    const d = new Date(r.date);
    if (d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
      const day = d.getDate();
      if (!calMarks[day]) calMarks[day] = { vaks: false, med: false };
      
      if (r.type === "Vaksinasi") calMarks[day].vaks = true;
      if (r.type === "Pengobatan") calMarks[day].med = true;
    }
  });

  // =====================================================================
  // 🔥 FUNGSI GEMINI AI (PENGELOLA FARMASI FARM)
  // =====================================================================
  const fetchGeminiInsight = async () => {
    if (isLoading || !process.env.NEXT_PUBLIC_GEMINI_API_KEY) return;

    setIsAiLoading(true);
    setAiInsight("STATUS: MEMPROSES...\nANALISIS: Mengumpulkan data kepatuhan vaksinasi dan inventaris obat...");

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

      const prompt = `
        Kamu adalah AI Apoteker dan Pengawas Medis Peternakan (AI Moo).
        Data Inventaris & Jadwal Farm Hari Ini:
        - Vaksinasi Mendatang (7 Hari): ${jadwalVaksinMendatang.length} ekor
        - Obat Rutin Mendatang (7 Hari): ${jadwalObatMendatang.length} ekor
        - Sapi dalam Masa Withdrawal Obat (Susu tak boleh dijual): ${uniqueWithdrawal.length} ekor
        - Stok Obat Rendah/Kritis: ${medicineStock.filter(m => m.status === 'Rendah').map(m => m.name).join(", ") || "Tidak ada"}

        Tugas: Analisis kepatuhan medis dan status inventaris obat.
        
        Berikan jawaban STRICT dengan format ini (TANPA EMOJI, TANPA MARKDOWN BINTANG):
        STATUS: [Pilih satu: AMAN / PERINGATAN / KRITIS]
        ANALISIS: [2-3 kalimat rangkuman tindakan medis minggu ini, pengingat masa withdrawal, dan saran belanja/restock obat]
      `;

      const result = await model.generateContent(prompt);
      setAiInsight(result.response.text());
    } catch (error) {
      console.error("Gagal memanggil Gemini API:", error);
      setAiInsight("STATUS: ERROR\nANALISIS: Maaf, koneksi ke server AI terputus. Silakan sinkronisasi ulang.");
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && cowsList.length > 0) {
      fetchGeminiInsight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // =====================================================================
  // 3. GENERATE DUMMY DATA MEDIS
  // =====================================================================
  const generateDummyData = async () => {
    if (!farmId || !userUid) return;
    
    if (cowsList.length < 5) {
      Swal.fire("Sapi Kurang!", "Harap ke menu Data Ternak dulu dan klik 'Generate Dummy Sapi' di sana minimal 1x.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const meds = ["Flunixin Meglumine", "Ceftiofur", "Oralit + Antidiare", "Albendazole", "Povidone Iodine"];
      const vaks = ["PMK (Penyakit Mulut Kuku)", "IBR (Infectious Bovine)", "BVD (Bovine Viral)"];
      const diags = ["Demam", "Mastitis", "Diare", "Cacingan", "Luka Kuku"];

      for (let i = 0; i < 15; i++) { 
        const isVaksin = Math.random() > 0.6; // 40% kemungkinan vaksin
        const randomDaysAgo = Math.floor(Math.random() * 30);
        const d = new Date(); d.setDate(d.getDate() - randomDaysAgo);
        const randCow = cowsList[Math.floor(Math.random() * cowsList.length)];
        
        if (isVaksin) {
          await addDoc(collection(db, "health_records"), {
            farmId, cowId: randCow.cowId, date: d.toISOString(), type: "Vaksinasi", 
            diagnosis: "Vaksin Rutin", details: vaks[Math.floor(Math.random() * vaks.length)], 
            handledBy: "Mantri Hewan", createdAt: serverTimestamp()
          });
        } else {
          const randIdx = Math.floor(Math.random() * diags.length);
          await addDoc(collection(db, "health_records"), {
            farmId, cowId: randCow.cowId, date: d.toISOString(), type: "Pengobatan", 
            diagnosis: diags[randIdx], details: meds[randIdx], 
            handledBy: "Dr. AI Moo", createdAt: serverTimestamp()
          });
        }
      }

      Swal.fire("Selesai!", "Riwayat Vaksinasi & Pengobatan berhasil di-generate!", "success");
    } catch (e: any) {
      Swal.fire("Error", e.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStrDisplay = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-[1600px] mx-auto pb-10 relative animate-in fade-in duration-500">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Vaksinasi & Obat</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola jadwal vaksinasi, pemberian obat, dan riwayat pengobatan sapi.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={generateDummyData} disabled={isSubmitting} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer">
            ✨ Generate Data Medis
          </button>

          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-default">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-sm font-bold text-slate-700">{todayStrDisplay}</span>
          </button>
        </div>
      </div>

      {/* JIKA DATA MASIH LOADING */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-emerald-600 font-bold animate-pulse">
          Memuat Sistem Farmasi...
        </div>
      ) : (
      <>
        {/* 2. KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
               <svg className="w-6 h-6 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-6 6" /></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">Jadwal Vaksinasi Mendatang</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{jadwalVaksinMendatang.length} <span className="text-sm font-semibold text-slate-400">sapi</span></p>
              <p className="text-[10px] font-medium text-slate-500 mt-0.5">Dalam 7 hari ke depan</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v4m-2-2h4" /></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">Jadwal Obat Mendatang</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{jadwalObatMendatang.length} <span className="text-sm font-semibold text-slate-400">sapi</span></p>
              <p className="text-[10px] font-medium text-slate-500 mt-0.5">Dalam 7 hari ke depan</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">Masa Withdrawal</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{uniqueWithdrawal.length} <span className="text-sm font-semibold text-slate-400">sapi</span></p>
              <p className="text-[10px] font-bold text-blue-500 mt-0.5">Susu JANGAN dipasarkan</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">Selesai Tepat Waktu</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">92%</p>
              <p className="text-[10px] font-medium text-slate-500 mt-0.5">Vaksinasi bulan ini</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${medicineStock.some(m => m.status === 'Rendah') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-teal-50 text-teal-600'}`}>
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">Obat Stok Rendah</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{medicineStock.filter(m => m.status === 'Rendah').length} <span className="text-sm font-semibold text-slate-400">jenis</span></p>
              <p className="text-[10px] font-medium text-slate-500 mt-0.5">Perlu restock</p>
            </div>
          </div>

        </div>

        {/* 3. MIDDLE SECTION (List, Calendar, Alerts) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
          
          {/* Kolom Kiri: Jadwal Vaksinasi Mendatang */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 mb-5">Jadwal Vaksinasi Mendatang</h3>
            <div className="space-y-4 flex-1">
              {jadwalVaksinMendatang.map((cow, i) => {
                const daysLeft = i + 2; 
                const futureD = new Date(today); futureD.setDate(today.getDate() + daysLeft);
                const vakType = ["PMK (Penyakit Mulut Kuku)", "IBR (Infectious Bovine)", "BVD (Bovine Viral)"][i % 3];

                return (
                  <div key={cow.cowId} className="flex items-center gap-3 bg-white hover:bg-slate-50 transition-colors group cursor-pointer border-b border-slate-50 pb-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                      <Image src={cow.photoUrl || "/image/Logo AiMoo.png"} alt="Cow" width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900">#{cow.tagNumber} - {cow.name}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{vakType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-emerald-600">{futureD.toLocaleDateString('id-ID', {day: 'numeric', month:'short'})}</p>
                      <p className="text-[9px] font-bold text-emerald-500">{daysLeft} hari lagi</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Kolom Tengah: Kalender Dinamis */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Kalender Vaksinasi & Treatment</h3>
            
            <div className="flex justify-between items-center mb-4">
              <button className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
              <span className="text-xs font-bold text-slate-800">{currentMonth}</span>
              <button className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></button>
            </div>

            <div className="grid grid-cols-7 text-center mb-2">
              {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(day => (
                <span key={day} className="text-[10px] font-bold text-slate-400">{day}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-semibold text-slate-700 flex-1 content-start">
              <div className="p-2 text-slate-300"></div><div className="p-2 text-slate-300"></div>
              {calendarDays.map((day) => {
                const isToday = day === today.getDate();
                const marks = calMarks[day];
                
                return (
                  <div key={day} className="p-2 relative cursor-pointer hover:bg-slate-50 rounded-lg transition-colors group">
                    <span className={`${isToday ? "bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto shadow-sm" : ""}`}>
                      {day}
                    </span>
                    {marks && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5 group-hover:scale-150 transition-transform">
                        {marks.vaks && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                        {marks.med && <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 text-[9px] font-bold text-slate-500 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Vaksinasi</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Obat / Treatment</div>
            </div>
          </div>

          {/* Kolom Kanan: Pengingat & Peringatan */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
              <span className="text-amber-500 text-lg">🔔</span> Pengingat Withdrawal
            </h3>
            
            <div className="space-y-4 flex-1">
              {uniqueWithdrawal.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 opacity-60">
                  <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-xs font-bold text-center">Tidak ada sapi dalam masa withdrawal obat.</p>
                </div>
              ) : (
                withdrawalCows.map((r, i) => {
                  const cowName = cowsList.find(c => c.cowId === r.cowId)?.name || "?";
                  const tglSelesai = new Date(r.date); tglSelesai.setDate(tglSelesai.getDate() + 5); // Simulasi withdrawal 5 hari
                  return (
                    <div key={i} className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 flex gap-3 hover:bg-blue-50 transition-colors cursor-pointer">
                      <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <div>
                        <p className="text-[11px] font-bold text-slate-800 mb-0.5">Sapi #{cowName}</p>
                        <p className="text-[10px] text-slate-600 leading-relaxed mb-1">Masa withdrawal <b>{r.details}</b>. Susu jangan dijual hingga {tglSelesai.toLocaleDateString('id-ID', {day: 'numeric', month:'short'})}.</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

        </div>

        {/* 4. BOTTOM SECTION (2 Tables + AI) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Riwayat Treatment */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Riwayat Pengobatan & Vaksinasi</h3>
            </div>
            <div className="overflow-x-auto flex-1 max-h-[300px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-white sticky top-0 z-10 shadow-sm">
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="pb-3 px-2 font-semibold">Tanggal</th>
                    <th className="pb-3 px-2 font-semibold">Tipe</th>
                    <th className="pb-3 px-2 font-semibold">Sapi</th>
                    <th className="pb-3 px-2 font-semibold">Obat / Vaksin</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-50">
                  {healthRecords.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-400 font-medium">Belum ada riwayat medis.</td></tr>}
                  {healthRecords.slice(0, 10).map((r, i) => {
                    const cowInfo = cowsList.find(c => c.cowId === r.cowId) || {};
                    return (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                        <td className="py-3 px-2 font-medium">{new Date(r.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded text-[9px] font-bold border ${r.type === 'Vaksinasi' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-purple-50 text-purple-700 border-purple-100'}`}>
                            {r.type}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-bold text-slate-800">#{cowInfo.tagNumber}</td>
                        <td className="py-3 px-2 font-medium text-slate-600 truncate max-w-[120px]">{r.details}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stok Obat */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Stok Apotek Farm</h3>
            </div>

            <div className="overflow-x-auto flex-1 max-h-[300px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-white sticky top-0 z-10 shadow-sm">
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="pb-3 px-2 font-semibold">Nama Obat</th>
                    <th className="pb-3 px-2 font-semibold text-center">Stok</th>
                    <th className="pb-3 px-2 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-50">
                  {medicineStock.map((m, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                      <td className="py-3 px-2 flex items-center gap-2 font-bold text-slate-800"><span className="text-base">{m.icon}</span> {m.name}</td>
                      <td className="py-3 px-2 text-center font-medium">{m.stock} <span className="text-[10px] text-slate-400">{m.unit}</span></td>
                      <td className="py-3 px-2 text-center">
                        <span className={`px-2 py-1 rounded text-[9px] font-bold border ${m.status === 'Rendah' ? 'bg-red-50 text-red-600 border-red-100' : m.status === 'Sedang' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insight (BADGE UI) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-200/60 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className={`text-emerald-500 transition-transform ${isAiLoading ? 'animate-spin' : 'group-hover:scale-110 group-hover:rotate-12'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span> 
                Pengawas AI Moo
              </h3>
              
              <button 
                onClick={fetchGeminiInsight}
                disabled={isAiLoading}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-emerald-100 disabled:opacity-50"
              >
                <svg className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync
              </button>
            </div>
            
            {(() => {
              const rawStatus = aiInsight.match(/STATUS:\s*(.*)/);
              const rawAnalysis = aiInsight.match(/ANALISIS:\s*([\s\S]*)/);
              
              const statusText = rawStatus ? rawStatus[1].trim().toUpperCase() : (isAiLoading ? "MEMPROSES..." : "MENUNGGU DATA");
              const analysisText = rawAnalysis ? rawAnalysis[1].trim() : aiInsight;

              let badgeColor = "bg-slate-100 text-slate-700 border-slate-200 shadow-slate-500/10";
              let cardBgColor = "bg-slate-50/50 border-slate-100/50";
              let statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

              if (statusText.includes("AMAN")) {
                badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm shadow-emerald-500/20";
                cardBgColor = "bg-emerald-50/30 border-emerald-100/50";
                statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
              } else if (statusText.includes("PERINGATAN")) {
                badgeColor = "bg-amber-100 text-amber-800 border-amber-200 shadow-sm shadow-amber-500/20";
                cardBgColor = "bg-amber-50/30 border-amber-100/50";
                statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
              } else if (statusText.includes("KRITIS") || statusText.includes("ERROR")) {
                badgeColor = "bg-red-100 text-red-800 border-red-200 shadow-sm shadow-red-500/20";
                cardBgColor = "bg-red-50/30 border-red-100/50";
                statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>;
              }

              return (
                <div className={`p-5 rounded-xl border flex-1 relative z-10 transition-colors duration-300 ${cardBgColor}`}>
                  {isAiLoading ? (
                    <div className="flex flex-col gap-3 animate-pulse mt-1">
                      <div className="h-5 bg-slate-200/70 rounded-md w-28 mb-1"></div>
                      <div className="h-2.5 bg-slate-200/70 rounded w-full"></div>
                      <div className="h-2.5 bg-slate-200/70 rounded w-5/6"></div>
                      <div className="h-2.5 bg-slate-200/70 rounded w-4/6"></div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wide ${badgeColor}`}>
                          {statusIcon}
                          {statusText}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 leading-relaxed font-medium mt-1 whitespace-pre-wrap">
                        {analysisText}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

        </div>

      </>
      )}

    </div>
  );
}