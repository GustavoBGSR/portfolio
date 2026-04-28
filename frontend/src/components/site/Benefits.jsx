import {
  Rocket,
  MessageSquareHeart,
  Target,
  Zap,
  Globe2,
  Wrench,
} from "lucide-react";

const items = [
  {
    icon: Rocket,
    title: "Visibilidade online",
    text: "Sua marca encontrada por quem está pronto para comprar.",
    testid: "benefit-visibility",
    span: "md:col-span-2 md:row-span-2",
    featured: true,
  },
  {
    icon: MessageSquareHeart,
    title: "Contato facilitado",
    text: "CTAs estratégicos para WhatsApp, telefone e redes.",
    testid: "benefit-contact",
  },
  {
    icon: Target,
    title: "Focada em conversão",
    text: "Cada seção construída para transformar visita em cliente.",
    testid: "benefit-conversion",
  },
  {
    icon: Zap,
    title: "Entrega em até 24h",
    text: "Rapidez sem abrir mão da qualidade.",
    testid: "benefit-speed",
  },
  {
    icon: Globe2,
    title: "Compra de domínio",
    text: "Te oriento do registro à publicação no ar.",
    testid: "benefit-domain",
  },
  {
    icon: Wrench,
    title: "Suporte inicial",
    text: "Ajustes e dúvidas após a entrega — você não fica sozinho.",
    testid: "benefit-support",
  },
];

export const Benefits = () => {
  return (
    <section
      id="beneficios"
      data-testid="benefits-section"
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <div
            data-testid="benefits-eyebrow"
            className="reveal text-xs tracking-[0.3em] uppercase text-[#d4af37]"
          >
            — O que você recebe
          </div>
          <h2
            data-testid="benefits-title"
            className="reveal delay-1 font-head mt-4 text-3xl sm:text-4xl lg:text-5xl text-[#f5e6c8] tracking-[-0.02em]"
          >
            Valor real, não só código.
          </h2>
          <p
            data-testid="benefits-sub"
            className="reveal delay-2 mt-5 text-zinc-400 text-base lg:text-lg max-w-2xl"
          >
            Cada entrega é pensada para gerar <em className="text-[#f5e6c8] not-italic">mais contatos</em> e
            destacar o seu negócio na internet.
          </p>
        </div>

        <div
          data-testid="benefits-grid"
          className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-5 lg:gap-6 auto-rows-[minmax(180px,auto)]"
        >
          {items.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={b.testid}
                data-testid={b.testid}
                className={`reveal delay-${(i % 5) + 1} card-lux p-7 lg:p-8 flex flex-col justify-between ${
                  b.span || "md:col-span-2"
                } ${b.featured ? "bg-[#d4af37]/[0.05]" : ""}`}
              >
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    b.featured
                      ? "bg-[#d4af37] text-black"
                      : "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/25"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="mt-8">
                  <h3
                    className={`font-head ${
                      b.featured ? "text-2xl lg:text-3xl" : "text-xl"
                    } text-[#f5e6c8]`}
                  >
                    {b.title}
                  </h3>
                  <p className="mt-2 text-zinc-400 text-sm leading-relaxed">
                    {b.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
