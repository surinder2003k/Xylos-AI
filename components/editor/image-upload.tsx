"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  onClear: () => void;
  currentUrl?: string;
}

export function ImageUpload({ onUploadComplete, onClear, currentUrl }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Neural File Validation
    if (!file.type.startsWith("image/")) {
      setUploadError("Invalid asset type. Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB Limit
      setUploadError("Asset too large. Max size: 5MB.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (error) throw error;

      // Generate Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
    } catch (err: any) {
      setUploadError("Neural Link Failure: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const clearAsset = () => {
    onClear();
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
        accept="image/*"
      />
      
      {!currentUrl ? (
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full aspect-video rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 hover:bg-white/10 hover:border-primary/40 transition-all group disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-white/20 group-hover:text-primary transition-colors" />
          )}
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
              {isUploading ? "Uploading to Core..." : "Upload from Device"}
            </p>
            <p className="text-[8px] text-white/20 uppercase tracking-tighter mt-1">PNG, JPG up to 5MB</p>
          </div>
        </button>
      ) : (
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group">
          <img src={currentUrl} alt="Uploaded asset" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-[10px] font-bold border border-primary/20 shadow-neon-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ASSET SYNCED
             </div>
             <button 
                onClick={clearAsset}
                className="w-9 h-9 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 transition-colors flex items-center justify-center border border-red-500/20"
             >
                <X className="w-5 h-5" />
             </button>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-widest px-2 group animate-shake">
          <AlertCircle className="w-3.5 h-3.5" />
          {uploadError}
        </div>
      )}
    </div>
  );
}
