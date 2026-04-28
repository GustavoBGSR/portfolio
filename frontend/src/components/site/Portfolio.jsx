import { ArrowUpRight, ExternalLink } from "lucide-react";

const projects = [
  {
    id: 1,
    name: "TSM Printer Solutions",
    category: "Soluções em impressão",
    url: "https://landingtsm.netlify.app/",
    accent: "from-amber-400/30 to-transparent",
  },
  {
    id: 2,
    name: "Valens Cestas",
    category: "Cestas & presentes",
    url: "https://valenscestas.netlify.app/",
    accent: "from-[#d4af37]/30 to-transparent",
  },
  {
    id: 3,
    name: "Bicycle SG",
    category: "Loja de bicicletas",
    url: "https://bicyclesg.netlify.app/",
    accent: "from-yellow-300/25 to-transparent",
  },
];

export const Portfolio = () => {
  return (
    <section
      id="portfolio"
      data-testid="portfolio-section"
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <div
              data-testid="portfolio-eyebrow"
              className="reveal text-xs tracking-[0.3em] uppercase text-[#d4af37]"
            >
              — Portfólio
            </div>
            <h2
              data-testid="portfolio-title"
              className="reveal delay-1 font-head mt-4 text-3xl sm:text-4xl lg:text-5xl text-[#f5e6c8] tracking-[-0.02em]"
            >
              Trabalhos recentes.
              <br />
              <span className="font-serif-accent gold-text">Prova viva</span> do
              que entrego.
            </h2>
          </div>
          <p
            data-testid="portfolio-sub"
            className="reveal delay-2 text-zinc-400 max-w-md"
          >
            Alguns sites reais publicados — clique e veja ao vivo. Cada página
            foi construída do zero, focada no negócio do cliente.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              data-testid={`portfolio-card-${p.id}`}
              className={`reveal delay-${i + 1} group card-lux overflow-hidden flex flex-col`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0b0b0c] border-b border-white/5">
                <div
                  aria-hidden
                  className={`absolute inset-0 bg-gradient-to-br ${p.accent} mix-blend-screen pointer-events-none z-10`}
                />
                <div className="absolute inset-0 flex items-start justify-start overflow-hidden">
                  <iframe
                    title={p.name}
                    src={p.url}
                    className="preview-frame"
                    loading="lazy"
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#d4af37] shadow-[0_0_12px_#d4af37]" />
                  <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-300">
                    Ao vivo
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 z-30 h-11 w-11 rounded-full bg-[#d4af37] text-black flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>

              <div className="p-6 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] tracking-[0.22em] uppercase text-zinc-500">
                    Projeto 0{p.id} · {p.category}
                  </div>
                  <div className="font-head mt-1 text-xl text-[#f5e6c8] group-hover:text-white transition-colors">
                    {p.name}
                  </div>
                </div>
                <div
                  className="inline-flex items-center gap-1.5 text-[#d4af37] text-sm"
                  data-testid={`portfolio-link-${p.id}`}
                >
                  Acessar
                  <ExternalLink className="h-4 w-4" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
