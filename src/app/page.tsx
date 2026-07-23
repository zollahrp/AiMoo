import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/layout/Preloader";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Stats from "@/components/sections/Stats";
import Calculator from "@/components/sections/Calculator";
import Pricing from "@/components/sections/Pricing";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Taruh Preloader di paling atas */}
      <Preloader /> 
      
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <Calculator />
      <Pricing />
      <Footer />
    </main>
  );
}