import { createClient } from "@/utils/supabase/server";
import dynamic from "next/dynamic";

const ProfileNameForm = dynamic(
  () => import("@/components/profile-name-form").then((mod) => mod.ProfileNameForm),
  { ssr: false }
);

interface ProfileData {
  user_id: string;
  full_name: string | null;
  email: string | null;
}

async function getProfile(): Promise<ProfileData | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id, full_name")
    .eq("user_id", user.id)
    .maybeSingle();
  return {
    user_id: user.id,
    full_name: profile?.full_name || null,
    email: user.email || null,
  };
}

export default async function SettingsPage() {
  const profile = await getProfile();

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <section className="p-6 rounded-xl editorial-card border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>Profile<span className="text-primary">.</span></h2>
            <p className="text-sm" style={{ color: '#8d8b85' }}>{profile?.email || "Not logged in"}</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <ProfileNameForm userId={profile?.user_id || ""} currentName={profile?.full_name || ""} />
          </div>
        </div>
      </section>

      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-[-0.02em] text-white" style={{ fontFamily: 'Sora, sans-serif' }}>API Settings<span className="text-primary">.</span></h1>
        <p className="text-sm mt-1" style={{ color: '#8d8b85' }}>Global API integrations</p>
      </header>

      <section className="grid grid-cols-1 gap-6">
        {[
          { id: "openrouter", name: "OpenRouter", placeholder: "sk-or-v1-..." },
          { id: "groq", name: "Groq", placeholder: "gsk_..." },
          { id: "google", name: "Google Gemini", placeholder: "AIzaSy..." },
          { id: "mistral", name: "Mistral AI", placeholder: "..." },
          { id: "cerebras", name: "Cerebras", placeholder: "csk-..." },
          { id: "huggingface", name: "Hugging Face", placeholder: "hf_..." },
          { id: "cloudflare", name: "Cloudflare", placeholder: "Account ID | Token" },
        ].map((provider) => (
          <div key={provider.id} className="group p-6 rounded-xl editorial-card hover:border-[rgba(54,183,176,0.18)] transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                   🔑
                </div>
                <div>
                   <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{provider.name} integration</h3>
                   <div className="flex items-center gap-2 text-[12px] mt-0.5" style={{ color: '#8d8b85' }}>
                      🔒 End-to-end encrypted
                   </div>
                </div>
              </div>
              <div className="flex-1 max-w-md relative">
                <input
                  type="password"
                  placeholder={provider.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all placeholder:text-white/20 text-white"
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      <footer className="sticky bottom-8 flex items-center justify-between p-6 rounded-xl editorial-card border-primary/20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
           🛡️
           <div className="text-sm">
              <div className="font-semibold text-white">Security shield active</div>
              <div className="text-white/40 text-xs">Your keys never leave Xylos' secure perimeter.</div>
           </div>
        </div>
        <button className="px-8 py-3 rounded-xl font-semibold bg-primary text-[#17181b] hover:bg-[#4accc4] transition-all">
          💾 Save Configuration
        </button>
      </footer>
    </div>
  );
}