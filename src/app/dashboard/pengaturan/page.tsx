"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, updatePassword } from "firebase/auth";
import { collection, addDoc, doc, query, onSnapshot, getDoc, setDoc, serverTimestamp, updateDoc, deleteDoc } from "firebase/firestore";
import Swal from "sweetalert2";

export default function PengaturanPage() {
  const [farmId, setFarmId] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Tabs (Notifikasi Dihapus)
  const [activeTab, setActiveTab] = useState("Umum");
  const tabs = ["Umum", "Pengguna", "Peran & Akses", "Perangkat & Integrasi", "Keamanan", "Data & Backup"];

  // State Form UMUM
  const [farmForm, setFarmForm] = useState({ name: "", address: "", capacity: "" });
  const [prefForm, setPrefForm] = useState({ language: "Bahasa Indonesia", weightUnit: "Kilogram (kg)" });
  const [profileForm, setProfileForm] = useState({ fullName: "", email: "", photoUrl: "/image/Logo AiMoo.png" });

  // State Form PENGGUNA (Members)
  const [members, setMembers] = useState<any[]>([]);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [memberForm, setMemberForm] = useState({ name: "", email: "", role: "Staff Kandang", status: "Aktif" });

  // =====================================================================
  // 1. INIT AUTH & FETCH DATA
  // =====================================================================
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileForm({
            fullName: userData.fullName || "",
            email: user.email || userData.email || "",
            photoUrl: userData.photoUrl || "/image/Logo AiMoo.png"
          });
          const uFarmId = Object.keys(userData.farmRoles || {})[0];
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
    const unsubFarm = onSnapshot(doc(db, "farms", farmId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFarmForm({ name: data.farmName || data.name || "", address: data.address || "", capacity: data.capacity || "" });
        setPrefForm({ language: data.settings?.language || data.language || "Bahasa Indonesia", weightUnit: data.settings?.weightUnit || data.weightUnit || "Kilogram (kg)" });
      }
    });

    const qMembers = query(collection(db, "farms", farmId, "members"));
    const unsubMembers = onSnapshot(qMembers, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMembers(data);
      setIsLoading(false);
    });

    return () => { unsubFarm(); unsubMembers(); };
  }, [farmId]);

  // =====================================================================
  // 2. HANDLERS SIMPAN DATA & UPLOAD FOTO (TAB UMUM)
  // =====================================================================

  // 🔥 FITUR AUTO-COMPRESS FOTO (Biar gak kena Error 1MB Firestore)
  const handleProfileImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("Ukuran Terlalu Besar!", "Maksimal ukuran foto adalah 2MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: any) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400; // Resize & Crop otomatis
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress jadi JPEG kualitas 70% (Ukurannya bakal turun drastis < 100kb)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setProfileForm({ ...profileForm, photoUrl: dataUrl });
        
        // Peringatan buat nge-klik tombol perbarui
        Swal.fire({
          title: "Foto Berhasil Dipilih!",
          text: "Jangan lupa klik tombol 'Perbarui Profil' di bawah untuk menyimpan gambar ke database.",
          icon: "info",
          confirmButtonColor: "#059669"
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveFarmInfo = async () => {
    if (!farmId) return;
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, "farms", farmId), { farmName: farmForm.name, address: farmForm.address, capacity: farmForm.capacity, updatedAt: serverTimestamp() }, { merge: true });
      Swal.fire({ icon: "success", title: "Tersimpan!", text: "Informasi peternakan diperbarui.", timer: 1500, showConfirmButton: false });
    } catch (e: any) { Swal.fire("Error", e.message, "error"); } finally { setIsSubmitting(false); }
  };

  const handleSavePreferences = async () => {
    if (!farmId) return;
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, "farms", farmId), { language: prefForm.language, weightUnit: prefForm.weightUnit, updatedAt: serverTimestamp() }, { merge: true });
      Swal.fire({ icon: "success", title: "Tersimpan!", text: "Preferensi aplikasi diperbarui.", timer: 1500, showConfirmButton: false });
    } catch (e: any) { Swal.fire("Error", e.message, "error"); } finally { setIsSubmitting(false); }
  };

  const handleSaveProfile = async () => {
    if (!userUid) return;
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, "users", userUid), { fullName: profileForm.fullName, email: profileForm.email, photoUrl: profileForm.photoUrl, updatedAt: serverTimestamp() }, { merge: true });
      Swal.fire({ icon: "success", title: "Tersimpan!", text: "Profil akun diperbarui.", timer: 1500, showConfirmButton: false });
    } catch (e: any) { Swal.fire("Error", e.message, "error"); } finally { setIsSubmitting(false); }
  };

  // =====================================================================
  // 3. HANDLERS KARYAWAN (TAB PENGGUNA)
  // =====================================================================
  const handleOpenAddMember = () => {
    setIsEditingMember(false); setEditMemberId(null);
    setMemberForm({ name: "", email: "", role: "Staff Kandang", status: "Aktif" });
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (m: any) => {
    setIsEditingMember(true); setEditMemberId(m.id);
    setMemberForm({ name: m.name, email: m.email, role: m.role, status: m.status });
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId) return;
    setIsSubmitting(true);
    try {
      if (isEditingMember && editMemberId) {
        await updateDoc(doc(db, "farms", farmId, "members", editMemberId), { ...memberForm, updatedAt: serverTimestamp() });
        Swal.fire({ icon: "success", title: "Diperbarui!", text: "Data karyawan diubah.", timer: 1500, showConfirmButton: false });
      } else {
        await addDoc(collection(db, "farms", farmId, "members"), { ...memberForm, addedBy: userUid, createdAt: serverTimestamp() });
        Swal.fire({ icon: "success", title: "Berhasil!", text: "Karyawan baru ditambahkan.", timer: 1500, showConfirmButton: false });
      }
      setIsMemberModalOpen(false);
    } catch (err: any) { Swal.fire("Error", err.message, "error"); } finally { setIsSubmitting(false); }
  };

  const handleDeleteMember = async (id: string) => {
    const res = await Swal.fire({ title: "Hapus Karyawan?", text: "Akses login karyawan ini akan dicabut.", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Ya, Hapus!" });
    if (res.isConfirmed && farmId) { await deleteDoc(doc(db, "farms", farmId, "members", id)); }
  };

  const generateDummyMembers = async () => {
    if (!farmId) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "farms", farmId, "members"), { name: "Budi Santoso", email: "budi.staff@aimoo.com", role: "Farm Manager", status: "Aktif", createdAt: serverTimestamp() });
      await addDoc(collection(db, "farms", farmId, "members"), { name: "Siti Aminah", email: "siti.kandang@aimoo.com", role: "Staff Kandang", status: "Aktif", createdAt: serverTimestamp() });
      Swal.fire("Sukses!", "Data karyawan dummy berhasil dibuat.", "success");
    } catch (e: any) { console.error(e); } finally { setIsSubmitting(false); }
  };

  const todayStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-[1600px] mx-auto pb-10 relative animate-in fade-in duration-500">
      
      {/* ========================================================= */}
      {/* MODAL KARYAWAN (TAMBAH / EDIT) */}
      {/* ========================================================= */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800">{isEditingMember ? "Edit Data Karyawan" : "Tambah Karyawan Baru"}</h3>
              <button onClick={() => setIsMemberModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSaveMember} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Nama Lengkap</label>
                <input type="text" required value={memberForm.name} onChange={(e) => setMemberForm({...memberForm, name: e.target.value})} placeholder="Misal: Budi Santoso" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-text" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Email / Username</label>
                <input type="email" required value={memberForm.email} onChange={(e) => setMemberForm({...memberForm, email: e.target.value})} placeholder="budi@aimoo.com" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-text" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Peran (Role)</label>
                  <select value={memberForm.role} onChange={(e) => setMemberForm({...memberForm, role: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                    <option>Farm Manager</option><option>Staff Kandang</option><option>Dokter Hewan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Status</label>
                  <select value={memberForm.status} onChange={(e) => setMemberForm({...memberForm, status: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                    <option>Aktif</option><option>Non-Aktif</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-2">
                <button type="button" onClick={() => setIsMemberModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-bold rounded-xl transition-colors shadow-md cursor-pointer">
                  {isSubmitting ? "Menyimpan..." : "Simpan Karyawan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* UI UTAMA PENGATURAN PAGE */}
      {/* ========================================================= */}

      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Pengaturan</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola preferensi aplikasi, pengguna, perangkat, dan sistem sesuai kebutuhan Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm cursor-default">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-sm font-bold text-slate-700">{todayStr}</span>
          </button>
        </div>
      </div>

      {/* 2. TABS NAVIGATION */}
      <div className="border-b border-slate-200 mb-6 flex overflow-x-auto no-scrollbar animate-in fade-in duration-500 delay-100">
        {tabs.map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap pb-4 px-5 text-sm font-bold transition-colors cursor-pointer ${activeTab === tab ? "text-emerald-600 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-800"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* =========================================
          TAB: UMUM
          ========================================= */}
      {activeTab === "Umum" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch animate-in slide-in-from-bottom-6 duration-700">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
              <span className="text-emerald-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></span>
              Informasi Peternakan
            </h3>
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Nama Peternakan</label>
                <input type="text" value={farmForm.name} onChange={(e) => setFarmForm({...farmForm, name: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-text" placeholder="Masukkan nama..." />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Alamat</label>
                <input type="text" value={farmForm.address} onChange={(e) => setFarmForm({...farmForm, address: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-text" placeholder="Masukkan alamat..." />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Kapasitas Populasi</label>
                <div className="flex">
                  <input type="number" value={farmForm.capacity} onChange={(e) => setFarmForm({...farmForm, capacity: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-l-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all border-r-0 cursor-text" placeholder="0" />
                  <span className="bg-slate-100 border border-slate-200 border-l-0 px-3 py-2 rounded-r-lg text-xs font-semibold text-slate-500 flex items-center justify-center">ekor</span>
                </div>
              </div>
            </div>
            <div className="mt-5 text-right">
              <button onClick={handleSaveFarmInfo} disabled={isSubmitting} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-sm">
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
              <span className="text-emerald-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg></span>
              Preferensi Aplikasi
            </h3>
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Bahasa</span>
                <select value={prefForm.language} onChange={(e) => setPrefForm({...prefForm, language: e.target.value})} className="w-48 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 cursor-pointer">
                  <option>Bahasa Indonesia</option><option>English (US)</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Satuan Berat</span>
                <select value={prefForm.weightUnit} onChange={(e) => setPrefForm({...prefForm, weightUnit: e.target.value})} className="w-48 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 cursor-pointer">
                  <option>Kilogram (kg)</option><option>Pound (lb)</option>
                </select>
              </div>
            </div>
            <div className="mt-5 text-right">
              <button onClick={handleSavePreferences} disabled={isSubmitting} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-sm">
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
              <span className="text-emerald-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></span>
              Profil Akun Utama (Owner)
            </h3>
            <div className="flex flex-col sm:flex-row gap-5 flex-1">
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border border-slate-200 hover:scale-105 transition-transform duration-300 relative group cursor-pointer">
                  <Image src={profileForm.photoUrl || "/image/Logo AiMoo.png"} alt="Profile" width={80} height={80} className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <span className="text-white text-[10px] font-bold text-center leading-tight">Ubah<br/>Foto</span>
                    <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-[9px] text-slate-400 font-medium">Maks: 2MB</p>
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Nama Lengkap</label>
                  <input type="text" value={profileForm.fullName} onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 cursor-text" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Email</label>
                  <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 cursor-text" />
                </div>
              </div>
            </div>
            <div className="mt-5 text-right">
              <button onClick={handleSaveProfile} disabled={isSubmitting} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-sm">
                {isSubmitting ? "Menyimpan..." : "Perbarui Profil"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          TAB: PENGGUNA
          ========================================= */}
      {activeTab === "Pengguna" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-700">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
            <div>
              <h3 className="text-base font-bold text-slate-900">Manajemen Karyawan</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">Kelola akses staf dan pekerja kandang di peternakan Anda.</p>
            </div>
            <div className="flex items-center gap-3">
              {members.length === 0 && (
                <button onClick={generateDummyMembers} disabled={isSubmitting} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer">
                  ✨ Generate Dummy Karyawan
                </button>
              )}
              <button onClick={handleOpenAddMember} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-sm transition-transform hover:-translate-y-0.5 cursor-pointer">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Tambah Karyawan
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50">
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="py-4 px-6 font-semibold">Nama Lengkap</th>
                  <th className="py-4 px-6 font-semibold">Email / Username</th>
                  <th className="py-4 px-6 font-semibold">Peran (Role)</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        <Image src={profileForm.photoUrl || "/image/Logo AiMoo.png"} alt="Profile" width={32} height={32} className="object-cover w-full h-full"/>
                      </div>
                      <span className="font-bold text-slate-900">{profileForm.fullName} (Anda)</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600">{profileForm.email}</td>
                  <td className="py-4 px-6"><span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100">Pemilik (Owner)</span></td>
                  <td className="py-4 px-6"><span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Aktif</span></td>
                  <td className="py-4 px-6 text-right text-xs text-slate-400 font-medium">-</td>
                </tr>
                {members.map(member => {
                  const initials = member.name.split(" ").map((n: string) => n[0]).join("").substring(0,2).toUpperCase();
                  const roleStyle = member.role === "Farm Manager" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-slate-100 text-slate-700 border-slate-200";
                  return (
                    <tr key={member.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${member.role === 'Farm Manager' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>{initials}</div>
                          <span className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{member.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-600">{member.email}</td>
                      <td className="py-4 px-6"><span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${roleStyle}`}>{member.role}</span></td>
                      <td className="py-4 px-6">
                        {member.status === "Aktif" ? <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Aktif</span> : <span className="flex items-center gap-1.5 text-xs font-bold text-red-500"><span className="w-2 h-2 rounded-full bg-red-500"></span> Non-Aktif</span>}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenEditMember(member)} className="text-xs font-bold text-blue-500 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">Edit</button>
                          <button onClick={() => handleDeleteMember(member.id)} className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================
          TAB: PERAN & AKSES
          ========================================= */}
      {activeTab === "Peran & Akses" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-700">
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
            <h3 className="text-base font-bold text-slate-900">Hak Akses & Peran</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Definisikan fitur apa saja yang bisa dilihat dan diedit oleh setiap posisi.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50">
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="py-4 px-6 font-semibold">Fitur / Modul</th>
                  <th className="py-4 px-6 font-semibold text-center">Pemilik (Owner)</th>
                  <th className="py-4 px-6 font-semibold text-center">Farm Manager</th>
                  <th className="py-4 px-6 font-semibold text-center">Staff Kandang</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-4 px-6 font-bold text-slate-800">Manajemen Data Sapi</td>
                  <td className="py-4 px-6 text-center text-emerald-500">✅ Edit</td>
                  <td className="py-4 px-6 text-center text-emerald-500">✅ Edit</td>
                  <td className="py-4 px-6 text-center text-slate-400">👁️ Lihat</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-4 px-6 font-bold text-slate-800">Input Produksi & Kesehatan</td>
                  <td className="py-4 px-6 text-center text-emerald-500">✅ Edit</td>
                  <td className="py-4 px-6 text-center text-emerald-500">✅ Edit</td>
                  <td className="py-4 px-6 text-center text-emerald-500">✅ Edit</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-4 px-6 font-bold text-slate-800">Manajemen Keuangan</td>
                  <td className="py-4 px-6 text-center text-emerald-500">✅ Edit</td>
                  <td className="py-4 px-6 text-center text-slate-400">👁️ Lihat</td>
                  <td className="py-4 px-6 text-center text-red-400">❌ Akses Ditolak</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-4 px-6 font-bold text-slate-800">Pengaturan & Karyawan</td>
                  <td className="py-4 px-6 text-center text-emerald-500">✅ Edit</td>
                  <td className="py-4 px-6 text-center text-red-400">❌ Akses Ditolak</td>
                  <td className="py-4 px-6 text-center text-red-400">❌ Akses Ditolak</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================
          TAB: PERANGKAT & INTEGRASI
          ========================================= */}
      {activeTab === "Perangkat & Integrasi" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-6 duration-700">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl shadow-sm">📡</div>
              <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold border border-green-200">Terhubung</span>
            </div>
            <h3 className="font-bold text-slate-900">AiMoo Smart Ear Tag</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Integrasi langsung ke sistem pelacakan suhu, langkah, dan ruminasi.</p>
            <button className="mt-auto px-4 py-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">Konfigurasi</button>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-2xl shadow-sm">🤖</div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold border border-slate-200">Offline</span>
            </div>
            <h3 className="font-bold text-slate-900">Auto Milking Machine</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Mesin perah otomatis yang menyinkronkan data produksi ke server.</p>
            <button className="mt-auto px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors cursor-pointer">Hubungkan Ulang</button>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 p-6 flex flex-col items-center justify-center text-center hover:bg-emerald-50 cursor-pointer transition-colors group">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform shadow-sm">＋</div>
            <h3 className="font-bold text-emerald-700">Tambah Perangkat</h3>
            <p className="text-[10px] text-emerald-600/70 mt-1">Hubungkan IoT atau sensor baru</p>
          </div>
        </div>
      )}

      {/* =========================================
          TAB: KEAMANAN
          ========================================= */}
      {activeTab === "Keamanan" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-6 duration-700">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
              <span className="text-purple-500 text-lg">🔒</span> Ubah Password
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Password Saat Ini</label>
                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-text" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Password Baru</label>
                <input type="password" placeholder="Minimal 6 Karakter" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-text" />
              </div>
              <div className="pt-2 text-right">
                <button className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-sm">Update Password</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
              <span className="text-emerald-500 text-lg">🛡️</span> Autentikasi 2 Langkah (2FA)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">Amankan akun Anda dengan menambahkan lapisan keamanan tambahan. Kami akan mengirimkan kode verifikasi setiap kali Anda login dari perangkat baru.</p>
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl mb-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Status 2FA</h4>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5">Saat ini dinonaktifkan</p>
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
              </div>
            </div>
            <button className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm">Mulai Setup 2FA</button>
          </div>
        </div>
      )}

      {/* =========================================
          TAB: DATA & BACKUP
          ========================================= */}
      {activeTab === "Data & Backup" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-6 duration-700">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
              <span className="text-blue-500 text-lg">☁️</span> Backup Cloud
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">Semua data peternakan Anda sudah di-backup otomatis secara real-time ke sistem Firebase Google Cloud.</p>
            <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500">🔄</div>
              <div>
                <p className="text-xs font-bold text-slate-800">Terakhir Dicadangkan</p>
                <p className="text-[10px] font-medium text-slate-500">Hari ini, 02:00 AM WIB</p>
              </div>
            </div>
            <button className="w-full py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shadow-sm">Backup Manual Sekarang</button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
              <span className="text-emerald-500 text-lg">📊</span> Ekspor Data (CSV / Excel)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">Unduh laporan dan master data peternakan Anda untuk keperluan audit atau pelaporan eksternal.</p>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer group">
                <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-700">1. Master Data Sapi</span>
                <span className="text-emerald-500">⬇️</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer group">
                <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-700">2. Laporan Keuangan (Bulan Ini)</span>
                <span className="text-emerald-500">⬇️</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer group">
                <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-700">3. Riwayat Produksi Susu</span>
                <span className="text-emerald-500">⬇️</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}