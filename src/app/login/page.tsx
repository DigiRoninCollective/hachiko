import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[rgba(212,175,55,0.3)] bg-white/5 p-8 backdrop-blur-md shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Hachiko</h1>
          <p className="text-[#C2B280]">Japan's Most Loyal Dog - Login to your account</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#C2B280] mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-[rgba(212,175,55,0.3)] bg-[#1a1a1a] px-4 py-2 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C2B280] mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-[rgba(212,175,55,0.3)] bg-[#1a1a1a] px-4 py-2 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
          <div className="flex flex-col space-y-3 pt-2">
            <button
              formAction={login}
              className="w-full rounded-lg bg-[#D4AF37] px-4 py-2 font-semibold text-black hover:bg-[#D4AF37]/90 transition-all active:scale-[0.98]"
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="w-full rounded-lg border border-[#D4AF37] px-4 py-2 font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all active:scale-[0.98]"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
