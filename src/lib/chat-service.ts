import kv from '@/lib/kv-config';

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  ip?: string;
}

export interface User {
  id: string;
  username: string;
  joinDate: Date;
  lastActive: Date;
}

// Rate limiting: Store user activity to prevent spam
export const isUserRateLimited = async (userId: string): Promise<boolean> => {
  const key = `rate_limit:${userId}`;
  const current = await kv.get<number>(key);
  
  if (current && current >= 5) { // Max 5 messages per minute
    return true;
  }
  
  await kv.incr(key);
  await kv.expire(key, 60); // Reset after 60 seconds
  
  return false;
};

// Store chat messages
export const saveMessage = async (message: ChatMessage): Promise<void> => {
  const messageKey = `message:${Date.now()}:${message.id}`;
  await kv.set(messageKey, message);
  
  // Add to user's message history
  const userMessagesKey = `user_messages:${message.userId}`;
  await kv.lpush(userMessagesKey, messageKey);
  await kv.ltrim(userMessagesKey, 0, 99); // Keep only last 100 messages per user
  await kv.expire(userMessagesKey, 86400 * 7); // Expire after 7 days
  
  // Add to global chat history
  const globalChatKey = 'global_chat';
  await kv.lpush(globalChatKey, messageKey);
  await kv.ltrim(globalChatKey, 0, 999); // Keep only last 1000 messages
  await kv.expire(globalChatKey, 86400 * 7); // Expire after 7 days
};

// Get recent chat messages
export const getRecentMessages = async (limit: number = 50): Promise<ChatMessage[]> => {
  const globalChatKey = 'global_chat';
  const messageKeys = await kv.lrange<string>(globalChatKey, 0, limit - 1);
  
  const messages: ChatMessage[] = [];
  for (const key of messageKeys) {
    const message = await kv.get<ChatMessage>(key);
    if (message) {
      messages.push(message);
    }
  }
  
  return messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Create or get user
export const getOrCreateUser = async (username: string): Promise<User> => {
  // In a real app, you'd have more robust user management
  // For now, we'll simulate user creation with a simple ID
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const user: User = {
    id: userId,
    username,
    joinDate: new Date(),
    lastActive: new Date(),
  };
  
  const userKey = `user:${userId}`;
  await kv.set(userKey, user);
  await kv.expire(userKey, 86400 * 30); // Expire after 30 days
  
  return user;
};

// Validate username
export const isValidUsername = (username: string): boolean => {
  if (!username || username.length < 3 || username.length > 20) {
    return false;
  }
  
  // Check for valid characters (alphanumeric and underscores/hyphens)
  const validUsernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!validUsernameRegex.test(username)) {
    return false;
  }
  
  // Check for inappropriate content (simple check)
  const inappropriateWords = ['admin', 'moderator', 'root', 'system'];
  if (inappropriateWords.some(word => username.toLowerCase().includes(word))) {
    return false;
  }
  
  return true;
};

// Moderate message content
export const moderateMessage = (message: string): { isAllowed: boolean; cleanedMessage: string } => {
  let cleanedMessage = message;
  
  // Check for spam patterns (simple implementation)
  const spamPatterns = [
    /http[s]?:\/\/(?:[-\w.])+/gi, // URLs
    /(?:\W|^)(\w+)\s+\1(?:\W|$)/gi, // Repeated words
    /(?:[^\w\s]){5,}/g, // Excessive special characters
  ];
  
  for (const pattern of spamPatterns) {
    if (pattern.test(message)) {
      // For now, we'll just flag as spam rather than block
      cleanedMessage = cleanedMessage.replace(pattern, '[MODERATED]');
    }
  }
  
  // Check for inappropriate content (simple implementation)
  const inappropriateWords = [
    'spam', 'buy now', 'click here', 'free money', 
    'make money', 'casino', 'poker', 'sex', 'xxx'
  ];
  
  let isAllowed = true;
  for (const word of inappropriateWords) {
    if (message.toLowerCase().includes(word.toLowerCase())) {
      isAllowed = false;
      break;
    }
  }
  
  return { isAllowed, cleanedMessage };
};