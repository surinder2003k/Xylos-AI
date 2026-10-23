"use client";

import { useState } from "react";
import { updateProfileName } from "@/app/actions/settings";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ProfileNameFormProps {
  userId: string;
  currentName: string;
}

export function ProfileNameForm({ userId, currentName }: ProfileNameFormProps) {
  const [profileName, setProfileName] = useState(currentName);
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleUpdate = async () => {
    if (!profileName.trim()) return;
    setIsUpdating(true);
    setStatus('idle');
    try {
      const res = await updateProfileName(profileName.trim());
      if (res.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setIsUpdating(false);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
      <input
        type="text"
        placeholder="Display name"
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
        className="w-full md:w-72 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all placeholder:text-white/20 text-white"
      />
      <button
        onClick={handleUpdate}
        disabled={isUpdating}
        className="px-6 py-3 rounded-xl font-semibold bg-primary text-[#17181b] hover:bg-[#4accc4] transition-all disabled:opacity-50"
      >
        {isUpdating ? "Updating..." : "Save Name"}
      </button>
      {status === 'success' && (
        <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Display name updated successfully</span>
        </div>
      )}
      {status === 'error' && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Failed to update display name</span>
        </div>
      )}
    </div>
  );
}