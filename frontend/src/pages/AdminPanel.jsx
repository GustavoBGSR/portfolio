import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Save,
  Plus,
  X,
  ArrowLeft,
  TrendingUp,
  Tag,
  Loader2,
} from "lucide-react";
import { adminApi, clearToken, getToken, formatApiError } from "@/lib/adminApi";

export default function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);
  const [sitesDelivered, setSitesDelivered] = useState(0);
  const [niches, setNiches] = useState([]);
  const [newNiche, setNewNiche] = useState("");
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }
    (async () => {
      try {
        await adminApi.get("/admin/verify");
        const { data } = await adminApi.get("/stats");
        setStats(data);
        setSitesDelivered(data.sites_delivered);
        setNiches(data.niches || []);
      } catch (err) {
        if (err.response?.status === 401) {
          clearToken();
          navigate("/admin/login", { replace: true });
        } else {
          setNotice({
            type: "error",
            msg: formatApiError(err.response?.data?.detail) || err.message,
          });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const onLogout = () => {
    clearToken();
    navigate("/admin/login", { replace: true });
  };

  const addNiche = () => {
    const v = newNiche.trim();
    if (!v) return;
    if (niches.includes(v)) return;
    setNiches([...niches, v]);
    setNewNiche("");
  };

  const removeNiche = (n) => setNiches(niches.filter((x) => x !== n));

  const onSave = async () => {
    setSaving(true);
    setNotice(null);
    try {
      const { data } = await adminApi.put("/stats", {
        sites_delivered: Number(sitesDelivered),
        niches,
      });
      setStats(data);
      setSitesDelivered(data.sites_delivered);
      setNiches(data.niches || []);
      setNotice({ type: "success", msg: "Alterações salvas com sucesso." });
    } catch (err) {
      if (err.response?.status === 401) {
        clearToken();
        navigate("/admin/login", { replace: true });
        return;
      }
      setNotice({
        type: "error",
        msg: formatApiError(err.response?.data?.detail) || err.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div
      data-testid="admin-panel-root"
      className="min-h-screen pb-24 relative grain"
    >
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <a
            href="/"
            className="text-xs tracking-[0.22em] uppercase text-zinc-500 hover:text-[#f5e6c8] inline-flex items-center gap-2"
            data-testid="admin-back-to-site"
          >
            <ArrowLeft className="h-4 w-4" />
            Ver site
          </a>
          <div className="font-head text-sm tracking-[0.22em] uppercase text-[#f5e6c8]">
            Painel <span className="text-[#d4af37]">Admin</span>
          </div>
          <button
            onClick={onLogout}
            data-testid="admin-logout"
            className="text-xs tracking-[0.22em] uppercase text-zinc-500 hover:text-[#f5e6c8] inline-flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 lg:px-8 pt-12">
        <div className="mb-10">
          <div className="text-xs tracking-[0.3em] uppercase text-[#d4af37]">
            — Editor do site
          </div>
          <h1 className="font-head mt-3 text-3xl sm:text-4xl text-[#f5e6c8] tracking-[-0.02em]">
            Atualize em <span className="gold-text">tempo real</span>.
          </h1>
          <p className="mt-3 text-zinc-400 text-sm max-w-xl">
            Mudanças aqui aparecem instantaneamente na sua landing page em{" "}
            <code className="text-[#f5e6c8]">/</code>.
          </p>
        </div>

        {notice && (
          <div
            data-testid="admin-notice"
            className={`mb-6 rounded-xl px-4 py-3 text-sm border ${
              notice.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
                : "border-red-500/30 bg-red-500/5 text-red-300"
            }`}
          >
            {notice.msg}
          </div>
        )}

        {/* Sites delivered */}
        <section className="card-lux p-8 mb-8">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/25 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs tracking-[0.22em] uppercase text-zinc-500">
                Contador
              </div>
              <h2 className="font-head text-xl text-[#f5e6c8]">
                Sites entregues
              </h2>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-6 flex-wrap">
            <input
              data-testid="admin-sites-input"
              type="number"
              min="0"
              value={sitesDelivered}
              onChange={(e) => setSitesDelivered(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-full px-6 py-3 text-[#f5e6c8] text-lg w-40 focus:outline-none focus:border-[#d4af37]/60"
            />
            <div className="text-sm text-zinc-500">
              Aparecerá na home como{" "}
              <span className="gold-text font-head text-lg">
                +{sitesDelivered || 0}
              </span>{" "}
              sites entregues.
            </div>
          </div>
        </section>

        {/* Niches */}
        <section className="card-lux p-8 mb-8">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/25 flex items-center justify-center">
              <Tag className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs tracking-[0.22em] uppercase text-zinc-500">
                Marquee
              </div>
              <h2 className="font-head text-xl text-[#f5e6c8]">
                Nichos atendidos
              </h2>
            </div>
          </div>

          <div
            data-testid="admin-niches-list"
            className="mt-6 flex flex-wrap gap-2"
          >
            {niches.map((n, i) => (
              <span
                key={n}
                data-testid={`admin-niche-${i}`}
                className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#f5e6c8] rounded-full pl-4 pr-2 py-1.5 text-sm"
              >
                {n}
                <button
                  onClick={() => removeNiche(n)}
                  aria-label={`Remover ${n}`}
                  data-testid={`admin-remove-niche-${i}`}
                  className="h-6 w-6 rounded-full hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-[#f5e6c8]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            {!niches.length && (
              <div className="text-sm text-zinc-500">
                Nenhum nicho. Adicione pelo menos um.
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center gap-3 max-w-md">
            <input
              data-testid="admin-new-niche-input"
              value={newNiche}
              onChange={(e) => setNewNiche(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addNiche();
                }
              }}
              placeholder="Ex: Barbearias"
              className="flex-1 bg-black/40 border border-white/10 rounded-full px-5 py-2.5 text-[#f5e6c8] placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]/60 text-sm"
            />
            <button
              onClick={addNiche}
              data-testid="admin-add-niche-btn"
              className="btn-outline-gold !py-2.5 !px-4 text-sm"
              type="button"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </button>
          </div>
        </section>

        <div className="flex items-center gap-4">
          <button
            onClick={onSave}
            disabled={saving}
            data-testid="admin-save-btn"
            className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar alterações
              </>
            )}
          </button>
          {stats?.updated_at && (
            <span className="text-xs tracking-[0.22em] uppercase text-zinc-600">
              Última atualização: {new Date(stats.updated_at).toLocaleString("pt-BR")}
            </span>
          )}
        </div>
      </main>
    </div>
  );
}
