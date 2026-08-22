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
import Image from "next/image";
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
      // Get current user and their profile (role)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPosts([]);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

      let query = supabase.from("blogs").select("*");

      // If NOT admin, only fetch OWN blogs
      if (!isAdmin) {
        query = query.eq("author_id", user.id);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

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

      // Check role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      
      const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

      let query = supabase
        .from("blogs")
        .update({ status: newStatus })
        .eq("id", post.id);

      // If NOT admin, only allow own
      if (!isAdmin) {
        query = query.eq("author_id", user.id);
      }

      const { error } = await query;

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

      // Check role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      
      const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

      let query = supabase
        .from("blogs")
        .delete()
        .eq("id", postToDelete.id);

      // If NOT admin, only allow own
      if (!isAdmin) {
        query = query.eq("author_id", user.id);
      }

      const { error } = await query;

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

  // ── Pagination ──
  const POSTS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));

  // Reset to page 1 whenever search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Clamp page if it goes out of range (e.g. after deletion)
  const safePage = Math.min(page, totalPages);
  const paginatedPosts = filteredPosts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE
  );

  const goToPage = (p: number) => {
    setPage(Math.max(1, Math.min(totalPages, p)));
    // Scroll table into view on page change
    document.getElementById('stories-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Build page numbers with ellipsis: 1 … 4 5 6 … 12
  const getPageNumbers = (): (number | '…')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '…')[] = [1];
    let start = Math.max(2, safePage - 1);
    let end = Math.min(totalPages - 1, safePage + 1);
    if (start > 2) pages.push('…');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('…');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 pt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Layers className="w-4 h-4 animate-pulse" />
            <h1 className="text-4xl lg:text-5xl font-black font-sora tracking-tighter uppercase leading-none text-white">Content <span className="text-primary italic">Archive</span></h1>
          </div>
        </div>
        
        <Link 
          href="/dashboard/create"
          className="group flex items-center gap-4 bg-primary text-[#04141a] px-10 py-5 rounded-xl font-semibold text-xs uppercase tracking-wide hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Draft New Story
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 glass-card p-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 transition-colors group-focus-within:text-primary" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search stories by title or category"
            placeholder="Search stories by title or category..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium placeholder:text-white/20 text-white"
          />
        </div>
        <button 
          onClick={fetchPosts}
          disabled={loading}
          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/40 hover:text-white disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Content Feed Table */}
      <div className="glass-card overflow-hidden" id="stories-table">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-10 py-8 text-[10px] font-semibold text-white/40 uppercase tracking-wide">Status</th>
                <th className="px-8 py-8 text-[10px] font-semibold text-white/40 uppercase tracking-wide">Asset Details</th>
                <th className="px-8 py-8 text-[10px] font-semibold text-white/40 uppercase tracking-wide">Taxonomy</th>
                <th className="px-10 py-8 text-[10px] font-semibold text-white/40 uppercase tracking-wide text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-10 py-12 text-center text-white/15 font-mono text-[10px] uppercase tracking-[0.4em] italic">
                      Scanning Archive Buffer Protocol...
                    </td>
                  </tr>
                ))
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-white">Story Archive Empty</p>
                      <Link href="/dashboard/create" className="text-xs text-primary font-bold hover:underline">Draft your first story →</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((post) => (
                  <tr key={post.id} className="group hover:bg-white/[0.03] transition-colors">
                    <td className="px-10 py-5">
                      <div className={`
                        inline-flex items-center gap-3 px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all
                        ${post.status === 'published' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/5 text-white/40 border border-white/10'}
                      `}>
                        <span className={`w-2 h-2 rounded-full animate-pulse ${post.status === 'published' ? 'bg-primary' : 'bg-white/30'}`}></span>
                        {post.status}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-8">
                        <div className="relative w-28 aspect-video rounded-xl bg-white/5 overflow-hidden border border-white/10 flex-shrink-0 group-hover:scale-105 transition-all duration-700">
                          {post.feature_image_url ? (
                            <Image 
                              src={post.feature_image_url} 
                              alt={post.title} 
                              fill
                              className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
                            />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center">
                               <div className="bg-gradient-to-br from-primary/10 to-primary/30 w-full h-full opacity-20" />
                               <ImageIcon className="absolute w-5 h-5 text-white/30" />
                            </div>
                          )}
                        </div>
                        <div className="max-w-md">
                          <div className="font-black text-base text-white group-hover:text-primary transition-colors leading-tight line-clamp-1 mb-1 uppercase tracking-tight">{post.title}</div>
                          <div className="text-[9px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                             <span className="w-1.5 h-px bg-white/10" />
                             SERIAL_{post.id.substring(0, 8).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="inline-flex items-center px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-all">
                        {post.category}
                      </div>
                    </td>
                    <td className="px-10 py-5">
                       <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => toggleStatus(post)}
                            className={`p-3.5 rounded-xl border border-white/10 transition-all group/btn ${post.status === 'published' ? 'bg-white/5 hover:bg-white/10 text-white/60' : 'bg-primary/10 hover:bg-primary text-primary hover:text-[#04141a]'}`}
                            title={post.status === 'published' ? "Unpublish Protocol" : "Deploy Protocol"}
                          >
                             {post.status === 'published' ? <EyeOff className="w-4 h-4 opacity-70 group-hover/btn:opacity-100" /> : <Eye className="w-4 h-4 opacity-70 group-hover/btn:opacity-100" />}
                          </button>
                          <a 
                            href={`/blog/${post.slug || post.id}`} 
                            target="_blank"
                            className="p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-primary hover:text-black transition-all group/btn"
                            title="View Public"
                          >
                             <ExternalLink className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                          </a>
                          <Link 
                            href={`/dashboard/create?id=${post.id}`} 
                            className="p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-primary hover:text-black transition-all group/btn"
                            title="Refine Story"
                          >
                             <Edit2 className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                          </Link>
                          <button 
                            onClick={() => handleDeleteClick(post)}
                            className="p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-red-500 hover:text-white transition-all group/btn"
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

        {/* Pagination Footer */}
        {!loading && filteredPosts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-6 border-t border-white/10">
            <p className="text-[11px] text-white/30 font-medium tracking-wide">
              Showing {(safePage - 1) * POSTS_PER_PAGE + 1}–{Math.min(safePage * POSTS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} stories
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage <= 1}
                aria-label="Previous page"
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                Prev
              </button>
              {getPageNumbers().map((p, i) =>
                p === '…' ? (
                  <span key={`e${i}`} className="px-2 text-white/25 text-xs select-none">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    aria-current={safePage === p ? 'page' : undefined}
                    className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                      safePage === p
                        ? 'bg-primary text-[#04141a] shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                        : 'bg-white/5 border border-white/10 text-white/50 hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage >= totalPages}
                aria-label="Next page"
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                Next
              </button>
            </div>
          </div>
        )}
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
