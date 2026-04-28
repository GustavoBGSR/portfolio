import { Quote } from "lucide-react";

const PHOTO =
  "https://customer-assets.emergentagent.com/job_47496f62-def4-4a63-adb1-784a8ff3c743/artifacts/s8d620v3_eupng.png";

export const About = () => {
  return (
    <section
      id="sobre"
      data-testid="about-section"
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Photo */}
        <div
          data-testid="about-photo-wrap"
          className="reveal lg:col-span-5 relative"
        >
          <div className="relative mx-auto max-w-sm">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[#d4af37]/40 via-transparent to-transparent blur-2xl"
            />
            <div className="relative rounded-[1.75rem] overflow-hidden border border-[#d4af37]/40 gold-ring bg-[#0b0b0c]">
              <img
                src={PHOTO}
                alt="Gustavo Borges"
                className="w-full h-auto object-cover"
                data-testid="about-photo"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/70 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-head text-[#f5e6c8] text-lg">
                      Gustavo Borges
                    </div>
                    <div className="text-[11px] tracking-[0.2em] uppercase text-[#d4af37]">
                      @dedsec.jar
                    </div>
                  </div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400 border border-white/10 rounded-full px-3 py-1">
                    Dev · Freelancer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="lg:col-span-7">
          <div
            data-testid="about-eyebrow"
            className="reveal text-xs tracking-[0.3em] uppercase text-[#d4af37]"
          >
            — Sobre mim
          </div>
          <h2
            data-testid="about-title"
            className="reveal delay-1 font-head mt-4 text-3xl sm:text-4xl lg:text-5xl text-[#f5e6c8] leading-[1.05] tracking-[-0.02em]"
          >
            Não sou o nadador.
            <br />
            Mas sei{" "}
            <span className="font-serif-accent gold-text">mergulhar fundo</span>{" "}
            no que importa:
            <br />
            <span className="gold-text">resultados.</span>
          </h2>

          <p
            data-testid="about-body"
            className="reveal delay-2 mt-8 text-zinc-400 text-base lg:text-lg leading-relaxed max-w-2xl"
          >
            Sou desenvolvedor especializado em landing pages para comércios
            físicos e digitais. Meu foco é simples: transformar visitantes em
            clientes, com páginas{" "}
            <span className="text-[#f5e6c8]">rápidas</span>,{" "}
            <span className="text-[#f5e6c8]">modernas</span> e{" "}
            <span className="text-[#f5e6c8]">otimizadas</span>.
          </p>

          <div
            data-testid="about-quote"
            className="reveal delay-3 mt-10 card-lux p-6 lg:p-8 max-w-2xl"
          >
            <Quote className="h-5 w-5 text-[#d4af37]" />
            <p className="font-serif-accent mt-3 text-[#f5e6c8] text-lg leading-snug">
              “Cada site é pensado para destacar o seu negócio e gerar mais
              contatos — com entrega super rápida.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
