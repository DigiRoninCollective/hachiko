// src/lib/prisma-mock.ts

// Mock implementation for demonstration purposes
// In a real application, this would connect to a real database

import { ObjectId } from 'bson';

interface User {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  ip?: string;
}

class MockPrismaClient {
  private users: Map<string, User> = new Map();
  private messages: Map<string, Message> = new Map();

  get user() {
    return {
      findUnique: async ({ where }: { where: { username: string } }) => {
        for (const [_, user] of this.users) {
          if (user.username === where.username) {
            return user;
          }
        }
        return null;
      },
      create: async ({ data }: { data: { username: string } }) => {
        const id = new ObjectId().toString();
        const now = new Date();
        const user: User = {
          id,
          username: data.username,
          createdAt: now,
          updatedAt: now,
        };
        this.users.set(id, user);
        return user;
      },
      update: async ({ where, data }: { where: { id: string }, data: { updatedAt: Date } }) => {
        const user = this.users.get(where.id);
        if (user) {
          user.updatedAt = data.updatedAt;
          this.users.set(where.id, user);
          return user;
        }
        throw new Error('User not found');
      }
    };
  }

  get message() {
    return {
      create: async ({ data }: { data: Omit<Message, 'id' | 'timestamp'> }) => {
        const id = new ObjectId().toString();
        const message: Message = {
          ...data,
          id,
          timestamp: new Date(),
        };
        this.messages.set(id, message);
        return message;
      },
      findMany: async ({ orderBy, take }: { orderBy: { timestamp: string }, take: number }) => {
        let messages = Array.from(this.messages.values());

        if (orderBy.timestamp === 'desc') {
          messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        } else {
          messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        }

        return messages.slice(0, take);
      }
    };
  }
}

export const prisma = new MockPrismaClient();
export default prisma;