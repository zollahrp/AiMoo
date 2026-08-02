"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, getDoc, addDoc, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function PakanPage() {
  const [farmId, setFarmId] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data State
  const [cowsList, setCowsList] = useState<any[]>([]);
  const [feedRecords, setFeedRecords] = useState<any[]>([]);
  const [milkRecords, setMilkRecords] = useState<any[]>([]); // Untuk hitung Feed Efficiency

  // 🔥 STATE UNTUK GEMINI AI 🔥
  const [aiInsight, setAiInsight] = useState<string>("STATUS: MEMPROSES...\nANALISIS: Mengumpulkan data konsumsi pakan, efisiensi ransum, dan produksi susu untuk dievaluasi oleh AI...");
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

    const qCows = query(collection(db, "cows"), where("farmId", "==", farmId));
    const unsubCows = onSnapshot(qCows, (snap) => setCowsList(snap.docs.map(d => d.data())));

    const qFeed = query(collection(db, "feed_consumptions"), where("farmId", "==", farmId));
    const unsubFeed = onSnapshot(qFeed, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setFeedRecords(data);
    });

    const qMilk = query(collection(db, "milk_productions"), where("farmId", "==", farmId));
    const unsubMilk = onSnapshot(qMilk, (snap) => {
      setMilkRecords(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setIsLoading(false);
    });

    return () => { unsubCows(); unsubFeed(); unsubMilk(); };
  }, [farmId]);

  // =====================================================================
  // 2. LOGIKA MATEMATIKA PAKAN & CHART
  // =====================================================================
  const todayStr = new Date().toISOString().split("T")[0];
  let yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

  const totalCows = cowsList.length || 1;

  // -- Konsumsi Pakan --
  const feedToday = feedRecords.filter(r => r.date.startsWith(todayStr));
  const feedYesterday = feedRecords.filter(r => r.date.startsWith(yesterdayStr));

  const totalFeedToday = feedToday.reduce((sum, r) => sum + Number(r.quantityKg), 0);
  const totalFeedYesterday = feedYesterday.reduce((sum, r) => sum + Number(r.quantityKg), 0);
  
  const trendFeed = totalFeedYesterday > 0 ? ((totalFeedToday - totalFeedYesterday) / totalFeedYesterday) * 100 : 0;
  const avgFeedPerCowToday = totalFeedToday / totalCows;
  const avgFeedPerCowYesterday = totalFeedYesterday / totalCows;
  const trendAvgFeed = avgFeedPerCowYesterday > 0 ? ((avgFeedPerCowToday - avgFeedPerCowYesterday) / avgFeedPerCowYesterday) * 100 : 0;

  // -- Feed Efficiency (Kg Pakan / Liter Susu) --
  // Semakin rendah (mendekati 1) semakin bagus. Rata-rata normal sapi perah 1.2 - 1.5
  const milkToday = milkRecords.filter(r => r.date.startsWith(todayStr)).reduce((sum, r) => sum + Number(r.quantityLiter), 0);
  const milkYesterday = milkRecords.filter(r => r.date.startsWith(yesterdayStr)).reduce((sum, r) => sum + Number(r.quantityLiter), 0);
  
  const feToday = milkToday > 0 ? (totalFeedToday / milkToday) : 0;
  const feYesterday = milkYesterday > 0 ? (totalFeedYesterday / milkYesterday) : 0;
  const trendFE = feYesterday > 0 ? ((feToday - feYesterday) / feYesterday) : 0; // Turun = bagus

  // -- Biaya Pakan (Asumsi rata-rata harga pakan campur Rp 2.500/kg) --
  const costPerKg = 2500;
  const costToday = totalFeedToday * costPerKg;
  const costYesterday = totalFeedYesterday * costPerKg;
  const trendCost = costYesterday > 0 ? ((costToday - costYesterday) / costYesterday) * 100 : 0;

  // -- Stok Pakan (Simulasi: kita asumsikan stok gudang sisa untuk 8 hari dari konsumsi hari ini) --
  const stockDays = 8;
  const simulatedStock = totalFeedToday > 0 ? totalFeedToday * stockDays : 12540;

  // -- LOGIKA AREA CHART (7 HARI TERAKHIR) --
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const chartDataArray = last7Days.map(dateStr => {
    const dayFeed = feedRecords.filter(m => m.date.startsWith(dateStr)).reduce((sum, m) => sum + Number(m.quantityKg), 0);
    return { date: dateStr, feed: dayFeed };
  });

  const maxFeedVal = Math.max(...chartDataArray.map(d => d.feed), 500); 
  const yMax = Math.ceil(maxFeedVal * 1.2); 
  const mapY = (val: number) => 150 - ((val / yMax) * 100); // 150 viewBox height
  const mapX = (idx: number) => idx * (500 / 6);

  const polylinePoints = chartDataArray.map((d, i) => `${mapX(i)},${mapY(d.feed)}`).join(" ");
  const polygonPoints = `0,150 ${polylinePoints} 500,150`;

  // -- LOGIKA DONUT CHART DISTRIBUSI PAKAN HARI INI --
  const feedTypeMap: Record<string, number> = {};
  feedToday.forEach(r => {
    const type = r.feedType || "Lainnya";
    feedTypeMap[type] = (feedTypeMap[type] || 0) + Number(r.quantityKg);
  });

  // Urutkan & Konversi ke Array
  const feedColors = ["#22c55e", "#f59e0b", "#3b82f6", "#8b5cf6", "#f97316", "#94a3b8"]; // Hijauan, Konsentrat, Silase, dll
  const feedDistribution = Object.entries(feedTypeMap)
    .map(([name, amount], index) => ({
      name,
      amount,
      pct: totalFeedToday > 0 ? (amount / totalFeedToday) * 100 : 0,
      color: feedColors[index % feedColors.length]
    }))
    .sort((a, b) => b.amount - a.amount);

  // Buat string CSS Conic Gradient
  let cumulativePct = 0;
  const gradientString = feedDistribution.map(item => {
    const start = cumulativePct;
    cumulativePct += item.pct;
    return `${item.color} ${start}% ${cumulativePct}%`;
  }).join(", ");

  // =====================================================================
  // 🔥 FUNGSI GEMINI AI (KHUSUS MANAJEMEN NUTRISI)
  // =====================================================================
  const fetchGeminiInsight = async () => {
    if (isLoading || !process.env.NEXT_PUBLIC_GEMINI_API_KEY) return;

    setIsAiLoading(true);
    setAiInsight("STATUS: MEMPROSES...\nANALISIS: Menganalisis rasio konversi pakan dan efisiensi ransum...");

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

      const prompt = `
        Kamu adalah sistem AI Ahli Nutrisi Peternakan Sapi Perah (AI Moo).
        Data Ransum & Produksi Farm Keseluruhan Hari Ini:
        - Total Sapi: ${totalCows} ekor
        - Total Konsumsi Pakan: ${totalFeedToday.toFixed(1)} kg
        - Rata-rata Konsumsi: ${avgFeedPerCowToday.toFixed(1)} kg/ekor
        - Total Produksi Susu: ${milkToday.toFixed(1)} Liter
        - Feed Efficiency (Rasio Pakan ke Susu): ${feToday > 0 ? feToday.toFixed(2) : "0"} kg pakan/Liter susu
        - Biaya Pakan Hari Ini: Rp ${costToday.toLocaleString('id-ID')}
        
        Distribusi Ransum Utama:
        ${feedDistribution.slice(0,3).map(f => `- ${f.name}: ${f.pct.toFixed(1)}%`).join("\n")}

        Tugas: Analisis performa efisiensi pakan dan komposisi ransum hari ini.
        *Catatan medis: Feed Efficiency normal sapi perah laktasi adalah 1.2 hingga 1.5. Jika > 1.6 berarti pakan boros/kurang berkualitas. Jika < 1.0 berarti sapi underfeeding.
        
        Berikan jawaban STRICT dengan format ini (TANPA EMOJI, TANPA MARKDOWN BINTANG):
        STATUS: [Pilih satu yang paling tepat: EFISIEN / PERLU EVALUASI / BOROS]
        ANALISIS: [2-3 kalimat rangkuman efisiensi, evaluasi komponen ransum, dan saran penyesuaian untuk besok]
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
    if (!isLoading && feedRecords.length > 0) {
      fetchGeminiInsight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // =====================================================================
  // 3. GENERATE DUMMY DATA PAKAN
  // =====================================================================
  const generateDummyData = async () => {
    if (!farmId || !userUid) return;
    
    if (cowsList.length < 3) {
      Swal.fire("Sapi Kurang!", "Harap ke menu Data Ternak dulu dan klik 'Generate Dummy Sapi' di sana minimal 1x.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const feedTypes = [
        { name: "Rumput Gajah", base: 10 },
        { name: "Konsentrat Bintang", base: 6 },
        { name: "Silase Jagung", base: 4 },
      ];

      for (let i = 0; i < 7; i++) {
        let d = new Date(); d.setDate(d.getDate() - i);
        let dateStr = `${d.toISOString().split("T")[0]}T07:00:00Z`;

        // Tiap hari masukin data per sapi per jenis pakan
        for (const cow of cowsList) {
          for (const feed of feedTypes) {
            // Fluktuasi +- 10%
            const variance = feed.base * 0.1;
            const randQty = feed.base + (Math.random() * variance * 2 - variance);
            
            await addDoc(collection(db, "feed_consumptions"), {
              farmId, cowId: cow.cowId, date: dateStr, feedType: feed.name, 
              quantityKg: Number(randQty.toFixed(1)), recordedBy: userUid, createdAt: dateStr
            });
          }
        }
      }

      Swal.fire("Selesai!", "Data konsumsi ransum 7 hari terakhir berhasil di-generate!", "success");
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Pakan</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola ransum, konsumsi, stok pakan, dan efisiensi pakan ternak Anda.</p>
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
          Memuat Data Ransum...
        </div>
      ) : (
      <>
        {/* 2. KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          
          {/* Card 1: Total Konsumsi */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">Total Konsumsi Hari Ini</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{totalFeedToday.toLocaleString('id-ID')} <span className="text-sm font-semibold text-slate-400">kg</span></p>
              <p className={`text-[10px] font-bold mt-0.5 ${trendFeed >= 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {trendFeed >= 0 ? "↑" : "↓"} {Math.abs(trendFeed).toFixed(1)}% <span className="text-slate-400 font-medium">dari kemarin</span>
              </p>
            </div>
          </div>

          {/* Card 2: Rata-rata per sapi */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">Rata-rata Konsumsi / Sapi</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{avgFeedPerCowToday.toFixed(1)} <span className="text-sm font-semibold text-slate-400">kg/hr</span></p>
              <p className={`text-[10px] font-bold mt-0.5 ${trendAvgFeed >= 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {trendAvgFeed >= 0 ? "↑" : "↓"} {Math.abs(trendAvgFeed).toFixed(1)}% <span className="text-slate-400 font-medium">dari kemarin</span>
              </p>
            </div>
          </div>

          {/* Card 3: Biaya Pakan */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">Estimasi Biaya Pakan (Harian)</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight"><span className="text-sm font-semibold text-slate-400">Rp</span> {(costToday/1000).toLocaleString('id-ID')}k</p>
              <p className={`text-[10px] font-bold mt-0.5 ${trendCost >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {trendCost >= 0 ? "↑" : "↓"} {Math.abs(trendCost).toFixed(1)}% <span className="text-slate-400 font-medium">dari kemarin</span>
              </p>
            </div>
          </div>

          {/* Card 4: Stok Pakan */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">Estimasi Stok Tersisa</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{simulatedStock.toLocaleString('id-ID')} <span className="text-sm font-semibold text-slate-400">kg</span></p>
              <p className="text-[10px] font-medium text-purple-600 mt-0.5">Aman untuk <b className="font-bold">{stockDays} hari</b></p>
            </div>
          </div>

          {/* Card 5: Feed Efficiency */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">Feed Efficiency (kg Pakan/Liter Susu)</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{feToday > 0 ? feToday.toFixed(2) : "0"} <span className="text-sm font-semibold text-slate-400">FE</span></p>
              <p className={`text-[10px] font-bold mt-0.5 ${trendFE > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {trendFE > 0 ? "↑" : "↓"} {Math.abs(trendFE * 100).toFixed(1)}% <span className="text-slate-400 font-medium">dr krmn {feToday < 1.6 ? "(Bagus)" : "(Boros)"}</span>
              </p>
            </div>
          </div>

        </div>

        {/* 3. MIDDLE SECTION (Chart, Donut, AI) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-stretch">
          
          {/* Area Chart: Konsumsi Pakan */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900">Total Konsumsi (7 Hari Terakhir)</h3>
            </div>
            
            <div className="flex-1 relative min-h-[220px]">
              {/* Y-Axis */}
              <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] font-medium text-slate-400">
                <span>{yMax}</span><span>{Math.round(yMax*0.66)}</span><span>{Math.round(yMax*0.33)}</span><span>0</span>
              </div>
              {/* X-Axis */}
              <div className="absolute left-10 right-0 bottom-0 flex justify-between text-[10px] font-medium text-slate-400">
                {chartDataArray.map((d) => {
                  const [y,m,day] = d.date.split("-");
                  return <span key={d.date}>{day}/{m}</span>
                })}
              </div>
              
              {/* Chart Area */}
              <div className="absolute left-10 right-2 top-2 bottom-8">
                <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-100">
                  <div className="w-full border-t border-slate-100/60 h-0"></div><div className="w-full border-t border-slate-100/60 h-0"></div>
                  <div className="w-full border-t border-slate-100/60 h-0"></div><div className="w-full border-t border-slate-100/60 h-0"></div>
                  <div className="w-full h-0"></div>
                </div>

                <svg viewBox="0 0 500 150" className="absolute inset-0 w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGreenPakan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon points={polygonPoints} fill="url(#chartGreenPakan)" className="animate-in fade-in duration-1000 delay-200" />
                  <polyline points={polylinePoints} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in slide-in-from-left-8 duration-1000" />
                  
                  {chartDataArray.map((d, i) => d.feed > 0 && (
                    <circle key={i} cx={mapX(i)} cy={mapY(d.feed)} r="4" fill="#22c55e" stroke="white" strokeWidth="2" className="animate-in zoom-in duration-500 delay-500" />
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Donut Chart: Komposisi Ransum */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 mb-6">Komposisi Ransum Hari Ini</h3>
            
            <div className="flex flex-col items-center justify-center flex-1 mb-2">
              {/* CSS Donut Chart */}
              <div className="relative w-40 h-40 shrink-0 rounded-full flex items-center justify-center mb-6 transition-all duration-1000" 
                   style={{ background: gradientString ? `conic-gradient(${gradientString})` : '#f1f5f9' }}>
                <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                  <span className="text-[10px] font-bold text-slate-500">Total Hari Ini</span>
                  <span className="text-xl font-black text-slate-900 leading-tight">{totalFeedToday.toLocaleString('id-ID')} <span className="text-[10px] font-bold text-slate-500">kg</span></span>
                </div>
              </div>
              
              {/* Legend List */}
              <div className="w-full space-y-2.5">
                {feedDistribution.length === 0 && <p className="text-xs text-center text-slate-400">Belum ada data pakan hari ini</p>}
                {feedDistribution.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{backgroundColor: item.color}}></span><span className="font-semibold text-slate-700">{item.name}</span></div>
                    <span className="text-slate-500 font-medium">{item.pct.toFixed(1)}% ({item.amount.toLocaleString('id-ID')} kg)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: AI Insight Pakan (BADGE UI) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-200/60 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className={`text-emerald-500 transition-transform ${isAiLoading ? 'animate-spin' : 'group-hover:scale-110 group-hover:rotate-12'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span> 
                Diagnosis Cerdas AI Moo
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

              if (statusText.includes("EFISIEN")) {
                badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm shadow-emerald-500/20";
                cardBgColor = "bg-emerald-50/30 border-emerald-100/50";
                statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
              } else if (statusText.includes("EVALUASI")) {
                badgeColor = "bg-amber-100 text-amber-800 border-amber-200 shadow-sm shadow-amber-500/20";
                cardBgColor = "bg-amber-50/30 border-amber-100/50";
                statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
              } else if (statusText.includes("BOROS") || statusText.includes("ERROR")) {
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

        {/* 4. LOWER SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Riwayat Konsumsi per Sapi */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Konsumsi Pakan per Sapi (Hari Ini)</h3>
            <div className="overflow-x-auto flex-1 max-h-[300px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-white sticky top-0 z-10 shadow-sm">
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="pb-3 px-2 font-semibold">ID & Nama Sapi</th>
                    <th className="pb-3 px-2 font-semibold text-center">Kelompok</th>
                    <th className="pb-3 px-2 font-semibold text-center">Pakan Dominan</th>
                    <th className="pb-3 px-2 font-semibold text-center">Total Konsumsi (kg)</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-50">
                  {cowsList.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-400 font-medium">Belum ada data sapi.</td></tr>}
                  {cowsList.map(cow => {
                    // Cari konsumsi sapi ini hari ini
                    const cowFeed = feedToday.filter(f => f.cowId === cow.cowId);
                    const cowTotal = cowFeed.reduce((sum, f) => sum + Number(f.quantityKg), 0);
                    
                    // Cari pakan terbanyak yang dimakan
                    let topFeedName = "-";
                    let topFeedAmount = 0;
                    cowFeed.forEach(f => {
                      if (Number(f.quantityKg) > topFeedAmount) {
                        topFeedAmount = Number(f.quantityKg);
                        topFeedName = f.feedType;
                      }
                    });

                    return (
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
                        <td className="py-3 px-2 text-center">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold border ${cow.group === 'Laktasi' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{cow.group || "Laktasi"}</span>
                        </td>
                        <td className="py-3 px-2 text-center font-bold text-slate-700">{topFeedName}</td>
                        <td className="py-3 px-2 text-center font-black text-slate-900">{cowTotal > 0 ? cowTotal.toFixed(1) : "0"}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stok Pakan Global */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Estimasi Sisa Stok Pakan</h3>
            <div className="overflow-x-auto flex-1 max-h-[300px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-white sticky top-0 z-10 shadow-sm">
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="pb-3 px-2 font-semibold">Jenis Pakan</th>
                    <th className="pb-3 px-2 font-semibold text-center">Stok (kg)</th>
                    <th className="pb-3 px-2 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-50">
                  {feedDistribution.length === 0 && <tr><td colSpan={3} className="py-8 text-center text-slate-400 font-medium">Belum ada data ransum.</td></tr>}
                  {feedDistribution.map((f, i) => {
                    // Simulasi stok per jenis pakan = penggunaan hari ini * random (5-12 hari)
                    const simulatedTypeStock = f.amount * (5 + (i % 5)); 
                    const isLow = simulatedTypeStock < (f.amount * 4); // Kurang dari 4 hari dibilang low

                    return (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                        <td className="py-3 px-2 flex items-center gap-2 font-bold text-slate-800">
                          <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: f.color}}></span> {f.name}
                        </td>
                        <td className="py-3 px-2 text-center font-black text-slate-900">
                          {simulatedTypeStock > 0 ? simulatedTypeStock.toLocaleString('id-ID') : "0"}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded border ${isLow ? 'text-red-600 bg-red-50 border-red-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100'}`}>
                            {isLow ? 'Kritis' : 'Aman'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </>
      )}

    </div>
  );
}