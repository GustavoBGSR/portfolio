# PRD — Gustavo Borges · Landing Page de Serviços

## Problema / Contexto
Gustavo Borges (@dedsec.jar) é desenvolvedor freelancer que cria landing pages para comércios físicos e digitais, com entrega em até 24h. Precisa de uma **landing page comercial própria** para converter visitantes em contatos de WhatsApp.

## Personas
- **Dono de comércio físico** (restaurantes, lojas, salões de festa) que precisa de presença digital rápida.
- **Prestador de serviço** que quer um ponto de contato online profissional.
- **Empreendedor digital** testando uma oferta/produto.

## Requisitos estáticos (core)
1. Seção Hero forte com CTAs: Solicitar site, WhatsApp, Instagram.
2. Sobre com foto pessoal e tagline ("não sou o nadador...").
3. Benefícios (6 itens em bento grid).
4. Portfólio com 3 projetos reais (TSM, Valens, Bicycle) com preview ao vivo.
5. Processo em 5 passos.
6. Prova social: garantia 24h + contador dinâmico de sites entregues + nichos.
7. CTA final + Footer com contatos.
8. Botão flutuante de WhatsApp.

## User choices (registradas)
- Estilo: dark elegante + dourado (premium).
- "Solicitar meu site" → WhatsApp direto (sem formulário).
- Contador dinâmico (editável via backend).
- Nichos padrão: Restaurantes, Lojas, Serviços, Salões de festa.
- Marca: "por Gustavo Borges" + tagline.

## Arquitetura
- Frontend: React 19 + Tailwind + Shadcn/UI, fontes Outfit + Manrope + Playfair Display.
- Backend: FastAPI + MongoDB (motor).
- Endpoints:
  - `GET /api/stats` — retorna `{sites_delivered, niches, updated_at}`
  - `PUT /api/stats` — atualiza contador e nichos
  - `POST /api/leads` — cria lead (não usado pela UI atual, reservado)
  - `GET /api/leads` — lista leads
- Mongo collections: `stats` (singleton key="public"), `leads`.

## Implementado (2025-12)
- [x] Backend FastAPI com stats + leads endpoints, seed automático de stats default
- [x] Landing page completa com todas as 9 seções
- [x] Header sticky com glassmorphism
- [x] Hero com aurora gold + grid pattern + CTAs
- [x] About com foto pessoal e glow dourado
- [x] Benefits bento grid (featured + 5 regulares)
- [x] Portfolio com iframe preview ao vivo dos 3 sites
- [x] Process timeline 5 passos com connector linha dourada
- [x] Proof banner com contador animado + marquee de nichos infinito
- [x] CTA final + Footer + Floating WhatsApp pulsante
- [x] Reveal-on-scroll via IntersectionObserver
- [x] data-testid em todos elementos interativos
- [x] Testes automatizados 100% passando (backend + frontend)

## Backlog / Próximos passos
- **P1**: Painel admin simples (`/admin`) para atualizar contador e nichos sem chamadas manuais de API.
- **P1**: Formulário opcional de lead (nome, negócio, contato) com integração WhatsApp + salvamento em `/api/leads`.
- **P2**: Depoimentos de clientes (quando houver).
- **P2**: Blog/conteúdo SEO para captação orgânica.
- **P2**: Integração com Google Analytics / Pixel Meta para tracking de conversão.
- **P2**: FAQ accordion (Shadcn) para objeções comuns (preço, prazo, suporte).
- **P3**: Multi-idioma (PT/EN) para clientes internacionais.

## Testes
- `/app/backend/tests/backend_test.py` — 8/8 pytest passando
- Testing agent report: `/app/test_reports/iteration_1.json`
