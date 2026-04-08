import { createClient } from "@/utils/supabase/client";

export interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachment?: {
    name: string;
    url: string;
    type: string;
  };
  created_at?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
  messages?: Message[];
}

export const chatService = {
  async getSessions() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[Neural Matrix] Session Retrieval Failure:', error);
      return [];
    }
    return data as ChatSession[];
  },

  async createSession(title: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('chats')
      .insert({ 
        title, 
        user_id: user.id,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as ChatSession;
  },

  async getMessages(chatId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[Neural Matrix] Message Retrieval Failure:', error);
      return [];
    }
    return data as Message[];
  },

  async saveMessage(chatId: string, message: Message) {
    const supabase = createClient();
    
    // Save message
    const { error: msgError } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        role: message.role,
        content: message.content,
        attachment: message.attachment
      });

    if (msgError) throw msgError;

    // Update chat timestamp
    await supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chatId);
  },

  async deleteSession(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async updateTitle(id: string, title: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('chats')
      .update({ title })
      .eq('id', id);
    
    if (error) throw error;
  }
};
