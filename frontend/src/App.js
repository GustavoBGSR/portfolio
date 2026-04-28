import { useEffect, useState } from "react";
import "@/App.css";
import axios from "axios";
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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Landing = () => {
  const [stats, setStats] = useState({
    sites_delivered: 10,
    niches: ["Restaurantes", "Lojas", "Serviços", "Salões de festa"],
  });

  useRevealOnScroll();

  useEffect(() => {
    let mounted = true;
    axios
      .get(`${API}/stats`)
      .then((res) => {
        if (mounted && res.data) setStats(res.data);
      })
      .catch(() => {
        /* silent - fallback defaults */
      });
    return () => {
      mounted = false;
    };
  }, []);

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
