import { Flame, MessageCircle, Instagram } from "lucide-react";

const WHATSAPP =
  "https://wa.me/5521987018600?text=Ol%C3%A1%20Gustavo%2C%20quero%20solicitar%20minha%20landing%20page.";
const INSTAGRAM = "https://www.instagram.com/dedsec.jar/";

export const FinalCTA = () => {
  return (
    <section
      id="contato"
      data-testid="cta-section"
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center relative">
        <div
          aria-hidden
          className="aurora"
          style={{
            top: "-30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "50rem",
            height: "30rem",
            background:
              "radial-gradient(closest-side, rgba(212,175,55,0.28), transparent)",
          }}
        />

        <div
          data-testid="cta-eyebrow"
          className="reveal text-xs tracking-[0.3em] uppercase text-[#d4af37]"
        >
          — Próximo passo
        </div>

        <h2
          data-testid="cta-title"
          className="reveal delay-1 font-head mt-5 text-4xl sm:text-5xl lg:text-7xl text-[#f5e6c8] tracking-[-0.03em] leading-[1.02]"
        >
          Pronto para colocar seu negócio no{" "}
          <span className="gold-text">digital?</span>
        </h2>

        <p
          data-testid="cta-sub"
          className="reveal delay-2 mt-6 text-zinc-400 max-w-2xl mx-auto text-base lg:text-lg"
        >
          Me chama no WhatsApp e em até <span className="text-[#f5e6c8]">24 horas</span> seu site está no ar.
        </p>

        <div
          data-testid="cta-buttons"
          className="reveal delay-3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            data-testid="cta-solicitar-btn"
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="btn-gold"
          >
            <Flame className="h-5 w-5" />
            Solicitar meu site agora
          </a>
          <a
            data-testid="cta-whatsapp-btn"
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="btn-outline-gold"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </a>
          <a
            data-testid="cta-instagram-btn"
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            <Instagram className="h-5 w-5" />
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
};
