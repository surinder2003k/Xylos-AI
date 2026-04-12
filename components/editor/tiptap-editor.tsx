"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu as BubbleMenuComponent } from "@tiptap/react/menus";
import { motion, AnimatePresence } from "framer-motion";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Dropcursor from "@tiptap/extension-dropcursor";
import ResizableImage from "tiptap-extension-resize-image";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  Image as ImageIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Code,
  Type,
  ChevronDown,
  Check,
  FileText,
  X,
  Plus,
  Loader2,
  Strikethrough,
  Palette,
  Underline as UnderlineIcon
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { CustomModal } from "../ui/custom-modal";
import { useToast } from "@/components/ui/toast";
import { useTheme } from "next-themes";

// Custom extension to allow dynamic 'rel' attribute toggling for SEO
const CustomLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      href: {
        default: null,
      },
      target: {
        default: this.options.HTMLAttributes.target,
      },
      rel: {
        default: 'noopener noreferrer', // Safe default
      },
    };
  },
});

const CustomResizableImage = ResizableImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    };
  },
});

const ToolbarButton = ({ onClick, isActive, icon: Icon, title, className = "" }: any) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2.5 rounded-xl transition-all duration-300 group relative ${
      isActive 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
        : "text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
    } ${className}`}
  >
    <Icon className={`w-4 h-4 ${isActive ? "animate-pulse" : "group-hover:rotate-6 transition-transform"}`} />
  </button>
);

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: "info" | "success" | "warning" | "error";
  }>({
    isOpen: false,
    title: "",
    description: "",
    type: "info",
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { showToast } = useToast();

  // Custom Prompt States
  const [linkEditor, setLinkEditor] = useState({ isOpen: false, url: '', isNofollow: false });
  const [metadataEditor, setMetadataEditor] = useState({ 
    isOpen: false, 
    alt: '', 
    title: '',
    callback: (data: { alt: string; title: string } | null) => {} 
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        dropcursor: false,
      }),
      TextStyle,
      Underline,
      Color,
      CustomLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'neural-link cursor-pointer text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all',
        },
      }),
      Placeholder.configure({
        placeholder: "The workspace is ready. Compose your story...",
      }),
      CustomResizableImage.configure({
        HTMLAttributes: {
          class: 'neural-resizable-image rounded-2xl border border-border bg-muted/20 shadow-2xl my-8 mx-auto block max-w-full h-auto',
        },
      }),
      Dropcursor.configure({
        color: 'oklch(var(--p))',
        width: 2,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `focus:outline-none min-h-[500px] p-8 leading-relaxed font-medium transition-colors duration-300 ${
          mounted && resolvedTheme === 'dark' ? 'prose prose-invert prose-p:text-white/70' : 'prose prose-neutral'
        } max-w-none`,
      },
    },
  });

  // Precise Reactive Sync for AI updates
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Use a more robust check for external updates (e.g. AI generation)
      // Only sync if the change is significant or the editor is empty
      const currentLength = editor.getText().length;
      if (content === "" || Math.abs(content.length - editor.getHTML().length) > 2) {
        editor.commands.setContent(content, { emitUpdate: false }); // false to not add to history
      }
    }
  }, [content, editor]);

  if (!editor || !mounted) return (
    <div className="w-full h-[500px] bg-muted/20 animate-pulse rounded-2xl border border-border flex items-center justify-center">
      <span className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Preparing editorial workspace...</span>
    </div>
  );

  const wordCount = editor.getText().split(/\s+/).filter(w => w.length > 0).length;
  const charCount = editor.getText().length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const setLink = () => {
    // Determine if we're dealing with an image or text
    const isImage = editor.isActive('image');
    const previousUrl = isImage 
      ? (editor.getAttributes('image').href || '')
      : (editor.getAttributes('link').href || '');
      
    setLinkEditor({ isOpen: true, url: previousUrl, isNofollow: false });
  };

  const applyLink = () => {
    if (editor.isActive('image')) {
      // Apply to image
      editor.chain().focus().updateAttributes('image', { 
        href: linkEditor.url 
      }).run();
    } else {
      // Apply to text
      if (linkEditor.url) {
        editor.chain().focus().extendMarkRange('link').setLink({ 
          href: linkEditor.url,
          target: '_blank',
          rel: linkEditor.isNofollow ? 'nofollow noopener noreferrer' : 'dofollow noopener noreferrer'
        }).run();
      } else {
        editor.chain().focus().unsetLink().run();
      }
    }
    setLinkEditor((prev) => ({ ...prev, isOpen: false }));
  };

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    // Neural Protocol: Asset Validation
    if (!file.type.startsWith("image/")) {
      setModalConfig({
        isOpen: true,
        title: "Asset Rejection",
        description: "Invalid asset type detected. All editorial assets must be valid image formats for narrative alignment.",
        type: "error"
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `editor-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      // Trigger Custom Metadata UI
      setMetadataEditor({
        isOpen: true,
        alt: '',
        title: '',
        callback: (data) => {
          editor.chain().focus().setImage({ 
            src: publicUrl, 
            alt: data?.alt || '',
            title: data?.title || ''
          }).run();
        }
      });
    } catch (err: any) {
      console.error("Asset Synthesis Failure:", err);
      
      // Detailed Neural Diagnostic
      let diagnosticMsg = "The platform could not synchronize this asset to the core matrix. Please check your connection.";
      if (err.message?.includes("bucket")) {
        diagnosticMsg = "Storage infrastructure (bucket) not found or inaccessible. Please verify 'blog-images' bucket in Supabase.";
      } else if (err.status === 403 || err.message?.includes("Permission")) {
        diagnosticMsg = "Access Denied: You do not have permission to upload to the neural matrix. Ensure you are logged in with administrative rights.";
      } else if (err.message?.includes("size")) {
        diagnosticMsg = "Asset Rejection: The file size exceeds the platform's core limits.";
      }

      setModalConfig({
        isOpen: true,
        title: "Synchronization Error",
        description: diagnosticMsg,
        type: "error"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const setMetadata = () => {
    if (!editor.isActive('image')) return;
    const attrs = editor.getAttributes('image');
    setMetadataEditor({
      isOpen: true,
      alt: attrs.alt || '',
      title: attrs.title || '',
      callback: (data) => {
        if (data !== null) {
          editor.chain().focus().updateAttributes('image', { 
            alt: data.alt,
            title: data.title 
          }).run();
        }
      }
    });
  };

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm shadow-sm flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-border bg-muted/30 backdrop-blur-md sticky top-0 z-20">
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          isActive={editor.isActive('bold')}
          icon={Bold}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          isActive={editor.isActive('italic')}
          icon={Italic}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()} 
          isActive={editor.isActive('underline')}
          icon={UnderlineIcon}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleStrike().run()} 
          isActive={editor.isActive('strike')}
          icon={Strikethrough}
        />
        
        <div className="w-px h-4 bg-border mx-1" />

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          isActive={editor.isActive('heading', { level: 1 })}
          icon={Heading1}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          isActive={editor.isActive('heading', { level: 2 })}
          icon={Heading2}
        />
        
        <div className="w-px h-4 bg-border mx-1" />

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          isActive={editor.isActive('bulletList')}
          icon={List}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          isActive={editor.isActive('orderedList')}
          icon={ListOrdered}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          isActive={editor.isActive('blockquote')}
          icon={Quote}
        />

        <div className="w-px h-4 bg-border mx-1" />

        <ToolbarButton 
          onClick={setLink} 
          isActive={editor.isActive('link')}
          icon={LinkIcon}
        />
        <ToolbarButton 
          onClick={addImage} 
          isActive={editor.isActive('image')}
          icon={ImageIcon}
        />
        {editor.isActive('image') && (
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg border border-primary/20 animate-in fade-in zoom-in duration-300">
            <ToolbarButton 
              onClick={setMetadata} 
              isActive={false}
              icon={FileText}
            />
            <span className="text-[10px] font-bold text-primary uppercase tracking-tighter pr-1">SEO Data</span>
          </div>
        )}

        <div className="relative">
          <ToolbarButton 
            onClick={() => setShowColorPicker(!showColorPicker)} 
            isActive={showColorPicker}
            icon={Palette}
          />
          {/* Editorial Color Palette */}
          <AnimatePresence>
            {showColorPicker && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 mt-3 bg-[#0d0d0d] border border-white/10 p-2.5 rounded-2xl shadow-2xl z-[100] flex flex-col gap-2.5 min-w-[40px] backdrop-blur-xl"
              >
                <button onClick={() => { setColor("#8b5cf6"); setShowColorPicker(false); }} className="w-6 h-6 rounded-full bg-violet-500 hover:scale-110 transition-transform shadow-[0_0_10px_rgba(139,92,246,0.3)]" title="Xylos Violet" />
                <button onClick={() => { setColor("#6366f1"); setShowColorPicker(false); }} className="w-6 h-6 rounded-full bg-indigo-500 hover:scale-110 transition-transform shadow-[0_0_10px_rgba(99,102,241,0.3)]" title="Indigo Insight" />
                <button onClick={() => { setColor("#a855f7"); setShowColorPicker(false); }} className="w-6 h-6 rounded-full bg-purple-500 hover:scale-110 transition-transform shadow-[0_0_10px_rgba(168,85,247,0.3)]" title="Purple Prestige" />
                <button onClick={() => { setColor("#ef4444"); setShowColorPicker(false); }} className="w-6 h-6 rounded-full bg-red-500 hover:scale-110 transition-transform shadow-[0_0_10px_rgba(239,68,68,0.3)]" title="Alert Red" />
                <div className="h-px bg-white/10 mx-1" />
                <button onClick={() => { setColor(resolvedTheme === 'dark' ? "#ffffff" : "#000000"); setShowColorPicker(false); }} className={`w-6 h-6 rounded-full border border-white/10 ${resolvedTheme === 'dark' ? 'bg-white' : 'bg-black'} hover:scale-110 transition-transform`} title="Default Text Color" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} icon={Undo} />
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} icon={Redo} />
        </div>
      </div>

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <div className="relative">
        {editor && (
          <BubbleMenuComponent editor={editor} tippyOptions={{ duration: 100 }} className="flex items-center gap-1 p-2 bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl animate-in fade-in zoom-in duration-200">
             <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} />
             <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} />
             <div className="w-px h-4 bg-border mx-1" />
             <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} />
             <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} icon={LinkIcon} />
          </BubbleMenuComponent>
        )}
        <EditorContent editor={editor} />
        <AnimatePresence>
          {isUploading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
            >
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">Synthesizing Asset</span>
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Synchronizing with Core Matrix</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Editorial Status Bar */}
      <div className="border-t border-border bg-muted/20 px-6 py-3 flex items-center justify-between transition-all duration-500">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Statistical Analysis</span>
            <div className="flex items-center gap-4 text-[10px] font-bold text-foreground">
              <span className="flex items-center gap-1.5"><span className="text-primary tracking-tighter">{wordCount}</span> WORDS</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5"><span className="text-primary tracking-tighter">{charCount}</span> CHARS</span>
            </div>
          </div>
          
          <div className="w-px h-8 bg-border" />
          
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Readability Score</span>
            <div className="text-[10px] font-bold text-foreground flex items-center gap-2">
              EST. <span className="text-primary italic">{readingTime} MIN</span> READING TIME
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Draft Status</span>
            <div className="text-[10px] font-bold text-green-500 flex items-center gap-1.5 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              Live Sync Active
            </div>
          </div>
        </div>
      </div>

      {/* Custom Link Editor Modal */}
      <AnimatePresence>
        {linkEditor.isOpen && (
          <div className="absolute inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="w-full max-w-sm bg-[#0d0d0d] border border-border rounded-3xl p-6 shadow-2xl space-y-6"
            >
              <div className="space-y-2">
                <h3 className="font-black text-lg uppercase tracking-widest text-primary flex items-center gap-2">
                   <LinkIcon className="w-5 h-5" /> Embed Link
                </h3>
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Neural Pathway Injection</p>
              </div>

              <div className="space-y-4">
                <input 
                  type="url" 
                  value={linkEditor.url}
                  onChange={(e) => setLinkEditor(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://xylos-ai.com"
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  autoFocus
                />
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${linkEditor.isNofollow ? 'bg-primary border-primary text-black' : 'border-border text-transparent group-hover:border-primary/50'}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <input type="checkbox" className="hidden" checked={linkEditor.isNofollow} onChange={(e) => setLinkEditor(prev => ({ ...prev, isNofollow: e.target.checked }))} />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Tag 'No-Follow' (SEO)</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <button onClick={() => setLinkEditor(prev => ({ ...prev, isOpen: false }))} className="flex-1 py-3 rounded-xl border border-white/10 text-xs font-bold uppercase hover:bg-white/5 transition-all text-muted-foreground">Cancel</button>
                <button onClick={applyLink} className="flex-1 py-3 rounded-xl bg-primary text-black text-xs font-black uppercase hover:scale-105 transition-all shadow-neon">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Metadata Modal */}
      <AnimatePresence>
        {metadataEditor.isOpen && (
          <div className="absolute inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="w-full max-w-sm bg-[#0d0d0d] border border-border rounded-3xl p-6 shadow-2xl space-y-6"
            >
              <div className="space-y-2">
                <h3 className="font-black text-lg uppercase tracking-widest text-primary flex items-center gap-2">
                   <FileText className="w-5 h-5" /> SEO Assets
                </h3>
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Image Optimization Protocol</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[8px] font-black uppercase tracking-widest text-primary/70">Alt Text (Search & Accessibility)</span>
                  <input 
                    type="text" 
                    value={metadataEditor.alt}
                    onChange={(e) => setMetadataEditor(prev => ({ ...prev, alt: e.target.value }))}
                    placeholder="Describe image for search engines..."
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <span className="text-[8px] font-black uppercase tracking-widest text-primary/70">Title Attribute (Tooltips)</span>
                  <input 
                    type="text" 
                    value={metadataEditor.title}
                    onChange={(e) => setMetadataEditor(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief description for tooltips..."
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <button onClick={() => { metadataEditor.callback(null); setMetadataEditor(prev => ({ ...prev, isOpen: false })); }} className="flex-1 py-3 rounded-xl border border-white/10 text-xs font-bold uppercase hover:bg-white/5 transition-all text-muted-foreground">Skip</button>
                <button onClick={() => { metadataEditor.callback({ alt: metadataEditor.alt, title: metadataEditor.title }); setMetadataEditor(prev => ({ ...prev, isOpen: false })); }} className="flex-1 py-3 rounded-xl bg-primary text-black text-xs font-black uppercase hover:scale-105 transition-all shadow-neon">Verify Data</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CustomModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
      />
    </div>
  );
}
