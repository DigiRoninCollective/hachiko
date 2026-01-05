import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const completed = url.searchParams.get('completed');

    const where = completed !== null 
      ? { isCompleted: completed === 'true' }
      : {};

    const todos = await prisma.todo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return Response.json({ todos, count: todos.length });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    if (!title || typeof title !== 'string') {
      return Response.json({ error: 'Title is required and must be a string' }, { status: 400 });
    }

    if (title.length > 500) {
      return Response.json({ error: 'Title must be 500 characters or less' }, { status: 400 });
    }

    if (title.trim().length === 0) {
      return Response.json({ error: 'Title cannot be empty' }, { status: 400 });
    }

    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
      },
    });

    return Response.json({ success: true, todo }, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
