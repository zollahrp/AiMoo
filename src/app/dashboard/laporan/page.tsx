"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, getDoc, addDoc, doc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import { GoogleGenerativeAI } from "@google/generative-ai";

const formatIDR = (number: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(number);
};

export default function LaporanPage() {
  const [farmId, setFarmId] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState("Ringkasan");
  
  // Data State
  const [cowsList, setCowsList] = useState<any[]>([]);
  const [milkRecords, setMilkRecords] = useState<any[]>([]);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [reproRecords, setReproRecords] = useState<any[]>([]);
  const [feedRecords, setFeedRecords] = useState<any[]>([]);

  // 🔥 STATE UNTUK GEMINI AI 🔥
  const [aiInsight, setAiInsight] = useState<string>("STATUS: MEMPROSES...\nANALISIS: Mengumpulkan laporan produksi, kesehatan, pakan, dan analisis finansial peternakan selama 30 hari terakhir...");
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

    const qMilk = query(collection(db, "milk_productions"), where("farmId", "==", farmId));
    const unsubMilk = onSnapshot(qMilk, (snap) => setMilkRecords(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qHealth = query(collection(db, "health_records"), where("farmId", "==", farmId));
    const unsubHealth = onSnapshot(qHealth, (snap) => setHealthRecords(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qRepro = query(collection(db, "reproduction_records"), where("farmId", "==", farmId));
    const unsubRepro = onSnapshot(qRepro, (snap) => setReproRecords(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qFeed = query(collection(db, "feed_consumptions"), where("farmId", "==", farmId));
    const unsubFeed = onSnapshot(qFeed, (snap) => {
      setFeedRecords(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setIsLoading(false); // Terakhir di-load
    });

    return () => { unsubCows(); unsubMilk(); unsubHealth(); unsubRepro(); unsubFeed(); };
  }, [farmId]);

  // =====================================================================
  // 2. LOGIKA MATEMATIKA LAPORAN (30 HARI TERAKHIR)
  // =====================================================================
  const today = new Date();
  
  const getLastNDays = (n: number) => Array.from({length: n}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().split("T")[0];
  });

  const last30Days = getLastNDays(30);
  const prev30Days = Array.from({length: 30}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (60 - 1 - i));
    return d.toISOString().split("T")[0];
  });

  const startDateStr = new Date(last30Days[0]).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  const endDateStr = new Date(last30Days[29]).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const dateRangeLabel = `${startDateStr} - ${endDateStr}`;

  // --- FILTER DATA 30 HARI ---
  const milk30 = milkRecords.filter(m => last30Days.includes(m.date.split("T")[0]));
  const milkPrev30 = milkRecords.filter(m => prev30Days.includes(m.date.split("T")[0]));

  const feed30 = feedRecords.filter(f => last30Days.includes(f.date.split("T")[0]));
  const feedPrev30 = feedRecords.filter(f => prev30Days.includes(f.date.split("T")[0]));

  const health30 = healthRecords.filter(h => last30Days.includes(h.date.split("T")[0]));
  const repro30 = reproRecords.filter(r => last30Days.includes(r.date.split("T")[0]));

  // --- KPI GENERAL ---
  const totalCows = cowsList.length || 1;
  const sickCows = cowsList.filter(c => c.currentStatus?.health !== "Sehat").length;
  
  const totalMilk30 = milk30.reduce((s, m) => s + Number(m.quantityLiter), 0);
  const totalMilkPrev30 = milkPrev30.reduce((s, m) => s + Number(m.quantityLiter), 0);
  const trendMilk = totalMilkPrev30 > 0 ? ((totalMilk30 - totalMilkPrev30) / totalMilkPrev30) * 100 : 0;
  const avgMilkDay = totalMilk30 / 30;
  const avgMilkDayPrev = totalMilkPrev30 / 30;
  const trendAvgMilk = avgMilkDayPrev > 0 ? ((avgMilkDay - avgMilkDayPrev) / avgMilkDayPrev) * 100 : 0;

  // --- KEUANGAN (SIMULASI) ---
  const pricePerLiter = 8500;
  const costPerKgFeed = 2500;

  const totalFeedKg30 = feed30.reduce((s, f) => s + Number(f.quantityKg), 0);
  
  const revenue30 = totalMilk30 * pricePerLiter;
  const feedCost30 = totalFeedKg30 * costPerKgFeed;
  const operationalCost30 = totalCows * 150000; // Asumsi overhead Rp 150rb/sapi/bulan
  const totalCost30 = feedCost30 + operationalCost30;
  
  const netProfit30 = revenue30 - totalCost30;
  const margin30 = revenue30 > 0 ? (netProfit30 / revenue30) * 100 : 0;
  const feedCostPerLiter = totalMilk30 > 0 ? (feedCost30 / totalMilk30) : 0;

  // --- TOP 5 SAPI ---
  const cowMilkTotals: Record<string, number> = {};
  milk30.forEach(m => { cowMilkTotals[m.cowId] = (cowMilkTotals[m.cowId] || 0) + Number(m.quantityLiter); });
  
  const top5Cows = Object.entries(cowMilkTotals)
    .map(([id, total]) => {
      const c = cowsList.find(cow => cow.cowId === id);
      return { id, name: c?.name || "?", tag: c?.tagNumber || "?", total, avg: total/30 };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // --- KESEHATAN (DONUT CHART) ---
  const healthDiags: Record<string, number> = { "Mastitis": 0, "Demam": 0, "Diare": 0, "Cacingan": 0, "Lainnya": 0 };
  let totalCases = 0;
  health30.forEach(h => {
    if (h.type !== "Vaksinasi") {
      const d = (h.diagnosis || "").toLowerCase();
      if (d.includes("mastitis")) healthDiags["Mastitis"]++;
      else if (d.includes("demam")) healthDiags["Demam"]++;
      else if (d.includes("diare") || d.includes("pencernaan")) healthDiags["Diare"]++;
      else if (d.includes("cacing")) healthDiags["Cacingan"]++;
      else healthDiags["Lainnya"]++;
      totalCases++;
    }
  });

  const healthColors = ["#ef4444", "#f97316", "#fbbf24", "#22c55e", "#3b82f6"];
  let hCum = 0;
  const healthGradient = Object.entries(healthDiags).map(([k, v], i) => {
    const pct = totalCases > 0 ? (v / totalCases) * 100 : 0;
    const str = `${healthColors[i]} ${hCum}% ${hCum + pct}%`;
    hCum += pct;
    return str;
  }).join(", ");

  // --- REPRODUKSI ---
  const totalIB30 = repro30.filter(r => r.activityType?.includes("IB")).length;
  const buntingList = cowsList.filter(c => c.currentStatus?.reproduction?.includes("Bunting")).length;
  const kosongList = cowsList.filter(c => c.currentStatus?.reproduction === "Kosong").length;

  // --- PAKAN BAR CHART ---
  const feedCategories = { "Hijauan": 0, "Konsentrat": 0, "Silase": 0, "Mineral": 0, "Lainnya": 0 };
  feed30.forEach(f => {
    const t = (f.feedType || "Lainnya").toLowerCase();
    if (t.includes("rumput") || t.includes("hijauan")) feedCategories["Hijauan"] += Number(f.quantityKg);
    else if (t.includes("konsentrat")) feedCategories["Konsentrat"] += Number(f.quantityKg);
    else if (t.includes("silase")) feedCategories["Silase"] += Number(f.quantityKg);
    else if (t.includes("mineral") || t.includes("vitamin")) feedCategories["Mineral"] += Number(f.quantityKg);
    else feedCategories["Lainnya"] += Number(f.quantityKg);
  });
  const maxFeedBar = Math.max(...Object.values(feedCategories), 1);

  // --- LINE CHART SUSU ---
  const milkChartData = last30Days.map(dateStr => {
    return milk30.filter(m => m.date.split("T")[0] === dateStr).reduce((s, m) => s + Number(m.quantityLiter), 0);
  });
  const maxMilkChart = Math.max(...milkChartData, 50);
  const mapMilkY = (val: number) => 150 - ((val / (maxMilkChart * 1.2)) * 120);
  const milkPolyline = milkChartData.map((val, idx) => `${(idx / 29) * 500},${mapMilkY(val)}`).join(" ");

  // =====================================================================
  // 🔥 FUNGSI GEMINI AI (BUSINESS ANALYST)
  // =====================================================================
  const fetchGeminiInsight = async () => {
    if (isLoading || !process.env.NEXT_PUBLIC_GEMINI_API_KEY) return;

    setIsAiLoading(true);
    setAiInsight("STATUS: MEMPROSES...\nANALISIS: Menganalisis laporan finansial dan performa produksi 30 hari terakhir...");

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

      const prompt = `
        Kamu adalah AI Konsultan Bisnis Peternakan Sapi Perah (AI Moo Report Analyst).
        Laporan Performa 30 Hari Terakhir (${dateRangeLabel}):
        - Populasi: ${totalCows} ekor (Sakit: ${sickCows}, Bunting: ${buntingList})
        - Produksi Susu: ${totalMilk30.toFixed(1)} Liter (Tren: ${trendMilk >= 0 ? '+' : ''}${trendMilk.toFixed(1)}%)
        - Total Kasus Penyakit: ${totalCases} kasus
        - Inseminasi Buatan (IB) Dilakukan: ${totalIB30} kali
        
        Finansial:
        - Pendapatan: Rp ${revenue30.toLocaleString('id-ID')}
        - Biaya Pakan & Operasional: Rp ${totalCost30.toLocaleString('id-ID')}
        - Laba Bersih: Rp ${netProfit30.toLocaleString('id-ID')} (Margin: ${margin30.toFixed(1)}%)
        - Biaya Pakan per Liter: Rp ${feedCostPerLiter.toFixed(0)}/L

        Tugas: Berikan analisis eksekutif (Executive Summary).
        
        Berikan jawaban STRICT dengan format ini (TANPA EMOJI, TANPA MARKDOWN BINTANG):
        STATUS: [Pilih: SANGAT BAIK / STABIL / PERLU PERBAIKAN / KRITIS]
        ANALISIS: [3-4 kalimat padat berisi evaluasi profitabilitas, sorotan efisiensi produksi/kesehatan, dan satu rekomendasi strategis untuk bulan depan]
      `;

      const result = await model.generateContent(prompt);
      setAiInsight(result.response.text());
    } catch (error) {
      console.error("Gagal memanggil Gemini API:", error);
      setAiInsight("STATUS: ERROR\nANALISIS: Maaf, koneksi ke server AI terputus saat membuat laporan. Silakan coba sinkronisasi ulang.");
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && milkRecords.length > 0) {
      fetchGeminiInsight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <div className="max-w-[1600px] mx-auto pb-10 relative animate-in fade-in duration-500">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Laporan</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Analisis performa dan ringkasan data peternakan sapi perah Anda.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-default">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-sm font-bold text-slate-700">{dateRangeLabel}</span>
          </button>
          
          <button onClick={() => window.print()} className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm font-bold text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Cetak PDF
          </button>
        </div>
      </div>

      {/* 2. TABS NAVIGASI MODUL */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {["Ringkasan", "Produksi Susu", "Kesehatan", "Reproduksi", "Pakan", "Keuangan"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-3 p-3 border rounded-xl text-left transition-colors cursor-pointer ${activeTab === tab ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
            <div className={activeTab === tab ? 'text-emerald-500' : 'text-slate-400'}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /></svg>
            </div>
            <div>
              <p className={`text-[11px] font-bold ${activeTab === tab ? 'text-emerald-800' : 'text-slate-800'}`}>{tab}</p>
            </div>
          </button>
        ))}
      </div>

      {/* JIKA DATA MASIH LOADING */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-emerald-600 font-bold animate-pulse">
          Menyusun Laporan 30 Hari...
        </div>
      ) : activeTab === "Ringkasan" ? (
      <>
        {/* =========================================
            TAB: RINGKASAN
            ========================================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <p className="text-[10px] font-bold text-slate-600">Total Produksi Susu</p>
            </div>
            <p className="text-xl font-black text-slate-900 tracking-tight">{totalMilk30.toLocaleString('id-ID')} <span className="text-sm font-semibold text-slate-400">L</span></p>
            <p className={`text-[9px] font-bold mt-1 ${trendMilk >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trendMilk >= 0 ? '↑' : '↓'} {Math.abs(trendMilk).toFixed(1)}% <br/><span className="text-slate-400 font-medium">vs 30 hari sblm</span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-[10px] font-bold text-slate-600">Rata-rata Harian</p>
            </div>
            <p className="text-xl font-black text-slate-900 tracking-tight">{avgMilkDay.toFixed(1)} <span className="text-sm font-semibold text-slate-400">L</span></p>
            <p className={`text-[9px] font-bold mt-1 ${trendAvgMilk >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trendAvgMilk >= 0 ? '↑' : '↓'} {Math.abs(trendAvgMilk).toFixed(1)}% <br/><span className="text-slate-400 font-medium">vs 30 hari sblm</span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
              </div>
              <p className="text-[10px] font-bold text-slate-600">Sapi Aktif</p>
            </div>
            <p className="text-xl font-black text-slate-900 tracking-tight">{totalCows} <span className="text-sm font-semibold text-slate-400">ekor</span></p>
            <p className="text-[9px] font-bold text-slate-400 mt-1">Total Populasi<br/><span className="text-slate-400 font-medium">di sistem saat ini</span></p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <p className="text-[10px] font-bold text-slate-600">Sapi Sakit</p>
            </div>
            <p className="text-xl font-black text-slate-900 tracking-tight">{sickCows} <span className="text-sm font-semibold text-slate-400">ekor</span></p>
            <p className="text-[9px] font-bold text-slate-400 mt-1">Status belum sehat<br/><span className="text-slate-400 font-medium">di sistem saat ini</span></p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-[10px] font-bold text-slate-600">Biaya Pakan / Liter</p>
            </div>
            <p className="text-xl font-black text-slate-900 tracking-tight"><span className="text-xs">Rp</span> {feedCostPerLiter.toLocaleString('id-ID')}</p>
            <p className="text-[9px] font-bold text-slate-400 mt-1">Efisiensi pakan 30 hr<br/><span className="text-slate-400 font-medium">vs total produksi susu</span></p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
              </div>
              <p className="text-[10px] font-bold text-slate-600">Laba Bersih 30 Hr</p>
            </div>
            <p className="text-xl font-black text-slate-900 tracking-tight"><span className="text-xs">Rp</span> {(netProfit30/1000000).toFixed(1)}<span className="text-xs">Jt</span></p>
            <p className="text-[9px] font-bold text-emerald-500 mt-1">Margin {margin30.toFixed(1)}% <br/><span className="text-slate-400 font-medium">Bulan berjalan</span></p>
          </div>
        </div>

        {/* AI Insight Rangkuman Eksekutif */}
        <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 shadow-sm p-6 mb-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className={`text-indigo-600 transition-transform ${isAiLoading ? 'animate-spin' : 'group-hover:scale-110 group-hover:rotate-12'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span> 
              Executive Summary (AI Moo Analyst)
            </h3>
            
            <button 
              onClick={fetchGeminiInsight}
              disabled={isAiLoading}
              className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <svg className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Analisis Ulang
            </button>
          </div>
          
          {(() => {
            const rawStatus = aiInsight.match(/STATUS:\s*(.*)/);
            const rawAnalysis = aiInsight.match(/ANALISIS:\s*([\s\S]*)/);
            
            const statusText = rawStatus ? rawStatus[1].trim().toUpperCase() : (isAiLoading ? "MEMPROSES..." : "MENUNGGU DATA");
            const analysisText = rawAnalysis ? rawAnalysis[1].trim() : aiInsight;

            let badgeColor = "bg-slate-100 text-slate-700 border-slate-200";
            let statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

            if (statusText.includes("BAIK") || statusText.includes("STABIL")) {
              badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm";
              statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
            } else if (statusText.includes("PERBAIKAN") || statusText.includes("PERINGATAN")) {
              badgeColor = "bg-amber-100 text-amber-800 border-amber-200 shadow-sm";
              statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
            } else if (statusText.includes("KRITIS") || statusText.includes("ERROR")) {
              badgeColor = "bg-red-100 text-red-800 border-red-200 shadow-sm";
              statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>;
            }

            return (
              <div className="relative z-10 flex flex-col h-full bg-white/60 p-4 rounded-xl border border-indigo-100/50">
                {isAiLoading ? (
                  <div className="flex flex-col gap-3 animate-pulse">
                    <div className="h-5 bg-slate-200/70 rounded-md w-32 mb-1"></div>
                    <div className="h-3 bg-slate-200/70 rounded w-full"></div>
                    <div className="h-3 bg-slate-200/70 rounded w-full"></div>
                    <div className="h-3 bg-slate-200/70 rounded w-4/6"></div>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wide ${badgeColor}`}>
                        {statusIcon}
                        {statusText}
                      </span>
                    </div>
                    <div className="text-[13px] text-slate-700 leading-relaxed font-medium mt-1 whitespace-pre-wrap">
                      {analysisText}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* 4. MIDDLE SECTION (3 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
          
          {/* Tren Produksi Susu */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Tren Produksi Susu (30 Hari)
              </h3>
            </div>
            
            <div className="flex-1 relative min-h-[160px]">
               <div className="absolute left-0 top-0 bottom-8 w-6 flex flex-col justify-between text-[9px] font-medium text-slate-400">
                 <span>{Math.ceil(maxMilkChart * 1.2)}</span><span>{Math.ceil(maxMilkChart * 0.8)}</span><span>{Math.ceil(maxMilkChart * 0.4)}</span><span>0</span>
               </div>
               <div className="absolute left-8 right-0 bottom-0 flex justify-between text-[9px] font-medium text-slate-400 overflow-hidden">
                 {/* Print label setiap 6 hari agar tidak penuh */}
                 {last30Days.map((d, i) => i % 6 === 0 ? <span key={i}>{new Date(d).getDate()} {new Date(d).toLocaleDateString('id-ID',{month:'short'})}</span> : null)}
               </div>
               <div className="absolute left-8 right-2 top-2 bottom-6">
                 <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-100">
                   {[...Array(4)].map((_,i) => <div key={i} className="w-full border-t border-slate-100/60 h-0"></div>)}
                   <div className="w-full h-0"></div>
                 </div>
                 <svg viewBox="0 0 500 150" className="absolute inset-0 w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
                   <polyline points={milkPolyline} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in duration-1000"/>
                   {/* Tooltip pada titik terakhir */}
                   {milkChartData.length > 0 && milkChartData[29] > 0 && (
                     <circle cx="500" cy={mapMilkY(milkChartData[29])} r="4" fill="white" stroke="#22c55e" strokeWidth="2" className="animate-in zoom-in duration-500 delay-500" />
                   )}
                 </svg>
               </div>
            </div>
          </div>

          {/* Produksi Susu per Sapi (Top 5) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Top 5 Sapi Produksi</h3>
            </div>
            <div className="flex-1 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-[11px] whitespace-nowrap">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="pb-2 font-semibold">No</th>
                    <th className="pb-2 font-semibold">Sapi</th>
                    <th className="pb-2 font-semibold text-center">Rata-rata/hari</th>
                    <th className="pb-2 font-semibold text-center">Total 30Hr</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 font-medium">
                  {top5Cows.length === 0 ? <tr><td colSpan={4} className="py-8 text-center text-slate-400">Tidak ada data</td></tr> : 
                    top5Cows.map((c, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-2.5">{i+1}</td>
                      <td className="py-2.5">
                        <p className="text-slate-900 font-bold">#{c.tag}</p>
                        <p className="text-[9px] text-slate-500">{c.name}</p>
                      </td>
                      <td className="py-2.5 text-center">{c.avg.toFixed(1)} L</td>
                      <td className="py-2.5 text-center font-bold text-emerald-600">{c.total.toFixed(0)} L</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setActiveTab("Produksi Susu")} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 mt-2 text-left cursor-pointer">Lihat seluruh laporan produksi →</button>
          </div>

          {/* Ringkasan Kesehatan */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900">Distribusi Kesehatan</h3>
            </div>
            <div className="flex items-center gap-6 flex-1 justify-center">
              {/* CSS Donut Chart */}
              <div className="relative w-32 h-32 shrink-0 rounded-full flex items-center justify-center transition-all duration-1000" 
                   style={{ background: healthGradient ? `conic-gradient(${healthGradient})` : '#f1f5f9' }}>
                <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-inner text-center">
                  <span className="text-[9px] font-bold text-slate-500">Total Kasus</span>
                  <span className="text-xl font-black text-slate-900">{totalCases}</span>
                </div>
              </div>
              
              {/* Legend */}
              <div className="space-y-2">
                {Object.entries(healthDiags).map(([name, count], i) => (
                  <div key={name} className="flex justify-between items-center text-[10px] gap-4">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{backgroundColor: healthColors[i]}}></span><span className="font-semibold text-slate-700">{name}</span></div>
                    <span className="text-slate-500 font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setActiveTab("Kesehatan")} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left cursor-pointer">Lihat laporan kesehatan →</button>
          </div>

        </div>

        {/* 5. BOTTOM SECTION (3 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
          
          {/* Ringkasan Reproduksi */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Ringkasan Reproduksi</h3>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-green-50/50 border border-green-100 p-2 rounded-lg text-center flex flex-col items-center">
                <span className="text-green-600 mb-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></span>
                <p className="text-[9px] font-bold text-slate-600">IB Dilakukan</p>
                <p className="text-xs font-black text-slate-900 leading-tight">{totalIB30} <span className="font-semibold text-slate-500 text-[9px]">kali</span></p>
              </div>
              <div className="bg-purple-50/50 border border-purple-100 p-2 rounded-lg text-center flex flex-col items-center">
                <span className="text-purple-600 mb-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></span>
                <p className="text-[9px] font-bold text-slate-600">Total Bunting</p>
                <p className="text-xs font-black text-slate-900 leading-tight">{buntingList} <span className="font-semibold text-slate-500 text-[9px]">ekor</span></p>
              </div>
              <div className="bg-blue-50/50 border border-blue-100 p-2 rounded-lg text-center flex flex-col items-center">
                <span className="text-blue-500 mb-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></span>
                <p className="text-[9px] font-bold text-slate-600">Total Kosong</p>
                <p className="text-xs font-black text-slate-900 leading-tight">{kosongList} <span className="font-semibold text-slate-500 text-[9px]">ekor</span></p>
              </div>
              <div className="bg-amber-50/50 border border-amber-100 p-2 rounded-lg text-center flex flex-col items-center">
                <span className="text-amber-500 mb-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg></span>
                <p className="text-[9px] font-bold text-slate-600">Kering</p>
                <p className="text-xs font-black text-slate-900 leading-tight">{cowsList.filter(c => c.group === 'Kering Kandang').length} <span className="font-semibold text-slate-500 text-[9px]">ekor</span></p>
              </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left text-[10px] whitespace-nowrap">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="pb-2 font-semibold">Tanggal IB</th>
                    <th className="pb-2 font-semibold">Sapi</th>
                    <th className="pb-2 font-semibold">Oleh</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {repro30.filter(r => r.activityType?.includes("IB")).length === 0 ? (
                    <tr><td colSpan={3} className="py-4 text-center text-slate-400">Tidak ada IB 30 hr terakhir</td></tr>
                  ) : (
                    repro30.filter(r => r.activityType?.includes("IB")).slice(0, 5).map((r, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-2">{new Date(r.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</td>
                        <td className="py-2 font-bold text-slate-900">#{cowsList.find(c => c.cowId === r.cowId)?.tagNumber || '?'}</td>
                        <td className="py-2 text-slate-500">{r.handledBy || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <button onClick={() => setActiveTab("Reproduksi")} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 mt-2 text-left cursor-pointer">Lihat laporan reproduksi →</button>
          </div>

          {/* Konsumsi Pakan (Bar Chart) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900">Total Pakan 30 Hari</h3>
            </div>
            
            <div className="flex-1 flex items-end gap-2 text-center h-40 border-b border-slate-200 relative pb-6 mb-4">
              <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[9px] font-medium text-slate-400 text-left">
                <span className="-mt-3">(Kg)</span><span>{maxFeedBar}</span><span>{Math.round(maxFeedBar/2)}</span><span>0</span>
              </div>
              
              <div className="ml-10 flex-1 h-full flex items-end justify-around gap-2 px-2 relative z-10">
                {Object.entries(feedCategories).map(([k, v]) => {
                  const hPct = maxFeedBar > 0 ? (v / maxFeedBar) * 100 : 0;
                  return (
                    <div key={k} className="flex flex-col items-center w-full relative group">
                      <span className="text-[10px] font-bold text-slate-900 mb-1 absolute -top-5 opacity-0 group-hover:opacity-100 transition-opacity">{v.toFixed(0)}</span>
                      <div className="w-8 bg-emerald-500 rounded-t-sm transition-all duration-1000" style={{height: `${hPct}%`}}></div>
                      <span className="text-[9px] font-medium text-slate-500 mt-2 absolute -bottom-5 truncate max-w-full" title={k}>{k.substring(0,6)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <button onClick={() => setActiveTab("Pakan")} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 mt-2 text-left cursor-pointer">Lihat rincian pakan →</button>
          </div>

          {/* Ringkasan Keuangan */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900">Finansial (Estimasi 30 Hari)</h3>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-[11px] font-medium text-slate-700">Total Pendapatan Susu</span>
                </div>
                <span className="text-[11px] font-black text-slate-900">{formatIDR(revenue30)}</span>
              </div>
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-red-50 text-red-500 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-[11px] font-medium text-slate-700">Estimasi Biaya (Pakan+OH)</span>
                </div>
                <span className="text-[11px] font-black text-slate-900">{formatIDR(totalCost30)}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                  <span className="text-[11px] font-medium text-slate-700">Laba Bersih</span>
                </div>
                <span className={`text-[11px] font-black ${netProfit30 >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{formatIDR(netProfit30)}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-amber-50 text-amber-500 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                  </div>
                  <span className="text-[11px] font-medium text-slate-700">Margin Laba</span>
                </div>
                <span className="text-[11px] font-black text-slate-900">{margin30.toFixed(1)}%</span>
              </div>
            </div>
            <button onClick={() => setActiveTab("Keuangan")} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 mt-2 text-left cursor-pointer">Lihat Rincian Keuangan →</button>
          </div>

        </div>
      </>
      ) : activeTab === "Produksi Susu" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-in fade-in duration-500">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Laporan Detail Produksi Susu (30 Hari Terakhir)</h3>
          <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 sticky top-0 shadow-sm">
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="py-3 px-4 font-semibold">Tanggal</th>
                  <th className="py-3 px-4 font-semibold">Sapi</th>
                  <th className="py-3 px-4 font-semibold">Sesi</th>
                  <th className="py-3 px-4 font-semibold">Volume (L)</th>
                  <th className="py-3 px-4 font-semibold">Dicatat Oleh</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {milk30.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-slate-400 font-medium">Belum ada data produksi.</td></tr>}
                {milk30.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((m, i) => {
                  const cowInfo = cowsList.find(c => c.cowId === m.cowId) || {};
                  return (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">{new Date(m.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-3 px-4 font-bold">#{cowInfo.tagNumber || "?"} - {cowInfo.name || "?"}</td>
                      <td className="py-3 px-4">{m.milkingSession || "Pagi"}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">{m.quantityLiter} L</td>
                      <td className="py-3 px-4 text-slate-500">Petugas</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "Kesehatan" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-in fade-in duration-500">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Laporan Detail Kesehatan (30 Hari Terakhir)</h3>
          <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 sticky top-0 shadow-sm">
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="py-3 px-4 font-semibold">Tanggal</th>
                  <th className="py-3 px-4 font-semibold">Sapi</th>
                  <th className="py-3 px-4 font-semibold">Tipe</th>
                  <th className="py-3 px-4 font-semibold">Diagnosis/Gejala</th>
                  <th className="py-3 px-4 font-semibold">Tindakan/Obat</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {health30.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-slate-400 font-medium">Belum ada rekam medis.</td></tr>}
                {health30.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((h, i) => {
                  const cowInfo = cowsList.find(c => c.cowId === h.cowId) || {};
                  return (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">{new Date(h.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-3 px-4 font-bold">#{cowInfo.tagNumber || "?"} - {cowInfo.name || "?"}</td>
                      <td className="py-3 px-4"><span className={`px-2 py-1 rounded text-[9px] font-bold border ${h.type === 'Vaksinasi' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-red-50 text-red-700 border-red-100'}`}>{h.type || "Pemeriksaan"}</span></td>
                      <td className="py-3 px-4 font-medium text-slate-900">{h.diagnosis || "-"}</td>
                      <td className="py-3 px-4 text-slate-500 truncate max-w-[200px]" title={h.details}>{h.details || "-"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "Reproduksi" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-in fade-in duration-500">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Laporan Detail Reproduksi (30 Hari Terakhir)</h3>
          <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 sticky top-0 shadow-sm">
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="py-3 px-4 font-semibold">Tanggal</th>
                  <th className="py-3 px-4 font-semibold">Sapi</th>
                  <th className="py-3 px-4 font-semibold">Aktivitas</th>
                  <th className="py-3 px-4 font-semibold">Keterangan</th>
                  <th className="py-3 px-4 font-semibold">Petugas</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {repro30.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-slate-400 font-medium">Belum ada data reproduksi.</td></tr>}
                {repro30.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((r, i) => {
                  const cowInfo = cowsList.find(c => c.cowId === r.cowId) || {};
                  return (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">{new Date(r.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-3 px-4 font-bold">#{cowInfo.tagNumber || "?"} - {cowInfo.name || "?"}</td>
                      <td className="py-3 px-4 font-bold text-purple-600">{r.activityType}</td>
                      <td className="py-3 px-4 text-slate-600">{r.details || "-"}</td>
                      <td className="py-3 px-4 text-slate-500">{r.handledBy || "-"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "Pakan" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-in fade-in duration-500">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Laporan Konsumsi Pakan (30 Hari Terakhir)</h3>
          <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 sticky top-0 shadow-sm">
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="py-3 px-4 font-semibold">Tanggal</th>
                  <th className="py-3 px-4 font-semibold">Sapi</th>
                  <th className="py-3 px-4 font-semibold">Jenis Pakan</th>
                  <th className="py-3 px-4 font-semibold">Jumlah (Kg)</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {feed30.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-400 font-medium">Belum ada data pakan.</td></tr>}
                {feed30.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((f, i) => {
                  const cowInfo = cowsList.find(c => c.cowId === f.cowId) || {};
                  return (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">{new Date(f.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-3 px-4 font-bold">#{cowInfo.tagNumber || "?"} - {cowInfo.name || "?"}</td>
                      <td className="py-3 px-4 font-medium text-slate-600">{f.feedType}</td>
                      <td className="py-3 px-4 font-bold text-amber-600">{f.quantityKg} Kg</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "Keuangan" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
          <div className="text-center mb-8 border-b border-slate-200 pb-6">
            <h2 className="text-xl font-black text-slate-900">Laporan Laba Rugi (Profit & Loss)</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Periode: {dateRangeLabel}</p>
          </div>
          
          <table className="w-full text-left text-sm">
            <tbody>
              {/* Pendapatan */}
              <tr><td colSpan={2} className="py-3 font-bold text-slate-500 uppercase tracking-wider text-xs bg-slate-50 px-4 rounded-t-lg">PENDAPATAN</td></tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-4 font-semibold text-slate-800">Penjualan Susu ({totalMilk30.toFixed(1)} L x Rp 8.500)</td>
                <td className="py-4 px-4 text-right font-black text-slate-900">{formatIDR(revenue30)}</td>
              </tr>
              <tr className="border-b-2 border-slate-200">
                <td className="py-4 px-4 font-black text-slate-900">TOTAL PENDAPATAN</td>
                <td className="py-4 px-4 text-right font-black text-emerald-600">{formatIDR(revenue30)}</td>
              </tr>

              {/* Biaya */}
              <tr><td colSpan={2} className="py-3 font-bold text-slate-500 uppercase tracking-wider text-xs bg-slate-50 px-4 mt-4 block">BIAYA OPERASIONAL</td></tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-4 font-semibold text-slate-800">Biaya Pakan ({totalFeedKg30.toFixed(1)} kg x Rp 2.500)</td>
                <td className="py-4 px-4 text-right font-black text-slate-900">- {formatIDR(feedCost30)}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-4 font-semibold text-slate-800">Overhead & Tenaga Kerja ({totalCows} ekor x Rp 150.000)</td>
                <td className="py-4 px-4 text-right font-black text-slate-900">- {formatIDR(operationalCost30)}</td>
              </tr>
              <tr className="border-b-2 border-slate-200">
                <td className="py-4 px-4 font-black text-slate-900">TOTAL BIAYA</td>
                <td className="py-4 px-4 text-right font-black text-red-500">- {formatIDR(totalCost30)}</td>
              </tr>

              {/* Laba Bersih */}
              <tr className="bg-emerald-50/50">
                <td className="py-6 px-4 font-black text-emerald-900 text-base rounded-bl-lg">LABA BERSIH</td>
                <td className="py-6 px-4 text-right font-black text-emerald-600 text-lg rounded-br-lg">{formatIDR(netProfit30)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}

    </div>
  );
}