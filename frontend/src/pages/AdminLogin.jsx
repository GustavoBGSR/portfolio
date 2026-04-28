import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { adminApi, saveToken, getToken, clearToken, formatApiError } from "@/lib/adminApi";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    adminApi
      .get("/admin/verify")
      .then(() => navigate("/admin", { replace: true }))
      .catch(() => clearToken());
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await adminApi.post("/admin/login", { password });
      saveToken(data.token);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-testid="admin-login-root"
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-6"
    >
      <div
        aria-hidden
        className="aurora"
        style={{
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "40rem",
          height: "30rem",
          background:
            "radial-gradient(closest-side, rgba(212,175,55,0.3), transparent)",
        }}
      />

      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,230,200,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(245,230,200,0.25) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />

      <a
        href="/"
        data-testid="admin-back-home"
        className="absolute top-6 left-6 text-xs tracking-[0.22em] uppercase text-zinc-500 hover:text-[#f5e6c8] inline-flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao site
      </a>

      <form
        onSubmit={onSubmit}
        data-testid="admin-login-form"
        className="relative card-lux w-full max-w-md p-10"
      >
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 rounded-full bg-gradient-to-br from-[#f5d97a] to-[#8a6d1b] flex items-center justify-center text-black">
            <Lock className="h-5 w-5" />
          </span>
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-[#d4af37]">
              Área restrita
            </div>
            <h1 className="font-head text-2xl text-[#f5e6c8]">Painel Admin</h1>
          </div>
        </div>

        <label className="block mt-8 text-xs tracking-[0.22em] uppercase text-zinc-400">
          Senha
        </label>
        <input
          data-testid="admin-password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="mt-2 w-full bg-black/40 border border-white/10 rounded-full px-5 py-3 text-[#f5e6c8] placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]/60 transition-colors"
          placeholder="••••••••"
          required
        />

        {error && (
          <div
            data-testid="admin-error"
            className="mt-4 text-sm text-red-400 border border-red-500/30 bg-red-500/5 rounded-xl px-4 py-3"
          >
            {error}
          </div>
        )}

        <button
          data-testid="admin-login-submit"
          type="submit"
          disabled={loading || !password}
          className="btn-gold mt-6 w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Entrando..." : "Entrar"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>

        <p className="mt-6 text-[11px] tracking-[0.22em] uppercase text-zinc-600 text-center">
          Acesso exclusivo · Gustavo Borges
        </p>
      </form>
    </div>
  );
}
