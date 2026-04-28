import { useEffect, useRef, useState } from "react";
import { ShieldCheck, TimerReset } from "lucide-react";

function useCountUp(target, start) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const duration = 1400;
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start]);
  return val;
}

export const Proof = ({ stats }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(stats?.sites_delivered || 0, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const niches =
    stats?.niches && stats.niches.length
      ? stats.niches
      : ["Restaurantes", "Lojas", "Serviços", "Salões de festa"];

  const marquee = [...niches, ...niches, ...niches];

  return (
    <section
      id="prova"
      data-testid="proof-section"
      ref={ref}
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          data-testid="proof-banner"
          className="relative card-lux p-8 lg:p-14 overflow-hidden"
        >
          <div
            aria-hidden
            className="aurora"
            style={{
              top: "-40%",
              right: "-10%",
              width: "30rem",
              height: "30rem",
              background:
                "radial-gradient(closest-side, rgba(212,175,55,0.3), transparent)",
            }}
          />

          <div className="relative grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#d4af37]">
                <ShieldCheck className="h-4 w-4" />
                Garantia da casa
              </div>

              <h2
                data-testid="proof-guarantee"
                className="font-head mt-5 text-3xl sm:text-4xl lg:text-5xl text-[#f5e6c8] tracking-[-0.02em] leading-[1.05]"
              >
                Entrego seu site em até{" "}
                <span className="gold-text">24 horas</span> — ou você{" "}
                <span className="font-serif-accent">não paga</span> pela
                urgência.
              </h2>

              <p className="mt-5 text-zinc-400 text-base lg:text-lg max-w-xl">
                Diferente de soluções genéricas, cada página é construída para
                destacar o seu negócio e gerar mais contatos. Sem templates
                batidos. Sem enrolação.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-2">
                  <TimerReset className="h-4 w-4 text-[#d4af37]" />
                  Entrega em 24h
                </div>
                <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-2">
                  <ShieldCheck className="h-4 w-4 text-[#d4af37]" />
                  Suporte inicial incluso
                </div>
              </div>
            </div>

            <div
              data-testid="proof-counter"
              className="lg:col-span-5 rounded-2xl border border-[#d4af37]/30 bg-black/40 p-10 text-center relative overflow-hidden"
            >
              <div className="text-xs tracking-[0.3em] uppercase text-[#d4af37]">
                Contador ao vivo
              </div>
              <div className="mt-4 font-head text-7xl lg:text-8xl leading-none">
                <span className="gold-text">+{count}</span>
              </div>
              <div className="mt-3 text-[#f5e6c8] text-lg">
                sites entregues
              </div>
              <div className="mt-2 text-xs text-zinc-500 tracking-wide">
                · e contando
              </div>
            </div>
          </div>
        </div>

        {/* Niches marquee */}
        <div
          data-testid="niches-marquee"
          className="mt-16 overflow-hidden border-y border-white/10 py-6"
        >
          <div className="text-xs tracking-[0.3em] uppercase text-zinc-500 mb-4 text-center">
            Nichos atendidos
          </div>
          <div className="flex gap-6 whitespace-nowrap marquee-track no-scrollbar">
            {marquee.map((n, i) => (
              <span
                key={i}
                data-testid={`niche-chip-${i}`}
                className="inline-flex items-center gap-3 text-[#f5e6c8] font-head text-2xl lg:text-3xl tracking-tight"
              >
                <span className="text-[#d4af37]">◆</span> {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
