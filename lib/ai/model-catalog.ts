/**
 * Live free-model catalog for the chat model picker.
 *
 * Each configured provider's public models endpoint is fetched directly, so
 * the picker always reflects what the provider actually serves today: models
 * that get deprecated or unlisted drop off automatically, and new free models
 * appear without any code change. Results are cached in-memory for 1h.
 *
 * Every chat attempt is recorded (recordModelResult) so models that keep
 * failing at call time get flagged `degraded` for the picker.
 */

export type CatalogModel = {
  id: string;
  name?: string;
  degraded?: boolean;
};

export type CatalogProvider = {
  id: string;
  label: string;
  models: CatalogModel[];
};

export type ModelCatalog = {
  generatedAt: string;
  providers: CatalogProvider[];
  fallback?: boolean;
};

type ProviderDefinition = {
  id: string;
  label: string;
  /** env vars that must all be present for the provider to be listed */
  envKeys: string[];
  fetch: () => Promise<CatalogModel[]>;
};

/** Text-only exclusions shared across providers (ids / names). */
const NON_CHAT_ID = /(whisper|distil-whisper|\btts\b|speech|audio|voice|playai|guard|embedding|embed-|-embed|moderation|rerank|image|diffusion|sdxl|inpainting|video|lyria|imagen|veo)/i;

const OPENAI_LIKE_MODELS_URLS: Record<string, string> = {
  groq: "https://api.groq.com/openai/v1/models",
  mistral: "https://api.mistral.ai/v1/models",
  cerebras: "https://api.cerebras.ai/v1/models",
};

const API_KEY_ENV: Record<string, string> = {
  groq: "GROQ_API_KEY",
  mistral: "MISTRAL_API_KEY",
  cerebras: "CEREBRAS_API_KEY",
};

async function fetchJson(url: string, init: RequestInit = {}, timeoutMs = 8000): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url).hostname}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchOpenAiLike(provider: "groq" | "mistral" | "cerebras"): Promise<CatalogModel[]> {
  const key = process.env[API_KEY_ENV[provider]];
  const data = await fetchJson(OPENAI_LIKE_MODELS_URLS[provider], {
    headers: { Authorization: `Bearer ${key}` },
  });
  return (data?.data ?? [])
    .map((m: any) => String(m?.id || ""))
    .filter(Boolean)
    .filter((id: string) => !NON_CHAT_ID.test(id))
    .sort()
    .map((id: string) => ({ id }));
}

async function fetchGemini(): Promise<CatalogModel[]> {
  const key = process.env.GOOGLE_GEMINI_API_KEY;
  const data = await fetchJson(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
  return (data?.models ?? [])
    .filter((m: any) => Array.isArray(m?.supportedGenerationMethods)
      && m.supportedGenerationMethods.includes("generateContent"))
    .map((m: any) => ({
      id: String(m.name || "").replace(/^models\//, ""),
      name: typeof m.displayName === "string" ? m.displayName : undefined,
    }))
    .filter((m: any) => m.id && !NON_CHAT_ID.test(m.id))
    .sort((a: any, b: any) => a.id.localeCompare(b.id));
}

async function fetchOpenRouter(): Promise<CatalogModel[]> {
  const data = await fetchJson("https://openrouter.ai/api/v1/models");
  return (data?.data ?? [])
    .filter((m: any) => {
      const id = String(m?.id || "");
      if (!id) return false;
      // Only genuinely free entries: ":free" suffix or zero prompt pricing.
      const isFree = id.endsWith(":free") || m?.pricing?.prompt === "0";
      if (!isFree) return false;
      if (NON_CHAT_ID.test(id)) return false;
      // Must be able to output text (drops image/audio generation models).
      const modality = m?.architecture?.modality;
      if (typeof modality === "string" && modality.length > 0 && !modality.includes("->text")) return false;
      return true;
    })
    .map((m: any) => ({
      id: String(m.id),
      name: typeof m.name === "string" && m.name ? m.name : undefined,
    }))
    .sort((a: any, b: any) => a.id.localeCompare(b.id));
}

async function fetchCloudflare(): Promise<CatalogModel[]> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const data = await fetchJson(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/models/search`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return (data?.result?.models ?? [])
    .map((item: any) => {
      const id = typeof item === "string" ? item : String(item?.model ?? item?.id ?? "");
      const taskRaw = typeof item?.task === "string" ? item.task : (item?.task?.name ?? item?.task?.id ?? "");
      const name = typeof item?.name === "string" && item.name ? item.name : undefined;
      return { id, task: String(taskRaw), name };
    })
    .filter((m: any) => m.id && m.id.startsWith("@"))
    .filter((m: any) => (m.task ? /text|conversational/i.test(m.task) : true))
    .filter((m: any) => !NON_CHAT_ID.test(m.id))
    .sort((a: any, b: any) => a.id.localeCompare(b.id))
    .map((m: any) => ({ id: m.id, name: m.name }));
}

const PROVIDERS: ProviderDefinition[] = [
  { id: "groq", label: "Groq", envKeys: ["GROQ_API_KEY"], fetch: () => fetchOpenAiLike("groq") },
  { id: "gemini", label: "Gemini", envKeys: ["GOOGLE_GEMINI_API_KEY"], fetch: fetchGemini },
  { id: "openrouter", label: "OpenRouter", envKeys: ["OPENROUTER_API_KEY"], fetch: fetchOpenRouter },
  { id: "mistral", label: "Mistral", envKeys: ["MISTRAL_API_KEY"], fetch: () => fetchOpenAiLike("mistral") },
  { id: "cerebras", label: "Cerebras", envKeys: ["CEREBRAS_API_KEY"], fetch: () => fetchOpenAiLike("cerebras") },
  { id: "cloudflare", label: "Cloudflare", envKeys: ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN"], fetch: fetchCloudflare },
];

/** Known-good static list used only when every live fetch fails. */
const FALLBACK_CATALOG: CatalogProvider[] = [
  { id: "groq", label: "Groq", models: [{ id: "openai/gpt-oss-120b" }, { id: "llama-3.3-70b-versatile" }] },
  { id: "gemini", label: "Gemini", models: [{ id: "gemini-3.6-flash" }] },
  { id: "openrouter", label: "OpenRouter", models: [{ id: "nvidia/nemotron-3-super-120b-a12b:free" }] },
  { id: "mistral", label: "Mistral", models: [{ id: "mistral-medium-latest" }] },
  { id: "cerebras", label: "Cerebras", models: [{ id: "gpt-oss-120b" }] },
  { id: "cloudflare", label: "Cloudflare", models: [{ id: "@cf/meta/llama-3-8b-instruct" }] },
];

// ---------------------------------------------------------------------------
// Health memory (best-effort, per server instance): models that fail chat
// attempts repeatedly are flagged degraded in the picker until they recover.
// ---------------------------------------------------------------------------

type HealthEntry = { fails: number; lastFail: number; lastOk: number };
const DEGRADED_FAILS = 2;
const DEGRADED_WINDOW_MS = 15 * 60 * 1000;

const health = new Map<string, HealthEntry>();

function healthKey(provider: string, model: string) {
  return `${provider}::${model}`;
}

export function recordModelResult(provider: string, model: string, ok: boolean) {
  if (!provider || !model) return;
  const key = healthKey(provider, model);
  const now = Date.now();
  const entry = health.get(key) ?? { fails: 0, lastFail: 0, lastOk: 0 };
  if (ok) {
    entry.fails = 0;
    entry.lastOk = now;
  } else {
    entry.fails += 1;
    entry.lastFail = now;
  }
  health.set(key, entry);
}

function isDegraded(provider: string, model: string): boolean {
  const entry = health.get(healthKey(provider, model));
  if (!entry) return false;
  const now = Date.now();
  return (
    entry.fails >= DEGRADED_FAILS &&
    now - entry.lastFail < DEGRADED_WINDOW_MS &&
    entry.lastOk < entry.lastFail
  );
}

// ---------------------------------------------------------------------------
// Catalog cache
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 60 * 60 * 1000; // 1h
let cache: { at: number; data: ModelCatalog } | null = null;

export async function getModelCatalog(refresh = false): Promise<ModelCatalog> {
  if (!refresh && cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.data;
  }

  const configured = PROVIDERS.filter((p) => p.envKeys.every((k) => Boolean(process.env[k])));
  const settled = await Promise.allSettled(configured.map((p) => p.fetch()));

  const providers: CatalogProvider[] = [];
  settled.forEach((result, index) => {
    const def = configured[index];
    if (result.status === "fulfilled" && Array.isArray(result.value) && result.value.length > 0) {
      providers.push({
        id: def.id,
        label: def.label,
        models: result.value.map((m) => ({ ...m, degraded: isDegraded(def.id, m.id) })),
      });
    } else if (result.status === "rejected") {
      const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
      console.warn(`[ModelCatalog] ${def.id} list fetch failed: ${reason}`);
    }
  });

  const catalog: ModelCatalog = providers.length > 0
    ? { generatedAt: new Date().toISOString(), providers }
    : { generatedAt: new Date().toISOString(), providers: FALLBACK_CATALOG, fallback: true };

  cache = { at: Date.now(), data: catalog };
  return catalog;
}

