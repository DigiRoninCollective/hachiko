import prisma from '@/lib/prisma';

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
  createdAt: Date;
  updatedAt: Date;
}

// Rate limiting: In a real app, you'd use a Redis store or similar for rate limiting
// For now, we'll implement a simple in-memory rate limiter (not suitable for production)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

export const isUserRateLimited = async (userId: string): Promise<boolean> => {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 5;

  const record = rateLimitStore.get(userId) || { count: 0, timestamp: now };

  if (now - record.timestamp > windowMs) {
    // Reset the counter if the window has passed
    record.count = 1;
    record.timestamp = now;
  } else {
    // Increment the counter
    record.count++;
  }

  rateLimitStore.set(userId, record);

  if (record.count > maxRequests) {
    return true;
  }

  return false;
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
      },
    });

    return {
      id: newMessage.id,
      userId: newMessage.userId,
      username: newMessage.username,
      message: newMessage.message,
      timestamp: newMessage.timestamp,
      ip: newMessage.ip || undefined
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
      ip: message.ip || undefined
    })).reverse(); // Reverse to show oldest first (like a typical chat)
  } catch (error) {
    console.error('Error fetching messages from database:', error);
    throw error;
  }
};

// Create or get user
export const getOrCreateUser = async (username: string): Promise<User> => {
  try {
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: { username },
      });
    }

    // Update the last active timestamp
    user = await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() },
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