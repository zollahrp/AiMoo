"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, getDoc, addDoc, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function DashboardPage() {
  const [farmId, setFarmId] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data State
  const [cowsList, setCowsList] = useState<any[]>([]);
  const [milkRecords, setMilkRecords] = useState<any[]>([]);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);

  // 🔥 STATE UNTUK GEMINI AI 🔥
  const [aiInsight, setAiInsight] = useState<string>("STATUS: MEMPROSES...\nANALISIS: Mengumpulkan dan memproses seluruh data operasional peternakan...");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // 🔥 STATE UNTUK TUGAS HARIAN (INTERAKTIF) 🔥
  const [tasks, setTasks] = useState([
    { id: 1, label: "Periksa kebuntingan kelompok 3", time: "08:00", isChecked: false },
    { id: 2, label: "Vaksinasi PMK", time: "10:00", isChecked: true },
    { id: 3, label: "Pemeriksaan ambing sore", time: "16:00", isChecked: false },
    { id: 4, label: "Pembersihan kandang laktasi", time: "17:30", isChecked: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isChecked: !t.isChecked } : t));
  };

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
    const unsubMilk = onSnapshot(qMilk, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setMilkRecords(data);
    });

    const qHealth = query(collection(db, "health_records"), where("farmId", "==", farmId));
    const unsubHealth = onSnapshot(qHealth, (snap) => {
      setHealthRecords(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setIsLoading(false);
    });

    return () => { unsubCows(); unsubMilk(); unsubHealth(); };
  }, [farmId]);

  // =====================================================================
  // 2. LOGIKA MATEMATIKA DASHBOARD (KPI, WARNINGS, CHART)
  // =====================================================================
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split("T")[0];
  let yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

  // --- KPI SAPI ---
  const totalCows = cowsList.length || 1;
  const cowsJantan = cowsList.filter(c => c.gender === "Jantan").length;
  const cowsBetina = cowsList.length - cowsJantan;
  
  const totalBunting = cowsList.filter(c => c.currentStatus?.reproduction?.includes("Bunting")).length;
  const pctBunting = ((totalBunting / totalCows) * 100).toFixed(1);
  
  const totalKosong = cowsList.filter(c => c.currentStatus?.reproduction === "Kosong").length;
  const totalLaktasi = cowsList.filter(c => c.group === "Laktasi").length;
  const totalKering = cowsList.filter(c => c.group === "Kering Kandang").length;

  // --- KPI SUSU ---
  const milkTodayData = milkRecords.filter(m => m.date.startsWith(todayStr));
  const milkYesterdayData = milkRecords.filter(m => m.date.startsWith(yesterdayStr));
  
  const totalMilkToday = milkTodayData.reduce((sum, m) => sum + Number(m.quantityLiter), 0);
  const totalMilkYesterday = milkYesterdayData.reduce((sum, m) => sum + Number(m.quantityLiter), 0);
  const trendMilk = totalMilkYesterday > 0 ? ((totalMilkToday - totalMilkYesterday) / totalMilkYesterday) * 100 : 0;

  const avgMilkToday = milkTodayData.length > 0 ? (totalMilkToday / milkTodayData.length) : 0;
  const avgMilkYesterday = milkYesterdayData.length > 0 ? (totalMilkYesterday / milkYesterdayData.length) : 0;
  const trendAvgMilk = avgMilkYesterday > 0 ? ((avgMilkToday - avgMilkYesterday) / avgMilkYesterday) * 100 : 0;

  // --- AUTO WARNINGS (RULE-BASED) ---
  const warnings: any[] = [];
  cowsList.forEach(cow => {
    // 1. Cek Suhu (Demam / Heat Stress)
    const temp = cow.liveMetrics?.temperature || 38.5;
    if (temp > 39.5) {
      warnings.push({ id: cow.cowId, cowName: cow.name, tag: cow.tagNumber, type: "Suhu Tinggi", desc: `Suhu mencapai ${temp}°C`, color: "red", icon: "🌡️" });
    }
    
    // 2. Cek Penurunan Susu Drastis (>15%)
    const cowMilks = milkRecords.filter(m => m.cowId === cow.cowId);
    const mToday = cowMilks.filter(m => m.date.startsWith(todayStr)).reduce((s, m) => s + Number(m.quantityLiter), 0);
    const mYest = cowMilks.filter(m => m.date.startsWith(yesterdayStr)).reduce((s, m) => s + Number(m.quantityLiter), 0);
    if (mYest > 0 && mToday < (mYest * 0.85) && mToday > 0) {
      const dropPct = ((mYest - mToday) / mYest * 100).toFixed(0);
      warnings.push({ id: cow.cowId, cowName: cow.name, tag: cow.tagNumber, type: "Produksi Drop", desc: `Turun ${dropPct}% dari kemarin`, color: "amber", icon: "📉" });
    }

    // 3. Cek Status Penyakit / Repeat Breeder
    const health = cow.currentStatus?.health || "Sehat";
    if (health !== "Sehat") {
      warnings.push({ id: cow.cowId, cowName: cow.name, tag: cow.tagNumber, type: "Status Medis", desc: `Terdiagnosis ${health}`, color: "red", icon: "🩺" });
    }
  });

  const uniqueWarnings = warnings.slice(0, 4); // Ambil 4 teratas buat di UI
  const totalPerhatian = [...new Set(warnings.map(w => w.id))].length; // Sapi unik yang kena warning

  // --- LOGIKA LINE CHART (7 HARI) ---
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const chartData = last7Days.map(dateStr => {
    const dayMilk = milkRecords.filter(m => m.date.startsWith(dateStr)).reduce((sum, m) => sum + Number(m.quantityLiter), 0);
    return { date: dateStr, milk: dayMilk };
  });

  const total7Days = chartData.reduce((sum, d) => sum + d.milk, 0);
  const avg7Days = total7Days / 7;
  const max7Days = Math.max(...chartData.map(d => d.milk), 0);
  const min7Days = Math.min(...chartData.filter(d => d.milk > 0).map(d => d.milk), max7Days);

  const maxChartVal = Math.max(...chartData.map(d => d.milk), 50); 
  const yMaxChart = Math.ceil(maxChartVal * 1.2); 
  const mapY = (val: number) => 150 - ((val / yMaxChart) * 120); 
  const xCoords = Array.from({length: 7}, (_, i) => i * (400 / 6));
  const polylinePoints = chartData.map((d, i) => `${xCoords[i]},${mapY(d.milk)}`).join(" ");

  const xAxisLabels = last7Days.map(d => {
    const dt = new Date(d);
    return `${dt.getDate()} ${dt.toLocaleString('id-ID', { month: 'short' })}`;
  });

  // --- LOGIKA DONUT REPRODUKSI ---
  const sumDonut = totalBunting + totalKosong + totalLaktasi + totalKering || 1;
  const pctDBunting = (totalBunting / sumDonut) * 100;
  const pctDKosong = (totalKosong / sumDonut) * 100;
  const pctDLaktasi = (totalLaktasi / sumDonut) * 100;
  const gradientDonut = `conic-gradient(#4ade80 0% ${pctDBunting}%, #94a3b8 ${pctDBunting}% ${pctDBunting+pctDKosong}%, #fbbf24 ${pctDBunting+pctDKosong}% ${pctDBunting+pctDKosong+pctDLaktasi}%, #f87171 ${pctDBunting+pctDKosong+pctDLaktasi}% 100%)`;

  // =====================================================================
  // 🔥 FUNGSI GEMINI AI (CHIEF FARM MANAGER)
  // =====================================================================
  const fetchGeminiInsight = async () => {
    if (isLoading || !process.env.NEXT_PUBLIC_GEMINI_API_KEY) return;

    setIsAiLoading(true);
    setAiInsight("STATUS: MEMPROSES...\nANALISIS: Menganalisis kondisi keseluruhan farm dari berbagai metrik...");

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

      const prompt = `
        Kamu adalah sistem AI Kepala Manajer Peternakan Sapi (AI Moo Command Center).
        Data Farm Hari Ini:
        - Total Sapi: ${totalCows} ekor (${totalBunting} bunting, ${totalLaktasi} laktasi)
        - Produksi Susu: ${totalMilkToday.toFixed(1)} Liter (Tren: ${trendMilk.toFixed(1)}%)
        - Jumlah Sapi Butuh Perhatian/Sakit: ${totalPerhatian} ekor
        - Ringkasan Masalah: ${uniqueWarnings.map(w => w.type).join(", ")}

        Tugas: Berikan evaluasi operasional peternakan tingkat tinggi.
        
        Berikan jawaban STRICT dengan format ini (TANPA EMOJI, TANPA MARKDOWN BINTANG):
        STATUS: [Pilih: SANGAT BAIK / NORMAL / PERLU TINDAKAN / KRITIS]
        ANALISIS: [2-3 kalimat rangkuman kesehatan farm, evaluasi tren produksi, dan instruksi manajerial utama untuk hari ini]
      `;

      const result = await model.generateContent(prompt);
      setAiInsight(result.response.text());
    } catch (error) {
      console.error("Gagal memanggil Gemini API:", error);
      setAiInsight("STATUS: ERROR\nANALISIS: Maaf, sistem AI sedang offline. Silakan coba sinkronisasi ulang.");
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
  // 3. GENERATE DUMMY DATA DASHBOARD
  // =====================================================================
  const generateDummyData = async () => {
    if (!farmId || !userUid) return;
    setIsSubmitting(true);
    try {
      // 1. Sapi Dummy
      const dummyCows = [
        { id: "cow_dash1", tag: "1001", name: "Srikandi", breed: "Holstein", group: "Laktasi", repro: "Kosong", health: "Sehat" },
        { id: "cow_dash2", tag: "1002", name: "Melati", breed: "Jersey", group: "Laktasi", repro: "Bunting", health: "Mastitis" }, // Sengaja dibikin sakit
        { id: "cow_dash3", tag: "1003", name: "Mawar", breed: "Holstein", group: "Kering Kandang", repro: "Bunting Tua", health: "Sehat" },
        { id: "cow_dash4", tag: "1004", name: "Anggrek", breed: "Angus", group: "Laktasi", repro: "Kosong", health: "Sehat" },
        { id: "cow_dash5", tag: "1005", name: "Bulan", breed: "Holstein", group: "Laktasi", repro: "Bunting", health: "Sehat" },
      ];

      for (const cow of dummyCows) {
        await setDoc(doc(db, "cows", cow.id), {
          cowId: cow.id, farmId, tagNumber: cow.tag, name: cow.name, breed: cow.breed, gender: "Betina",
          birthDate: "2022-01-01", group: cow.group, location: "Kandang Utama", isActive: true,
          currentStatus: { lactationPhase: 2, reproduction: cow.repro, health: cow.health },
          liveMetrics: { temperature: cow.health === "Mastitis" ? 39.8 : 38.5, rumination: 400, steps: 1200, lastSync: new Date().toISOString() },
          createdAt: serverTimestamp()
        });

        // 2. Susu Dummy (Biar Chart Hidup)
        for (let i = 0; i < 7; i++) {
          let d = new Date(); d.setDate(d.getDate() - i);
          let dateStr = `${d.toISOString().split("T")[0]}T07:00:00Z`;
          
          let baseMilk = 20 + Math.random() * 5;
          if (cow.group === "Kering Kandang") baseMilk = 0;
          if (i === 0 && cow.health === "Mastitis") baseMilk -= 8; // Drop produksi hari ini

          if (baseMilk > 0) {
            await addDoc(collection(db, "milk_productions"), { 
              farmId, cowId: cow.id, date: dateStr, quantityLiter: Number(baseMilk.toFixed(1)), 
              milkingSession: "Pagi", recordedBy: userUid, createdAt: dateStr 
            });
          }
        }
      }

      Swal.fire("Berhasil!", "Data simulasi farm berhasil ditambahkan. Dashboard langsung hidup!", "success");
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Ringkasan operasional peternakan harian.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={generateDummyData} disabled={isSubmitting} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer">
            ✨ Generate Data Farm
          </button>

          {/* Search */}
          <div className="relative group hidden sm:block">
            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Cari sapi..." className="w-56 pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded bg-slate-100 text-[10px] font-bold text-slate-500 border border-slate-200">/</div>
          </div>

          {/* Notif Bell */}
          <button className="relative p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {totalPerhatian > 0 && <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
          </button>

          {/* Date Picker */}
          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm cursor-default">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-sm font-bold text-slate-700">{todayStrDisplay}</span>
          </button>
        </div>
      </div>

      {/* JIKA DATA MASIH LOADING */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-emerald-600 font-bold animate-pulse">
          Memuat Sistem Dashboard...
        </div>
      ) : (
      <>
        {/* 2. KPI CARDS (5 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M5 4h14v2H5V4zm1 4h12v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8zm3 2v6h2v-6H9zm4 0v6h2v-6h-2z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1 leading-tight">Produksi Susu Hari Ini</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{totalMilkToday.toLocaleString('id-ID')} <span className="text-sm font-semibold text-slate-400">L</span></p>
              <p className={`text-[10px] font-bold mt-1 ${trendMilk >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {trendMilk >= 0 ? "↑" : "↓"} {Math.abs(trendMilk).toFixed(1)}% <span className="text-slate-400 font-medium">dari kemarin</span>
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 10h3v4H3v-4zm4-4h14a1 1 0 011 1v9h-3v4h-2v-4h-5v4H9v-4H7V7a1 1 0 011-1zm3 3v2h2V9h-2z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1 leading-tight">Rata-rata Produksi</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{avgMilkToday.toFixed(1)} <span className="text-sm font-semibold text-slate-400">L/ekor</span></p>
              <p className={`text-[10px] font-bold mt-1 ${trendAvgMilk >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {trendAvgMilk >= 0 ? "↑" : "↓"} {Math.abs(trendAvgMilk).toFixed(1)}% <span className="text-slate-400 font-medium">dari kemarin</span>
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM11 7v4h2V7h-2zm0 6v2h2v-2h-2z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1 leading-tight">Sapi Perlu Perhatian</p>
              <p className={`text-2xl font-black tracking-tight ${totalPerhatian > 0 ? 'text-red-600' : 'text-slate-900'}`}>{totalPerhatian} <span className="text-sm font-semibold text-slate-400">ekor</span></p>
              <button className="text-[10px] font-bold text-slate-500 mt-1 hover:text-slate-700">Lihat peringatan →</button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1 leading-tight">Total Bunting</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{totalBunting} <span className="text-sm font-semibold text-slate-400">ekor</span></p>
              <p className="text-[10px] font-medium text-slate-400 mt-1">{pctBunting}% dari total populasi</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1 leading-tight">Total Populasi Sapi</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{totalCows} <span className="text-sm font-semibold text-slate-400">ekor</span></p>
              <p className="text-[10px] font-medium text-slate-400 mt-1">{cowsJantan} jantan / {cowsBetina} betina</p>
            </div>
          </div>

        </div>

        {/* 3. MIDDLE SECTION (Warnings, Chart, AI Advice) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-stretch">
          
          {/* Left: AI Warnings */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
              <span className={`${totalPerhatian > 0 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
              </span> 
              Sistem Peringatan Dini ({warnings.length})
            </h3>
            
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[220px] custom-scrollbar pr-2">
              {warnings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 opacity-60">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-xs font-bold">Semua kondisi aman terkendali</p>
                </div>
              ) : (
                uniqueWarnings.map((w, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${w.color === 'red' ? 'bg-red-50/50 border-red-100 hover:bg-red-50' : 'bg-amber-50/50 border-amber-100 hover:bg-amber-50'}`}>
                    <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden shrink-0 shadow-sm flex items-center justify-center text-lg">
                      {w.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-bold ${w.color === 'red' ? 'text-red-600' : 'text-amber-600'}`}>{w.type}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5 font-medium">#{w.tag} {w.cowName} • {w.desc}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {warnings.length > 4 && <button className="text-xs font-bold text-slate-500 hover:text-slate-800 mt-4 text-center">+{warnings.length - 4} peringatan lainnya</button>}
          </div>

          {/* Center: Chart Dinamis */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="text-blue-500">📊</span> Produksi Susu (7 Hari)
              </h3>
            </div>
            
            <div className="w-full h-48 relative mb-6">
               <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] font-medium text-slate-400">
                 <span>{yMaxChart}</span><span>{Math.round(yMaxChart*0.75)}</span><span>{Math.round(yMaxChart*0.5)}</span><span>{Math.round(yMaxChart*0.25)}</span><span>0</span>
               </div>
               
               <div className="absolute left-10 right-0 bottom-0 flex justify-between text-[10px] font-medium text-slate-400 pl-2 pr-2">
                 {xAxisLabels.map((lbl, idx) => <span key={idx}>{lbl}</span>)}
               </div>
               
               <div className="absolute left-12 right-0 top-2 bottom-8">
                 <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-100">
                   <div className="w-full border-t border-slate-100/60 h-0"></div><div className="w-full border-t border-slate-100/60 h-0"></div>
                   <div className="w-full border-t border-slate-100/60 h-0"></div><div className="w-full border-t border-slate-100/60 h-0"></div>
                   <div className="w-full h-0"></div>
                 </div>
                 
                 <svg viewBox="0 0 400 150" className="absolute inset-0 w-full h-full preserve-3d overflow-visible" preserveAspectRatio="none">
                   <polyline points={polylinePoints} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in slide-in-from-left-8 duration-1000" />
                   {chartData.map((d, i) => d.milk > 0 && (
                     <circle key={i} cx={xCoords[i]} cy={mapY(d.milk)} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" className="animate-in zoom-in duration-500 delay-500" />
                   ))}
                 </svg>
                 
                 {totalMilkToday > 0 && (
                   <div className="absolute right-0 top-[30%] -translate-y-full mr-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md animate-in zoom-in duration-500 delay-700">
                     {totalMilkToday.toLocaleString('id-ID')} L
                   </div>
                 )}
               </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-auto pt-4 border-t border-slate-100 text-center">
              <div>
                <p className="text-[10px] font-semibold text-slate-500 mb-1">Total 7 Hari</p>
                <p className="text-sm font-bold text-slate-900">{total7Days.toLocaleString('id-ID')} L</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 mb-1">Rata-rata / Hari</p>
                <p className="text-sm font-bold text-slate-900">{avg7Days.toFixed(1)} L</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 mb-1">Tertinggi</p>
                <p className="text-sm font-bold text-emerald-600">{max7Days.toFixed(1)} L</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 mb-1">Terendah</p>
                <p className="text-sm font-bold text-red-500">{min7Days > 0 ? min7Days.toFixed(1) : 0} L</p>
              </div>
            </div>
          </div>

          {/* Right: AI Insight Command Center */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-200/60 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className={`text-indigo-600 transition-transform ${isAiLoading ? 'animate-spin' : 'group-hover:scale-110 group-hover:rotate-12'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </span> 
                Chief AI Moo
              </h3>
              <button onClick={fetchGeminiInsight} disabled={isAiLoading} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer disabled:opacity-50">
                <svg className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>
            
            {(() => {
              const rawStatus = aiInsight.match(/STATUS:\s*(.*)/);
              const rawAnalysis = aiInsight.match(/ANALISIS:\s*([\s\S]*)/);
              
              const statusText = rawStatus ? rawStatus[1].trim().toUpperCase() : (isAiLoading ? "MEMPROSES..." : "MENUNGGU DATA");
              const analysisText = rawAnalysis ? rawAnalysis[1].trim() : aiInsight;

              let badgeColor = "bg-slate-100 text-slate-700 border-slate-200";
              let cardBgColor = "bg-slate-50/50 border-slate-100/50";
              let statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

              if (statusText.includes("SANGAT BAIK") || statusText.includes("NORMAL")) {
                badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
                cardBgColor = "bg-emerald-50/30 border-emerald-100/50";
                statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
              } else if (statusText.includes("TINDAKAN") || statusText.includes("PERINGATAN")) {
                badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
                cardBgColor = "bg-amber-50/30 border-amber-100/50";
                statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
              } else if (statusText.includes("KRITIS") || statusText.includes("ERROR")) {
                badgeColor = "bg-red-100 text-red-800 border-red-200";
                cardBgColor = "bg-red-50/30 border-red-100/50";
                statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>;
              }

              return (
                <div className={`p-4 rounded-xl border flex-1 relative z-10 transition-colors duration-300 ${cardBgColor}`}>
                  {isAiLoading ? (
                    <div className="flex flex-col gap-3 animate-pulse mt-1">
                      <div className="h-5 bg-slate-200/70 rounded-md w-24 mb-1"></div>
                      <div className="h-2.5 bg-slate-200/70 rounded w-full"></div>
                      <div className="h-2.5 bg-slate-200/70 rounded w-5/6"></div>
                      <div className="h-2.5 bg-slate-200/70 rounded w-full"></div>
                      <div className="h-2.5 bg-slate-200/70 rounded w-4/6"></div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wide shadow-sm ${badgeColor}`}>
                          {statusIcon}
                          {statusText}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-slate-700 leading-relaxed font-medium mt-1 whitespace-pre-wrap">
                        {analysisText}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* 4. BOTTOM SECTION (Donut, Bars, Tasks) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Reproduksi (Donut) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
             <h3 className="text-sm font-bold text-slate-900 mb-6">Status Reproduksi</h3>
             <div className="flex items-center gap-6 flex-1">
               {/* CSS Donut Chart Dinamis */}
               <div className="relative w-28 h-28 shrink-0 rounded-full flex items-center justify-center transition-all duration-1000 shadow-sm" 
                    style={{ background: gradientDonut }}>
                 <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                   <span className="text-2xl font-black text-slate-900 leading-none">{totalCows}</span>
                   <span className="text-[9px] font-semibold text-slate-500">Ekor Sapi</span>
                 </div>
               </div>
               
               {/* Legend */}
               <div className="space-y-3 flex-1">
                 <div className="flex items-center justify-between text-xs">
                   <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-sm"></span><span className="font-semibold text-slate-700">Bunting</span></div>
                   <span className="text-slate-500 font-medium">{totalBunting} ({pctDBunting.toFixed(1)}%)</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                   <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-sm"></span><span className="font-semibold text-slate-700">Kosong</span></div>
                   <span className="text-slate-500 font-medium">{totalKosong} ({pctDKosong.toFixed(1)}%)</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                   <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm"></span><span className="font-semibold text-slate-700">Laktasi</span></div>
                   <span className="text-slate-500 font-medium">{totalLaktasi} ({pctDLaktasi.toFixed(1)}%)</span>
                 </div>
               </div>
             </div>
          </div>

          {/* Center: Status Bars */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
             <h3 className="text-sm font-bold text-slate-900 mb-6">Distribusi Berdasarkan Kelompok</h3>
             <div className="space-y-5 flex-1">
               {/* Bar Laktasi */}
               <div className="flex items-center gap-4">
                 <span className="text-xs font-semibold text-slate-700 w-16">Laktasi</span>
                 <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: `${(totalLaktasi/totalCows)*100}%` }}></div>
                 </div>
                 <span className="text-xs font-bold text-slate-700 w-12 text-right">{totalLaktasi} ekor</span>
               </div>
               {/* Bar Kering */}
               <div className="flex items-center gap-4">
                 <span className="text-xs font-semibold text-slate-700 w-16">Kering</span>
                 <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-orange-400 rounded-full transition-all duration-1000" style={{ width: `${(totalKering/totalCows)*100}%` }}></div>
                 </div>
                 <span className="text-xs font-bold text-slate-700 w-12 text-right">{totalKering} ekor</span>
               </div>
               {/* Bar Bunting */}
               <div className="flex items-center gap-4">
                 <span className="text-xs font-semibold text-slate-700 w-16">Bunting</span>
                 <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${(totalBunting/totalCows)*100}%` }}></div>
                 </div>
                 <span className="text-xs font-bold text-slate-700 w-12 text-right">{totalBunting} ekor</span>
               </div>
               {/* Bar Kosong */}
               <div className="flex items-center gap-4">
                 <span className="text-xs font-semibold text-slate-700 w-16">Kosong</span>
                 <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-slate-400 rounded-full transition-all duration-1000" style={{ width: `${(totalKosong/totalCows)*100}%` }}></div>
                 </div>
                 <span className="text-xs font-bold text-slate-700 w-12 text-right">{totalKosong} ekor</span>
               </div>
             </div>
          </div>

          {/* Right: Tasks & Schedule */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Interactive Tasks */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1 flex flex-col hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Tugas Hari Ini</h3>
              <div className="space-y-3 flex-1">
                {tasks.map(task => (
                  <label key={task.id} className="flex items-center justify-between cursor-pointer group select-none" onClick={() => toggleTask(task.id)}>
                    <div className="flex items-center gap-3">
                      {task.isChecked ? (
                        <div className="w-4 h-4 rounded border-none bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm transition-all duration-200">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center shrink-0 group-hover:border-emerald-500 transition-all duration-200"></div>
                      )}
                      <span className={`text-xs font-medium transition-colors duration-200 ${task.isChecked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.label}</span>
                    </div>
                    <span className={`text-[10px] font-semibold transition-colors duration-200 ${task.isChecked ? 'text-slate-300 line-through' : 'text-slate-400'}`}>{task.time}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Schedule */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Jadwal Mendatang
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-sm font-black text-slate-900 leading-none">20</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Agt</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 mb-0.5">Kunjungan Dokter Hewan</p>
                  <p className="text-[10px] text-slate-500 font-medium">Pemeriksaan rutin & USG</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </>
      )}

    </div>
  );
}