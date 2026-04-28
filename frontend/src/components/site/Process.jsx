import {
  MessageCircle,
  Search,
  PenTool,
  RefreshCcw,
  Rocket,
} from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Contato",
    text: "Você me chama no WhatsApp ou Instagram.",
    icon: MessageCircle,
  },
  {
    n: "02",
    title: "Briefing",
    text: "Entendo seu negócio, público e objetivos.",
    icon: Search,
  },
  {
    n: "03",
    title: "Desenvolvimento",
    text: "Crio sua landing page focada em conversão.",
    icon: PenTool,
  },
  {
    n: "04",
    title: "Ajustes",
    text: "Refinamentos rápidos até ficar perfeito.",
    icon: RefreshCcw,
  },
  {
    n: "05",
    title: "Entrega",
    text: "Site publicado em até 1 dia. No ar 🚀",
    icon: Rocket,
  },
];

export const Process = () => {
  return (
    <section
      id="processo"
      data-testid="process-section"
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <div
            data-testid="process-eyebrow"
            className="reveal text-xs tracking-[0.3em] uppercase text-[#d4af37]"
          >
            — Como funciona
          </div>
          <h2
            data-testid="process-title"
            className="reveal delay-1 font-head mt-4 text-3xl sm:text-4xl lg:text-5xl text-[#f5e6c8] tracking-[-0.02em]"
          >
            5 passos. 1 dia. <span className="gold-text">Site no ar.</span>
          </h2>
        </div>

        <div
          data-testid="process-grid"
          className="mt-16 grid grid-cols-1 md:grid-cols-5 gap-6 relative"
        >
          <div
            aria-hidden
            className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px step-line"
          />
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.n}
                data-testid={`process-step-${i + 1}`}
                className={`reveal delay-${i + 1} relative`}
              >
                <div className="flex md:flex-col items-start md:items-center gap-4 md:gap-5 md:text-center">
                  <div className="relative h-20 w-20 rounded-full border border-[#d4af37]/30 bg-[#0b0b0c] flex items-center justify-center shadow-[inset_0_0_40px_rgba(212,175,55,0.15)]">
                    <Icon className="h-7 w-7 text-[#d4af37]" />
                    <span className="absolute -top-3 -right-3 text-[10px] tracking-[0.25em] uppercase bg-[#d4af37] text-black rounded-full h-7 w-10 flex items-center justify-center font-head">
                      {s.n}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-head text-lg text-[#f5e6c8]">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-zinc-400 text-sm leading-relaxed">
                      {s.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
