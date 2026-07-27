"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, doc, query, where, onSnapshot, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";

const CHART_COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#fbbf24", "#f97316", "#94a3b8"];

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

export default function SapiPage() {
  const [farmId, setFarmId] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  
  const [cowsList, setCowsList] = useState<any[]>([]);
  const [currentCowId, setCurrentCowId] = useState<string>(""); 

  const [cowData, setCowData] = useState<any>(null);
  const [milkRecords, setMilkRecords] = useState<any[]>([]);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [reproRecords, setReproRecords] = useState<any[]>([]);
  const [feedRecords, setFeedRecords] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 🔥 STATE IOT SIMULATION 🔥
  const [isIotActive, setIsIotActive] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  // === STATE MODAL AKSI CEPAT ===
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"Susu" | "Reproduksi" | "Kesehatan" | "Pakan">("Susu");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<any>({
    date: new Date().toISOString().split("T")[0],
    time: "07:00"
  });

  // === STATE MODAL SAPI (Tambah/Edit) ===
  const [isCowModalOpen, setIsCowModalOpen] = useState(false);
  const [isEditingCow, setIsEditingCow] = useState(false);
  const [cowForm, setCowForm] = useState({
    tagNumber: "", name: "", breed: "Holstein Friesian", gender: "Betina",
    birthDate: "", group: "Laktasi", location: "", photoUrl: ""
  });

  // 🔥 STATE MODAL LIHAT SEMUA RIWAYAT 🔥
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyType, setHistoryType] = useState<"All" | "Repro" | "Health">("All");

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
        setIsLoadingData(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!farmId) return;
    const qAllCows = query(collection(db, "cows"), where("farmId", "==", farmId));
    const unsubAllCows = onSnapshot(qAllCows, (snap) => {
      const all = snap.docs.map(d => d.data());
      setCowsList(all);
      if (all.length > 0 && !currentCowId) setCurrentCowId(all[0].cowId); 
    });
    return () => unsubAllCows();
  }, [farmId, currentCowId]);

  useEffect(() => {
    if (!farmId || !currentCowId) return;

    const qCow = query(collection(db, "cows"), where("farmId", "==", farmId), where("cowId", "==", currentCowId));
    const unsubCow = onSnapshot(qCow, (snap) => {
      if (!snap.empty) setCowData(snap.docs[0].data());
      else setCowData(null);
    });

    const qMilk = query(collection(db, "milk_productions"), where("farmId", "==", farmId), where("cowId", "==", currentCowId));
    const unsubMilk = onSnapshot(qMilk, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setMilkRecords(data);
    });

    const qHealth = query(collection(db, "health_records"), where("farmId", "==", farmId), where("cowId", "==", currentCowId));
    const unsubHealth = onSnapshot(qHealth, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setHealthRecords(data);
    });

    const qRepro = query(collection(db, "reproduction_records"), where("farmId", "==", farmId), where("cowId", "==", currentCowId));
    const unsubRepro = onSnapshot(qRepro, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setReproRecords(data);
    });

    const qFeed = query(collection(db, "feed_consumptions"), where("farmId", "==", farmId), where("cowId", "==", currentCowId));
    const unsubFeed = onSnapshot(qFeed, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setFeedRecords(data);
      setIsLoadingData(false);
    });

    return () => { unsubCow(); unsubMilk(); unsubHealth(); unsubRepro(); unsubFeed(); };
  }, [farmId, currentCowId]);

  // Efek IoT
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isIotActive && currentCowId && farmId) {
      interval = setInterval(async () => {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 1000);

        const newTemp = Number((38.2 + Math.random() * 0.8).toFixed(1)); 
        const newRumi = Math.floor(400 + Math.random() * 30); 
        const newSteps = Math.floor(1200 + Math.random() * 50); 

        try {
          await updateDoc(doc(db, "cows", currentCowId), {
            liveMetrics: { temperature: newTemp, rumination: newRumi, steps: newSteps, lastSync: new Date().toISOString() }
          });
        } catch (e) {
          console.log("Koneksi IoT gagal", e);
        }
      }, 5000); 
    }
    return () => clearInterval(interval);
  }, [isIotActive, currentCowId, farmId]);

  const getAge = (birthDate: string) => {
    if (!birthDate) return "-";
    const diff = new Date().getTime() - new Date(birthDate).getTime();
    const years = Math.floor(diff / 31557600000);
    const months = Math.floor((diff % 31557600000) / 2629800000);
    return `${years} Tahun ${months} Bulan`;
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  const formatTime = (isoString: string) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const todayStr = new Date().toISOString().split("T")[0];
  let yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

  const todayMilk = milkRecords.filter(m => m.date.startsWith(todayStr)).reduce((sum, m) => sum + Number(m.quantityLiter), 0);
  const yesterdayMilk = milkRecords.filter(m => m.date.startsWith(yesterdayStr)).reduce((sum, m) => sum + Number(m.quantityLiter), 0);
  const milkTrend = yesterdayMilk > 0 ? ((todayMilk - yesterdayMilk) / yesterdayMilk) * 100 : 0;

  const totalLactationMilk = milkRecords.reduce((sum, m) => sum + Number(m.quantityLiter), 0);
  const peakMilk = milkRecords.length > 0 ? Math.max(...milkRecords.map(m => Number(m.quantityLiter))) : 0;
  const avgMilk = milkRecords.length > 0 ? (totalLactationMilk / milkRecords.length).toFixed(1) : "0";
  
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const chartData = last7Days.map(dateStr => {
    const dayMilk = milkRecords.filter(m => m.date.startsWith(dateStr)).reduce((sum, m) => sum + Number(m.quantityLiter), 0);
    return { date: dateStr, milk: dayMilk };
  });

  const avg7Days = chartData.reduce((sum, d) => sum + d.milk, 0) / 7;
  const maxMilkVal = Math.max(...chartData.map(d => d.milk), 20);
  const yMax = Math.ceil(maxMilkVal + 5);
  const mapY = (val: number) => 100 - ((val / yMax) * 80); 

  const xCoords = Array.from({length: 7}, (_, i) => i * (500 / 6));
  const polylinePoints = chartData.map((d, i) => `${xCoords[i]},${mapY(d.milk)}`).join(" ");
  const polygonPoints = `0,100 ${polylinePoints} 500,100`;

  // Gabung Semua Catatan
  const allNotes = [...healthRecords, ...reproRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recentNotes = allNotes.slice(0, 4); // Cuma ambil 4 buat di preview kotak

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("Ukuran Terlalu Besar!", "Maksimal ukuran foto adalah 2MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setCowForm({ ...cowForm, photoUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleOpenAddCow = () => {
    setIsEditingCow(false);
    setCowForm({ tagNumber: "", name: "", breed: "Holstein Friesian", gender: "Betina", birthDate: "", group: "Laktasi", location: "", photoUrl: "" });
    setIsCowModalOpen(true);
  };

  const handleOpenEditCow = () => {
    if (!cowData) return;
    setIsEditingCow(true);
    setCowForm({
      tagNumber: cowData.tagNumber || "", name: cowData.name || "", breed: cowData.breed || "Holstein Friesian", gender: cowData.gender || "Betina",
      birthDate: cowData.birthDate || "", group: cowData.group || "Laktasi", location: cowData.location || "", photoUrl: cowData.photoUrl || ""
    });
    setIsCowModalOpen(true);
  };

  const handleSaveCow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId) return;
    setIsSubmitting(true);
    try {
      if (isEditingCow && currentCowId) {
        await updateDoc(doc(db, "cows", currentCowId), { ...cowForm, updatedAt: serverTimestamp() });
        Swal.fire({ icon: "success", title: "Berhasil", text: "Profil Sapi diperbarui!", timer: 1500, showConfirmButton: false });
      } else {
        const newCowId = `cow_${cowForm.tagNumber}_${Date.now()}`;
        await setDoc(doc(db, "cows", newCowId), {
          cowId: newCowId, farmId, ...cowForm, isActive: true,
          currentStatus: { lactationPhase: 1, reproduction: "Kosong", health: "Sehat" },
          createdAt: serverTimestamp()
        });
        setCurrentCowId(newCowId);
        Swal.fire({ icon: "success", title: "Berhasil", text: "Sapi baru ditambahkan!", timer: 1500, showConfirmButton: false });
      }
      setIsCowModalOpen(false);
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = (type: "Susu" | "Reproduksi" | "Kesehatan" | "Pakan") => {
    setModalType(type);
    setFormData({ date: new Date().toISOString().split("T")[0], time: "07:00", quantity: "", session: "Pagi", activityType: "IB", details: "", healthType: "Pemeriksaan", diagnosis: "", temp: "" });
    setIsModalOpen(true);
  };

  const handleSaveAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId || !userUid || !currentCowId) return;
    setIsSubmitting(true);
    try {
      const timestamp = `${formData.date}T${formData.time}:00Z`;
      if (modalType === "Susu") {
        await addDoc(collection(db, "milk_productions"), { farmId, cowId: currentCowId, date: timestamp, quantityLiter: Number(formData.quantity), milkingSession: formData.session, recordedBy: userUid, createdAt: timestamp });
      } else if (modalType === "Reproduksi") {
        await addDoc(collection(db, "reproduction_records"), { farmId, cowId: currentCowId, date: timestamp, activityType: formData.activityType, details: formData.details, handledBy: userUid, createdAt: timestamp });
      } else if (modalType === "Kesehatan") {
        await addDoc(collection(db, "health_records"), { farmId, cowId: currentCowId, date: timestamp, type: formData.healthType, diagnosis: formData.diagnosis, details: formData.details, metrics: { temperature: Number(formData.temp) }, handledBy: userUid, createdAt: timestamp });
      } else if (modalType === "Pakan") {
        await addDoc(collection(db, "feed_consumptions"), { farmId, cowId: currentCowId, date: formData.date, feedType: formData.details, quantityKg: Number(formData.quantity), recordedBy: userUid, createdAt: timestamp });
      }
      Swal.fire({ icon: "success", title: "Tercatat!", text: `Data ${modalType} berhasil disimpan.`, timer: 1500, showConfirmButton: false });
      setIsModalOpen(false);
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const injectDummySapi = async () => {
    if (!farmId || !userUid) return;
    setIsSubmitting(true);
    try {
      const dummyCows = [
        { id: "cow_1047", tag: "1047", name: "Lara", breed: "Holstein", birth: "2023-03-10" },
        { id: "cow_1048", tag: "1048", name: "Moly", breed: "Jersey", birth: "2024-01-15" },
        { id: "cow_1049", tag: "1049", name: "Bessie", breed: "Angus", birth: "2022-11-20" }
      ];

      for (const cow of dummyCows) {
        await setDoc(doc(db, "cows", cow.id), {
          cowId: cow.id, farmId, tagNumber: cow.tag, name: cow.name, breed: cow.breed, gender: "Betina",
          birthDate: cow.birth, group: "Laktasi", location: "Kandang A", isActive: true, photoUrl: "",
          currentStatus: { lactationPhase: 1, reproduction: "Bunting", health: "Sehat" },
          liveMetrics: { temperature: 38.5, rumination: 410, steps: 1250, lastSync: new Date().toISOString() }, 
          createdAt: serverTimestamp()
        });

        for (let i = 0; i < 7; i++) {
          let d = new Date(); d.setDate(d.getDate() - i);
          let dateStr = `${d.toISOString().split("T")[0]}T07:00:00Z`;
          let randMilk = (Math.random() * (22 - 16) + 16).toFixed(1); 
          await addDoc(collection(db, "milk_productions"), { farmId, cowId: cow.id, date: dateStr, quantityLiter: Number(randMilk), milkingSession: "Pagi", recordedBy: userUid, createdAt: dateStr });
        }

        await addDoc(collection(db, "health_records"), { farmId, cowId: cow.id, date: new Date().toISOString(), type: "Pemeriksaan", diagnosis: "Cek Rutin", details: "Kondisi sehat, ambing normal.", handledBy: "Dr. Budi" });
        await addDoc(collection(db, "health_records"), { farmId, cowId: cow.id, date: "2026-06-10T10:00:00Z", type: "Vaksinasi", diagnosis: "Vaksin PMK", details: "Dosis pertama", handledBy: "Dr. Budi" });
        
        await addDoc(collection(db, "reproduction_records"), { farmId, cowId: cow.id, date: new Date().toISOString(), activityType: "IB", details: "Semen Import ABS 123", handledBy: "Inseminator Andi" });
        await addDoc(collection(db, "reproduction_records"), { farmId, cowId: cow.id, date: "2026-05-20T08:00:00Z", activityType: "Birahi", details: "Birahi terdeteksi pagi hari", handledBy: "Inseminator Andi" });
      }

      Swal.fire("Selesai!", "3 Data Sapi Dummy lengkap dengan riwayatnya berhasil dibuat!", "success");
      setCurrentCowId(dummyCows[0].id); 
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Gagal generate dummy.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10 relative animate-in fade-in duration-500">
      
      {/* ========================================================= */}
      {/* MODAL LIHAT SEMUA RIWAYAT (TABEL LENGKAP) */}
      {/* ========================================================= */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                {historyType === "All" && "📋 Semua Catatan (Kesehatan & Reproduksi)"}
                {historyType === "Repro" && "⚥ Semua Riwayat Reproduksi"}
                {historyType === "Health" && "🩺 Semua Riwayat Kesehatan"}
              </h3>
              <button onClick={() => setIsHistoryModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-0 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/80 sticky top-0 z-10 shadow-sm">
                  <tr className="text-slate-500 border-b border-slate-200">
                    <th className="py-3 px-6 font-bold text-xs uppercase tracking-wider">Tanggal & Waktu</th>
                    <th className="py-3 px-6 font-bold text-xs uppercase tracking-wider">Tipe / Diagnosa</th>
                    <th className="py-3 px-6 font-bold text-xs uppercase tracking-wider">Detail Keterangan</th>
                    <th className="py-3 px-6 font-bold text-xs uppercase tracking-wider text-right">Dicatat Oleh</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-50">
                  {/* PILIH DATA BERDASARKAN TIPE MODAL */}
                  {(() => {
                    let dataToMap = [];
                    if (historyType === "All") dataToMap = allNotes;
                    else if (historyType === "Repro") dataToMap = reproRecords;
                    else if (historyType === "Health") dataToMap = healthRecords;

                    if (dataToMap.length === 0) {
                      return <tr><td colSpan={4} className="py-8 text-center text-slate-400 font-medium">Belum ada data tercatat.</td></tr>;
                    }

                    return dataToMap.map((row: any) => {
                      const isHealth = row.hasOwnProperty('diagnosis');
                      return (
                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-6">
                            <div className="font-semibold text-slate-800">{formatDate(row.date.split("T")[0])}</div>
                            <div className="text-[10px] text-slate-400">{formatTime(row.date)}</div>
                          </td>
                          <td className="py-3 px-6">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${isHealth ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                              {isHealth ? row.diagnosis : row.activityType}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-xs text-slate-600 whitespace-normal min-w-[200px]">{row.details}</td>
                          <td className="py-3 px-6 text-right text-xs font-semibold text-slate-500">{row.handledBy || "-"}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button onClick={() => setIsHistoryModalOpen(false)} className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer">
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL TAMBAH / EDIT SAPI MASTER */}
      {/* ========================================================= */}
      {isCowModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800">{isEditingCow ? "Edit Profil Sapi" : "Tambah Sapi Baru"}</h3>
              <button onClick={() => setIsCowModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveCow} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500 bg-slate-50 mb-3 relative group cursor-pointer">
                  <img src={cowForm.photoUrl || "/image/Logo AiMoo.png"} alt="Preview" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <span className="text-white text-xs font-bold">Ubah</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Format JPG/PNG, Maksimal 2MB.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">ID Telinga (Tag)</label>
                  <input type="text" value={cowForm.tagNumber} onChange={(e) => setCowForm({...cowForm, tagNumber: e.target.value})} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 cursor-text" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Nama Panggilan</label>
                  <input type="text" value={cowForm.name} onChange={(e) => setCowForm({...cowForm, name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 cursor-text" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Breed (Jenis)</label>
                  <select value={cowForm.breed} onChange={(e) => setCowForm({...cowForm, breed: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500">
                    <option>Holstein Friesian</option><option>Jersey</option><option>Angus</option><option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Jenis Kelamin</label>
                  <select value={cowForm.gender} onChange={(e) => setCowForm({...cowForm, gender: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500">
                    <option>Betina</option><option>Jantan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Tanggal Lahir</label>
                  <input type="date" value={cowForm.birthDate} onChange={(e) => setCowForm({...cowForm, birthDate: e.target.value})} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Kelompok Sapi</label>
                  <select value={cowForm.group} onChange={(e) => setCowForm({...cowForm, group: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500">
                    <option>Laktasi</option><option>Kering Kandang</option><option>Pedet</option><option>Dara</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Lokasi Kandang</label>
                  <input type="text" value={cowForm.location} onChange={(e) => setCowForm({...cowForm, location: e.target.value})} placeholder="Misal: Kandang A - Baris 2" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 cursor-text" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-2">
                <button type="button" onClick={() => setIsCowModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-bold rounded-xl transition-colors shadow-md cursor-pointer">
                  {isSubmitting ? "Menyimpan..." : "Simpan Sapi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL AKTIVITAS (SUSU, KESEHATAN DLL) */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800">Catat {modalType} Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveAction} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Tanggal</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Jam</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              {modalType === "Susu" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Jumlah (Liter)</label>
                    <input type="number" step="0.1" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required placeholder="Misal: 15.5" className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Sesi</label>
                    <select value={formData.session} onChange={(e) => setFormData({...formData, session: e.target.value})} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500">
                      <option>Pagi</option><option>Sore</option>
                    </select>
                  </div>
                </div>
              )}

              {modalType === "Reproduksi" && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Jenis Aktivitas</label>
                    <select value={formData.activityType} onChange={(e) => setFormData({...formData, activityType: e.target.value})} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500">
                      <option>Birahi Terdeteksi</option><option>IB</option><option>Pemeriksaan Kebuntingan (PK)</option><option>Beranak</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Detail / Keterangan</label>
                    <input type="text" value={formData.details} onChange={(e) => setFormData({...formData, details: e.target.value})} required placeholder="Misal: Semen ABS 123" className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </>
              )}

              {modalType === "Kesehatan" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Tipe</label>
                      <select value={formData.healthType} onChange={(e) => setFormData({...formData, healthType: e.target.value})} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500">
                        <option>Pemeriksaan</option><option>Pengobatan</option><option>Gejala</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Suhu Tubuh (°C)</label>
                      <input type="number" step="0.1" value={formData.temp} onChange={(e) => setFormData({...formData, temp: e.target.value})} placeholder="38.5" className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Diagnosa / Gejala Utama</label>
                    <input type="text" value={formData.diagnosis} onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} required placeholder="Misal: Mastitis Ringan" className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Tindakan / Detail</label>
                    <textarea rows={2} value={formData.details} onChange={(e) => setFormData({...formData, details: e.target.value})} placeholder="Misal: Diberi injeksi antibiotik" className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-emerald-500"></textarea>
                  </div>
                </>
              )}

              {modalType === "Pakan" && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Jenis Pakan Khusus</label>
                    <input type="text" value={formData.details} onChange={(e) => setFormData({...formData, details: e.target.value})} required placeholder="Misal: Konsentrat Tambahan" className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Jumlah (Kg)</label>
                    <input type="number" step="0.1" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required placeholder="Misal: 5.5" className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-bold rounded-xl transition-colors shadow-md cursor-pointer">
                  {isSubmitting ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ========================================================= */}
      {/* UI UTAMA SAPI PAGE */}
      {/* ========================================================= */}

      {/* 1. TOP NAV */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight hidden lg:block">Data Ternak</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          
          {/* 🔥 TOMBOL IOT SIMULATION (KEDAP KEDIP) */}
          <button 
            onClick={() => setIsIotActive(!isIotActive)} 
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer ${isIotActive ? 'bg-red-50 border border-red-200 text-red-600 shadow-red-500/20' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {isIotActive ? (
              <><span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span> Matikan Sensor IoT</>
            ) : (
              <>📡 Aktifkan Sensor Ear Tag</>
            )}
          </button>

          {/* DROPDOWN PILIH SAPI */}
          <div className="relative group">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <select 
              value={currentCowId} 
              onChange={(e) => setCurrentCowId(e.target.value)}
              className="w-56 pl-9 pr-10 py-2.5 bg-white border border-emerald-200 rounded-xl text-sm font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm appearance-none"
            >
              {cowsList.length === 0 ? <option value="">Belum ada sapi</option> : null}
              {cowsList.map(c => (
                <option key={c.cowId} value={c.cowId}>#{c.tagNumber} - {c.name}</option>
              ))}
            </select>
            <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>

          <button onClick={handleOpenAddCow} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-transform hover:-translate-y-0.5 shadow-md shadow-emerald-500/20 cursor-pointer">
            + Tambah Sapi
          </button>

          <button onClick={injectDummySapi} disabled={isSubmitting} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer">
            ✨ Generate Data Dummy
          </button>
        </div>
      </div>

      {/* STATE KOSONG */}
      {!cowData && !isLoadingData ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-200 shadow-sm text-center animate-in fade-in duration-500">
          <div className="text-5xl mb-4">🐄</div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Data Sapi Belum Tersedia</h2>
          <p className="text-sm text-slate-500 mb-6">Klik tombol "+ Tambah Sapi" atau "Generate Data Dummy" di pojok kanan atas untuk mengisi database.</p>
        </div>
      ) : (
      <>
        {/* 2. HEADER PROFILE & BUTTONS */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">#{cowData?.tagNumber || "..."} – {cowData?.name || "..."}</h1>
              <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${cowData?.isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                {cowData?.isActive ? "Aktif" : "Tidak Aktif"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-1.5"><span className="text-slate-400">🐄</span> {cowData?.breed || "-"}</div>
              <div className="flex items-center gap-1.5"><span className="text-slate-400">{cowData?.gender === 'Betina' ? '♀' : '♂'}</span> {cowData?.gender || "-"}</div>
              <div className="flex items-center gap-1.5"><span className="text-slate-400">📅</span> {getAge(cowData?.birthDate)}</div>
              <div className="flex items-center gap-1.5"><span className="text-slate-400">⊕</span> Laktasi ke-{cowData?.currentStatus?.lactationPhase || "-"}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleOpenEditCow} className="px-5 py-2.5 bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold text-sm transition-colors cursor-pointer flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              Edit Data Sapi
            </button>
            <button onClick={() => handleOpenModal("Susu")} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors shadow-md cursor-pointer flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Catat Aktivitas
            </button>
          </div>
        </div>

        {/* 4. ROW 1: PROFILE, AI SUMMARY, PERFORMA */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6 items-stretch">
          
          {/* Box A: Info Sapi */}
          <div className="xl:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
            <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
              <img src={cowData?.photoUrl || "/image/Logo AiMoo.png"} alt="Foto Sapi" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
              <div className="text-slate-500 font-medium">ID Sapi</div><div className="font-bold text-slate-900">{cowData?.tagNumber}</div>
              <div className="text-slate-500 font-medium">Nama</div><div className="font-bold text-slate-900">{cowData?.name}</div>
              <div className="text-slate-500 font-medium">Status Repro</div><div className="font-bold text-indigo-600">{cowData?.currentStatus?.reproduction}</div>
              <div className="text-slate-500 font-medium">Kesehatan</div><div className={`font-bold ${cowData?.currentStatus?.health === 'Sehat' ? 'text-emerald-600' : 'text-red-500'}`}>{cowData?.currentStatus?.health}</div>
              <div className="text-slate-500 font-medium">Kelompok</div><div className="font-bold text-slate-900">{cowData?.group}</div>
              <div className="text-slate-500 font-medium">Lokasi</div><div className="font-bold text-slate-900">{cowData?.location}</div>
            </div>
          </div>

          {/* Box B: AI Ringkasan */}
          <div className="xl:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-200/60 transition-colors duration-500"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="text-purple-500 text-lg group-hover:scale-110 group-hover:rotate-12 transition-transform">✨</span> AI Insight Hari Ini
              </h3>
              {milkTrend < 0 ? (
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-200 flex items-center gap-1">⚠️ Perlu Perhatian</span>
              ) : (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200 flex items-center gap-1">✅ Performa Baik</span>
              )}
            </div>
            
            <div className={`p-4 rounded-xl border mb-4 flex-1 relative z-10 ${milkTrend < 0 ? 'bg-amber-50/50 border-amber-100/50' : 'bg-emerald-50/50 border-emerald-100/50'}`}>
              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                {milkTrend < 0 ? `Produksi susu turun ${Math.abs(milkTrend).toFixed(1)}% vs hari kemarin.` : `Produksi susu stabil/naik. Performa sapi dalam kondisi optimal.`}
              </p>
              <p className="text-xs text-slate-800 leading-relaxed">
                <span className="font-bold">Saran AI:</span> {milkTrend < 0 ? "Lakukan pemeriksaan kesehatan ambing dan cek konsumsi pakan hari ini." : "Pertahankan ransum dan pola pemerahan saat ini."}
              </p>
            </div>
          </div>

          {/* Box C: Performa Hari Ini (DENGAN LIVE IOT DATA) */}
          <div className="xl:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
            {isIotActive && (
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-emerald-400/20 rounded-full animate-ping pointer-events-none"></div>
            )}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Performa Hari Ini</h3>
              {isIotActive && <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> LIVE</span>}
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-1 -mx-1 rounded transition-colors">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="w-6 h-6 rounded bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">🥛</span> Produksi Susu
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{todayMilk.toFixed(1)} L</span>
                  {milkTrend !== 0 && <span className={`text-[10px] font-bold ${milkTrend > 0 ? "text-emerald-500" : "text-red-500"}`}>{milkTrend > 0 ? "↑" : "↓"} {Math.abs(milkTrend).toFixed(1)}%</span>}
                </div>
              </div>
              <div className="border-t border-slate-100"></div>

              {/* LIVE DATA IOT: LANGKAH (Aktivitas) */}
              <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-1 -mx-1 rounded transition-colors">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="w-6 h-6 rounded bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">🚶</span> Langkah Harian
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold text-slate-900 transition-colors ${isIotActive && isPulsing ? 'text-indigo-600' : ''}`}>
                    {cowData?.liveMetrics?.steps || 1250}
                  </span>
                </div>
              </div>
              <div className="border-t border-slate-100"></div>

              {/* LIVE DATA IOT: RUMINASI */}
              <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-1 -mx-1 rounded transition-colors">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="w-6 h-6 rounded bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">🔄</span> Ruminasi
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold text-slate-900 transition-colors ${isIotActive && isPulsing ? 'text-blue-600' : ''}`}>
                    {cowData?.liveMetrics?.rumination || 410} <span className="text-[10px] font-medium text-slate-500">mnt</span>
                  </span>
                </div>
              </div>
              <div className="border-t border-slate-100"></div>

              {/* LIVE DATA IOT: SUHU */}
              <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-1 -mx-1 rounded transition-colors">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="w-6 h-6 rounded bg-red-50 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">🌡️</span> Suhu Tubuh
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold text-slate-900 transition-colors ${isIotActive && isPulsing ? 'text-red-500' : ''}`}>
                    {cowData?.liveMetrics?.temperature || 38.5} <span className="text-[10px] font-medium text-slate-500">°C</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 5. ROW 2: CHART & CATATAN */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6 items-stretch">
          
          {/* Grafik (Kiri) */}
          <div className="xl:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900">Grafik Produksi Susu</h3>
              <select className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg outline-none cursor-pointer">
                <option>7 Hari Terakhir</option>
              </select>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-1">
              {/* Area Chart SVG */}
              <div className="flex-1 relative h-48 lg:h-auto min-h-[200px]">
                <div className="absolute left-0 top-0 bottom-6 w-6 flex flex-col justify-between text-[10px] font-medium text-slate-400">
                  <span>{yMax}</span><span>{Math.round(yMax*0.66)}</span><span>{Math.round(yMax*0.33)}</span><span>0</span>
                </div>
                <div className="absolute left-10 right-0 bottom-0 flex justify-between text-[9px] font-medium text-slate-400">
                  {chartData.map(d => {
                    const [y,m,day] = d.date.split("-");
                    return <span key={d.date}>{day}/{m}</span>
                  })}
                </div>
                <div className="absolute left-10 right-2 top-2 bottom-6">
                  <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="0" x2="500" y2="0" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="33" x2="500" y2="33" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="66" x2="500" y2="66" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                    
                    <polygon points={polygonPoints} fill="url(#chartGreen)" className="animate-in fade-in duration-1000"/>
                    <polyline points={polylinePoints} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in slide-in-from-left-8 duration-1000" />
                    
                    {/* 🔥 FONT DIPERKECIL & DIGESER DIKIT BIAR RAPI */}
                    {chartData.map((d, i) => d.milk > 0 && (
                      <g key={i} className="animate-in zoom-in duration-500 delay-500">
                        <circle cx={xCoords[i]} cy={mapY(d.milk)} r="4" fill="#10b981" stroke="white" strokeWidth="2" className="cursor-pointer hover:r-6 transition-all" />
                        <text x={xCoords[i]} y={mapY(d.milk) - 8} fill="#10b981" fontSize="9.5" fontWeight="bold" textAnchor="middle">{d.milk.toFixed(1)}</text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
              
              {/* Stats Sidebar */}
              <div className="w-full lg:w-48 flex flex-col justify-center space-y-4 shrink-0 border-l border-slate-100 pl-6">
                <div className="flex justify-between items-center group cursor-pointer">
                  <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-800">Rata-rata 7 hari</span>
                  <span className="text-sm font-bold text-slate-900 group-hover:scale-110 origin-right transition-transform">{avg7Days.toFixed(1)} L</span>
                </div>
                <div className="flex justify-between items-center group cursor-pointer">
                  <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-800">Rata-rata Laktasi</span>
                  <span className="text-sm font-bold text-slate-900 group-hover:scale-110 origin-right transition-transform">{avgMilk} L</span>
                </div>
                <div className="flex justify-between items-center group cursor-pointer">
                  <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-800">Puncak Laktasi</span>
                  <span className="text-sm font-bold text-emerald-600 group-hover:scale-110 origin-right transition-transform">{peakMilk.toFixed(1)} L</span>
                </div>
                <div className="flex justify-between items-center group cursor-pointer">
                  <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-800">Total Perah</span>
                  <span className="text-sm font-bold text-slate-900 group-hover:scale-110 origin-right transition-transform">{milkRecords.length}x</span>
                </div>
              </div>
            </div>
          </div>

          {/* Catatan Terbaru (Kanan) */}
          <div className="xl:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 mb-5">Catatan Kesehatan / Reproduksi</h3>
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[220px] custom-scrollbar pr-2">
              
              {recentNotes.length === 0 && <p className="text-xs text-slate-400 text-center py-8">Belum ada catatan.</p>}

              {recentNotes.map((note: any) => {
                const isHealth = note.hasOwnProperty('diagnosis');
                const icon = isHealth ? (note.type === 'Pemeriksaan' ? '🩺' : '🌡️') : '⚥';
                const colorBg = isHealth ? 'bg-orange-50' : 'bg-purple-50';
                const colorText = isHealth ? 'text-orange-500' : 'text-purple-500';
                const title = isHealth ? note.diagnosis : `Repro: ${note.activityType}`;

                return (
                  <div key={note.id} className="flex items-start gap-3 group cursor-pointer p-2 -mx-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className={`w-8 h-8 rounded ${colorBg} ${colorText} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}>{icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-bold text-slate-900">{title}</p>
                        <span className="text-[9px] font-medium text-slate-400">{formatDate(note.date.split("T")[0])}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{note.details}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <button onClick={() => { setHistoryType("All"); setIsHistoryModalOpen(true); }} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left cursor-pointer hover:underline">
              Lihat semua catatan →
            </button>
          </div>

        </div>

        {/* 6. ROW 3: RIWAYAT & AKSI CEPAT */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 items-stretch mb-10">
          
          {/* Riwayat Reproduksi */}
          <div className="xl:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Riwayat Reproduksi</h3>
            <div className="overflow-x-auto flex-1 max-h-[200px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="sticky top-0 bg-white">
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="pb-2 font-semibold">Tanggal</th>
                    <th className="pb-2 font-semibold">Aktivitas</th>
                    <th className="pb-2 font-semibold">Detail</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {reproRecords.length === 0 && <tr><td colSpan={3} className="py-4 text-center text-slate-400">Kosong</td></tr>}
                  {reproRecords.map(r => (
                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className="py-2.5 font-medium">{formatDate(r.date.split("T")[0])}</td>
                      <td className="py-2.5 font-bold text-slate-800">{r.activityType}</td>
                      <td className="py-2.5 text-slate-500 truncate max-w-[100px]" title={r.details}>{r.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => { setHistoryType("Repro"); setIsHistoryModalOpen(true); }} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left cursor-pointer hover:underline">
              Lihat semua riwayat →
            </button>
          </div>

          {/* Riwayat Kesehatan */}
          <div className="xl:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Riwayat Kesehatan</h3>
            <div className="overflow-x-auto flex-1 max-h-[200px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="sticky top-0 bg-white">
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="pb-2 font-semibold">Tanggal</th>
                    <th className="pb-2 font-semibold">Diagnosa</th>
                    <th className="pb-2 font-semibold">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {healthRecords.length === 0 && <tr><td colSpan={3} className="py-4 text-center text-slate-400">Kosong</td></tr>}
                  {healthRecords.map(h => (
                    <tr key={h.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className="py-2.5 font-medium">{formatDate(h.date.split("T")[0])}</td>
                      <td className="py-2.5 font-bold text-slate-800">{h.diagnosis}</td>
                      <td className="py-2.5 text-slate-500 truncate max-w-[100px]" title={h.details}>{h.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => { setHistoryType("Health"); setIsHistoryModalOpen(true); }} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-4 text-left cursor-pointer hover:underline">
              Lihat semua riwayat →
            </button>
          </div>

          {/* Aksi Cepat */}
          <div className="xl:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Pencatatan Cepat Hari Ini</h3>
            <div className="grid grid-cols-2 gap-3 flex-1">
              
              <button onClick={() => handleOpenModal("Susu")} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all group shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer">
                <span className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform text-lg">🥛</span>
                <span className="text-[10px] font-bold text-slate-600 text-center leading-tight group-hover:text-blue-700">Catat<br/>Produksi</span>
              </button>
              
              <button onClick={() => handleOpenModal("Reproduksi")} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-100 hover:bg-purple-50 hover:border-purple-200 transition-all group shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer">
                <span className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform text-lg">⚥</span>
                <span className="text-[10px] font-bold text-slate-600 text-center leading-tight group-hover:text-purple-700">Catat<br/>Reproduksi</span>
              </button>
              
              <button onClick={() => handleOpenModal("Kesehatan")} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-100 hover:bg-red-50 hover:border-red-200 transition-all group shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer">
                <span className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform text-lg">🩺</span>
                <span className="text-[10px] font-bold text-slate-600 text-center leading-tight group-hover:text-red-700">Catat<br/>Kesehatan</span>
              </button>
              
              <button onClick={() => handleOpenModal("Pakan")} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-100 hover:bg-green-50 hover:border-green-200 transition-all group shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer">
                <span className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform text-lg">🌾</span>
                <span className="text-[10px] font-bold text-slate-600 text-center leading-tight group-hover:text-green-700">Catat<br/>Pakan</span>
              </button>

            </div>
          </div>

        </div>
      </>
      )}

    </div>
  );
}