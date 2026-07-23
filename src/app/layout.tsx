import type { Metadata } from "next";
// 1. Import font dari Google Fonts bawaan Next.js
import { Inter } from "next/font/google"; 
import "./globals.css";

// 2. Konfigurasi font-nya

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], 
  display: 'swap',
});

// (Opsional) Sekalian kita rapihin metadata buat tab browser lu biar pro!
export const metadata: Metadata = {
  title: "AiMoo | Smart Livestock Monitoring",
  description: "Platform berbasis AI dan IoT untuk memantau kesehatan dan produktivitas sapi perah secara real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Tambahin scroll-smooth biar kalau klik menu navbar turunnya mulus
    <html lang="id" className="scroll-smooth"> 
      <body 
        // 3. Panggil class font-nya di body, plus antialiased biar font makin tajam & tipis
        className={`${inter.className} antialiased text-gray-900 bg-white`}
      >
        {children}
      </body>
    </html>
  );
}