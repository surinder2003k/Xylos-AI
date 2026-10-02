"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Diamond,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  TriangleAlert,
  Wrench,
} from "lucide-react";

/** A model pinned by the user. `model: null` means "Best Free Route" (auto). */
export type SelectedModel = {
  provider: string;
  model: string | null;
  label: string;
};

export const AUTO_MODEL: SelectedModel = {
  provider: "best",
  model: null,
  label: "Best Free Route",
};

type CatalogModel = { id: string; name?: string; degraded?: boolean };
type CatalogProvider = { id: string; label: string; models: CatalogModel[] };
type Catalog = { generatedAt: string; providers: CatalogProvider[]; fallback?: boolean };

const CATALOG_STALE_MS = 30 * 60 * 1000;
const CUSTOM_MODEL_MAX = 120;
/** Mirror of the server-side allowlist in app/api/chat/route.ts. */
const CUSTOM_MODEL_OK = /^[A-Za-z0-9][A-Za-z0-9._:/@-]*$/;

/** Providers a custom model id can target, even if the catalog call fails. */
export const CUSTOM_PROVIDERS = [
  { id: "groq", label: "Groq", hint: "e.g. llama-3.3-70b-versatile" },
  { id: "gemini", label: "Gemini", hint: "e.g. gemini-3.6-flash" },
  { id: "openrouter", label: "OpenRouter", hint: "must end with :free" },
  { id: "mistral", label: "Mistral", hint: "e.g. mistral-large-latest" },
  { id: "cerebras", label: "Cerebras", hint: "e.g. llama-3.3-70b" },
  { id: "cloudflare", label: "Cloudflare", hint: "e.g. @cf/meta/llama-3-8b-instruct" },
  { id: "huggingface", label: "Hugging Face", hint: "e.g. microsoft/Phi-3-mini-4k-instruct" },
];

export function isValidCustomModel(provider: string, value: string) {
  const id = value.trim();
  if (!id || id.length > CUSTOM_MODEL_MAX) return false;
  if (!CUSTOM_MODEL_OK.test(id) || id.includes("..") || id.includes("//")) return false;
  if (provider === "cloudflare" && !/^@(cf|hf)\//.test(id)) return false;
  if (provider === "huggingface" && !id.includes("/")) return false;
  return true;
}

function syncedLabel(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (!Number.isFinite(mins) || mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
}

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  selected: SelectedModel;
  onSelect: (model: SelectedModel) => void;
};

export function ModelLibraryMenu({ isOpen, onToggle, selected, onSelect }: Props) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [customProvider, setCustomProvider] = useState("groq");
  const [customModel, setCustomModel] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const loadCatalog = useCallback(async (refresh: boolean) => {
    setIsFetching(true);
    setError(null);
    try {
      const res = await fetch(`/api/models${refresh ? "?refresh=1" : ""}`);
      if (!res.ok) throw new Error("Could not reach the model registry.");
      setCatalog(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach the model registry.");
    } finally {
      setIsFetching(false);
    }
  }, []);

  // First visit loads the catalog; re-opening refreshes in the background only
  // when the cached list has gone stale, so the menu never feels slow.
  useEffect(() => {
    if (!catalog && !isFetching) loadCatalog(false);
  }, [catalog, isFetching, loadCatalog]);

  useEffect(() => {
    if (!isOpen || !catalog?.generatedAt) return;
    if (Date.now() - new Date(catalog.generatedAt).getTime() > CATALOG_STALE_MS) {
      loadCatalog(false);
    }
  }, [isOpen, catalog, loadCatalog]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as HTMLElement)) onToggle();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  const visibleProviders = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const groups = (catalog?.providers ?? []).map((p) => ({
      ...p,
      models: needle
        ? p.models.filter((m) =>
            m.id.toLowerCase().includes(needle) ||
            (m.name ?? "").toLowerCase().includes(needle) ||
            p.label.toLowerCase().includes(needle)
          )
        : p.models,
    }));
    if (!needle) return groups;
    return groups.filter((p) => p.models.length > 0 || p.label.toLowerCase().includes(needle));
  }, [catalog, query]);

  const totalVisible = visibleProviders.reduce((sum, p) => sum + p.models.length, 0);

  const handleUseCustom = () => {
    const id = customModel.trim();
    if (!isValidCustomModel(customProvider, id)) {
      setCustomError("That id is not valid for the selected provider.");
      return;
    }
    onSelect({ provider: customProvider, model: id, label: `${customProvider}/${id}` });
    setCustomError(null);
    setShowCustom(false);
    setCustomModel("");
    onToggle();
  };
return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label="Open model library"
        className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition-all text-[10px] font-semibold uppercase tracking-wide text-white/40"
      >
        <Diamond className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="hidden sm:inline max-w-[170px] truncate">{selected.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-[110%] left-0 w-[min(22rem,calc(100vw-3rem))] editorial-card shadow-2xl rounded-xl overflow-hidden z-[100] flex flex-col"
          >
            {/* Header: search + manual refresh */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/10">
              <Search className="w-3.5 h-3.5 text-white/30 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search free models…"
                aria-label="Search free models"
                className="flex-1 bg-transparent text-xs text-white placeholder:text-white/25 outline-none"
              />
              <button
                onClick={() => loadCatalog(true)}
                aria-label="Refresh model catalog"
                className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-primary transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
              {/* Auto route always sits at the top */}
              <button
                onClick={() => { onSelect(AUTO_MODEL); onToggle(); }}
                className={`w-full flex items-center justify-between px-4 py-3 transition-all border-b border-white/10 ${selected.provider === "best" ? "bg-primary/10 text-primary" : "hover:bg-white/5 text-white/50 hover:text-white"}`}
              >
                <div className="flex items-center gap-3 text-xs font-bold">
                  <Sparkles className="w-4 h-4" /> Best Free Route
                </div>
                <span className="text-[9px] uppercase tracking-widest text-white/25">Auto</span>
              </button>

              {error && (
                <p className="px-4 py-3 text-[11px] text-red-400">Failed to load live models — you can still enter a model id below.</p>
              )}
              {catalog?.fallback && !error && (
                <p className="px-4 py-3 text-[11px] text-amber-400/80">
                  Live registry unreachable — showing a known-good shortlist.
                </p>
              )}

              {isFetching && !catalog && (
                <div className="flex items-center justify-center gap-2 px-4 py-6 text-[11px] text-white/40">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Scanning free model registry…
                </div>
              )}

              {totalVisible === 0 && !isFetching && (
                <p className="px-4 py-6 text-center text-[11px] text-white/30">
                  No free model matches “{query.trim()}”.
                </p>
              )}

              {visibleProviders.map((p) => p.models.length > 0 && (
                <div key={p.id} className="py-1.5">
                  <p className="px-4 py-1 text-[9px] font-bold uppercase tracking-widest text-white/25">{p.label}</p>
                  {p.models.map((m) => {
                    const isSelected = selected.provider === p.id && selected.model === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => { onSelect({ provider: p.id, model: m.id, label: m.id }); onToggle(); }}
                        title={m.name ? `${m.name} · ${m.id}` : m.id}
                        className={`w-full flex items-center justify-between gap-2 pl-4 pr-3 py-2.5 transition-all ${isSelected ? "bg-primary/10 text-primary" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          {m.degraded && <TriangleAlert className="w-3 h-3 text-amber-400 shrink-0" aria-label="Recently failing" />}
                          <span className="text-[11px] font-semibold truncate">{m.id}</span>
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-primary/70 border border-primary/20 rounded px-1.5 py-0.5 shrink-0">Free</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
{/* Custom model entry */}
            <div className="border-t border-white/10">
              <button
                onClick={() => setShowCustom((v) => !v)}
                aria-expanded={showCustom}
                className="w-full flex items-center justify-between px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-white/40 hover:text-primary transition-all"
              >
                <span className="flex items-center gap-2"><Wrench className="w-3.5 h-3.5" /> Custom model</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showCustom ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showCustom && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-2">
                      <select
                        value={customProvider}
                        onChange={(e) => { setCustomProvider(e.target.value); setCustomError(null); }}
                        aria-label="Custom model provider"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-[11px] text-white outline-none focus:border-primary/40"
                      >
                        {CUSTOM_PROVIDERS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                      </select>
                      <input
                        value={customModel}
                        onChange={(e) => { setCustomModel(e.target.value); setCustomError(null); }}
                        onKeyDown={(e) => { if (e.key === "Enter") handleUseCustom(); }}
                        placeholder={CUSTOM_PROVIDERS.find((p) => p.id === customProvider)?.hint}
                        aria-label="Custom model id"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-[11px] text-white placeholder:text-white/25 outline-none focus:border-primary/40"
                      />
                      {customError && <p className="text-[10px] text-red-400">{customError}</p>}
                      <button
                        onClick={handleUseCustom}
                        className="w-full bg-primary/15 border border-primary/25 text-primary rounded-lg py-2 text-[10px] font-bold uppercase tracking-wide hover:bg-primary/25 transition-all"
                      >
                        Use this model
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {catalog?.generatedAt && (
              <p className="px-4 py-2 border-t border-white/10 text-[9px] uppercase tracking-widest text-white/20">
                Registry synced {syncedLabel(catalog.generatedAt)}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}