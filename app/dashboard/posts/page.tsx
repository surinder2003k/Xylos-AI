"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ExternalLink,
  BookOpen,
  RefreshCcw,
  Image as ImageIcon,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/toast";
import { ConfirmationModal } from "@/components/ui/modal";
import { formatIST } from "@/lib/utils/date-format";

export default function AllStoriesPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { showToast } = useToast();
  const supabase = createClient();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Get current user first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPosts([]);
        return;
      }

      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("author_id", user.id)  // ← Only fetch THIS user's blogs
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err: any) {
      showToast("Failed to fetch stories: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeleteClick = (post: any) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  const toggleStatus = async (post: any) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("blogs")
        .update({ status: newStatus })
        .eq("id", post.id)
        .eq("author_id", user.id);  // ← Security: only own posts

      if (error) throw error;
      
      setPosts(posts.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
      showToast(`Article status updated to ${newStatus}.`, "success");
    } catch (err: any) {
      showToast("Status update failed: " + err.message, "error");
    }
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", postToDelete.id)
        .eq("author_id", user.id);  // ← Security: only own posts

      if (error) throw error;
      
      setPosts(posts.filter(p => p.id !== postToDelete.id));
      showToast("Story removed from archive.", "success");
    } catch (err: any) {
      showToast("Deletion failed: " + err.message, "error");
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 pt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Layers className="w-4 h-4 animate-pulse" />
            <h1 className="text-4xl lg:text-5xl font-black font-fustat tracking-tighter uppercase leading-none">Content <span className="text-primary italic">Archive</span></h1>
          </div>
        </div>
        
        <Link 
          href="/dashboard/create"
          className="group flex items-center gap-4 bg-foreground text-background px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Draft New Story
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-[2rem] shadow-sm backdrop-blur-xl">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories by title or category..." 
            className="w-full bg-muted/30 border border-border rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium placeholder:text-muted-foreground/30 shadow-inner"
          />
        </div>
        <button 
          onClick={fetchPosts}
          disabled={loading}
          className="p-4 rounded-2xl bg-muted/50 border border-border hover:bg-muted transition-all text-muted-foreground hover:text-foreground shadow-sm disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Content Feed Table */}
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-10 py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Status</th>
                <th className="px-8 py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Asset Details</th>
                <th className="px-8 py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Taxonomy</th>
                <th className="px-10 py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-10 py-12 text-center text-muted-foreground/30 font-mono text-[10px] uppercase tracking-[0.4em] italic">
                      Scanning Archive Buffer Protocol...
                    </td>
                  </tr>
                ))
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <BookOpen className="w-8 h-8" />
                      </div>
                      <p className="text-xs font-black uppercase tracking-[0.3em]">Story Archive Empty</p>
                      <Link href="/dashboard/create" className="text-xs text-primary font-bold hover:underline">Draft your first story →</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-10 py-5">
                      <div className={`
                        inline-flex items-center gap-3 px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all
                        ${post.status === 'published' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}
                      `}>
                        <span className={`w-2 h-2 rounded-full animate-pulse ${post.status === 'published' ? 'bg-primary shadow-sm' : 'bg-orange-500 shadow-sm'}`}></span>
                        {post.status}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-8">
                        <div className="relative w-28 aspect-video rounded-xl bg-muted overflow-hidden border border-border shadow-inner flex-shrink-0 group-hover:scale-105 transition-all duration-700">
                          {post.feature_image_url ? (
                            <img src={post.feature_image_url} alt={post.title} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center">
                               <div className="bg-gradient-to-br from-primary/10 to-primary/30 w-full h-full opacity-20" />
                               <ImageIcon className="absolute w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="max-w-md">
                          <div className="font-black text-base text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-1 mb-1 uppercase tracking-tight">{post.title}</div>
                          <div className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest flex items-center gap-2">
                             <span className="w-1.5 h-px bg-border" />
                             SERIAL_{post.id.substring(0, 8).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="inline-flex items-center px-4 py-2 rounded-xl bg-muted/50 border border-border text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-all">
                        {post.category}
                      </div>
                    </td>
                    <td className="px-10 py-5">
                       <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => toggleStatus(post)}
                            className={`p-3.5 rounded-xl border border-border shadow-sm transition-all group/btn ${post.status === 'published' ? 'bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white' : 'bg-primary/10 hover:bg-primary text-primary hover:text-black'}`}
                            title={post.status === 'published' ? "Unpublish Protocol" : "Deploy Protocol"}
                          >
                             {post.status === 'published' ? <EyeOff className="w-4 h-4 opacity-70 group-hover/btn:opacity-100" /> : <Eye className="w-4 h-4 opacity-70 group-hover/btn:opacity-100" />}
                          </button>
                          <a 
                            href={`/blog/${post.slug || post.id}`} 
                            target="_blank"
                            className="p-3.5 rounded-xl border border-border bg-card hover:bg-foreground hover:text-background transition-all group/btn shadow-sm"
                            title="View Public"
                          >
                             <ExternalLink className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                          </a>
                          <Link 
                            href={`/dashboard/create?id=${post.id}`} 
                            className="p-3.5 rounded-xl border border-border bg-card hover:bg-primary hover:text-black transition-all group/btn shadow-sm"
                            title="Refine Story"
                          >
                             <Edit2 className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                          </Link>
                          <button 
                            onClick={() => handleDeleteClick(post)}
                            className="p-3.5 rounded-xl border border-border bg-card hover:bg-destructive hover:text-destructive-foreground transition-all group/btn shadow-sm"
                            title="Decommission Story"
                          >
                             <Trash2 className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="REMOVE FROM ARCHIVE?"
        message={`Confirm the permanent removal of "${postToDelete?.title}" from the editorial archive. This action is irreversible.`}
        confirmText="DELETE"
        cancelText="KEEP"
      />
    </div>
  );
}
