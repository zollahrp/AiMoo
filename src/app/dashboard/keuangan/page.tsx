"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, deleteDoc, updateDoc, doc, query, where, onSnapshot, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import { GoogleGenerativeAI } from "@google/generative-ai";

const CHART_COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#fbbf24", "#f97316", "#94a3b8"];

// --- FUNGSI FORMAT ANGKA CERDAS ---
const formatShort = (val: number) => {
  if (val === 0) return "0";
  const isNeg = val < 0;
  const absVal = Math.abs(val);
  let res = "";
  if (absVal >= 1e12) res = (absVal / 1e12).toFixed(1).replace(/\.0$/, '') + "T";
  else if (absVal >= 1e9) res = (absVal / 1e9).toFixed(1).replace(/\.0$/, '') + "M";
  else if (absVal >= 1e6) res = (absVal / 1e6).toFixed(1).replace(/\.0$/, '') + "Jt";
  else res = absVal.toLocaleString("id-ID");
  return isNeg ? "-" + res : res;
};

export default function KeuanganPage() {
  const [farmId, setFarmId] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // State Pagination Tabel
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;

  // State Filter & Sort Tabel
  const [filterType, setFilterType] = useState("All"); 
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: "asc" | "desc" } | null>(null);
  
  // State Filter Grafik
  const [chartFilter, setChartFilter] = useState<number>(3); 
  
  // State Modal Transaksi & Kategori Dinamis
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null); 
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "Income",
    category: "Penjualan Susu",
    amount: "",
    description: ""
  });

  // State Modal Pengaturan & Target & Kategori Firebase
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [financialSettings, setFinancialSettings] = useState<any>({
    saldoAwal: 0,
    targetIncome: 100000000,
    targetProfit: 40000000,
    customIncome: [],
    customExpense: []
  });
  const [settingsForm, setSettingsForm] = useState({
    saldoAwal: 0,
    targetIncome: 0,
    targetProfit: 0
  });

  // 🔥 STATE UNTUK GEMINI AI 🔥
  const [aiInsight, setAiInsight] = useState<string>("STATUS: MEMPROSES...\nANALISIS: Mengumpulkan data arus kas, margin laba, dan efisiensi pengeluaran untuk dievaluasi oleh AI...");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const incomeCategories = ["Penjualan Susu", "Penjualan Pedet", "Penjualan Sapi Afkir", "Lainnya"];
  const expenseCategories = ["Pakan", "Tenaga Kerja", "Obat & Kesehatan", "Reproduksi", "Listrik & Air", "Pemeliharaan", "Lainnya"];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userFarmId = Object.keys(userDoc.data().farmRoles || {})[0];
          setFarmId(userFarmId);
        }
      } else {
        setIsLoadingData(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!farmId) return;
    
    const q = query(collection(db, "financial_transactions"), where("farmId", "==", farmId));
    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const docsData: any[] = [];
      snapshot.forEach((docSnap) => docsData.push({ id: docSnap.id, ...docSnap.data() }));
      docsData.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
      setTransactions(docsData);
      setIsLoadingData(false);
    });

    const settingsRef = doc(db, "farms", farmId, "settings", "financial");
    const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFinancialSettings({
          saldoAwal: data.saldoAwal || 0,
          targetIncome: data.targetIncome || 100000000,
          targetProfit: data.targetProfit || 40000000,
          customIncome: data.customIncome || [],
          customExpense: data.customExpense || []
        });
      }
    });

    return () => {
      unsubscribeSnapshot();
      unsubscribeSettings();
    };
  }, [farmId]);

  // =====================================================================
  // 🔥 OTAK DINAMIS (KALKULASI 100% REAL-TIME) 🔥
  // =====================================================================
  
  const incomes = transactions.filter((t) => t.type === "Income");
  const expenses = transactions.filter((t) => t.type === "Expense");

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  const monthlyDataMap: Record<string, {inc: number, exp: number}> = {};
  transactions.forEach(t => {
    const monthStr = t.transactionDate.substring(0, 7); 
    if (!monthlyDataMap[monthStr]) monthlyDataMap[monthStr] = { inc: 0, exp: 0 };
    if (t.type === "Income") monthlyDataMap[monthStr].inc += t.amount;
    if (t.type === "Expense") monthlyDataMap[monthStr].exp += t.amount;
  });

  const allMonths = Object.keys(monthlyDataMap).sort();
  const currentMonthKey = allMonths.length > 0 ? allMonths[allMonths.length - 1] : null;
  const prevMonthKey = allMonths.length > 1 ? allMonths[allMonths.length - 2] : null;

  const currInc = currentMonthKey ? monthlyDataMap[currentMonthKey].inc : 0;
  const prevInc = prevMonthKey ? monthlyDataMap[prevMonthKey].inc : 0;
  const incTrend = prevInc !== 0 ? ((currInc - prevInc) / prevInc) * 100 : (currInc > 0 ? 100 : 0);

  const currExp = currentMonthKey ? monthlyDataMap[currentMonthKey].exp : 0;
  const prevExp = prevMonthKey ? monthlyDataMap[prevMonthKey].exp : 0;
  const expTrend = prevExp !== 0 ? ((currExp - prevExp) / prevExp) * 100 : (currExp > 0 ? 100 : 0);

  const currNet = currInc - currExp;
  const prevNet = prevInc - prevExp;
  const netTrend = prevNet !== 0 ? ((currNet - prevNet) / Math.abs(prevNet)) * 100 : (currNet > 0 ? 100 : (currNet < 0 ? -100 : 0));

  const currMargin = currInc > 0 ? (currNet / currInc) * 100 : 0;
  const prevMargin = prevInc > 0 ? (prevNet / prevInc) * 100 : 0;
  const marginTrend = prevMargin !== 0 ? ((currMargin - prevMargin) / Math.abs(prevMargin)) * 100 : (currMargin > 0 ? 100 : 0);

  const renderTrend = (percent: number, isExpense: boolean = false) => {
    if (percent === 0 || !prevMonthKey) return <p className="text-[10px] font-bold mt-0.5 text-slate-400">- 0% <span className="font-medium">vs bln lalu</span></p>;
    const isPositive = isExpense ? percent < 0 : percent > 0;
    const color = isPositive ? "text-emerald-500" : "text-red-500";
    const arrow = percent > 0 ? "↑" : "↓";
    return (
      <p className={`text-[10px] font-bold mt-0.5 ${color} animate-in fade-in zoom-in duration-500`}>
        {arrow} {Math.abs(percent).toFixed(1)}% <span className="text-slate-400 font-medium">vs bln lalu</span>
      </p>
    );
  };

  const totalIncome = incomes.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalExpense = expenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const netProfit = totalIncome - totalExpense;
  const marginLaba = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : "0";

  const saldoAwal = Number(financialSettings.saldoAwal) || 0; 
  const saldoAkhir = saldoAwal + netProfit;

  const totalPakan = expenses.filter(e => e.category === "Pakan").reduce((s, e) => s + e.amount, 0);
  const totalGaji = expenses.filter(e => e.category === "Tenaga Kerja").reduce((s, e) => s + e.amount, 0);
  const totalListrik = expenses.filter(e => e.category === "Listrik & Air").reduce((s, e) => s + e.amount, 0);
  
  const grossProfit = totalIncome - totalPakan; 
  const ebitda = grossProfit - totalGaji - totalListrik; 
  const roi = totalExpense > 0 ? ((netProfit / totalExpense) * 100).toFixed(1) : "0";

  const targetIncome = Number(financialSettings.targetIncome) || 1; 
  const targetProfit = Number(financialSettings.targetProfit) || 1;  
  
  const progressIncome = Math.min((totalIncome / targetIncome) * 100, 100).toFixed(1);
  const percentIncome = ((totalIncome / targetIncome) * 100).toFixed(1);
  const progressProfit = Math.min((netProfit / targetProfit) * 100, 100).toFixed(1);
  const percentProfit = ((netProfit / targetProfit) * 100).toFixed(1);

  // --- OLAH DATA GRAFIK ---
  const sortedMonths = Object.keys(monthlyDataMap).sort().slice(-chartFilter); 
  let chartData = sortedMonths.map(monthStr => {
    const [yyyy, mm] = monthStr.split("-");
    const inc = monthlyDataMap[monthStr].inc;
    const exp = monthlyDataMap[monthStr].exp;
    return { label: `${monthNames[parseInt(mm)-1]} ${yyyy.substring(2)}`, inc, exp, net: inc - exp };
  });

  while (chartData.length < chartFilter) {
    chartData.unshift({ label: "-", inc: 0, exp: 0, net: 0 });
  }

  const maxChartVal = Math.max(...chartData.map(d => Math.max(d.inc, d.exp, d.net)), 100000);
  const minChartVal = Math.min(...chartData.map(d => Math.min(d.inc, d.exp, d.net)), 0);

  const chartRange = maxChartVal - minChartVal;
  const yMax = maxChartVal + (chartRange * 0.15);
  const yMin = minChartVal < 0 ? minChartVal - (chartRange * 0.15) : 0;
  const yRange = yMax - yMin || 1;

  const mapY = (val: number) => 130 - (((val - yMin) / yRange) * 110); 
  const yAxisLabels = [yMax, yMin + (yRange * 0.75), yMin + (yRange * 0.5), yMin + (yRange * 0.25), yMin];
  
  const numPoints = chartData.length;
  const xCoords = numPoints <= 1 ? [200] : Array.from({length: numPoints}, (_, i) => 40 + i * (320 / (numPoints - 1)));

  const pointsInc = chartData.map((d, i) => `${xCoords[i]},${mapY(d.inc)}`).join(" ");
  const pointsExp = chartData.map((d, i) => `${xCoords[i]},${mapY(d.exp)}`).join(" ");
  const pointsNet = chartData.map((d, i) => `${xCoords[i]},${mapY(d.net)}`).join(" ");

  // --- RINCIAN KATEGORI & DONUT ---
  const expenseBreakdownMap = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const sortedExpenses = Object.entries(expenseBreakdownMap).map(([category, amount]) => ({
      category, amount: amount as number, percentage: totalExpense > 0 ? ((amount as number) / totalExpense) * 100 : 0
  })).sort((a, b) => b.amount - a.amount);

  const incomeBreakdownMap = incomes.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const sortedIncomes = Object.entries(incomeBreakdownMap).map(([category, amount]) => ({
      category, amount: amount as number, percentage: totalIncome > 0 ? ((amount as number) / totalIncome) * 100 : 0
  })).sort((a, b) => b.amount - a.amount);

  let currentPercent = 0;
  const donutGradient = sortedExpenses.length > 0 
    ? sortedExpenses.map((item, idx) => {
        const start = currentPercent;
        currentPercent += item.percentage;
        return `${CHART_COLORS[idx % CHART_COLORS.length]} ${start}% ${currentPercent}%`;
      }).join(", ")
    : "#e2e8f0 0% 100%"; 

  const getIncomeIcon = (cat: string) => {
    if (cat === "Penjualan Susu") return { icon: "🥛", color: "text-slate-700", bg: "bg-slate-50" };
    if (cat === "Penjualan Pedet") return { icon: "🐄", color: "text-slate-700", bg: "bg-slate-50" };
    if (cat === "Penjualan Sapi Afkir") return { icon: "🛖", color: "text-slate-700", bg: "bg-slate-50" };
    return { icon: "＋", color: "text-emerald-500", bg: "bg-emerald-50" };
  };

  const getExpenseIcon = (cat: string) => {
    if (cat === "Pakan") return { icon: "🌾", color: "text-slate-700", bg: "bg-green-50" };
    if (cat === "Tenaga Kerja") return { icon: "👥", color: "text-slate-700", bg: "bg-blue-50" };
    if (cat === "Obat & Kesehatan") return { icon: "💊", color: "text-slate-700", bg: "bg-purple-50" };
    if (cat === "Reproduksi") return { icon: "⚥", color: "text-slate-700", bg: "bg-amber-50" };
    if (cat === "Listrik & Air") return { icon: "⚡", color: "text-slate-700", bg: "bg-yellow-50" };
    if (cat === "Pemeliharaan") return { icon: "🔧", color: "text-slate-700", bg: "bg-orange-50" };
    return { icon: "−", color: "text-red-500", bg: "bg-red-50" };
  };

  // =====================================================================
  // 🔥 FUNGSI GEMINI AI (ANALISIS KEUANGAN DENGAN FALLBACK)
  // =====================================================================
  const fetchGeminiInsight = async () => {
    if (isLoadingData) return;
    setIsAiLoading(true);
    setAiInsight("STATUS: MEMPROSES...\nANALISIS: Mengevaluasi margin profit, ROI, dan efisiensi pengeluaran bulan ini...");

    // 🔥 FIX: Fallback kalau API Key kosong (Mode Demo AI)
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      setTimeout(() => {
        let status = "SEHAT";
        let text = `(Mode Demo AI) Arus kas peternakan sangat baik dengan Net Profit Margin ${marginLaba}%. Pengeluaran terbesar pada ${sortedExpenses[0]?.category || "operasional"} (${sortedExpenses[0]?.percentage.toFixed(1) || 0}%). Lanjutkan performa ini!`;
        
        if (netProfit < 0) {
          status = "DEFISIT";
          text = `(Mode Demo AI) PERINGATAN: Peternakan mengalami kerugian Rp ${formatShort(Math.abs(netProfit))}. Evaluasi segera biaya ${sortedExpenses[0]?.category || "operasional"} yang memakan mayoritas anggaran.`;
        } else if (Number(marginLaba) < 15) {
          status = "EVALUASI MARGIN";
          text = `(Mode Demo AI) Laba bersih positif, namun Margin Laba hanya ${marginLaba}% (Di bawah standar ideal 25%). Kurangi pemborosan pada sektor ${sortedExpenses[1]?.category || "lainnya"}.`;
        }

        setAiInsight(`STATUS: ${status}\nANALISIS: ${text}`);
        setIsAiLoading(false);
      }, 2000);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

      const prompt = `
        Kamu adalah AI Ahli Keuangan Peternakan Sapi Perah (AI Moo).
        Data Keuangan Keseluruhan Farm:
        - Total Pendapatan: Rp ${totalIncome.toLocaleString('id-ID')}
        - Total Pengeluaran: Rp ${totalExpense.toLocaleString('id-ID')}
        - Laba Bersih (Net Profit): Rp ${netProfit.toLocaleString('id-ID')}
        - Net Profit Margin: ${marginLaba}%
        - ROI (Return on Investment): ${roi}%
        
        Rincian Pengeluaran Terbesar:
        ${sortedExpenses.slice(0,3).map(e => `- ${e.category}: ${e.percentage.toFixed(1)}% (Rp ${e.amount.toLocaleString('id-ID')})`).join("\n")}

        Tugas: Analisis kesehatan arus kas dan efisiensi biaya peternakan ini.
        *Catatan industri: Profit margin sehat sapi perah adalah >25%. Pakan normalnya 60-70% biaya.
        
        Berikan jawaban STRICT dengan format ini (TANPA EMOJI, TANPA MARKDOWN):
        STATUS: [Pilih: SEHAT / EVALUASI MARGIN / DEFISIT]
        ANALISIS: [2-3 kalimat rangkuman kesehatan finansial, evaluasi biaya operasional yang membengkak, dan saran efisiensi]
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
    if (!isLoadingData && transactions.length > 0) {
      fetchGeminiInsight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingData]);

  // =====================================================================
  // 🔥 FUNGSI HANDLER CRUD & KATEGORI DINAMIS 🔥
  // =====================================================================
  
  const handleOpenAddModal = () => {
    setEditId(null); 
    setFormData({ date: new Date().toISOString().split("T")[0], type: "Income", category: "Penjualan Susu", amount: "", description: "" });
    setIsCategoryDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (trx: any) => {
    setEditId(trx.id); 
    setFormData({ date: trx.transactionDate, type: trx.type, category: trx.category, amount: String(trx.amount), description: trx.description });
    setIsCategoryDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleSetToday = () => {
    setFormData((prev) => ({ ...prev, date: new Date().toISOString().split("T")[0] }));
  };

  const handleTypeChange = (e: any) => {
    const newType = e.target.value;
    const firstCat = newType === "Income" ? incomeCategories[0] : expenseCategories[0];
    setFormData((prev) => ({ ...prev, type: newType, category: firstCat }));
    setIsCategoryDropdownOpen(false);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "amount") {
      setFormData((prev) => ({ ...prev, amount: value.replace(/\D/g, '') }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCustomCategory = async () => {
    if (!newCategoryName.trim() || !farmId) return;
    const key = formData.type === "Income" ? "customIncome" : "customExpense";
    const currentList = financialSettings[key] || [];
    
    if ([...(formData.type === "Income" ? incomeCategories : expenseCategories), ...currentList].includes(newCategoryName)) {
      Swal.fire("Oops", "Kategori sudah ada!", "warning");
      return;
    }

    const updatedList = [...currentList, newCategoryName];
    try {
      await setDoc(doc(db, "farms", farmId, "settings", "financial"), { [key]: updatedList }, { merge: true });
      setFinancialSettings((prev: any) => ({...prev, [key]: updatedList}));
      setFormData(prev => ({...prev, category: newCategoryName}));
      setNewCategoryName("");
      setIsAddingCategory(false);
      setIsCategoryDropdownOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleDeleteCustomCategory = async (catToDelete: string) => {
    if (!farmId) return;
    const key = formData.type === "Income" ? "customIncome" : "customExpense";
    const currentList = financialSettings[key] || [];
    const updatedList = currentList.filter((c: string) => c !== catToDelete);
    
    try {
      await setDoc(doc(db, "farms", farmId, "settings", "financial"), { [key]: updatedList }, { merge: true });
      setFinancialSettings((prev: any) => ({...prev, [key]: updatedList}));
      if (formData.category === catToDelete) {
         setFormData(prev => ({...prev, category: formData.type === "Income" ? incomeCategories[0] : expenseCategories[0]}));
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId || !userUid) return;
    setIsSubmitting(true);
    
    try {
      const finalAmount = Number(formData.amount.replace(/\D/g, ''));
      if (editId) {
        await updateDoc(doc(db, "financial_transactions", editId), { transactionDate: formData.date, type: formData.type, category: formData.category, amount: finalAmount, description: formData.description });
        Swal.fire({ icon: "success", title: "Diperbarui!", text: "Transaksi berhasil diubah.", timer: 1000, showConfirmButton: false });
      } else {
        await addDoc(collection(db, "financial_transactions"), { farmId, transactionDate: formData.date, type: formData.type, category: formData.category, amount: finalAmount, description: formData.description, recordedBy: userUid, createdAt: serverTimestamp() });
        Swal.fire({ icon: "success", title: "Berhasil!", text: "Transaksi dicatat.", timer: 1000, showConfirmButton: false });
      }
      setIsModalOpen(false);
      setEditId(null);
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    } finally { setIsSubmitting(false); }
  };

  const handleDeleteTransaction = async (id: string) => {
    const result = await Swal.fire({ title: "Hapus Transaksi?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Ya, Hapus!" });
    if (result.isConfirmed) { await deleteDoc(doc(db, "financial_transactions", id)); }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId) return;
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, "farms", farmId, "settings", "financial"), { saldoAwal: Number(settingsForm.saldoAwal), targetIncome: Number(settingsForm.targetIncome), targetProfit: Number(settingsForm.targetProfit), updatedAt: serverTimestamp() }, { merge: true }); 
      setIsSettingsModalOpen(false);
      Swal.fire("Tersimpan!", "Pengaturan keuangan berhasil diperbarui.", "success");
    } catch (err: any) { Swal.fire("Error", err.message, "error"); } finally { setIsSubmitting(false); }
  };

  const handleGenerateSmartTarget = () => {
    const baseIncome = totalIncome > 0 ? totalIncome : 50000000;
    const recommendedIncome = baseIncome * 1.15; 
    const recommendedProfit = recommendedIncome * 0.40;
    setSettingsForm({ ...settingsForm, targetIncome: Math.round(recommendedIncome), targetProfit: Math.round(recommendedProfit) });
    Swal.fire({ icon: 'info', title: 'Sistem AI Aktif 🤖', text: 'Target disesuaikan ke pola sehat: Pertumbuhan 15% & Margin 40%.', confirmButtonColor: '#059669' });
  };

  const injectDummyData = async () => {
    if (!farmId || !userUid) return;
    setIsSubmitting(true);
    const dummys = [
      { date: "2026-02-15", type: "Income", category: "Penjualan Susu", amount: 80000000, desc: "Susu Feb" },
      { date: "2026-03-15", type: "Income", category: "Penjualan Susu", amount: 98250000, desc: "Susu Mar" },
      { date: "2026-03-20", type: "Expense", category: "Pakan", amount: 56120000, desc: "Pakan Mar" },
      { date: "2026-04-10", type: "Income", category: "Penjualan Susu", amount: 114350000, desc: "Susu Apr" },
      { date: "2026-04-12", type: "Expense", category: "Pakan", amount: 62050000, desc: "Pakan Apr" },
      { date: "2026-05-01", type: "Income", category: "Penjualan Susu", amount: 97650000, desc: "Susu Mei" },
      { date: "2026-05-05", type: "Expense", category: "Pakan", amount: 31050000, desc: "Konsentrat Mei" },
      { date: "2026-05-10", type: "Income", category: "Penjualan Pedet", amount: 18500000, desc: "Jual 2 pedet jantan" },
      { date: "2026-05-12", type: "Expense", category: "Tenaga Kerja", amount: 12500000, desc: "Gaji ABK" },
      { date: "2026-05-15", type: "Expense", category: "Listrik & Air", amount: 3560000, desc: "Bayar PLN" },
    ];
    try {
      for (const item of dummys) {
        await addDoc(collection(db, "financial_transactions"), { farmId, transactionDate: item.date, type: item.type, category: item.category, amount: item.amount, description: item.desc, recordedBy: userUid, createdAt: serverTimestamp() });
      }
      Swal.fire("Sukses", "Data Dummy Berhasil Dimasukkan!", "success");
    } catch (e) { console.error(e); } finally { setIsSubmitting(false); }
  };

  // =====================================================================
  // 🔥 FUNGSI SORT & FILTER TABEL 🔥
  // =====================================================================

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") { direction = "desc"; }
    setSortConfig({ key, direction });
    setCurrentPage(1); 
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  let processedTransactions = [...transactions];
  if (filterType !== "All") { processedTransactions = processedTransactions.filter(trx => trx.type === filterType); }

  if (sortConfig !== null) {
    processedTransactions.sort((a, b) => {
      if (sortConfig.key === "date") {
        const dateA = new Date(a.transactionDate).getTime();
        const dateB = new Date(b.transactionDate).getTime();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortConfig.key === "amount") {
        const amountA = Number(a.amount);
        const amountB = Number(b.amount);
        return sortConfig.direction === "asc" ? amountA - amountB : amountB - amountA;
      }
      return 0;
    });
  }

  const totalPages = Math.ceil(processedTransactions.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentTransactions = processedTransactions.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="max-w-[1600px] mx-auto pb-10 relative animate-in fade-in duration-500">
      
      {/* MODAL PENGATURAN KEUANGAN */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800">Pengaturan Keuangan</h3>
              <button onClick={() => setIsSettingsModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveSettings} className="p-6 space-y-4">
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3 items-start">
                <span className="text-xl">🤖</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">Bingung menentukan target?</p>
                  <p className="text-[10px] text-slate-600 mb-2">Biar sistem yang hitung otomatis berdasarkan transaksi Anda sebelumnya.</p>
                  <button type="button" onClick={handleGenerateSmartTarget} className="text-[10px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm">Hitung Target Sehat</button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Saldo Awal (Modal Tunai)</label>
                <input type="text" required value={settingsForm.saldoAwal === 0 ? "" : settingsForm.saldoAwal.toLocaleString("id-ID")} onChange={(e) => setSettingsForm({...settingsForm, saldoAwal: Number(e.target.value.replace(/\D/g, ''))})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-text" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Target Pendapatan Bulanan</label>
                <input type="text" required value={settingsForm.targetIncome === 0 ? "" : settingsForm.targetIncome.toLocaleString("id-ID")} onChange={(e) => setSettingsForm({...settingsForm, targetIncome: Number(e.target.value.replace(/\D/g, ''))})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-text" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Target Laba Bersih Bulanan</label>
                <input type="text" required value={settingsForm.targetProfit === 0 ? "" : settingsForm.targetProfit.toLocaleString("id-ID")} onChange={(e) => setSettingsForm({...settingsForm, targetProfit: Number(e.target.value.replace(/\D/g, ''))})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-text" />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsSettingsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-bold rounded-xl transition-colors shadow-md cursor-pointer">
                  {isSubmitting ? "Menyimpan..." : "Simpan Pengaturan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FORM TRANSAKSI (CREATE & EDIT) + KATEGORI DINAMIS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-visible animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <h3 className="font-black text-slate-800">
                {editId ? "Edit Transaksi" : "Catat Transaksi Baru"}
              </h3>
              <button onClick={() => { setIsModalOpen(false); setEditId(null); setIsCategoryDropdownOpen(false); }} className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveTransaction} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-bold text-slate-600">Tanggal</label>
                    <button type="button" onClick={handleSetToday} className="text-[9px] font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-0.5 rounded transition-colors cursor-pointer">
                      Hari Ini
                    </button>
                  </div>
                  <input type="date" name="date" required value={formData.date} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Jenis Transaksi</label>
                  <select name="type" value={formData.type} onChange={handleTypeChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                    <option value="Income">Pemasukan (Income)</option>
                    <option value="Expense">Pengeluaran (Expense)</option>
                  </select>
                </div>
              </div>
              
              {/* 🔥 CUSTOM DROPDOWN KATEGORI */}
              <div className="relative">
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Kategori</label>
                <div 
                  onClick={() => { setIsCategoryDropdownOpen(!isCategoryDropdownOpen); setIsAddingCategory(false); }} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer flex justify-between items-center transition-colors hover:bg-slate-100"
                >
                  <span className="text-slate-700">{formData.category}</span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>

                {isCategoryDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsCategoryDropdownOpen(false)}></div>
                    <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {isAddingCategory ? (
                        <div className="p-3 bg-emerald-50/30">
                          <input 
                            type="text" 
                            autoFocus
                            value={newCategoryName} 
                            onChange={(e) => setNewCategoryName(e.target.value)} 
                            placeholder="Ketik kategori baru..." 
                            className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none mb-2 cursor-text" 
                          />
                          <div className="flex gap-2">
                            <button type="button" onClick={handleAddCustomCategory} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer">Simpan Kategori</button>
                            <button type="button" onClick={() => setIsAddingCategory(false)} className="px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer">Batal</button>
                          </div>
                        </div>
                      ) : (
                        <ul className="max-h-48 overflow-y-auto py-1">
                          {(formData.type === "Income" ? [...incomeCategories, ...(financialSettings.customIncome || [])] : [...expenseCategories, ...(financialSettings.customExpense || [])]).map(cat => {
                            const isCustom = formData.type === "Income" ? (financialSettings.customIncome || []).includes(cat) : (financialSettings.customExpense || []).includes(cat);
                            return (
                              <li key={cat} className="flex justify-between items-center px-4 py-2 hover:bg-slate-50 transition-colors group">
                                <span 
                                  onClick={() => { setFormData({...formData, category: cat}); setIsCategoryDropdownOpen(false); }} 
                                  className="text-sm font-semibold text-slate-700 cursor-pointer flex-1 py-1"
                                >
                                  {cat}
                                </span>
                                {isCustom && (
                                  <button type="button" onClick={() => handleDeleteCustomCategory(cat)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100 cursor-pointer" title="Hapus Kategori Permanen">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  </button>
                                )}
                              </li>
                            )
                          })}
                          <li className="border-t border-slate-100 mt-1">
                            <button type="button" onClick={() => setIsAddingCategory(true)} className="w-full text-left px-4 py-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                              Tambah Kategori Baru
                            </button>
                          </li>
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Jumlah (Rp)</label>
                <input type="text" name="amount" required value={formData.amount ? Number(formData.amount).toLocaleString("id-ID") : ""} onChange={handleInputChange} placeholder="Contoh: 1.500.000" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-text" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Keterangan / Deskripsi</label>
                <textarea name="description" required rows={2} value={formData.description} onChange={handleInputChange} placeholder="Tulis rincian transaksi..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none cursor-text"></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditId(null); setIsCategoryDropdownOpen(false); }} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-bold rounded-xl transition-colors shadow-md cursor-pointer">
                  {isSubmitting ? "Menyimpan..." : (editId ? "Simpan Perubahan" : "Simpan Transaksi")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER UTAMA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="animate-in slide-in-from-left-4 duration-500">
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Keuangan</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola arus kas, pendapatan, biaya, dan profitabilitas peternakan Anda.</p>
        </div>
        
        <div className="flex items-center gap-3 animate-in slide-in-from-right-4 duration-500">
          <button onClick={injectDummyData} disabled={isSubmitting} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs shadow-sm transition-transform hover:-translate-y-0.5 cursor-pointer">
            ✨ Generate Data Dummy
          </button>
          
          <button onClick={() => { setSettingsForm(financialSettings); setIsSettingsModalOpen(true); }} className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-transform hover:-translate-y-0.5 shadow-sm font-bold text-sm cursor-pointer">
            ⚙️ Pengaturan Saldo
          </button>
          
          <button onClick={handleOpenAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-transform hover:-translate-y-0.5 shadow-md shadow-emerald-500/20 cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            Catat Transaksi
          </button>
        </div>
      </div>

      {/* KPI CARDS DINAMIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Total Pendapatan</p>
            <p className="text-xl font-black text-slate-900 tracking-tight">Rp {formatShort(totalIncome)}</p>
            {renderTrend(incTrend, false)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-75">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Total Biaya</p>
            <p className="text-xl font-black text-slate-900 tracking-tight">Rp {formatShort(totalExpense)}</p>
            {renderTrend(expTrend, true)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-100">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Laba Bersih</p>
            <p className={`text-xl font-black tracking-tight ${netProfit >= 0 ? "text-slate-900" : "text-red-600"}`}>
              Rp {formatShort(netProfit)}
            </p>
            {renderTrend(netTrend, false)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-150">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Margin Laba</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{marginLaba}%</p>
            {renderTrend(marginTrend, false)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-200">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 mb-0.5">Status Arus Kas</p>
            <span className={`px-2 py-0.5 font-bold text-[10px] rounded ${netProfit >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {netProfit >= 0 ? "Sehat" : "Defisit"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-stretch animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* GRAFIK DINAMIS */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Tren Pendapatan, Biaya & Laba Bersih
            </h3>
            <select 
              value={chartFilter} 
              onChange={(e) => setChartFilter(Number(e.target.value))}
              className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg outline-none cursor-pointer hover:bg-slate-200 transition-colors"
            >
              <option value={3}>3 Bulan Terakhir</option>
              <option value={6}>6 Bulan Terakhir</option>
              <option value={12}>12 Bulan Terakhir</option>
            </select>
          </div>

          <div className="flex items-center gap-6 mb-6 text-[11px] font-bold text-slate-600">
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-emerald-500 relative"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute -top-0.5 left-0.5"></div></div> Pendapatan</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-red-500 relative"><div className="w-1.5 h-1.5 rounded-full bg-red-500 absolute -top-0.5 left-0.5"></div></div> Biaya</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-blue-500 relative"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 absolute -top-0.5 left-0.5"></div></div> Laba Bersih</div>
          </div>
          
          <div className="flex-1 relative min-h-[220px]">
             <div className="absolute left-0 top-0 bottom-6 w-16 flex flex-col justify-between text-[9px] font-medium text-slate-400">
               <span>(Rp)</span>
               {yAxisLabels.map((val, idx) => (
                 <span key={`y-label-${idx}`}>{formatShort(val)}</span>
               ))}
             </div>
             <div className="absolute left-20 right-0 bottom-0 flex justify-between text-[10px] font-medium text-slate-400 px-8">
               {chartData.map((d, idx) => <span key={`x-label-${idx}`}>{d.label}</span>)}
             </div>
             <div className="absolute left-20 right-4 top-4 bottom-8">
               <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-100">
                 <div className="w-full border-t border-slate-100/60 h-0"></div><div className="w-full border-t border-slate-100/60 h-0"></div>
                 <div className="w-full border-t border-slate-100/60 h-0"></div><div className="w-full border-t border-slate-100/60 h-0"></div>
                 <div className="w-full h-0"></div>
               </div>
               
               <svg viewBox="0 0 400 150" className="absolute inset-0 w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
                 <polyline points={pointsInc} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in duration-1000 slide-in-from-left-8" />
                 <polyline points={pointsExp} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in duration-1000 delay-150 slide-in-from-left-8" />
                 <polyline points={pointsNet} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in duration-1000 delay-300 slide-in-from-left-8" />
                 
                 {chartData.map((d, i) => d.inc !== 0 && (
                   <g key={`inc-${i}`} className="animate-in zoom-in duration-500 delay-500">
                     <circle cx={xCoords[i]} cy={mapY(d.inc)} r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                     {chartFilter <= 6 && <text x={xCoords[i]} y={mapY(d.inc) - 10} fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">{formatShort(d.inc)}</text>}
                   </g>
                 ))}
                 {chartData.map((d, i) => d.exp !== 0 && (
                   <g key={`exp-${i}`} className="animate-in zoom-in duration-500 delay-500">
                     <circle cx={xCoords[i]} cy={mapY(d.exp)} r="4" fill="#ef4444" stroke="white" strokeWidth="2" />
                     {chartFilter <= 6 && <text x={xCoords[i]} y={mapY(d.exp) + 15} fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">{formatShort(d.exp)}</text>}
                   </g>
                 ))}
                 {chartData.map((d, i) => d.net !== 0 && (
                   <g key={`net-${i}`} className="animate-in zoom-in duration-500 delay-500">
                     <circle cx={xCoords[i]} cy={mapY(d.net)} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                     {chartFilter <= 6 && <text x={xCoords[i]} y={mapY(d.net) + 15} fill="#3b82f6" fontSize="10" fontWeight="bold" textAnchor="middle">{formatShort(d.net)}</text>}
                   </g>
                 ))}
               </svg>
             </div>
          </div>
        </div>

        {/* Rincian Arus Kas Dinamis */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow duration-300">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Rincian Arus Kas</h3>
          
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Saldo Awal</span>
              <span className="font-bold text-slate-900">Rp {saldoAwal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Total Penerimaan</span>
              <span className="font-bold text-emerald-500">Rp {totalIncome.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Total Pengeluaran</span>
              <span className="font-bold text-red-500">Rp {totalExpense.toLocaleString("id-ID")}</span>
            </div>
            
            <div className="border-t border-slate-200 my-2 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-black text-slate-900">Saldo Akhir</span>
                <span className="font-black text-slate-900">Rp {saldoAkhir.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-emerald-50/70 border border-emerald-100 rounded-xl p-4 flex gap-3 items-center hover:scale-[1.02] transition-transform cursor-pointer">
            <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center shrink-0 ${netProfit >= 0 ? "bg-emerald-500" : "bg-red-500"}`}>
              {netProfit >= 0 ? (
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              ) : (
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{netProfit >= 0 ? "Positif" : "Negatif"}</p>
              <p className="text-[10px] text-slate-600 font-medium">{netProfit >= 0 ? "Arus kas sehat." : "Pengeluaran > pendapatan."}</p>
            </div>
          </div>
        </div>

        {/* Ringkasan Donut Chart Dinamis */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow duration-300">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Ringkasan Biaya</h3>
          
          <div className="flex flex-col items-center flex-1">
            <div className="relative w-40 h-40 shrink-0 rounded-full flex items-center justify-center mb-6 shadow-sm hover:scale-105 transition-transform duration-500 cursor-pointer animate-in zoom-in-75 duration-700 delay-200" 
                 style={{ background: `conic-gradient(${donutGradient})` }}>
               <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-inner text-center">
                 <span className="text-[10px] font-bold text-slate-500">Total Biaya</span>
                 <span className="text-[11px] font-black text-slate-900 leading-tight">Rp {formatShort(totalExpense)}</span>
               </div>
            </div>
            
            <div className="w-full grid grid-cols-2 gap-x-2 gap-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              {sortedExpenses.length === 0 ? (
                <p className="text-xs text-slate-400 col-span-2 text-center mt-4">Belum ada pengeluaran.</p>
              ) : (
                sortedExpenses.map((item, idx) => (
                  <div key={item.category} className="flex justify-between items-center text-[10px] hover:bg-slate-50 p-1 -mx-1 rounded cursor-pointer transition-colors">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}></span>
                      <span className="font-semibold text-slate-700 truncate w-20" title={item.category}>{item.category}</span>
                    </div>
                    <span className="text-slate-500 font-medium">{item.percentage.toFixed(1)}%</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        
        {/* Rincian Pendapatan */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Rincian Pendapatan</h3>
          <div className="flex-1">
            <table className="w-full text-left text-[11px] whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Sumber</th>
                  <th className="pb-3 font-semibold text-right">Jumlah</th>
                  <th className="pb-3 font-semibold text-right">%</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {sortedIncomes.map((item) => {
                  const style = getIncomeIcon(item.category);
                  return (
                    <tr key={item.category} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                      <td className="py-3 flex items-center gap-2 font-semibold">
                        <span className={`w-6 h-6 rounded ${style.bg} flex items-center justify-center text-sm ${style.color} group-hover:scale-110 transition-transform`}>{style.icon}</span> 
                        <span className="truncate w-24" title={item.category}>{item.category}</span>
                      </td>
                      <td className="py-3 text-right font-medium">Rp {formatShort(item.amount)}</td>
                      <td className="py-3 text-right font-bold text-slate-900">{item.percentage.toFixed(1)}%</td>
                    </tr>
                  )
                })}
                {sortedIncomes.length === 0 && (
                  <tr><td colSpan={3} className="py-4 text-center text-slate-400">Belum ada data.</td></tr>
                )}
                <tr>
                  <td className="py-4 font-black text-slate-900">Total</td>
                  <td className="py-4 text-right font-black text-slate-900">Rp {formatShort(totalIncome)}</td>
                  <td className="py-4 text-right font-black text-slate-900">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Rincian Biaya */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Rincian Biaya</h3>
          <div className="flex-1">
            <table className="w-full text-left text-[11px] whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Kategori</th>
                  <th className="pb-3 font-semibold text-right">Jumlah</th>
                  <th className="pb-3 font-semibold text-right">%</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {sortedExpenses.map((item) => {
                  const style = getExpenseIcon(item.category);
                  return (
                    <tr key={item.category} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                      <td className="py-2.5 flex items-center gap-2 font-semibold">
                        <span className={`w-5 h-5 rounded ${style.bg} flex items-center justify-center text-[10px] ${style.color} group-hover:scale-110 transition-transform`}>{style.icon}</span> 
                        <span className="truncate w-24" title={item.category}>{item.category}</span>
                      </td>
                      <td className="py-2.5 text-right font-medium">Rp {formatShort(item.amount)}</td>
                      <td className="py-2.5 text-right font-bold text-slate-900">{item.percentage.toFixed(1)}%</td>
                    </tr>
                  )
                })}
                {sortedExpenses.length === 0 && (
                  <tr><td colSpan={3} className="py-4 text-center text-slate-400">Belum ada data.</td></tr>
                )}
                <tr>
                  <td className="py-3 font-black text-slate-900">Total</td>
                  <td className="py-3 text-right font-black text-slate-900">Rp {formatShort(totalExpense)}</td>
                  <td className="py-3 text-right font-black text-slate-900">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Profitabilitas & Target Dinamis */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Profitabilitas</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-[11px] hover:bg-slate-50 p-1.5 -mx-1.5 rounded cursor-pointer transition-colors">
              <span className="font-semibold text-slate-600">Gross Profit</span>
              <span className="font-bold text-slate-900">Rp {grossProfit.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] hover:bg-slate-50 p-1.5 -mx-1.5 rounded cursor-pointer transition-colors">
              <span className="font-semibold text-slate-600">EBITDA</span>
              <span className="font-bold text-slate-900">Rp {ebitda.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] hover:bg-slate-50 p-1.5 -mx-1.5 rounded cursor-pointer transition-colors">
              <span className="font-semibold text-slate-600">Net Profit Margin</span>
              <span className="font-bold text-slate-900">{marginLaba}%</span>
            </div>
            <div className="flex justify-between items-center text-[11px] hover:bg-slate-50 p-1.5 -mx-1.5 rounded cursor-pointer transition-colors">
              <span className="font-semibold text-slate-600">ROI (Return on Inv.)</span>
              <span className="font-bold text-slate-900">{roi}%</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Target Bulanan
          </h3>

          <div className="space-y-5 flex-1">
            <div className="group cursor-pointer">
              <div className="flex justify-between items-end mb-1.5 text-[10px]">
                <div>
                  <p className="font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Target Pendapatan</p>
                  <p className="font-medium text-slate-400">Rp {formatShort(targetIncome)}</p>
                </div>
                <p className="font-bold text-emerald-600 group-hover:scale-110 transition-transform origin-right">{percentIncome}%</p>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 group-hover:bg-emerald-400" style={{ width: `${progressIncome}%` }}></div>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="flex justify-between items-end mb-1.5 text-[10px]">
                <div>
                  <p className="font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Target Laba Bersih</p>
                  <p className="font-medium text-slate-400">Rp {formatShort(targetProfit)}</p>
                </div>
                <p className="font-bold text-emerald-600 group-hover:scale-110 transition-transform origin-right">{percentProfit}%</p>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 group-hover:bg-emerald-400" style={{ width: `${progressProfit}%` }}></div>
              </div>
            </div>
          </div>
          <button onClick={() => { setSettingsForm(financialSettings); setIsSettingsModalOpen(true); }} className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 mt-6 text-left cursor-pointer hover:underline">Atur Pengaturan & Target →</button>
        </div>

        {/* 🔥 AI Insight Keuangan 🔥 */}
        <div className="lg:col-span-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm p-6 flex flex-col relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-300/40 transition-colors duration-500"></div>
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className={`text-emerald-500 transition-transform ${isAiLoading ? 'animate-spin' : 'group-hover:scale-110 group-hover:rotate-12'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span> 
              Diagnosis AI Moo
            </h3>
            
            <button 
              onClick={fetchGeminiInsight}
              disabled={isAiLoading}
              className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-emerald-200 disabled:opacity-50"
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

            let badgeColor = "bg-slate-100 text-slate-700 border-slate-200";
            let statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

            if (statusText.includes("SEHAT")) {
              badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
              statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
            } else if (statusText.includes("EVALUASI")) {
              badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
              statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
            } else if (statusText.includes("DEFISIT") || statusText.includes("ERROR")) {
              badgeColor = "bg-red-100 text-red-800 border-red-200";
              statusIcon = <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>;
            }

            return (
              <div className="flex-1 relative z-10 flex flex-col h-full bg-white/60 p-4 rounded-xl border border-emerald-100/50">
                {isAiLoading ? (
                  <div className="flex flex-col gap-3 animate-pulse">
                    <div className="h-5 bg-slate-200/70 rounded-md w-28 mb-1"></div>
                    <div className="h-2.5 bg-slate-200/70 rounded w-full"></div>
                    <div className="h-2.5 bg-slate-200/70 rounded w-5/6"></div>
                    <div className="h-2.5 bg-slate-200/70 rounded w-4/6"></div>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-wide ${badgeColor}`}>
                        {statusIcon}
                        {statusText}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-700 leading-relaxed font-medium mt-1 whitespace-pre-wrap">
                      {analysisText}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

      </div>

      {/* --- TABEL RIWAYAT TRANSAKSI --- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50/30 gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Riwayat Transaksi</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Daftar arus kas yang terhubung ke Firebase.</p>
          </div>
          {/* 🔥 FILTER TIPE TRANSAKSI */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600">Filter:</label>
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg outline-none cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
            >
              <option value="All">Semua Transaksi</option>
              <option value="Income">Hanya Pemasukan</option>
              <option value="Expense">Hanya Pengeluaran</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80">
              <tr className="text-slate-500 border-b border-slate-200">
                <th onClick={() => requestSort("date")} className="py-4 px-6 font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-200 hover:text-slate-800 transition-colors select-none group">
                  <div className="flex items-center gap-1">Tanggal <span className="text-[10px] text-slate-400 group-hover:text-slate-600">{getSortIcon("date")}</span></div>
                </th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider">Tipe</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider">Kategori</th>
                <th onClick={() => requestSort("amount")} className="py-4 px-6 font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-200 hover:text-slate-800 transition-colors select-none group text-right">
                  <div className="flex items-center justify-end gap-1">Jumlah (Rp) <span className="text-[10px] text-slate-400 group-hover:text-slate-600">{getSortIcon("amount")}</span></div>
                </th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {isLoadingData ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400 font-medium animate-pulse">Memuat data dari server...</td></tr>
              ) : currentTransactions.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400 font-medium">Tidak ada transaksi yang sesuai.</td></tr>
              ) : (
                currentTransactions.map((trx) => (
                  <tr key={trx.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-700">{trx.transactionDate}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${trx.type === "Income" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                        {trx.type === "Income" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">{trx.category}</td>
                    <td className={`py-4 px-6 text-right font-black ${trx.type === "Income" ? "text-emerald-600" : "text-red-500"}`}>
                      {trx.type === "Income" ? "+" : "-"} {Number(trx.amount).toLocaleString("id-ID")}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenEditModal(trx)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all cursor-pointer hover:scale-110" title="Edit">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDeleteTransaction(trx.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer hover:scale-110" title="Hapus">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        {processedTransactions.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
            <span className="text-xs text-slate-500 font-medium">
              Menampilkan <span className="font-bold text-slate-700">{indexOfFirstRow + 1}</span> - <span className="font-bold text-slate-700">{Math.min(indexOfLastRow, processedTransactions.length)}</span> dari <span className="font-bold text-slate-700">{processedTransactions.length}</span> transaksi
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed active:scale-95">
                ← Prev
              </button>
              <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 border border-slate-200 rounded-lg shadow-sm">
                Hal {currentPage} / {totalPages}
              </span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed active:scale-95">
                Next →
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}