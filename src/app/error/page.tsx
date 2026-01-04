export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1a1a1a] text-white px-4">
      <div className="text-center p-8 rounded-2xl border border-red-500/30 bg-white/5 backdrop-blur-md">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Oops!</h1>
        <p className="text-[#C2B280] text-lg mb-8">Sorry, something went wrong with your authentication request.</p>
        <a 
          href="/login" 
          className="bg-[#D4AF37] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#D4AF37]/90 transition-all"
        >
          Back to Login
        </a>
      </div>
    </div>
  )
}
