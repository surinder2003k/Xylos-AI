export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
  attachment?: {
    name: string;
    dataUrl: string;
    type: string;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

const STORAGE_KEY = 'pulse_chat_history';

export const historyManager = {
  getSessions(): ChatSession[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored).sort((a: ChatSession, b: ChatSession) => b.updatedAt - a.updatedAt);
    } catch (e) {
      console.error('Failed to parse history:', e);
      return [];
    }
  },

  saveSession(session: ChatSession) {
    if (typeof window === 'undefined') return;
    const sessions = this.getSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex > -1) {
      sessions[existingIndex] = { ...session, updatedAt: Date.now() };
    } else {
      sessions.push({ ...session, updatedAt: Date.now() });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    // Emit global event for components to sync without reload
    window.dispatchEvent(new Event('chat_history_updated'));
  },

  deleteSession(id: string) {
    if (typeof window === 'undefined') return;
    const sessions = this.getSessions().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    window.dispatchEvent(new Event('chat_history_updated'));
  },

  clearAll() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('chat_history_updated'));
  },

  generateTitle(firstMessage: string): string {
    // Check if it's an image attachment marker and generate default neutral title
    if (firstMessage.startsWith('[Image Attached:')) return 'Vision Protocol Initialization';
    
    const title = firstMessage.trim().split('\n')[0].substring(0, 40);
    return title.length < firstMessage.length ? `${title}...` : title || 'New Neural Mission';
  }
};
