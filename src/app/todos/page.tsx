import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="p-8 bg-[#1a1a1a] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4 text-[#D4AF37]">Supabase Todos Test</h1>
      <div className="mb-6">
        <a 
          href="/login" 
          className="text-sm text-[#C2B280] hover:text-[#D4AF37] underline"
        >
          Go to Login Page
        </a>
      </div>
      <ul className="space-y-2">
        {todos?.map((todo: any, index: number) => (
          <li key={index} className="p-3 bg-white/10 rounded border border-white/5">
            {typeof todo === 'object' ? JSON.stringify(todo) : todo}
          </li>
        ))}
        {(!todos || todos.length === 0) && (
          <p className="text-[#C2B280]">No todos found or "todos" table does not exist yet.</p>
        )}
      </ul>
    </div>
  )
}
