import { createClient } from '@/utils/supabase/client';
import { ChatMessage } from './chat-service';

export type RealtimeMessageCallback = (message: ChatMessage) => void;

export class RealtimeChat {
  private supabase = createClient();
  private channel: ReturnType<typeof this.supabase.channel> | null = null;

  subscribe(onMessage: RealtimeMessageCallback) {
    this.channel = this.supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
        },
        (payload) => {
          const newMessage = payload.new as Record<string, unknown>;
          const message: ChatMessage = {
            id: String(newMessage.id || ''),
            userId: String(newMessage.userId || ''),
            username: String(newMessage.username || ''),
            message: String(newMessage.message || ''),
            timestamp: new Date(String(newMessage.timestamp || new Date())),
            ip: newMessage.ip ? String(newMessage.ip) : undefined,
            fileUrl: newMessage.fileUrl ? String(newMessage.fileUrl) : undefined,
            fileName: newMessage.fileName ? String(newMessage.fileName) : undefined,
            fileType: newMessage.fileType ? String(newMessage.fileType) : undefined,
            fileSize: newMessage.fileSize ? Number(newMessage.fileSize) : undefined,
          };
          onMessage(message);
        }
      )
      .subscribe();

    return () => {
      this.unsubscribe();
    };
  }

  unsubscribe() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }
}
