"use client";

import { useState, useEffect } from "react";

// Fungsi untuk ubah kode cuaca dari API jadi Emoji & Teks
const getWeatherInfo = (code: number) => {
  if (code === 0) return { emoji: "☀️", text: "Cerah" };
  if (code >= 1 && code <= 3) return { emoji: "⛅", text: "Berawan" };
  if (code >= 45 && code <= 48) return { emoji: "🌫️", text: "Berkabut" };
  if (code >= 51 && code <= 67) return { emoji: "🌧️", text: "Hujan" };
  if (code >= 71 && code <= 77) return { emoji: "❄️", text: "Salju" };
  if (code >= 95) return { emoji: "⛈️", text: "Badai" };
  return { emoji: "☁️", text: "Tidak Diketahui" };
};

export default function WeatherCard() {
  const [data, setData] = useState({
    farmName: "Sukasari Dairy Farm",
    location: "Mendeteksi lokasi...",
    temp: 0,
    humidity: 0,
    weatherCode: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fungsi panggil API Cuaca Open-Meteo
    const fetchWeather = async (lat: number, lon: number, cityName?: string) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code`);
        const json = await res.json();
        
        if (json.current) {
          setData(prev => ({
            ...prev,
            location: cityName || "Lokasi Anda",
            temp: Math.round(json.current.temperature_2m),
            humidity: json.current.relative_humidity_2m,
            weatherCode: json.current.weather_code
          }));
        }
      } catch (error) {
        console.error("Gagal mengambil data cuaca:", error);
        // Fallback text kalau gagal
        setData(prev => ({ ...prev, location: "Gagal memuat lokasi" }));
      } finally {
        setLoading(false);
      }
    };

    // Minta izin lokasi ke browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Ubah koordinat jadi nama Kota pakai Nominatim (OpenStreetMap)
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const geoJson = await geoRes.json();
            const city = geoJson.address.city || geoJson.address.town || geoJson.address.county;
            const state = geoJson.address.state || "";
            
            // Panggil cuaca dengan nama kota asli
            fetchWeather(latitude, longitude, `${city}${state ? `, ${state}` : ""}`);
            
            // Ganti nama Farm biar dinamis sesuai lokasi user
            setData(prev => ({ ...prev, farmName: "Peternakan Lokal" }));
            
          } catch (e) {
            // Kalau geocoding gagal, tetap panggil cuacanya aja
            fetchWeather(latitude, longitude, "Lokasi Saat Ini");
          }
        },
        (error) => {
          console.log("Izin lokasi ditolak, pakai default Batu, Jatim.");
          // FALLBACK: Kalau user nolak akses lokasi, arahkan default ke Batu, Jawa Timur
          setData(prev => ({ ...prev, farmName: "Sukasari Dairy Farm", location: "Batu, Jawa Timur" }));
          fetchWeather(-7.87, 112.52, "Batu, Jawa Timur");
        }
      );
    } else {
      // Browser jadul
      fetchWeather(-7.87, 112.52, "Batu, Jawa Timur");
    }
  }, []);

  const weatherInfo = getWeatherInfo(data.weatherCode);

  return (
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden transition-all duration-300">
      {loading ? (
        // Animasi Loading (Pulse)
        <div className="animate-pulse space-y-3">
          <div className="h-3.5 bg-slate-200 rounded w-3/4"></div>
          <div className="h-2.5 bg-slate-200 rounded w-1/2 mb-2"></div>
          <div className="flex gap-3 items-center pt-2">
            <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
            <div className="space-y-1.5">
              <div className="h-4 bg-slate-200 rounded w-12"></div>
              <div className="h-2 bg-slate-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ) : (
        // Data Asli
        <>
          <h4 className="text-sm font-bold text-slate-900 truncate">{data.farmName}</h4>
          <p className="text-[11px] text-slate-500 mb-3 truncate">{data.location}</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl" title={weatherInfo.text}>{weatherInfo.emoji}</span>
            <div>
              <p className="text-lg font-black text-slate-900 leading-tight">{data.temp}°C</p>
              <p className="text-[10px] font-medium text-slate-500">{weatherInfo.text} • Kel: {data.humidity}%</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}