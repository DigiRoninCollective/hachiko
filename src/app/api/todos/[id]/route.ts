import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      return Response.json({ error: 'Todo not found' }, { status: 404 });
    }

    return Response.json({ todo });
  } catch (error) {
    console.error('Error fetching todo:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, isCompleted } = body;

    const updateData: { title?: string; isCompleted?: boolean } = {};

    if (title !== undefined) {
      if (typeof title !== 'string') {
        return Response.json({ error: 'Title must be a string' }, { status: 400 });
      }
      if (title.length > 500) {
        return Response.json({ error: 'Title must be 500 characters or less' }, { status: 400 });
      }
      if (title.trim().length === 0) {
        return Response.json({ error: 'Title cannot be empty' }, { status: 400 });
      }
      updateData.title = title.trim();
    }

    if (isCompleted !== undefined) {
      if (typeof isCompleted !== 'boolean') {
        return Response.json({ error: 'isCompleted must be a boolean' }, { status: 400 });
      }
      updateData.isCompleted = isCompleted;
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: updateData,
    });

    return Response.json({ success: true, todo });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return Response.json({ error: 'Todo not found' }, { status: 404 });
    }
    console.error('Error updating todo:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.todo.delete({
      where: { id },
    });

    return Response.json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return Response.json({ error: 'Todo not found' }, { status: 404 });
    }
    console.error('Error deleting todo:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
