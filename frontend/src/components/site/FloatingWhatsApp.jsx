import { MessageCircle } from "lucide-react";

const WHATSAPP =
  "https://wa.me/5521987018600?text=Ol%C3%A1%20Gustavo%2C%20quero%20solicitar%20minha%20landing%20page.";

export const FloatingWhatsApp = () => {
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noreferrer"
      data-testid="floating-whatsapp-btn"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Falar no WhatsApp"
    >
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_15px_40px_-10px_rgba(37,211,102,0.6)] wa-pulse">
        <MessageCircle className="h-6 w-6 relative z-10" />
      </span>
      <span className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/80 backdrop-blur-xl border border-white/10 text-[#f5e6c8] text-xs tracking-[0.2em] uppercase rounded-full px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
        Fale comigo
      </span>
    </a>
  );
};
