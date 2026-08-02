"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, getDoc, addDoc, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function KesehatanPage() {
  const [farmId, setFarmId] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data State
  const [cowsList, setCowsList] = useState<any[]>([]);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);

  // 🔥 STATE UNTUK GEMINI AI 🔥
  const [aiInsight, setAiInsight] = useState<string>("STATUS: MEMPROSES...\nANALISIS: Mengumpulkan data rekam medis dan metrik kesehatan seluruh peternakan untuk dievaluasi oleh AI...");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // 🔥 STATE UNTUK CHECKLIST HARIAN (INTERAKTIF) 🔥
  const [checklist, setChecklist] = useState([
    { id: 1, label: "Pemeriksaan suhu tubuh (Sensor IoT)", isChecked: true },
    { id: 2, label: "Sanitasi & Kebersihan kandang", isChecked: true },
    { id: 3, label: "Pemeriksaan palatabilitas pakan", isChecked: true },
    { id: 4, label: "Pengecekan kualitas air minum", isChecked: true },
    { id: 5, label: "Uji California Mastitis Test (CMT)", isChecked: false },
    { id: 6, label: "Inspeksi visual feses & pencernaan", isChecked: false },
  ]);

  const toggleChecklist = (id: number) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const completedTasks = checklist.filter(item => item.isChecked).length;
  const totalTasks = checklist.length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

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

    // Ambil Data Sapi Master
    const qCows = query(collection(db, "cows"), where("farmId", "==", farmId));
    const unsubCows = onSnapshot(qCows, (snap) => {
      const data = snap.docs.map(d => d.data());
      setCowsList(data);
    });

    // Ambil Data Kesehatan
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
  // 2. LOGIKA MATEMATIKA KESEHATAN & CHART
  // =====================================================================
  const todayStr = new Date().toISOString().split("T")[0];
  const todayDate = new Date();

  // Pengelompokan Risiko Sapi
  let highRiskCows: any[] = [];
  let mediumRiskCows: any[] = [];
  let healthyCows: any[] = [];

  cowsList.forEach(cow => {
    const healthStat = (cow.currentStatus?.health || "Sehat").toLowerCase();
    const temp = cow.liveMetrics?.temperature || 38.5;

    const isHighRisk = healthStat.includes("mastitis") || healthStat.includes("demam") || temp > 39.5;
    const isMediumRisk = !isHighRisk && (healthStat !== "sehat" || temp > 39.1);

    if (isHighRisk) highRiskCows.push({ ...cow, riskScore: temp > 39.5 ? 90 : 80, issue: healthStat });
    else if (isMediumRisk) mediumRiskCows.push({ ...cow, riskScore: 65, issue: healthStat });
    else healthyCows.push(cow);
  });

  const totalCows = cowsList.length || 1; // hindari division by zero
  const pctHigh = (highRiskCows.length / totalCows) * 100;
  const pctMed = (mediumRiskCows.length / totalCows) * 100;
  const pctHealthy = (healthyCows.length / totalCows) * 100;

  // KPI Kasus Baru (7 Hari) & Tindakan Hari Ini
  const newCases7Days = healthRecords.filter(r => (todayDate.getTime() - new Date(r.date).getTime()) <= 7 * 24 * 3600 * 1000).length;
  const actionsToday = healthRecords.filter(r => r.date.startsWith(todayStr)).length;

  // --- LOGIKA LINE CHART (30 HARI TERAKHIR) ---
  const last30Days = Array.from({length: 30}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });

  // Kategori Penyakit
  const chartCategories = {
    mastitis: new Array(30).fill(0),
    demam: new Array(30).fill(0),
    pencernaan: new Array(30).fill(0),
    lainnya: new Array(30).fill(0),
  };

  healthRecords.forEach(r => {
    const rDateStr = r.date.split("T")[0];
    const dayIndex = last30Days.indexOf(rDateStr);
    if (dayIndex !== -1) {
      const diag = (r.diagnosis || "").toLowerCase();
      if (diag.includes("mastitis")) chartCategories.mastitis[dayIndex]++;
      else if (diag.includes("demam")) chartCategories.demam[dayIndex]++;
      else if (diag.includes("diare") || diag.includes("kembung") || diag.includes("pencernaan")) chartCategories.pencernaan[dayIndex]++;
      else chartCategories.lainnya[dayIndex]++;
    }
  });

  const yMaxChart = Math.max(12, ...Object.values(chartCategories).flat()) + 2; 
  const mapChartX = (idx: number) => (idx / 29) * 500;
  const mapChartY = (val: number) => 140 - ((val / yMaxChart) * 120); 

  const getPoints = (dataArr: number[]) => dataArr.map((v, i) => `${mapChartX(i)},${mapChartY(v)}`).join(" ");

  const xAxisLabels = [0, 7, 14, 21, 29].map(idx => {
    const d = new Date(last30Days[idx]);
    return `${d.getDate()} ${d.toLocaleString('id-ID', { month: 'short' })}`;
  });

  // =====================================================================
  // 🔥 FUNGSI GEMINI AI
  // =====================================================================
  const fetchGeminiInsight = async () => {
    if (isLoading || !process.env.NEXT_PUBLIC_GEMINI_API_KEY) return;

    setIsAiLoading(true);
    setAiInsight("STATUS: MEMPROSES...\nANALISIS: Mengumpulkan rekam medis, pola penyakit, dan metrik risiko...");

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

      const prompt = `
        Kamu adalah AI Kepala Dokter Hewan Peternakan (AI Moo).
        Data Kesehatan Farm Keseluruhan Hari Ini:
        - Total Populasi: ${cowsList.length} ekor
        - Sapi Risiko Tinggi (Mastitis/Demam): ${highRiskCows.length} ekor
        - Sapi Risiko Sedang (Pencernaan/Luka): ${mediumRiskCows.length} ekor
        - Sapi Sehat: ${healthyCows.length} ekor
        - Kasus Baru (7 Hari Terakhir): ${newCases7Days} kasus
        - Tindakan Medis Hari Ini: ${actionsToday} tindakan

        Tugas: Analisis status kesehatan kawanan secara menyeluruh.
        
        Berikan jawaban STRICT dengan format ini (TANPA EMOJI, TANPA MARKDOWN BINTANG):
        STATUS: [Pilih satu yang paling tepat: AMAN / PERINGATAN / KRITIS]
        ANALISIS: [2-3 kalimat rangkuman epidemologi kesehatan, sorotan kasus utama, dan rekomendasi sterilisasi/tindakan medis prioritas]
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
  // 3. GENERATE DUMMY DATA 
  // =====================================================================
  const generateDummyData = async () => {
    if (!farmId || !userUid) return;
    
    if (cowsList.length < 5) {
      Swal.fire("Sapi Kurang!", "Harap ke menu Data Ternak dulu dan klik 'Generate Dummy Sapi' di sana minimal 1x.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const c1 = cowsList[0];
      const c2 = cowsList[1];
      const c3 = cowsList[2];
      const c4 = cowsList[3];

      await updateDoc(doc(db, `cows/${c1.cowId}`), { "currentStatus.health": "Mastitis", "liveMetrics.temperature": 39.8 });
      await updateDoc(doc(db, `cows/${c2.cowId}`), { "currentStatus.health": "Demam", "liveMetrics.temperature": 40.2 });
      await updateDoc(doc(db, `cows/${c3.cowId}`), { "currentStatus.health": "Diare", "liveMetrics.temperature": 38.9 });
      await updateDoc(doc(db, `cows/${c4.cowId}`), { "currentStatus.health": "Sehat", "liveMetrics.temperature": 38.5 });

      const dummyDiag = ["Mastitis", "Demam", "Diare", "Luka Kuku", "Kembung"];
      for (let i = 0; i < 20; i++) { 
        const randomDaysAgo = Math.floor(Math.random() * 30);
        const d = new Date(); d.setDate(d.getDate() - randomDaysAgo);
        const randDiag = dummyDiag[Math.floor(Math.random() * dummyDiag.length)];
        const randCow = cowsList[Math.floor(Math.random() * cowsList.length)];
        
        await addDoc(collection(db, "health_records"), {
          farmId, cowId: randCow.cowId, date: d.toISOString(), type: "Pengobatan", 
          diagnosis: randDiag, details: `Penanganan kasus ${randDiag.toLowerCase()}`, 
          handledBy: "Dr. AI Moo", createdAt: serverTimestamp()
        });
      }

      Swal.fire("Selesai!", "Status kesehatan diacak dan riwayat rekam medis 30 hari berhasil dibuat!", "success");
    } catch (e: any) {
      Swal.fire("Error", e.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStrDisplay = todayDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-[1600px] mx-auto pb-10 relative animate-in fade-in duration-500">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Kesehatan</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Pantau kondisi kesehatan sapi dan deteksi dini potensi penyakit.</p>
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

      {/* JIKA DATA MASIH LOADING */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-emerald-600 font-bold animate-pulse">
          Memuat Rekam Medis...
        </div>
      ) : (
      <>
        {/* 2. KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v4m0 0H9m3 0h3" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 mb-0.5">Risiko Tinggi</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{highRiskCows.length} <span className="text-sm font-semibold text-slate-400">ekor</span></p>
              <p className="text-[10px] font-bold text-red-500 mt-0.5">Perlu penanganan segera</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Risiko Sedang</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{mediumRiskCows.length} <span className="text-sm font-semibold text-slate-400">ekor</span></p>
              <p className="text-[10px] font-bold text-amber-500 mt-0.5">Perlu observasi</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Sapi Sehat</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{healthyCows.length} <span className="text-sm font-semibold text-slate-400">ekor</span></p>
              <p className="text-[10px] font-bold text-green-500 mt-0.5">Kondisi optimal</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Kasus Baru <span className="font-medium">(7 hari)</span></p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{newCases7Days} <span className="text-sm font-semibold text-slate-400">kasus</span></p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 mb-0.5">Tindakan Hari Ini</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{actionsToday} <span className="text-sm font-semibold text-slate-400">tindakan</span></p>
            </div>
          </div>
        </div>

        {/* 3. MIDDLE SECTION (Donut, Line Chart, AI Insight) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-stretch">
          
          {/* Left: Distribusi Kondisi */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
             <h3 className="text-sm font-bold text-slate-900 mb-6">Distribusi Kesehatan</h3>
             <div className="flex flex-col items-center justify-center flex-1 mb-6">
               <div className="relative w-36 h-36 shrink-0 rounded-full flex items-center justify-center mb-6 transition-all duration-1000" 
                  style={{ background: `conic-gradient(#ef4444 0% ${pctHigh}%, #f59e0b ${pctHigh}% ${pctHigh + pctMed}%, #22c55e ${pctHigh + pctMed}% 100%)` }}>
                 <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                   <span className="text-3xl font-black text-slate-900 leading-none">{totalCows}</span>
                   <span className="text-[10px] font-semibold text-slate-500 mt-1">Sapi</span>
                 </div>
               </div>
               
               <div className="w-full space-y-3">
                 <div className="flex items-center justify-between text-xs">
                   <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="font-semibold text-slate-700">Tinggi</span></div>
                   <span className="text-slate-500 font-medium">{highRiskCows.length} ({pctHigh.toFixed(1)}%)</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                   <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="font-semibold text-slate-700">Sedang</span></div>
                   <span className="text-slate-500 font-medium">{mediumRiskCows.length} ({pctMed.toFixed(1)}%)</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                   <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span><span className="font-semibold text-slate-700">Sehat</span></div>
                   <span className="text-slate-500 font-medium">{healthyCows.length} ({pctHealthy.toFixed(1)}%)</span>
                 </div>
               </div>
             </div>
          </div>

          {/* Center: Line Chart Tren Kasus */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Tren Kasus Kesehatan (30 Hari)</h3>
              <select className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg outline-none cursor-pointer">
                <option>Semua Penyakit</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-[10px] font-bold text-slate-600">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Mastitis</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Demam</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Pencernaan</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Lainnya</div>
            </div>
            
            <div className="flex-1 relative min-h-[200px]">
               <div className="absolute left-0 top-0 bottom-6 w-6 flex flex-col justify-between text-[10px] font-medium text-slate-400">
                 <span>{yMaxChart}</span><span>{Math.round(yMaxChart*0.75)}</span><span>{Math.round(yMaxChart*0.5)}</span><span>{Math.round(yMaxChart*0.25)}</span><span>0</span>
               </div>
               
               <div className="absolute left-8 right-0 bottom-0 flex justify-between text-[10px] font-medium text-slate-400">
                 {xAxisLabels.map((lbl, i) => <span key={i}>{lbl}</span>)}
               </div>
               
               <div className="absolute left-8 right-2 top-2 bottom-8">
                 <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-100">
                   <div className="w-full border-t border-slate-100/60 h-0"></div><div className="w-full border-t border-slate-100/60 h-0"></div>
                   <div className="w-full border-t border-slate-100/60 h-0"></div><div className="w-full border-t border-slate-100/60 h-0"></div>
                   <div className="w-full h-0"></div>
                 </div>
                 
                 <svg viewBox="0 0 500 150" className="absolute inset-0 w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
                   <polyline points={getPoints(chartCategories.lainnya)} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in duration-1000"/>
                   <polyline points={getPoints(chartCategories.pencernaan)} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in duration-1000 delay-100"/>
                   <polyline points={getPoints(chartCategories.demam)} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in duration-1000 delay-200"/>
                   <polyline points={getPoints(chartCategories.mastitis)} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in duration-1000 delay-300"/>
                   
                   {chartCategories.mastitis.map((val, idx) => val > 0 && (
                      <circle key={`red-${idx}`} cx={mapChartX(idx)} cy={mapChartY(val)} r="3.5" fill="#ef4444" stroke="white" strokeWidth="1.5" className="animate-in zoom-in duration-500 delay-500" />
                   ))}
                   {chartCategories.demam.map((val, idx) => val > 0 && (
                      <circle key={`blu-${idx}`} cx={mapChartX(idx)} cy={mapChartY(val)} r="3" fill="#3b82f6" stroke="white" strokeWidth="1" className="animate-in zoom-in duration-500 delay-500" />
                   ))}
                 </svg>
               </div>
            </div>
          </div>

          {/* Right: AI Insight */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-200/60 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className={`text-purple-600 transition-transform ${isAiLoading ? 'animate-spin' : 'group-hover:scale-110 group-hover:rotate-12'}`}>
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

        {/* 4. BOTTOM SECTION (Tables & Checklist) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          
          {/* Table 1: Sapi Risiko Tinggi */}
          <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Sapi Perlu Perhatian <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-[10px] flex items-center justify-center font-bold">{highRiskCows.length}</span>
              </h3>
            </div>
            <div className="overflow-x-auto flex-1 max-h-[300px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-white sticky top-0 z-10 shadow-sm">
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="pb-3 px-2 font-semibold">ID & Nama</th>
                    <th className="pb-3 px-2 font-semibold">Masalah Utama</th>
                    <th className="pb-3 px-2 font-semibold text-center">Skor Risiko</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-50">
                  {highRiskCows.length === 0 ? (
                    <tr><td colSpan={3} className="py-8 text-center text-slate-400 font-medium">Tidak ada sapi berisiko tinggi.</td></tr>
                  ) : (
                    highRiskCows.map(cow => (
                      <tr key={cow.cowId} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                        <td className="py-3 px-2 font-semibold">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded overflow-hidden bg-slate-100 shrink-0"><Image src={cow.photoUrl || "/image/Logo AiMoo.png"} alt="Cow" width={32} height={32} className="object-cover w-full h-full group-hover:scale-110 transition-transform"/></div>
                            <div>
                              <p className="font-bold text-slate-900">#{cow.tagNumber}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{cow.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <p className="font-bold text-slate-900 capitalize">{cow.issue}</p>
                          <p className="text-[9px] text-slate-500">Suhu: {cow.liveMetrics?.temperature || "-"}°C</p>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded border ${cow.riskScore >= 90 ? 'text-red-600 bg-red-50 border-red-100' : 'text-amber-600 bg-amber-50 border-amber-100'}`}>
                            {cow.riskScore} / 100
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Riwayat Kasus Terbaru */}
          <div className="xl:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Riwayat Medis Terbaru</h3>
            </div>
            <div className="overflow-x-auto flex-1 max-h-[300px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-white sticky top-0 z-10 shadow-sm">
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="pb-3 px-2 font-semibold">Tanggal</th>
                    <th className="pb-3 px-2 font-semibold">Diagnosa</th>
                    <th className="pb-3 px-2 font-semibold">Sapi</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-50">
                  {healthRecords.length === 0 ? (
                    <tr><td colSpan={3} className="py-8 text-center text-slate-400 font-medium">Belum ada rekam medis.</td></tr>
                  ) : (
                    healthRecords.slice(0, 10).map(r => {
                      const cowName = cowsList.find(c => c.cowId === r.cowId)?.name || "?";
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                          <td className="py-3 px-2">
                            <span className="font-semibold text-slate-700">{new Date(r.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                          </td>
                          <td className="py-3 px-2">
                            <p className="font-bold text-slate-900">{r.diagnosis}</p>
                            <p className="text-[9px] text-slate-500 max-w-[120px] truncate">{r.details}</p>
                          </td>
                          <td className="py-3 px-2 font-medium text-slate-600">{cowName}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Col: Checklist 🔥 SEKARANG BISA DIKLIK 🔥 */}
          <div className="xl:col-span-3 flex flex-col gap-6 items-stretch">
            
            {/* Checklist Kesehatan Harian */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col flex-1 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900">Checklist Harian Medis</h3>
              </div>
              
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs font-bold text-slate-700">Progres Hari Ini</p>
                <p className="text-xs font-bold text-slate-500">{completedTasks} / {totalTasks} selesai</p>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
              </div>

              <div className="grid grid-cols-1 gap-y-3 text-[10px] font-semibold text-slate-600">
                {checklist.map(item => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer group select-none" onClick={() => toggleChecklist(item.id)}>
                    {item.isChecked ? (
                      <div className="w-4 h-4 rounded border-none bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm transition-all duration-200">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center shrink-0 group-hover:border-emerald-500 transition-all duration-200"></div>
                    )}
                    <span className={item.isChecked ? "text-slate-400 line-through transition-colors duration-200" : "text-slate-700 transition-colors duration-200"}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>

        </div>
      </>
      )}

    </div>
  );
}