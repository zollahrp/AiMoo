"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, doc, query, where, onSnapshot, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function ProduksiSusuPage() {
  const [farmId, setFarmId] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data State
  const [cowsList, setCowsList] = useState<any[]>([]);
  const [milkRecords, setMilkRecords] = useState<any[]>([]);
  
  // Table State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");

  // 🔥 STATE UNTUK GEMINI AI 🔥
  const [aiInsight, setAiInsight] = useState<string>("STATUS: MEMPROSES...\nANALISIS: Mengumpulkan data produksi seluruh peternakan...");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // =====================================================================
  // 1. INIT AUTH & FETCH DATA
  // =====================================================================
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const uFarmId = Object.keys(userDoc.data().farmRoles || {})[0];
          setFarmId(uFarmId);
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
    const unsubCows = onSnapshot(qCows, (snap) => {
      const data = snap.docs.map(d => d.data());
      setCowsList(data);
    });

    // Ambil Data Susu
    const qMilk = query(collection(db, "milk_productions"), where("farmId", "==", farmId));
    const unsubMilk = onSnapshot(qMilk, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMilkRecords(data);
      setIsLoading(false);
    });

    return () => { unsubCows(); unsubMilk(); };
  }, [farmId]);

  // =====================================================================
  // 2. PERHITUNGAN MATEMATIKA (KPI & GRAFIK)
  // =====================================================================
  const todayStr = new Date().toISOString().split("T")[0];
  let yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

  // Hitung Total Hari Ini & Kemarin
  const todayMilkData = milkRecords.filter(m => m.date.startsWith(todayStr));
  const yesterdayMilkData = milkRecords.filter(m => m.date.startsWith(yesterdayStr));

  const totalToday = todayMilkData.reduce((sum, m) => sum + Number(m.quantityLiter), 0);
  const totalYesterday = yesterdayMilkData.reduce((sum, m) => sum + Number(m.quantityLiter), 0);
  
  const trendTotal = totalYesterday > 0 ? ((totalToday - totalYesterday) / totalYesterday) * 100 : 0;
  const avgPerCowToday = todayMilkData.length > 0 ? (totalToday / todayMilkData.length) : 0;
  
  const avgPerCowYesterday = yesterdayMilkData.length > 0 ? (totalYesterday / yesterdayMilkData.length) : 0;
  const trendAvg = avgPerCowYesterday > 0 ? ((avgPerCowToday - avgPerCowYesterday) / avgPerCowYesterday) * 100 : 0;

  // Data Tabel & Sapi Juara
  let topCow = { name: "-", amount: 0, tag: "-" };
  let cowsDownCount = 0;
  let cowsUpCount = 0;

  let rawTableData = cowsList.map(cow => {
    const cowMilks = milkRecords.filter(m => m.cowId === cow.cowId);
    const cowToday = cowMilks.filter(m => m.date.startsWith(todayStr)).reduce((s, m) => s + Number(m.quantityLiter), 0);
    const cowYest = cowMilks.filter(m => m.date.startsWith(yesterdayStr)).reduce((s, m) => s + Number(m.quantityLiter), 0);
    const cowAvg = cowMilks.length > 0 ? (cowMilks.reduce((s, m) => s + Number(m.quantityLiter), 0) / 7) : 0; // Avg 7 hari simple
    
    const change = cowYest > 0 ? ((cowToday - cowYest) / cowYest) * 100 : 0;
    const changeType = cowToday >= cowYest ? "up" : "down";

    if (cowToday > topCow.amount) {
      topCow = { name: cow.name, amount: cowToday, tag: cow.tagNumber };
    }
    if (changeType === "down" && cowYest > 0) cowsDownCount++;
    if (changeType === "up" && cowToday > 0) cowsUpCount++;

    return {
      id: `#${cow.tagNumber}`,
      name: cow.name,
      laktasi: cow.currentStatus?.lactationPhase || 1,
      prod: cowToday.toFixed(1),
      changeValue: change,
      changeText: `${change >= 0 ? "↑" : "↓"} ${Math.abs(change).toFixed(1)}%`,
      changeType: changeType,
      avg: cowAvg.toFixed(1),
      img: cow.photoUrl || "/image/Logo AiMoo.png"
    };
  });

  // Filter Search
  if (searchQuery) {
    rawTableData = rawTableData.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.includes(searchQuery));
  }

  // Pagination Tabel
  const totalPages = Math.ceil(rawTableData.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const tableData = rawTableData.slice(indexOfFirstRow, indexOfLastRow);

  // Data Grafik 7 Hari Terakhir
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const chartDataArray = last7Days.map(dateStr => {
    const dayMilk = milkRecords.filter(m => m.date.startsWith(dateStr)).reduce((sum, m) => sum + Number(m.quantityLiter), 0);
    return { date: dateStr, milk: dayMilk };
  });

  const maxMilkVal = Math.max(...chartDataArray.map(d => d.milk), 100); 
  const yMax = Math.ceil(maxMilkVal * 1.2); 
  const mapY = (val: number) => 150 - ((val / yMax) * 90); 

  const xCoords = Array.from({length: 7}, (_, i) => i * (500 / 6));
  const polylinePoints = chartDataArray.map((d, i) => `${xCoords[i]},${mapY(d.milk)}`).join(" ");
  const polygonPoints = `0,150 ${polylinePoints} 500,150`;

  // =====================================================================
  // 🔥 FUNGSI GEMINI AI (KHUSUS MANAJEMEN PRODUKSI FARM)
  // =====================================================================
  const fetchGeminiInsight = async () => {
    if (isLoading || !process.env.NEXT_PUBLIC_GEMINI_API_KEY) return;

    setIsAiLoading(true);
    setAiInsight("STATUS: MEMPROSES...\nANALISIS: Mengumpulkan data produksi seluruh peternakan untuk dievaluasi oleh AI...");

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

      const prompt = `
        Kamu adalah sistem AI manajer peternakan sapi perah (AI Moo).
        Data Produksi Susu Keseluruhan Hari Ini:
        - Total Produksi: ${totalToday.toFixed(1)} Liter (Trend: ${trendTotal.toFixed(1)}% dari kemarin)
        - Rata-rata per Sapi: ${avgPerCowToday.toFixed(1)} Liter/ekor
        - Sapi Mengalami Kenaikan Produksi: ${cowsUpCount} ekor
        - Sapi Mengalami Penurunan Produksi: ${cowsDownCount} ekor
        - Top Performer: Sapi ${topCow.name} (${topCow.amount.toFixed(1)} Liter)

        Tugas: Analisis performa produksi susu farm hari ini secara keseluruhan.
        
        Berikan jawaban STRICT dengan format ini (TANPA EMOJI, TANPA MARKDOWN BINTANG):
        STATUS: [Pilih satu yang paling tepat berdasarkan tren: AMAN / PERINGATAN / KRITIS]
        ANALISIS: [2-3 kalimat rangkuman performa, sorotan tren, dan saran evaluasi manajemen pakan/kesehatan]
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
    if (!isLoading && milkRecords.length > 0) {
      fetchGeminiInsight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]); 

  // =====================================================================
  // 3. HANDLER GENERATE DUMMY (SAPI + SUSU)
  // =====================================================================
  const generateDummyData = async () => {
    if (!farmId || !userUid) return;
    setIsSubmitting(true);
    try {
      const dummyCows = [
        { id: "cow_d1", tag: "1001", name: "Bella", breed: "Holstein", img: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=200&auto=format&fit=crop" },
        { id: "cow_d2", tag: "1002", name: "Mona", breed: "Jersey", img: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=200&auto=format&fit=crop" },
        { id: "cow_d3", tag: "1003", name: "Caca", breed: "Holstein", img: "https://images.unsplash.com/photo-1596733430284-f74372808c10?q=80&w=200&auto=format&fit=crop" },
        { id: "cow_d4", tag: "1004", name: "Dinda", breed: "Angus", img: "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?q=80&w=200&auto=format&fit=crop" },
        { id: "cow_d5", tag: "1005", name: "Rara", breed: "Holstein", img: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=200&auto=format&fit=crop" },
      ];

      // Insert Cows
      for (const cow of dummyCows) {
        await setDoc(doc(db, "cows", cow.id), {
          cowId: cow.id, farmId, tagNumber: cow.tag, name: cow.name, breed: cow.breed, gender: "Betina",
          birthDate: "2022-05-10", group: "Laktasi", location: "Kandang A", isActive: true, photoUrl: cow.img,
          currentStatus: { lactationPhase: Math.floor(Math.random() * 3) + 1 },
          createdAt: serverTimestamp()
        });

        // Insert Milk for 7 Days
        for (let i = 0; i < 7; i++) {
          let d = new Date(); d.setDate(d.getDate() - i);
          let dateStr = `${d.toISOString().split("T")[0]}T07:00:00Z`;
          
          // Bikin fluktuasi dummy
          let baseMilk = 20 + Math.random() * 15; // 20 - 35 Liter
          if (i === 0 && cow.tag === "1003") baseMilk -= 5; // Bikin Caca turun
          if (i === 0 && cow.tag === "1001") baseMilk += 5; // Bikin Bella naik

          await addDoc(collection(db, "milk_productions"), { 
            farmId, cowId: cow.id, date: dateStr, quantityLiter: Number(baseMilk.toFixed(1)), 
            milkingSession: "Pagi", recordedBy: userUid, createdAt: dateStr 
          });
        }
      }
      Swal.fire("Selesai!", "5 Sapi & Riwayat Susu berhasil di-generate!", "success");
    } catch (e: any) {
      Swal.fire("Error", e.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayLabel = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-[1600px] mx-auto pb-10 relative animate-in fade-in duration-500">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Produksi Susu</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Pantau produksi susu harian dan performa sapi Anda.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Tombol Dummy */}
          <button onClick={generateDummyData} disabled={isSubmitting} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer">
            ✨ Generate Data Dummy
          </button>

          {/* Date Picker */}
          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-sm font-bold text-slate-700">{todayLabel}</span>
          </button>
          
          {/* Filter */}
          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-emerald-600 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm font-bold text-sm cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filter
          </button>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer animate-in slide-in-from-bottom-4 duration-500">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Total Produksi Hari Ini</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{totalToday.toLocaleString('id-ID')} <span className="text-sm font-semibold text-slate-400">L</span></p>
            <p className={`text-[10px] font-bold mt-1 ${trendTotal >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trendTotal >= 0 ? "↑" : "↓"} {Math.abs(trendTotal).toFixed(1)}% <span className="text-slate-400 font-medium">dari kemarin</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer animate-in slide-in-from-bottom-4 duration-500 delay-75">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Rata-rata per Sapi</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{avgPerCowToday.toFixed(1)} <span className="text-sm font-semibold text-slate-400">L/ekor</span></p>
            <p className={`text-[10px] font-bold mt-1 ${trendAvg >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trendAvg >= 0 ? "↑" : "↓"} {Math.abs(trendAvg).toFixed(1)}% <span className="text-slate-400 font-medium">dari kemarin</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer animate-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Produksi Tertinggi</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{topCow.amount.toFixed(1)} <span className="text-sm font-semibold text-slate-400">L</span></p>
            <p className="text-[10px] font-medium text-slate-500 mt-1">Sapi #{topCow.tag} - {topCow.name}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer animate-in slide-in-from-bottom-4 duration-500 delay-150">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Penurunan Produksi</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{cowsDownCount} <span className="text-sm font-semibold text-slate-400">Ekor</span></p>
            <button className="text-[10px] font-bold text-slate-500 mt-1 hover:text-slate-700 transition-colors">Lihat daftar sapi →</button>
          </div>
        </div>

      </div>

      {/* 3. MIDDLE SECTION (Chart & AI Insight) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 animate-in slide-in-from-bottom-6 duration-700 delay-200">
        
        {/* Left: Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-900">Grafik Produksi Harian (Total Farm)</h3>
            <select className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg outline-none cursor-pointer hover:bg-slate-100 transition-colors">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          
          <div className="flex-1 relative min-h-[220px]">
            {/* Y-Axis */}
            <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] font-medium text-slate-400">
              <span>{yMax}</span><span>{Math.round(yMax*0.75)}</span><span>{Math.round(yMax*0.5)}</span><span>{Math.round(yMax*0.25)}</span><span>0</span>
            </div>
            {/* X-Axis */}
            <div className="absolute left-12 right-0 bottom-0 flex justify-between text-[10px] font-medium text-slate-400">
              {chartDataArray.map((d) => {
                const [y,m,day] = d.date.split("-");
                return <span key={d.date}>{day}/{m}</span>
              })}
            </div>
            
            {/* Chart Area */}
            <div className="absolute left-12 right-4 top-2 bottom-8">
              <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-100">
                <div className="w-full border-t border-slate-100/60 h-0"></div><div className="w-full border-t border-slate-100/60 h-0"></div>
                <div className="w-full border-t border-slate-100/60 h-0"></div><div className="w-full border-t border-slate-100/60 h-0"></div>
                <div className="w-full h-0"></div>
              </div>

              <svg viewBox="0 0 500 150" className="absolute inset-0 w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGreenArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points={polygonPoints} fill="url(#chartGreenArea)" className="animate-in fade-in duration-1000 delay-300" />
                <polyline points={polylinePoints} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in slide-in-from-left-8 duration-1000" />
                
                {chartDataArray.map((d, i) => d.milk > 0 && (
                  <g key={i} className="animate-in zoom-in duration-500 delay-500">
                    <circle cx={xCoords[i]} cy={mapY(d.milk)} r="4.5" fill="#10b981" stroke="white" strokeWidth="2" className="cursor-pointer hover:r-6 transition-all" />
                  </g>
                ))}
              </svg>
              
              {/* Tooltip on last point */}
              {totalToday > 0 && (
                <div className="absolute right-0 top-[28%] -translate-y-full mr-1 bg-emerald-500 text-white text-[11px] font-bold px-2 py-1 rounded shadow-md animate-in zoom-in duration-500 delay-700">
                  {totalToday.toLocaleString('id-ID')} L
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: AI Insight (DI-REWRITE TOTAL MENJADI FORMAT BADGE TANPA EMOJI) */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow group overflow-hidden relative">
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

      {/* 4. BOTTOM SECTION (Table) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
          <h3 className="text-sm font-bold text-slate-900">Produksi per Sapi (Hari Ini)</h3>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Cari nama sapi..." 
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
                className="w-48 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" 
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer active:scale-95">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50/80">
              <tr className="text-slate-500 border-b border-slate-100">
                <th className="py-3 px-5 font-semibold">No. Sapi</th>
                <th className="py-3 px-5 font-semibold">Nama</th>
                <th className="py-3 px-5 font-semibold text-center">Fase Laktasi</th>
                <th className="py-3 px-5 font-semibold text-center">Produksi Hari Ini (L)</th>
                <th className="py-3 px-5 font-semibold text-center">Perubahan</th>
                <th className="py-3 px-5 font-semibold text-center">Rata-rata 7 Hari (L)</th>
                <th className="py-3 px-5 font-semibold text-center">Trend Visual</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {tableData.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-slate-400 font-medium">Belum ada data sapi atau produksi hari ini.</td></tr>
              ) : (
                tableData.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded bg-slate-200 overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                          <img src={row.img} alt={row.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <span className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{row.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5 font-bold text-slate-700">{row.name}</td>
                    <td className="py-3 px-5 text-center font-medium">Laktasi ke-{row.laktasi}</td>
                    <td className="py-3 px-5 text-center font-black text-slate-900">{row.prod}</td>
                    <td className={`py-3 px-5 text-center font-bold ${row.changeType === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {row.changeText}
                    </td>
                    <td className="py-3 px-5 text-center font-bold text-slate-600">{row.avg}</td>
                    <td className="py-3 px-5 w-24">
                      {/* SVG Sparkline Mini Dinamis (Merah kalo turun, Hijau kalo naik) */}
                      <div className="w-16 h-4 mx-auto flex items-center group-hover:scale-110 transition-transform">
                        {row.changeType === 'up' ? (
                           <svg viewBox="0 0 30 10" className="w-full h-full preserve-3d overflow-visible">
                             <polyline points="0,8 5,5 10,7 15,3 20,5 25,1 30,2" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                           </svg>
                        ) : (
                          <svg viewBox="0 0 30 10" className="w-full h-full preserve-3d overflow-visible">
                             <polyline points="0,2 5,6 10,4 15,8 20,5 25,9 30,7" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {rawTableData.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
            <p className="text-[11px] font-medium text-slate-500">
              Menampilkan {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, rawTableData.length)} dari {rawTableData.length} sapi
            </p>
            
            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-700 shadow-sm disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded bg-emerald-500 text-white font-bold text-[11px] shadow-sm">{currentPage}</button>
              <span className="text-xs font-medium text-slate-400 px-1">/ {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-700 shadow-sm disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}