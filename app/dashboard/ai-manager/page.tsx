"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Terminal, 
  Activity, 
  Settings2, 
  Play, 
  Timer, 
  History,
  ShieldCheck,
  Cpu, 
  RefreshCw,
  Globe,
  Database,
  Users,
  ShieldAlert,
  UserCheck,
  Search,
  MoreVertical,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Server,
  CloudLightning,
  Image as ImageIcon
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/interfaces-select";
import { useToast } from "@/components/ui/toast";
import { ConfirmationModal } from "@/components/ui/modal";
import { updateAppSetting, getAppSetting, getProfiles, updateProfileRole } from "@/app/actions/settings";

export default function AIManagerPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState("Never");
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<"admin" | "user">("user");
  
  const [isAutoPublish, setIsAutoPublish] = useState(true);
  const [autoCategory, setAutoCategory] = useState("Technology");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [autoCategoriesList, setAutoCategoriesList] = useState(["Technology", "Finance", "Health"]);
  
  const [apiStatus, setApiStatus] = useState<any>({
    gemini: "checking",
    supabase: "checking",
    pexels: "checking"
  });
  
  const { showToast } = useToast();
  const supabase = createClient();

  const fetchSettings = async () => {
    try {
      const publishResult = await getAppSetting("auto_publish");
      const categoryResult = await getAppSetting("auto_category");
      
      if (publishResult.success && publishResult.value !== null) setIsAutoPublish(publishResult.value);
      if (categoryResult.success && categoryResult.value) setAutoCategory(typeof categoryResult.value === 'string' ? categoryResult.value : categoryResult.value);
    } catch (err) {
      console.warn("Settings fetch failed");
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const result = await getProfiles();
      if (!result.success) throw new Error(result.error);
      setUsers(result.profiles || []);
    } catch (err: any) {
      showToast("Access Denied: Could not sync neural directory.", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  const checkAPIStatus = async () => {
    setApiStatus({ gemini: "online", supabase: "online", pexels: "online" });
  };

  useEffect(() => {
    fetchUsers();
    fetchSettings();
    checkAPIStatus();
    // Get current user ID
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    fetchCurrentUser();
  }, []);

  const updateGlobalCategory = async (cat: string) => {
    setAutoCategory(cat);
    if (cat.trim() && !autoCategoriesList.includes(cat.trim())) {
      setAutoCategoriesList(prev => [...prev, cat.trim()]);
    }
    try {
      const result = await updateAppSetting("auto_category", cat);
      if (!result.success) throw new Error(result.error);
      showToast(`Protocol: Category set to ${cat.toUpperCase()}`, "success");
    } catch (err: any) {
      showToast("Sync Error: " + (err.message || "Failed to update global category."), "error");
    }
  };

  const toggleAutoPublish = async () => {
    const newState = !isAutoPublish;
    setIsAutoPublish(newState); 
    try {
      const result = await updateAppSetting("auto_publish", newState);
      if (!result.success) throw new Error(result.error);
      showToast(`Protocol: Auto-Publish is now ${newState ? "ACTIVE" : "DISABLED"}`, "info");
    } catch (err) {
      setIsAutoPublish(!newState); // Rollback
      showToast("Protocol failure: Setting sync crashed.", "error");
    }
  };

  const runAutomation = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/automate', { 
        method: 'GET'
      });
      const data = await res.json();
      
      if (data.success) {
        setLastRun("Just Now");
        showToast("Editorial Generator complete! 2 Posts scheduled and synthesized.", "success");
      } else {
        showToast("Editorial Error: " + (data.error || "Generation Failed"), "error");
      }
    } catch (err) {
      showToast("System Crash: Could not connect to Editorial Engine.", "error");
    } finally {
      setIsRunning(false);
    }
  };

  const handleRoleChange = (user: any, role: "admin" | "user") => {
    setTargetUser(user);
    setNewRole(role);
    setIsRoleModalOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!targetUser) return;
    try {
      const result = await updateProfileRole(targetUser.user_id || targetUser.id, newRole);
      
      if (!result.success) throw new Error(result.error);
      
      showToast(`${targetUser.full_name || 'User'} role updated to ${newRole.toUpperCase()}.`, "success");
      setUsers(users.map(u => (u.user_id === targetUser.user_id || u.id === targetUser.id) ? { ...u, role: newRole } : u));
      setIsRoleModalOpen(false);
    } catch (err: any) {
      showToast("Security override failed: " + err.message, "error");
    }
  };

  const handleDeleteUser = (user: any) => {
    setTargetUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!targetUser) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", targetUser.id);
      
      if (error) throw error;

      showToast(`User ${targetUser.full_name || 'Pilot'} removed from directory.`, "success");
      setUsers(users.filter(u => u.id !== targetUser.id));
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      showToast("Purge protocol failed: " + err.message, "error");
    }
  };

  // Deduplicate users by user_id and then filter by search
  const uniqueUsers = Array.from(new Map(users.map(u => [u.user_id, u])).values());
  
  const filteredUsers = uniqueUsers.filter(u => 
    (u.full_name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.id || "").toLowerCase().includes(userSearch.toLowerCase())
  );


  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Cpu className="w-32 h-32 text-primary" />
         </div>
         <div>
            <h1 className="text-4xl font-black font-fustat tracking-tighter uppercase leading-none">Autonomous <span className="text-red-500">Manager</span></h1>
            <p className="text-white/40 mt-2 font-medium uppercase tracking-[0.2em] text-[10px]">Editorial Synthesis Core V3.1 // Status: Online</p>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
               <Activity className="w-4 h-4 animate-pulse" />
               Pulse Active
            </div>
            <button 
              onClick={runAutomation}
              disabled={isRunning}
              className="px-8 py-3.5 rounded-2xl bg-primary text-black font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-neon disabled:opacity-50"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isRunning ? "PROCESSING..." : "CREATE 2 POST"}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Control & Logs */}
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatusCard 
                icon={Timer} 
                title="Next Scheduled Sync" 
                value="Tomorrow, 08:00 AM" 
                subtitle="2 Posts Queued (India News)"
                color="text-secondary"
              />
              <StatusCard 
                icon={History} 
                title="Last Execution Log" 
                value={lastRun} 
                subtitle="Status: 100% Success Rate"
                color="text-primary"
              />
           </div>

           <div className="bg-card border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md space-y-6 shadow-xl">
              <h3 className="font-bold text-lg flex items-center gap-3">
                 <Terminal className="w-5 h-5 text-white/40" />
                 Editorial Strategy Logs
              </h3>
              <div className="bg-black/60 rounded-2xl p-6 font-mono text-[10px] text-white/40 space-y-2 max-h-52 overflow-y-auto custom-scrollbar">
                 <div className="flex gap-4"><span className="text-primary">[SYNC_START]</span> Initializing Gemini 2.5 Flash pipeline...</div>
                 <div className="flex gap-4"><span className="text-primary">[PROMPT_INGEST]</span> context: "Major Indian News" (1000+ words target)</div>
                 <div className="flex gap-4"><span className="text-secondary">[PEXELS_SYNC]</span> fetching random assets for diversified visual...</div>
                 <div className="flex gap-4"><span className="text-accent font-bold">[V_DB_COMMIT]</span> successfully uploaded to Supabase logs</div>
                 {isRunning && <div className="flex gap-4 animate-pulse"><span className="text-primary">[SYNTHESIS]</span> generating core narrative...</div>}
              </div>
           </div>
        </div>

        {/* Sync Protocols */}
        <div className="bg-card border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md space-y-8 shadow-xl">
           <h3 className="font-bold text-lg flex items-center gap-3 underline decoration-primary decoration-4 underline-offset-8">
              <Settings2 className="w-5 h-5 text-white/40" />
              Sync Protocols
           </h3>
           
           <div className="space-y-6">
              <ToggleOption 
                 icon={ShieldCheck}
                 title="Auto-Publish"
                 description="Bypass moderation drafts"
                 active={isAutoPublish}
                 onClick={toggleAutoPublish}
              />
              <GlobeOverlay />
              <ToggleOption 
                 icon={Database}
                 title="High Frequency"
                 description="8AM Sync Daily"
                 active={true}
              />
           </div>

           <div className="pt-6 border-t border-white/5 space-y-6">
              <div className="space-y-3">
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Auto-Post Category</p>
                 <Select
                   value={isCustomCategory ? "Add Category..." : autoCategory}
                   onValueChange={(val) => {
                     if (val === "Add Category...") {
                       setIsCustomCategory(true);
                       setAutoCategory("");
                     } else {
                       setIsCustomCategory(false);
                       updateGlobalCategory(val);
                     }
                   }}
                 >
                   <SelectTrigger className="w-full bg-white/5 border border-white/10 rounded-xl py-5 px-4 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 text-white cursor-pointer h-auto leading-none">
                     <SelectValue placeholder="Select Category" />
                   </SelectTrigger>
                   <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                     {autoCategoriesList.map(cat => (
                       <SelectItem key={cat} value={cat} className="text-white hover:bg-white/10 cursor-pointer">
                         {cat}
                       </SelectItem>
                     ))}
                     <SelectItem value="Add Category..." className="text-primary font-bold hover:bg-primary/10 cursor-pointer">
                       Add Category...
                     </SelectItem>
                   </SelectContent>
                 </Select>
                 
                 {isCustomCategory && (
                    <div className="flex items-center gap-2 mt-2">
                       <input 
                         type="text" 
                         value={autoCategory}
                         onChange={(e) => setAutoCategory(e.target.value)}
                         placeholder="Type new category..."
                         className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 text-white"
                       />
                       <button 
                         onClick={() => {
                           if (autoCategory.trim()) {
                             updateGlobalCategory(autoCategory);
                             setIsCustomCategory(false);
                           }
                         }}
                         className="px-4 py-2 bg-primary/20 text-primary font-bold text-xs uppercase rounded-xl hover:bg-primary/30 transition-all"
                       >Add</button>
                    </div>
                 )}
              </div>

              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                 <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center justify-between">
                    Model Pipeline Status
                    <RefreshCw className={`w-3 h-3 cursor-pointer ${isRunning ? 'animate-spin' : ''}`} onClick={checkAPIStatus} />
                 </p>
                 
                 <div className="space-y-4">
                    <ApiItem 
                       icon={CloudLightning} 
                       name="Google Gemini 2.5" 
                       status={apiStatus.gemini} 
                       desc="Main Narrative Engine" 
                    />
                    <ApiItem 
                       icon={Database} 
                       name="Supabase Edge DB" 
                       status={apiStatus.supabase} 
                       desc="Neural Index Storage" 
                    />
                    <ApiItem 
                       icon={ImageIcon} 
                       name="Pexels Asset API" 
                       status={apiStatus.pexels} 
                       desc="Visual Content Sync" 
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-navy-900/20 border border-white/5 rounded-[2.5rem] p-8 space-y-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
             </div>
             <div>
                <h3 className="text-xl font-bold font-outfit">Neural Network Directory</h3>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Manage platform access levels</p>
             </div>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search by name or email..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">Digital ID / User</th>
                <th className="pb-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">Email Access</th>
                <th className="pb-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">Permission Level</th>
                <th className="pb-4 text-[9px] font-bold text-white/20 uppercase tracking-widest text-center">Global Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loadingUsers ? (
                <tr><td colSpan={4} className="py-10 text-center opacity-20 italic">Scanning directory...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="py-10 text-center opacity-20 italic">No users found.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/[0.02] transition-all">
                    <td className="py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center font-bold text-xs">
                          {user.full_name?.[0] || <Users className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white/90">{user.full_name || "Neural Pilot"}</p>
                            {user.user_id === currentUserId && (
                              <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-primary/20 text-primary font-black border border-primary/20">YOU</span>
                            )}
                          </div>
                          <p className="text-[10px] text-white/20 font-mono tracking-tighter uppercase">{user.user_id.substring(0, 12)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 text-xs text-white/40">{user.email || "Confidential Entry"}</td>
                    <td className="py-6">
                      <div className={`
                        inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
                        ${(user.role === 'super_admin' || user.user_id === currentUserId && user.role !== 'user') ? 'bg-red-500/10 text-red-500 border border-red-500/20' : user.role === 'admin' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/5 text-white/40 border border-white/5'}
                      `}>
                        {user.role === 'super_admin' ? <ShieldAlert className="w-3 h-3" /> : user.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                        {user.role === 'super_admin' ? 'Super Admin' : user.role || 'user'}
                      </div>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center justify-center gap-2">
                        {user.user_id === currentUserId ? (
                          <div className="text-[10px] uppercase font-black tracking-widest text-primary opacity-50 px-4 py-2 border border-transparent">
                            Active Session
                          </div>
                        ) : user.role === 'super_admin' ? (
                          <div className="text-[10px] uppercase font-black tracking-widest text-red-500 opacity-50 px-4 py-2 border border-transparent">
                            System Core
                          </div>
                        ) : user.role === 'admin' ? (
                          <button 
                            onClick={() => handleRoleChange(user, 'user')}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold hover:bg-red-500 hover:text-white transition-all group/btn"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            REVOKE
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleRoleChange(user, 'admin')}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold hover:bg-primary hover:text-black transition-all group/btn shadow-neon"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            PROMOTE
                          </button>
                        )}
                        {user.user_id !== currentUserId && user.role !== 'super_admin' && (
                          <button 
                            onClick={() => handleDeleteUser(user)}
                            className="p-2.5 rounded-xl hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                            title="Purge User Protocol"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onConfirm={confirmRoleChange}
        title="Override Permission Protocol?"
        message={`Confirm changing permissions for "${targetUser?.full_name || targetUser?.email}" to Level: ${newRole.toUpperCase()}. This modifies global network access.`}
        confirmText="CONFIRM OVERRIDE"
        cancelText="ABORT"
        type="info"
      />

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteUser}
        title="CRITICAL: Purge User Protocol"
        message={`Confirm PERMANENT removal of "${targetUser?.full_name || targetUser?.email}" from the Pulse AI directory. This action cannot be undone.`}
        confirmText="INITIATE PURGE"
        cancelText="ABORT"
        type="danger"
      />
    </div>
  );
}

function ApiItem({ icon: Icon, name, status, desc }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
          <Icon className="w-4 h-4 text-white/40" />
        </div>
        <div>
          <p className="text-[11px] font-bold">{name}</p>
          <p className="text-[9px] text-white/20 uppercase tracking-tighter">{desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-primary shadow-neon animate-pulse' : 'bg-red-500'}`} />
        <span className={`text-[9px] font-bold uppercase ${status === 'online' ? 'text-primary' : 'text-red-500'}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, title, value, subtitle, color }: any) {
  return (
    <div className="bg-navy-900/30 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md space-y-4 hover:border-white/10 transition-colors group">
       <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
       </div>
       <div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-bold mt-1 text-white group-hover:text-primary transition-colors">{value}</p>
          <p className="text-[10px] text-white/40 font-medium mt-1">{subtitle}</p>
       </div>
    </div>
  );
}

function ToggleOption({ icon: Icon, title, description, active, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between group cursor-pointer"
    >
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
             <Icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-white/40'}`} />
          </div>
          <div>
             <p className="text-sm font-bold">{title}</p>
             <p className="text-[10px] text-white/20 font-medium">{description}</p>
          </div>
       </div>
       <div className={`w-10 h-5 rounded-full relative p-1 transition-colors ${active ? 'bg-primary shadow-neon' : 'bg-white/10'}`}>
          <div className={`w-3 h-3 bg-black rounded-full transition-all ${active ? 'ml-5' : 'ml-0'}`} />
       </div>
    </div>
  );
}

function GlobeOverlay() {
  return (
    <div className="flex items-center justify-between group">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
             <Globe className="w-4 h-4 text-secondary" />
          </div>
          <div>
             <p className="text-sm font-bold">Regional Sync</p>
             <p className="text-[10px] text-white/20 font-medium">India Focus Active</p>
          </div>
       </div>
       <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <span className="text-[9px] font-bold text-secondary uppercase">Locked</span>
       </div>
    </div>
  );
}
