import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.message.delete({
      where: { id },
    });

    return Response.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return Response.json({ error: 'Message not found' }, { status: 404 });
    }
    console.error('Error deleting message:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
