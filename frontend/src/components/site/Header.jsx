import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

const WHATSAPP =
  "https://wa.me/5521987018600?text=Ol%C3%A1%20Gustavo%2C%20quero%20solicitar%20minha%20landing%20page.";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/70 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <a
          href="#top"
          data-testid="brand-logo"
          className="flex items-center gap-2 group"
        >
          <span className="h-8 w-8 rounded-full bg-gradient-to-br from-[#f5d97a] to-[#8a6d1b] flex items-center justify-center text-black font-bold font-head">
            G
          </span>
          <span className="font-head text-sm tracking-[0.22em] uppercase text-[#f5e6c8] group-hover:text-white transition-colors">
            Gustavo<span className="text-[#d4af37]"> · </span>Borges
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
          <a
            data-testid="nav-sobre"
            href="#sobre"
            className="hover:text-[#f5e6c8] transition-colors"
          >
            Sobre
          </a>
          <a
            data-testid="nav-beneficios"
            href="#beneficios"
            className="hover:text-[#f5e6c8] transition-colors"
          >
            Benefícios
          </a>
          <a
            data-testid="nav-portfolio"
            href="#portfolio"
            className="hover:text-[#f5e6c8] transition-colors"
          >
            Portfólio
          </a>
          <a
            data-testid="nav-processo"
            href="#processo"
            className="hover:text-[#f5e6c8] transition-colors"
          >
            Processo
          </a>
        </nav>

        <a
          data-testid="header-whatsapp-btn"
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="btn-gold text-sm !py-2.5 !px-5"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </header>
  );
};
