import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Benefits } from "@/components/site/Benefits";
import { Portfolio } from "@/components/site/Portfolio";
import { Process } from "@/components/site/Process";
import { Proof } from "@/components/site/Proof";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { useRevealOnScroll } from "@/lib/reveal";

const SITE_STATS = {
  sites_delivered: 10,
  niches: ["Restaurantes", "Lojas", "Serviços", "Salões de festa"],
};

const Landing = () => {
  const [stats] = useState(SITE_STATS);
  useRevealOnScroll();

  return (
    <div className="relative min-h-screen grain" data-testid="landing-root">
      <Header />
      <main>
        <Hero />
        <About />
        <Benefits />
        <Portfolio />
        <Process />
        <Proof stats={stats} />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
