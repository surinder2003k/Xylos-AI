"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const ChatContent = dynamic(
  () => import("@/components/chat/chat-content").then((mod) => mod.ChatContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-[#0d0e10]">
        <div className="w-12 h-12 rounded-[1.5rem] bg-primary/5 flex items-center justify-center border border-primary/10 animate-pulse">
          <svg className="w-6 h-6 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
      </div>
    ),
  }
);

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#0d0e10]">
        <div className="w-12 h-12 rounded-[1.5rem] bg-primary/5 flex items-center justify-center border border-primary/10 animate-pulse">
          <svg className="w-6 h-6 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
