import prisma from '@/lib/prisma';
import { kv } from '@/lib/kv';

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  ip?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

export interface User {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60; // seconds
const RATE_LIMIT_MAX_REQUESTS = 5;

export const isUserRateLimited = async (userId: string): Promise<boolean> => {
  const key = `ratelimit:chat:${userId}`;
  
  try {
    const count = await kv.incr(key);
    
    // Set expiration on first request
    if (count === 1) {
      await kv.expire(key, RATE_LIMIT_WINDOW);
    }
    
    return count > RATE_LIMIT_MAX_REQUESTS;
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Fail open - allow request if rate limiting fails
    return false;
  }
};

// Store chat message in database
export const saveMessage = async (message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> => {
  try {
    const newMessage = await prisma.message.create({
      data: {
        userId: message.userId,
        username: message.username,
        message: message.message,
        ip: message.ip,
        fileUrl: message.fileUrl,
        fileName: message.fileName,
        fileType: message.fileType,
        fileSize: message.fileSize,
      },
    });

    return {
      id: newMessage.id,
      userId: newMessage.userId,
      username: newMessage.username,
      message: newMessage.message,
      timestamp: newMessage.timestamp,
      ip: newMessage.ip || undefined,
      fileUrl: newMessage.fileUrl || undefined,
      fileName: newMessage.fileName || undefined,
      fileType: newMessage.fileType || undefined,
      fileSize: newMessage.fileSize || undefined,
    };
  } catch (error) {
    console.error('Error saving message to database:', error);
    throw error;
  }
};

// Get recent chat messages
export const getRecentMessages = async (limit: number = 50): Promise<ChatMessage[]> => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });

    return messages.map(message => ({
      id: message.id,
      userId: message.userId,
      username: message.username,
      message: message.message,
      timestamp: message.timestamp,
      ip: message.ip || undefined,
      fileUrl: message.fileUrl || undefined,
      fileName: message.fileName || undefined,
      fileType: message.fileType || undefined,
      fileSize: message.fileSize || undefined,
    })).reverse(); // Reverse to show oldest first (like a typical chat)
  } catch (error) {
    console.error('Error fetching messages from database:', error);
    throw error;
  }
};

// Create or get user
export const getOrCreateUser = async (username: string): Promise<User> => {
  try {
    // Use upsert to create or update user in a single query
    const user = await prisma.user.upsert({
      where: { username },
      update: { updatedAt: new Date() },
      create: { username },
    });

    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error('Error getting/creating user:', error);
    throw error;
  }
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
  const inappropriateWords = ['admin', 'moderator', 'root', 'system', 'hachiko'];
  if (inappropriateWords.some(word => username.toLowerCase().includes(word))) {
    return false;
  }

  return true;
};

// Moderate message content
export const moderateMessage = (message: string): { isAllowed: boolean; cleanedMessage: string } => {
  // Check message length (max 1000 chars to match DB constraint)
  if (message.length > 1000) {
    return { isAllowed: false, cleanedMessage: message };
  }

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
    'make money', 'casino', 'poker', 'sex', 'xxx', 'scam'
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