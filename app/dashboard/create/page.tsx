"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Sparkles, 
  Image as ImageIcon, 
  ArrowRight,
  Send,
  Zap,
  Trash2,
  Settings,
  X,
  Type,
  Layout,
  Globe,
  Tag,
  Eye,
  CheckCircle2,
  Terminal,
  Loader2,
  Search,
  Hash,
  FileText,
  BarChart
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/toast";
import dynamic from "next/dynamic";
import { PexelsLibrary } from "@/components/editor/pexels-library";
import { ImageUpload } from "@/components/editor/image-upload";
import { XylosLogo } from "@/components/premium/xylos-logo";
import { slugify } from "@/lib/utils/slugify";
import { EditorialErrorBoundary } from "@/components/error-boundary";

const TiptapEditor = dynamic(() => import("@/components/editor/tiptap-editor").then(mod => mod.TiptapEditor), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-muted/20 animate-pulse rounded-[1.5rem] border border-border flex items-center justify-center">
      <span className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Loading Editorial Matrix...</span>
    </div>
  )
});

function CreatePostContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const supabase = createClient();
  
  const [currentPostId, setCurrentPostId] = useState<string | null>(searchParams.get("id"));
  
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [featureImageUrl, setFeatureImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  
  // SEO States
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isAutoSlug, setIsAutoSlug] = useState(true);

  // Auto-sync SEO fields
  useEffect(() => {
    if (isAutoSlug && title) {
      setSlug(slugify(title));
      if (!metaTitle) setMetaTitle(title);
    }
  }, [title, isAutoSlug]);
  
  const [originalStatus, setOriginalStatus] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [assetMode, setAssetMode] = useState<'search' | 'upload'>('search');

  useEffect(() => {
    if (currentPostId) {
      async function fetchPost() {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", currentPostId)
          .single();
        if (data) {
          setTitle(data.title);
          setExcerpt(data.excerpt);
          setContent(data.content);
          
          const standardCategories = ["Technology", "Business", "Politics", "Science", "Sports", "Culture"];
          if (standardCategories.includes(data.category)) {
            setCategory(data.category);
            setIsCustomCategory(false);
          } else {
            setCategory(data.category);
            setIsCustomCategory(true);
          }
          
          setFeatureImageUrl(data.feature_image_url);
          setAltText(data.alt_text || "");
          setSlug(data.slug || "");
          setMetaTitle(data.meta_title || "");
          setMetaDescription(data.meta_description || "");
          setKeywords(data.keywords || "");
          setIsAutoSlug(false); // Don't auto-update when editing existing
          setOriginalStatus(data.status);
        }
      }
      fetchPost();
    }
  }, [currentPostId]);

  const handleGenerateDraft = async () => {
    if (!aiPrompt) {
      showToast("Please enter a prompt for the AI.", "info");
      return;
    }
    setIsGenerating(true);
    showToast("Initializing editorial engines. Synthesizing article...", "success");
    
    try {
      const res = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await res.json();
      
      if (data.success) {
        // Precise state updates
        setTitle(data.post.title);
        setExcerpt(data.post.excerpt);
        setContent(data.post.content);
        setCategory(data.post.category);
        setFeatureImageUrl(data.post.feature_image_url);
        setAltText(data.post.alt_text || "");
        
        // SEO Matrix Sync (Automatic Automation)
        setMetaTitle(data.post.meta_title || data.post.title);
        setMetaDescription(data.post.meta_description || data.post.excerpt);
        setKeywords(data.post.keywords || "");
        
        // Critical: Set the ID so handlePublish knows to update
        if (data.post.id) {
          setCurrentPostId(data.post.id);
          setOriginalStatus(data.post.status);
          setSlug(data.post.slug || slugify(data.post.title));
        }
        
        if (data.warning) {
          showToast(data.warning, "info");
        } else {
          showToast("Post synthesized successfully with full SEO & AI Imagery!", "success");
        }
      } else {
        showToast(data.error || "Editorial sync failed.", "error");
      }
    } catch (err: any) {
      showToast("System crash: " + err.message, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!title || !content) {
      showToast("Title and Content are required to publish.", "error");
      return;
    }
    setIsPublishing(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Authentication failed. Please relogin.");

      const postData: any = {
        title,
        excerpt,
        content,
        category,
        feature_image_url: featureImageUrl,
        alt_text: altText,
        slug: slug || slugify(title),
        meta_title: metaTitle,
        meta_description: metaDescription,
        keywords: keywords,
        updated_at: new Date().toISOString(),
      };

      let query;
      if (currentPostId) {
        query = supabase.from("blogs").update(postData).eq("id", currentPostId);
      } else {
        postData.status = "published";
        postData.published_at = new Date().toISOString();
        postData.author_id = user.id;
        query = supabase.from("blogs").insert(postData).select().single();
      }

      const { data, error } = await query;
      if (error) throw error;
      
      if (!currentPostId && data) {
        setCurrentPostId(data.id);
      }
      
      showToast(currentPostId ? "Asset updated successfully!" : "Article published to archive!", "success");
      router.push("/dashboard/posts");
      // Force refresh data in dashboard
      router.refresh();
    } catch (err: any) {
      showToast("Deployment failed: " + err.message, "error");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card border border-border p-8 rounded-[2.5rem] shadow-sm backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-primary mb-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono">Professional Editorial Editor v3.2</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black font-fustat tracking-tighter uppercase leading-tight">
            Create Editorial <span className="text-primary italic">Masterpiece</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-medium max-w-lg">Advanced strategic journalism engine powered by tiered AI fallbacks.</p>
        </div>
        
        <div className="flex gap-3 relative z-10">
          <button 
            onClick={() => router.push("/dashboard/posts")}
            className="px-6 py-4 rounded-2xl bg-muted/50 border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all flex items-center gap-2 font-bold group"
          >
            <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Discard
          </button>
          <button 
            onClick={handlePublish}
            disabled={isPublishing || isGenerating}
            className="px-8 py-4 rounded-2xl bg-primary text-black font-black hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-neon disabled:opacity-50 disabled:grayscale"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                {currentPostId ? "Save Changes" : "Publish Article"}
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Editor Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 space-y-8 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Type className="w-4 h-4" />
                <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Asset Headline</label>
              </div>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..." 
                className="w-full bg-muted/30 border border-border rounded-[1.5rem] p-6 focus:outline-none focus:ring-2 focus:ring-primary/50 text-2xl lg:text-3xl font-black placeholder:text-muted-foreground/20 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Layout className="w-4 h-4" />
                <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Contextual Summary (Excerpt)</label>
              </div>
              <textarea 
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A concise executive summary for SEO meta tags..." 
                className="w-full bg-muted/30 border border-border rounded-[1.5rem] p-6 focus:outline-none focus:ring-2 focus:ring-primary/50 h-32 resize-none placeholder:text-muted-foreground/20 transition-all leading-relaxed text-sm font-medium shadow-inner"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Terminal className="w-4 h-4" />
                <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Core Narrative (Full Article)</label>
              </div>
              <TiptapEditor content={content} onChange={setContent} />
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Visual Identity Panel */}
          <div className="bg-card border border-border rounded-[2.5rem] p-8 space-y-6 shadow-sm">
            <h3 className="font-black text-lg flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-primary" />
              Visual Asset
            </h3>
            
            <div className="flex p-1 bg-muted/50 rounded-xl">
              <button 
                onClick={() => setAssetMode('search')}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${assetMode === 'search' ? 'bg-primary text-black' : 'text-muted-foreground hover:bg-muted'}`}
              >
                Search
              </button>
              <button 
                onClick={() => setAssetMode('upload')}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${assetMode === 'upload' ? 'bg-primary text-black' : 'text-muted-foreground hover:bg-muted'}`}
              >
                Upload
              </button>
            </div>

            {assetMode === 'search' ? (
              <PexelsLibrary 
                onSelect={(url, alt) => {
                  setFeatureImageUrl(url);
                  setAltText(alt);
                }} 
                currentUrl={featureImageUrl}
              />
            ) : (
              <ImageUpload 
                onUploadComplete={(url) => setFeatureImageUrl(url)}
                onClear={() => setFeatureImageUrl("")}
                currentUrl={featureImageUrl}
              />
            )}

            {featureImageUrl && (
              <div className="space-y-3 pt-2 border-t border-border">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Alt Description</label>
                <input 
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe image for SEO..." 
                  className="w-full bg-muted/30 border border-border rounded-xl py-2 px-3 text-[10px] font-medium focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            )}
          </div>
          {/* AI Integration Panel */}
          <div className="bg-gradient-to-br from-primary/10 via-background to-transparent border border-primary/20 rounded-[2.5rem] p-8 space-y-6 backdrop-blur-xl relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="w-20 h-20 text-primary" />
            </div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-black text-lg">AI Co-Author</h3>
            </div>

            <div className="space-y-4 relative z-10">
              <textarea 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Briefly describe the story topic (e.g., 'The future of clean energy in the Himalayas')..." 
                className="w-full bg-background/50 border border-border rounded-2xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 h-32 resize-none placeholder:text-muted-foreground/30 font-medium leading-relaxed"
              />
              <button 
                onClick={handleGenerateDraft}
                disabled={isGenerating || isPublishing}
                className="w-full bg-primary text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 shadow-neon"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    Synthesizing...
                  </>
                ) : (
                  <>
                    Generate Narrative
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-black" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SEO Matrix Panel */}
          <div className="bg-card border border-border rounded-[2.5rem] p-8 space-y-6 shadow-sm">
            <h3 className="font-black text-lg flex items-center gap-3">
              <BarChart className="w-5 h-5 text-primary" />
              SEO Matrix
            </h3>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    Permalinks (Slug)
                  </label>
                  <button 
                    onClick={() => setIsAutoSlug(!isAutoSlug)}
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${isAutoSlug ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-muted border-border text-muted-foreground'}`}
                  >
                    {isAutoSlug ? 'Auto' : 'Manual'}
                  </button>
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-mono text-xs">/blog/</span>
                  <input 
                    value={slug}
                    onChange={(e) => {
                      setSlug(slugify(e.target.value));
                      setIsAutoSlug(false);
                    }}
                    placeholder="clean-url-slug" 
                    className="w-full bg-muted/30 border border-border rounded-xl py-3 pl-16 pr-4 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <p className="text-[9px] text-muted-foreground italic px-2">* Guaranteed number-free for maximum SEO authority.</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Search className="w-3 h-3" />
                    Meta Title
                  </label>
                  <span className={`text-[9px] font-bold ${metaTitle.length > 60 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {metaTitle.length}/60
                  </span>
                </div>
                <input 
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Enter SEO title..." 
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    Meta Description
                  </label>
                  <span className={`text-[9px] font-bold ${metaDescription.length > 160 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {metaDescription.length}/160
                  </span>
                </div>
                <textarea 
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Summarize for Google snippets..." 
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none h-20"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Hash className="w-3 h-3" />
                  Keywords
                </label>
                <input 
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="comma, separated, keywords" 
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreatePostPage() {
  return (
    <EditorialErrorBoundary name="Article Creation Engine">
      <Suspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Initializing Editorial Engine...</span>
        </div>
      }>
        <CreatePostContent />
      </Suspense>
    </EditorialErrorBoundary>
  );
}
