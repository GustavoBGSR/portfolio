import { Flame, MessageCircle, Instagram, ArrowUpRight, Sparkles } from "lucide-react";

const WHATSAPP =
  "https://wa.me/5521987018600?text=Ol%C3%A1%20Gustavo%2C%20quero%20solicitar%20minha%20landing%20page.";
const INSTAGRAM = "https://www.instagram.com/dedsec.jar/";

export const Hero = () => {
  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative pt-36 pb-28 lg:pt-44 lg:pb-40 overflow-hidden"
    >
      {/* Background aurora */}
      <div
        aria-hidden
        className="aurora"
        style={{
          top: "-10%",
          left: "-10%",
          width: "40rem",
          height: "40rem",
          background:
            "radial-gradient(closest-side, rgba(212,175,55,0.35), transparent)",
        }}
      />
      <div
        aria-hidden
        className="aurora"
        style={{
          bottom: "-20%",
          right: "-10%",
          width: "38rem",
          height: "38rem",
          background:
            "radial-gradient(closest-side, rgba(212,175,55,0.22), transparent)",
        }}
      />
      {/* Grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,230,200,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(245,230,200,0.25) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center z-10">
        <div
          data-testid="hero-badge"
          className="reveal inline-flex items-center gap-2 text-xs tracking-[0.22em] uppercase text-[#d4af37] border border-[#d4af37]/30 rounded-full px-4 py-2 bg-[#d4af37]/5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Landing pages premium · entrega em 24h
        </div>

        <h1
          data-testid="hero-title"
          className="reveal delay-1 font-head mt-8 text-4xl sm:text-5xl lg:text-7xl font-medium leading-[1.02] tracking-[-0.03em] text-[#f5e6c8]"
        >
          Criação de{" "}
          <span className="gold-text">Landing Pages</span>
          <br />
          que{" "}
          <span className="font-serif-accent text-[#f5e6c8]">
            aumentam
          </span>{" "}
          a visibilidade do{" "}
          <span className="gold-text">seu negócio</span>
        </h1>

        <p
          data-testid="hero-subtitle"
          className="reveal delay-2 mt-8 text-base lg:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
        >
          Receba seu site pronto em até{" "}
          <span className="text-[#f5e6c8] font-medium">1 dia</span>, com suporte
          completo para domínio e publicação.
        </p>

        <div
          data-testid="hero-cta-group"
          className="reveal delay-3 mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            data-testid="hero-solicitar-btn"
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="btn-gold"
          >
            <Flame className="h-5 w-5" />
            Solicitar meu site
            <ArrowUpRight className="h-4 w-4" />
          </a>

          <a
            data-testid="hero-whatsapp-btn"
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="btn-outline-gold"
          >
            <MessageCircle className="h-5 w-5" />
            Falar no WhatsApp
          </a>

          <a
            data-testid="hero-instagram-btn"
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            <Instagram className="h-5 w-5" />
            Ver Instagram
          </a>
        </div>

        {/* Trust micro-row */}
        <div
          data-testid="hero-trust-row"
          className="reveal delay-4 mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs tracking-[0.22em] uppercase text-zinc-500"
        >
          <span>◆ +10 sites entregues</span>
          <span className="text-zinc-700">·</span>
          <span>◆ Entrega em 24h</span>
          <span className="text-zinc-700">·</span>
          <span>◆ Suporte pós-venda</span>
        </div>
      </div>
    </section>
  );
};
