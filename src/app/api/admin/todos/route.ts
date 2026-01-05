import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Response.json({ todos });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
