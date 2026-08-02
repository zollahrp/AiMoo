"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, getDoc, addDoc, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function ReproduksiPage() {
  const [farmId, setFarmId] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data State
  const [cowsList, setCowsList] = useState<any[]>([]);
  const [reproRecords, setReproRecords] = useState<any[]>([]);

  // TABS
  const [activeTab, setActiveTab] = useState("Ringkasan");
  const tabs = ["Ringkasan", "Deteksi Birahi", "IB & Kebuntingan", "Riwayat Reproduksi", "Analisis"];

  // 🔥 STATE UNTUK GEMINI AI 🔥
  const [aiInsight, setAiInsight] = useState<string>("STATUS: MEMPROSES...\nANALISIS: Mengumpulkan data reproduksi seluruh peternakan untuk dievaluasi oleh AI...");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // =====================================================================
  // 1. INIT AUTH & FETCH DATA (SUPER AMAN)
  // =====================================================================
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        try {
          const userDocRef = doc(db, `users/${user.uid}`);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const uFarmId = Object.keys(userData.farmRoles || {})[0];
            if (uFarmId) {
              setFarmId(uFarmId);
            } else {
              setIsLoading(false);
            }
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

    // Ambil Data Sapi Master
    const qCows = query(collection(db, "cows"), where("farmId", "==", farmId));
    const unsubCows = onSnapshot(qCows, (snap) => {
      const data = snap.docs.map(d => d.data());
      setCowsList(data);
    });

    // Ambil Data Reproduksi
    const qRepro = query(collection(db, "reproduction_records"), where("farmId", "==", farmId));
    const unsubRepro = onSnapshot(qRepro, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Urutkan dari yang terbaru
      data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setReproRecords(data);
      setIsLoading(false);
    });

    return () => { unsubCows(); unsubRepro(); };
  }, [farmId]);

  // =====================================================================
  // 2. LOGIKA MATEMATIKA REPRODUKSI (AI)
  // =====================================================================
  
  // Hitung Sapi Birahi (Cek riwayat "Birahi" 72 jam terakhir biar nggak gampang kelewat)
  const countBirahi = reproRecords.filter(r => 
    (r.activityType?.includes("Birahi")) && 
    (new Date().getTime() - new Date(r.date).getTime() < 72 * 3600 * 1000)
  ).length;
  
  // KPI Status Sapi
  const perluIB = cowsList.filter(c => c.currentStatus?.reproduction === "Kosong" || c.currentStatus?.reproduction === "Perlu IB").length;
  const totalBunting = cowsList.filter(c => c.currentStatus?.reproduction === "Bunting" || c.currentStatus?.reproduction === "Bunting Tua").length;
  const persentaseBunting = cowsList.length > 0 ? ((totalBunting / cowsList.length) * 100).toFixed(1) : "0";
  const mendekatiBeranak = cowsList.filter(c => c.currentStatus?.reproduction === "Bunting Tua").length;
  const repeatBreeder = cowsList.filter(c => c.currentStatus?.health === "Repeat Breeder").length;

  // List Sapi di UI
  const sapiPerhatian = cowsList.filter(c => c.currentStatus?.reproduction === "Kosong" || c.currentStatus?.health === "Repeat Breeder").slice(0, 3);
  const sapiMelahirkan = cowsList.filter(c => c.currentStatus?.reproduction === "Bunting Tua").slice(0, 3);

  // Kalender Pintar
  const today = new Date();
  const currentMonth = today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({length: daysInMonth}, (_, i) => i + 1);

  const reproMarks: Record<number, string> = {};
  
  // Tanda kejadian asli
  reproRecords.forEach(r => {
    const d = new Date(r.date);
    if (d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
      if (r.activityType?.includes("Birahi")) reproMarks[d.getDate()] = "bg-green-500";
      if (r.activityType?.includes("IB")) reproMarks[d.getDate()] = "bg-purple-500";
      if (r.activityType?.includes("Beranak")) reproMarks[d.getDate()] = "bg-red-500";
      if (r.activityType?.includes("PK") || r.activityType?.includes("Pemeriksaan")) reproMarks[d.getDate()] = "bg-blue-500";
    }
  });

  // Tanda prediksi siklus (+21 hari)
  reproRecords.forEach(r => {
    const d = new Date(r.date);
    const predictedDate = new Date(d);
    predictedDate.setDate(predictedDate.getDate() + 21);

    if (predictedDate.getMonth() === today.getMonth() && predictedDate.getFullYear() === today.getFullYear()) {
       if (!reproMarks[predictedDate.getDate()]) {
         reproMarks[predictedDate.getDate()] = "bg-amber-400"; 
       }
    }
  });

  // =====================================================================
  // 🔥 FUNGSI GEMINI AI (KHUSUS MANAJEMEN REPRODUKSI FARM)
  // =====================================================================
  const fetchGeminiInsight = async () => {
    if (isLoading || !process.env.NEXT_PUBLIC_GEMINI_API_KEY) return;

    setIsAiLoading(true);
    setAiInsight("STATUS: MEMPROSES...\nANALISIS: Mengumpulkan data siklus reproduksi, birahi, dan kebuntingan...");

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

      const prompt = `
        Kamu adalah sistem AI manajer reproduksi peternakan sapi perah (AI Moo).
        Data Status Reproduksi Farm Saat Ini:
        - Sapi Birahi (72 jam terakhir): ${countBirahi} ekor
        - Sapi Kosong / Perlu IB: ${perluIB} ekor
        - Sapi Bunting: ${totalBunting} ekor (${persentaseBunting}% dari total populasi)
        - Sapi Mendekati Beranak (Bunting Tua): ${mendekatiBeranak} ekor
        - Sapi Repeat Breeder (Masalah Medis): ${repeatBreeder} ekor

        Tugas: Analisis performa reproduksi farm secara keseluruhan hari ini.
        
        Berikan jawaban STRICT dengan format ini (TANPA EMOJI, TANPA MARKDOWN BINTANG):
        STATUS: [Pilih satu yang paling tepat: AMAN / PERINGATAN / KRITIS]
        ANALISIS: [2-3 kalimat rangkuman performa, berikan rekomendasi terkait sapi yang sedang birahi atau penanganan repeat breeder jika ada]
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

  // Panggil AI otomatis setelah data pertama kali sukses diload
  useEffect(() => {
    if (!isLoading && cowsList.length > 0) {
      fetchGeminiInsight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // =====================================================================
  // 3. GENERATE DUMMY DATA (ACAK STATUS SAPI YANG UDAH ADA)
  // =====================================================================
  const generateDummyData = async () => {
    if (!farmId || !userUid) return;
    
    if (cowsList.length < 3) {
      Swal.fire("Sapi Kurang!", "Harap ke menu Data Ternak dulu dan klik 'Generate Dummy Sapi' di sana minimal 1x.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      // Kita acak 3 sapi pertama dari database
      const cow1 = cowsList[0]; // Jadikan Birahi
      const cow2 = cowsList[1]; // Jadikan Bunting Tua
      const cow3 = cowsList[2]; // Jadikan Repeat Breeder

      // Update Sapi 1 (Lara -> Kosong & Birahi)
      await updateDoc(doc(db, `cows/${cow1.cowId}`), {
        "currentStatus.reproduction": "Kosong", "currentStatus.health": "Sehat"
      });
      await addDoc(collection(db, "reproduction_records"), {
        farmId, cowId: cow1.cowId, date: new Date().toISOString(), activityType: "Birahi Terdeteksi", details: "Skor Tinggi (Lendir Bening)", handledBy: "Sistem AI", createdAt: serverTimestamp()
      });

      // Update Sapi 2 (Moly -> Bunting Tua)
      await updateDoc(doc(db, `cows/${cow2.cowId}`), {
        "currentStatus.reproduction": "Bunting Tua", "currentStatus.health": "Sehat"
      });
      let oldD = new Date(); oldD.setMonth(oldD.getMonth() - 8); // 8 bulan lalu
      await addDoc(collection(db, "reproduction_records"), {
        farmId, cowId: cow2.cowId, date: oldD.toISOString(), activityType: "Pemeriksaan Kebuntingan (PK)", details: "Positif (8 Bulan)", handledBy: "Dr. Hewan", createdAt: serverTimestamp()
      });

      // Update Sapi 3 (Bessie -> Repeat Breeder)
      await updateDoc(doc(db, `cows/${cow3.cowId}`), {
        "currentStatus.reproduction": "Kosong", "currentStatus.health": "Repeat Breeder"
      });
      let failD = new Date(); failD.setDate(failD.getDate() - 25); // 25 hari lalu
      await addDoc(collection(db, "reproduction_records"), {
        farmId, cowId: cow3.cowId, date: failD.toISOString(), activityType: "IB", details: "Gagal bunting (IB ke-3)", handledBy: "Mantri", createdAt: serverTimestamp()
      });

      Swal.fire("Selesai!", "Status sapi berhasil diacak! Sekarang kalender dan KPI penuh warna.", "success");
    } catch (e: any) {
      Swal.fire("Error", e.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStrDisplay = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-[1600px] mx-auto pb-10 relative animate-in fade-in duration-500">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Reproduksi</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Pantau siklus reproduksi dan tingkat kebuntingan sapi Anda.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={generateDummyData} disabled={isSubmitting} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer">
            ✨ Generate Data Dummy
          </button>

          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-default">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-sm font-bold text-slate-700">{todayStrDisplay}</span>
          </button>
        </div>
      </div>

      {/* 2. TABS NAVIGATION */}
      <div className="border-b border-slate-200 mb-6 flex overflow-x-auto no-scrollbar animate-in fade-in duration-500 delay-100">
        {tabs.map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap pb-4 px-5 text-sm font-bold transition-colors cursor-pointer ${
              activeTab === tab ? "text-emerald-600 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* JIKA DATA MASIH LOADING */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-emerald-600 font-bold animate-pulse">
          Memuat Data Reproduksi...
        </div>
      ) : activeTab === "Ringkasan" && (
        <>
          {/* 3. KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer animate-in slide-in-from-bottom-4 duration-500">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-0.5">Sapi Birahi</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{countBirahi} <span className="text-sm font-semibold text-slate-400">ekor</span></p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">72 Jam Terakhir</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer animate-in slide-in-from-bottom-4 duration-500 delay-75">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-0.5">Perlu IB</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{perluIB} <span className="text-sm font-semibold text-slate-400">ekor</span></p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">Status Kosong</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer animate-in slide-in-from-bottom-4 duration-500 delay-100">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-0.5">Bunting</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{totalBunting} <span className="text-sm font-semibold text-slate-400">ekor</span></p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">{persentaseBunting}% dari total sapi</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer animate-in slide-in-from-bottom-4 duration-500 delay-150">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-0.5">Mendekati Beranak</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{mendekatiBeranak} <span className="text-sm font-semibold text-slate-400">ekor</span></p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">Bunting Tua</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer animate-in slide-in-from-bottom-4 duration-500 delay-200">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 mb-0.5">Repeat Breeder</p>
                <p className="text-2xl font-black text-red-600 tracking-tight">{repeatBreeder} <span className="text-sm font-semibold text-red-400">ekor</span></p>
                <p className="text-[10px] font-bold text-red-500 mt-0.5">Perlu perhatian medis</p>
              </div>
            </div>

          </div>

          {/* 4. MIDDLE SECTION (3 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch animate-in slide-in-from-bottom-6 duration-700 delay-200">
            
            {/* Kolom Kiri: Sapi Perlu Perhatian */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-slate-900 mb-5">Sapi Perlu Perhatian</h3>
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                {sapiPerhatian.length === 0 && <p className="text-xs text-slate-400 text-center py-10">Semua sapi dalam kondisi baik.</p>}
                
                {sapiPerhatian.map(cow => (
                  <div key={cow.cowId} className="flex items-center gap-3 p-3 bg-white border border-slate-100 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 shadow-sm">
                      <Image src={cow.photoUrl || "/image/Logo AiMoo.png"} alt="Cow" width={48} height={48} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-0.5">
                        <p className="text-xs font-bold text-slate-900">#{cow.tagNumber} - {cow.name}</p>
                        {cow.currentStatus?.health === "Repeat Breeder" ? (
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[9px] font-bold rounded border border-red-100">Repeat Breeder</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold rounded border border-amber-100">Belum Bunting</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">Status: {cow.currentStatus?.reproduction || "Kosong"}</p>
                    </div>
                    <svg className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </div>
                ))}
              </div>
              <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left hover:underline cursor-pointer">Lihat semua sapi perlu perhatian →</button>
            </div>

            {/* Kolom Tengah: Kalender Reproduksi */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Kalender Siklus ({currentMonth})</h3>
              
              <div className="flex justify-between items-center mb-4">
                <button className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
                <span className="text-xs font-bold text-slate-800">{currentMonth}</span>
                <button className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></button>
              </div>

              <div className="grid grid-cols-7 text-center mb-2">
                {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(day => (
                  <span key={day} className="text-[10px] font-bold text-slate-400">{day}</span>
                ))}
              </div>

              {/* Kalender Dinamis */}
              <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-semibold text-slate-700 flex-1 content-start">
                <div className="p-2 text-slate-300"></div><div className="p-2 text-slate-300"></div>
                
                {calendarDays.map((day) => {
                  const isToday = day === today.getDate();
                  const markColor = reproMarks[day] || ""; 
                  
                  return (
                    <div key={day} className="p-2 relative cursor-pointer hover:bg-slate-50 rounded-lg transition-colors group">
                      <span className={`${isToday ? "bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto shadow-sm" : ""}`}>
                        {day}
                      </span>
                      {markColor && (
                        <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${markColor} group-hover:scale-150 transition-transform`}></span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Legend Kalender */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 text-[9px] font-bold text-slate-500 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Birahi</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Prediksi Siklus/IB</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Telah Di-IB</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Cek Bunting (PK)</div>
              </div>
            </div>

            {/* Kolom Kanan: AI Insight (DI-REWRITE TOTAL MENJADI FORMAT BADGE TANPA EMOJI) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-200/60 transition-colors duration-500 pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-4 relative z-10">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className={`text-purple-600 transition-transform ${isAiLoading ? 'animate-spin' : 'group-hover:scale-110 group-hover:rotate-12'}`}>
                    {/* SVG Sparkles (Menggantikan Emoji 🤖/✨) */}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span> 
                  Diagnosis Cerdas AI Moo
                </h3>
                
                <button 
                  onClick={fetchGeminiInsight}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-purple-100 disabled:opacity-50"
                >
                  {/* SVG Refresh (Menggantikan Emoji 🔄) */}
                  <svg className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Sinkronisasi AI
                </button>
              </div>
              
              {/* PARSING HASIL GEMINI MENJADI UI BADGE */}
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

          {/* 5. BOTTOM SECTION (2 Columns) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch animate-in slide-in-from-bottom-8 duration-700 delay-300">
            
            {/* Table: Aktivitas Reproduksi Terbaru */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Riwayat Reproduksi Semua Sapi</h3>
              <div className="overflow-x-auto flex-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-white sticky top-0 z-10 shadow-sm">
                    <tr className="text-slate-500 border-b border-slate-100">
                      <th className="py-3 px-4 font-semibold">Tanggal</th>
                      <th className="py-3 px-4 font-semibold">ID Sapi</th>
                      <th className="py-3 px-4 font-semibold">Aktivitas</th>
                      <th className="py-3 px-4 font-semibold">Detail</th>
                      <th className="py-3 px-4 font-semibold">Oleh</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 divide-y divide-slate-50">
                    {reproRecords.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-slate-400 font-medium">Belum ada riwayat reproduksi.</td></tr>}
                    
                    {reproRecords.map(r => {
                      const cowInfo = cowsList.find(c => c.cowId === r.cowId) || {};
                      
                      let badgeStyle = "bg-slate-100 text-slate-600";
                      if (r.activityType?.includes("Birahi")) badgeStyle = "bg-green-100 text-green-700 border-green-200";
                      if (r.activityType?.includes("IB")) badgeStyle = "bg-purple-100 text-purple-700 border-purple-200";
                      if (r.activityType?.includes("Pemeriksaan") || r.activityType?.includes("PK")) badgeStyle = "bg-blue-100 text-blue-700 border-blue-200";
                      if (r.activityType?.includes("Beranak")) badgeStyle = "bg-red-100 text-red-700 border-red-200";

                      return (
                        <tr key={r.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                          <td className="py-3 px-4 font-medium">{new Date(r.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          <td className="py-3 px-4 font-bold text-slate-800">#{cowInfo.tagNumber || "?"} - {cowInfo.name || "Terhapus"}</td>
                          <td className="py-3 px-4"><span className={`px-2 py-1 rounded font-bold text-[9px] border ${badgeStyle}`}>{r.activityType}</span></td>
                          <td className="py-3 px-4 truncate max-w-[150px] text-slate-500" title={r.details}>{r.details}</td>
                          <td className="py-3 px-4 font-medium text-slate-600">{r.handledBy}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* List: Sapi Mendekati Beranak */}
            <div className="xl:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
                <span className="text-blue-500 text-lg">🍼</span> Mendekati Masa Beranak
              </h3>
              <div className="space-y-4 flex-1">
                {sapiMelahirkan.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-10">Tidak ada sapi di trimester akhir.</p>
                ) : (
                  sapiMelahirkan.map(cow => (
                    <div key={cow.cowId} className="flex items-center gap-3 p-2 -mx-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 shadow-sm group-hover:shadow">
                        <Image src={cow.photoUrl || "/image/Logo AiMoo.png"} alt="Cow" width={40} height={40} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900">#{cow.tagNumber} - {cow.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Pantau ketat tanda kelahiran</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-bold rounded border border-blue-100 whitespace-nowrap group-hover:bg-blue-100 transition-colors">Segera</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </>
      )}

      {/* Konten Tab Lainnya (Placeholder) */}
      {activeTab !== "Ringkasan" && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center animate-in zoom-in-95 duration-500">
          <div className="text-4xl mb-3 opacity-50">🛠️</div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">Sedang Dalam Pengembangan</h3>
          <p className="text-sm text-slate-400 font-medium">Modul Detail <span className="font-bold text-slate-600">"{activeTab}"</span> akan tersedia pada pembaruan sistem berikutnya.</p>
        </div>
      )}

    </div>
  );
}