import { Instagram, MessageCircle } from "lucide-react";

const WHATSAPP =
  "https://wa.me/5521987018600?text=Ol%C3%A1%20Gustavo%2C%20quero%20solicitar%20minha%20landing%20page.";
const INSTAGRAM = "https://www.instagram.com/dedsec.jar/";

export const Footer = () => {
  return (
    <footer
      data-testid="site-footer"
      className="relative border-t border-white/10 py-14"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-3 gap-10 items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-gradient-to-br from-[#f5d97a] to-[#8a6d1b] flex items-center justify-center text-black font-bold font-head">
              G
            </span>
            <span className="font-head text-sm tracking-[0.22em] uppercase text-[#f5e6c8]">
              por Gustavo Borges
            </span>
          </div>
          <p className="font-serif-accent mt-4 text-zinc-400 max-w-sm leading-snug">
            Não sou o nadador, mas sei mergulhar fundo no que realmente importa:
            resultados.
          </p>
        </div>

        <div>
          <div className="text-xs tracking-[0.3em] uppercase text-[#d4af37]">
            Navegar
          </div>
          <ul className="mt-4 space-y-2 text-zinc-400 text-sm">
            <li>
              <a data-testid="footer-nav-sobre" href="#sobre" className="hover:text-[#f5e6c8]">
                Sobre
              </a>
            </li>
            <li>
              <a data-testid="footer-nav-beneficios" href="#beneficios" className="hover:text-[#f5e6c8]">
                Benefícios
              </a>
            </li>
            <li>
              <a data-testid="footer-nav-portfolio" href="#portfolio" className="hover:text-[#f5e6c8]">
                Portfólio
              </a>
            </li>
            <li>
              <a data-testid="footer-nav-processo" href="#processo" className="hover:text-[#f5e6c8]">
                Como funciona
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-xs tracking-[0.3em] uppercase text-[#d4af37]">
            Contato
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <a
              data-testid="footer-whatsapp"
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[#f5e6c8] hover:text-white"
            >
              <MessageCircle className="h-4 w-4 text-[#d4af37]" />
              +55 21 98701-8600
            </a>
            <a
              data-testid="footer-instagram"
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[#f5e6c8] hover:text-white"
            >
              <Instagram className="h-4 w-4 text-[#d4af37]" />
              @dedsec.jar
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <div data-testid="footer-copyright">
          © {new Date().getFullYear()} · Gustavo Borges · Todos os direitos reservados.
        </div>
        <div className="tracking-[0.25em] uppercase">
          Feito com <span className="text-[#d4af37]">◆</span> no Rio de Janeiro
        </div>
      </div>
    </footer>
  );
};
