"use client";

import Image from "next/image";
import Script from "next/script";
import { useState, useEffect, useRef } from "react";
import { ExternalLink, Copy, Check, TrendingUp, X, ChevronRight, ChevronLeft } from "lucide-react";
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  HeartIcon, 
  ClockIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  TrophyIcon,
  CalendarIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import LoyaltyFortuneGenerator from "@/components/LoyaltyFortuneGenerator";
import ChartChatView from "@/components/ChartChatView";

export default function Home() {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sections = [
    { id: "hero", title: "Home" },
    { id: "token", title: "Token" },
    { id: "proof", title: "Symbols" },
    { id: "community", title: "Lore" },
    { id: "gallery", title: "Gallery" },
    { id: "wisdom", title: "Wisdom" },
    { id: "faq", title: "FAQ" }
  ];

  const galleryImages = [
    {
      src: "/images/hachiko/hachiko-memorial.jpg",
      alt: "Hachiko Memorial Statue at Shibuya",
      label: "Shibuya Legacy — Hachiko Memorial"
    },
    {
      src: "/images/hachiko/hachiko-waiting.webp",
      alt: "Hachiko waiting at Shibuya Station",
      label: "Daily Vigil — Waiting at the Station"
    },
    {
      src: "/images/hachiko/hachiko-family.webp",
      alt: "Hachiko with the Ueno family",
      label: "The Bond — Hachiko with Family"
    },
    {
      src: "/images/hachiko/hachiko-funeral.webp",
      alt: "Farewell to Hachiko in 1935",
      label: "1935 — Farewell and Tribute"
    },
    {
      src: "/hachiko-bronze-statue-shibuya.jpg",
      alt: "Bronze statue of Hachiko in Shibuya",
      label: "Shibuya Icon — Bronze Statue"
    },
    {
      src: "/hachiko-original-1935-wikipedia.jpg",
      alt: "Hachiko portrait, 1930s",
      label: "Archive — Original Portrait"
    }
  ];

  const contractAddress = "HACH1Ko11111111111111111111111111111111";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const scrollToSection = (index: number) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const width = container.clientWidth;
      container.scrollTo({
        left: width * index,
        behavior: 'smooth'
      });
      setActiveSection(index);
      setIsMobileMenuOpen(false);
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.clientWidth;
      const index = Math.round(scrollLeft / width);
      if (index !== activeSection) {
        setActiveSection(index);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#1a1a1a] text-white">
      {/* Header/Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#1a1a1a]/95 backdrop-blur-md border-b border-[rgba(212,175,55,0.3)]">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => scrollToSection(0)}
          >
            <svg className="w-7 h-7 text-[#D4AF37]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C10.9 2 10 2.9 10 4C10 4.74 10.4 5.38 11 5.73V8C9 8 7.5 9.5 7.5 11.5C7.5 11.85 7.57 12.19 7.69 12.5L6.5 13.5C6.19 13.19 5.85 13 5.5 13C4.67 13 4 13.67 4 14.5C4 15.33 4.67 16 5.5 16C5.85 16 6.19 15.81 6.5 15.5L7.69 16.5C8.45 17.44 9.64 18 11 18H13C14.36 18 15.55 17.44 16.31 16.5L17.5 15.5C17.81 15.81 18.15 16 18.5 16C19.33 16 20 15.33 20 14.5C20 13.67 19.33 13 18.5 13C18.15 13 17.81 13.19 17.5 13.5L16.31 12.5C16.43 12.19 16.5 11.85 16.5 11.5C16.5 9.5 15 8 13 8V5.73C13.6 5.38 14 4.74 14 4C14 2.9 13.1 2 12 2M12 9C13.1 9 14 9.9 14 11C14 12.1 13.1 13 12 13C10.9 13 10 12.1 10 11C10 9.9 10.9 9 12 9M10 20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20H10Z" />
            </svg>
            <span className="text-xl font-bold text-[#D4AF37]">Hachiko</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6">
            {sections.map((section, idx) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(idx)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === idx ? "text-[#D4AF37]" : "text-white/70 hover:text-white"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white hover:text-[#D4AF37]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-[#1a1a1a] border-b border-[rgba(212,175,55,0.3)] p-4 md:hidden">
            <div className="flex flex-col space-y-3">
              {sections.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(idx)}
                  className={`text-left py-2 px-3 rounded ${
                    activeSection === idx ? "bg-[#D4AF37]/10 text-[#D4AF37]" : "text-white/80"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Horizontal Scroll Container */}
      <div 
        ref={containerRef}
        className="flex h-full w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none' }} // Hide scrollbar for cleaner look
      >
        
        {/* SECTION 1: HERO */}
        <section className="min-w-full h-full snap-start relative flex items-center justify-center pt-16">
          {/* Internal overflow-y-auto allows content to scroll vertically if it exceeds screen height */}
          <div className="w-full h-full overflow-y-auto px-4 py-8 custom-scrollbar">
            <div className="min-h-full flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto gap-8 md:gap-16">
              
              <div className="flex-1 text-center md:text-left space-y-6">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-white via-[#fff8e1] to-[#D4AF37] bg-clip-text text-transparent">
                  Hachiko
                </h1>
                <p className="text-xl md:text-2xl text-white/90 max-w-xl mx-auto md:mx-0">
                  Japan's Most Loyal Dog — A Story of Unwavering Devotion Reborn on Solana.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-8">
                  <div>
                    <div className="text-3xl font-bold text-[#D4AF37]">10+</div>
                    <div className="text-xs text-[#C2B280] uppercase">Years Waiting</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#D4AF37]">1935</div>
                    <div className="text-xs text-[#C2B280] uppercase">Legacy Year</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#D4AF37]">∞</div>
                    <div className="text-xs text-[#C2B280] uppercase">Loyalty</div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                  <a href="https://pump.fun" target="_blank" className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black px-8 py-3 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-1">
                    Buy on pump.fun
                  </a>
                  <button onClick={() => scrollToSection(3)} className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 px-8 py-3 rounded-xl font-bold transition-all">
                    Read the Story
                  </button>
                </div>
              </div>

              <div className="flex-1 flex justify-center">
                <div className="relative w-[300px] md:w-[450px] aspect-square">
                  <div className="absolute inset-0 bg-[#D4AF37] blur-[80px] opacity-20 rounded-full"></div>
                  <Image src="/images/hachiko/hachiko-family.webp" alt="Hachiko" fill className="object-contain drop-shadow-2xl relative z-10" priority />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: TOKEN */}
        <section className="min-w-full h-full snap-start pt-16 bg-[#151515]">
          <div className="w-full h-full overflow-y-auto px-4 py-8 custom-scrollbar">
            <div className="min-h-full flex flex-col items-center justify-center max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-[#F59E0B]">Hachiko Token</h2>
                <p className="text-[#DBEAFE] mt-2">Built on Solana. Designed for loyalty.</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 w-full">
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Image src="/solana.svg" alt="SOL" width={24} height={24} /> Contract Address
                    </h3>
                    <div className="relative">
                      <input type="text" value={contractAddress} readOnly className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-gray-300 focus:outline-none" />
                      <button onClick={copyToClipboard} className="absolute right-2 top-2 bottom-2 bg-[#D4AF37] text-black px-3 rounded text-xs font-bold hover:bg-[#D4AF37]/90">
                        {copiedAddress ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <a
                      href="https://pump.fun"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                    >
                      <Image src="/icons/pumpfun.png" alt="Pump.fun" width={18} height={18} />
                      Pump.fun
                    </a>
                    <a
                      href="https://solscan.io"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                    >
                      <Image src="/icons/solscan.png" alt="Solscan" width={18} height={18} />
                      Solscan
                    </a>
                    <a
                      href="https://t.me/HachikoFunCom"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                    >
                      <Image src="/icons/telegram.svg" alt="Telegram" width={18} height={18} />
                      Telegram
                    </a>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-semibold text-[#D4AF37] mb-3">Community</div>
                    <div className="min-h-[220px]">
                      <Script
                        src="https://telegram.org/js/telegram-widget.js?22"
                        strategy="lazyOnload"
                        data-telegram-post="HachikoFunCom/2"
                        data-width="100%"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="text-[#D4AF37] font-bold text-lg">1B Supply</div>
                      <div className="text-xs text-white/60">Total Token Supply</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="text-[#D4AF37] font-bold text-lg">0% Tax</div>
                      <div className="text-xs text-white/60">Buy/Sell Tax</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="text-[#D4AF37] font-bold text-lg">Mint Revoked</div>
                      <div className="text-xs text-white/60">Fixed Supply</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="text-[#D4AF37] font-bold text-lg">Liquidity</div>
                      <div className="text-xs text-white/60">Burned on Raydium</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-1 border border-white/10 overflow-hidden min-h-[300px]">
                  <ChartChatView />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: SYMBOLS */}
        <section className="min-w-full h-full snap-start pt-16">
          <div className="w-full h-full overflow-y-auto px-4 py-8 custom-scrollbar">
            <div className="min-h-full flex flex-col items-center justify-center max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-[#F59E0B] mb-12 text-center">Symbols of Devotion</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {[
                  { icon: ClockIcon, title: "9 Years", desc: "The duration of his daily vigil at Shibuya." },
                  { icon: MapPinIcon, title: "Shibuya", desc: "The station where the legend was born." },
                  { icon: HeartIcon, title: "Loyalty", desc: "The virtue that defines our community." },
                  { icon: SparklesIcon, title: "Statue", desc: "The bronze monument honoring his spirit." }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 p-8 rounded-3xl border border-[#D4AF37]/20 hover:-translate-y-2 transition-all duration-300">
                    <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mb-6">
                      <item.icon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: LORE */}
        <section className="min-w-full h-full snap-start pt-16 bg-[#151515]">
          <div className="w-full h-full overflow-y-auto px-4 py-8 custom-scrollbar">
            <div className="min-h-full flex flex-col items-center justify-center max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-[#F59E0B] mb-12">The Lore</h2>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-[#FEF3C7] mb-2">The Beginning</h3>
                    <p className="text-white/80 leading-relaxed">Born in 1923, Hachiko formed an unbreakable bond with Professor Ueno. Every day, they walked to the station together, and every evening, Hachiko was there to welcome him home.</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-[#FEF3C7] mb-2">The Vigil</h3>
                    <p className="text-white/80 leading-relaxed">After the Professor's sudden death in 1925, Hachiko continued to return to Shibuya Station every single day for nearly 10 years, waiting for a reunion that would never come in this life.</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                  <div className="space-y-6 border-l-2 border-[#D4AF37]/30 ml-2 pl-8 relative">
                    {[
                      { year: "1923", text: "Born in Odate, Akita Prefecture." },
                      { year: "1925", text: "Professor Ueno passes away. The vigil begins." },
                      { year: "1934", text: "Bronze statue unveiled at Shibuya." },
                      { year: "1935", text: "Hachiko passes away, becoming a legend." }
                    ].map((item, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#D4AF37] border-4 border-[#1a1a1a]"></div>
                        <div className="text-[#D4AF37] font-bold">{item.year}</div>
                        <div className="text-white/70 text-sm">{item.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: GALLERY */}
        <section className="min-w-full h-full snap-start pt-16">
          <div className="w-full h-full overflow-y-auto px-4 py-8 custom-scrollbar">
            <div className="min-h-full flex flex-col items-center justify-center max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-[#F59E0B] mb-8">Historical Archives</h2>
              <div className="grid md:grid-cols-3 gap-4 w-full">
                {galleryImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`relative group rounded-xl overflow-hidden cursor-pointer border border-white/10 aspect-[4/3] ${idx === 0 ? 'md:col-span-2 md:row-span-2 md:aspect-auto' : ''}`}
                    onClick={() => setLightboxIndex(idx)}
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white font-medium text-sm">{img.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: WISDOM */}
        <section className="min-w-full h-full snap-start pt-16 bg-[#151515]">
          <div className="w-full h-full overflow-y-auto px-4 py-8 custom-scrollbar">
            <div className="min-h-full flex flex-col items-center justify-center max-w-5xl mx-auto">
              <h2 className="text-4xl font-bold text-[#F59E0B] mb-6">Wisdom of Hachiko</h2>
              <p className="text-center text-white/60 mb-12 max-w-2xl">Generate daily wisdom cards inspired by loyalty and perseverance.</p>
              <div className="w-full">
                <LoyaltyFortuneGenerator />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: FAQ */}
        <section className="min-w-full h-full snap-start pt-16">
          <div className="w-full h-full overflow-y-auto px-4 py-8 custom-scrollbar">
            <div className="min-h-full flex flex-col items-center justify-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-[#F59E0B] mb-12">FAQ</h2>
              <div className="space-y-4 w-full">
                {[
                  { q: "Where can I buy Hachiko token?", a: "Hachiko is available on pump.fun on the Solana network." },
                  { q: "Is this an official project?", a: "This is a community-driven tribute project honoring the legacy of Hachiko." },
                  { q: "What is the token utility?", a: "It serves as a governance token for community initiatives and a digital collectible." }
                ].map((faq, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-6 border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                    <p className="text-white/70 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
              <footer className="mt-16 text-center text-white/30 text-sm pb-8">
                © 2026 Hachiko Token | Preserving the Legacy
              </footer>
            </div>
          </div>
        </section>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4" onClick={() => setLightboxIndex(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white p-2" onClick={() => setLightboxIndex(null)}>
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center">
            <div className="relative w-full h-[80vh]">
              <Image src={galleryImages[lightboxIndex].src} alt={galleryImages[lightboxIndex].alt} fill className="object-contain" />
            </div>
            <p className="text-white/90 mt-4 text-lg font-medium">{galleryImages[lightboxIndex].label}</p>
          </div>
        </div>
      )}

      {/* Navigation Arrows (Optional, for desktop clarity) */}
      <div className="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 z-40 text-white/20 hover:text-[#D4AF37] cursor-pointer" onClick={() => scrollToSection(Math.max(0, activeSection - 1))}>
        {activeSection > 0 && <ChevronLeft className="w-10 h-10" />}
      </div>
      <div className="hidden md:block fixed right-4 top-1/2 -translate-y-1/2 z-40 text-white/20 hover:text-[#D4AF37] cursor-pointer" onClick={() => scrollToSection(Math.min(sections.length - 1, activeSection + 1))}>
        {activeSection < sections.length - 1 && <ChevronRight className="w-10 h-10" />}
      </div>
    </div>
  );
}
