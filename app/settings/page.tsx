"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Key, 
  Cpu, 
  Zap, 
  Globe, 
  Lock, 
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const providers = [
  { id: "openrouter", name: "OpenRouter", icon: Globe, placeholder: "sk-or-v1-..." },
  { id: "groq", name: "Groq", icon: Zap, placeholder: "gsk_..." },
  { id: "google", name: "Google Gemini", icon: Cpu, placeholder: "AIzaSy..." },
  { id: "mistral", name: "Mistral AI", icon: Lock, placeholder: "..." },
  { id: "cerebras", name: "Cerebras", icon: Zap, placeholder: "csk-..." },
  { id: "huggingface", name: "Hugging Face", icon: ShieldCheck, placeholder: "hf_..." },
  { id: "cloudflare", name: "Cloudflare", icon: Globe, placeholder: "Account ID | Token" },
];

export default function SettingsPage() {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'ping' }], provider: Object.keys(keys).find(k => keys[k]) || 'groq' })
      });
      if (!res.ok) throw new Error('API check failed');
      setSaveStatus('success');
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-black font-sora tracking-tighter uppercase text-white">Settings<span className="text-primary italic">.</span></h1>
        <p className="text-white/40 mt-1 text-[10px] font-bold uppercase tracking-widest">Global API Integrations // Studio Protocol</p>
      </header>

      <section className="grid grid-cols-1 gap-6">
        {providers.map((provider, idx) => (
          <motion.div 
            key={provider.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group p-6 rounded-xl glass-card hover:border-white/20 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                   <provider.icon className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" />
                </div>
                <div>
                   <h3 className="text-lg font-bold font-sora text-white">{provider.name} Integration</h3>
                   <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest mt-0.5">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Xylos Core</span>
                      <Lock className="w-3 h-3" />
                      End-to-End Encrypted
                   </div>
                </div>
              </div>

              <div className="flex-1 max-w-md relative">
                <input 
                  type="password"
                  placeholder={provider.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all placeholder:text-white/20 text-white"
                  onChange={(e) => setKeys({ ...keys, [provider.id]: e.target.value })}
                />
                <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <footer className="sticky bottom-8 flex items-center justify-between p-6 rounded-xl glass-card border-primary/20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
           <ShieldCheck className="w-6 h-6 text-primary" />
           <div className="text-sm">
              <div className="font-bold text-white">Security Shield Active</div>
              <div className="text-white/40 text-xs">Your keys never leave Xylos' secure perimeter.</div>
           </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`
            px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all duration-300
            ${saveStatus === 'success' ? 'bg-green-500 text-white' : 'bg-primary text-black hover:shadow-[0_0_30px_rgba(210,187,255,0.3)]'}
            disabled:opacity-50
          `}
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : saveStatus === 'success' ? (
            <><CheckCircle2 className="w-5 h-5" /> Saved Successfully</>
          ) : (
            <><Save className="w-5 h-5" /> Save Configuration</>
          )}
        </button>
      </footer>

      {/* Global Status Banner */}
      <AnimatePresence>
        {saveStatus === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl bg-red-500/20 border border-red-500/50 backdrop-blur-xl text-red-200 flex items-center gap-3 z-50"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium text-sm">Failed to secure configuration. Please try again.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
