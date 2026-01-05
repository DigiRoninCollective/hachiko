"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { 
  HeartIcon, 
  ClockIcon,
  SparklesIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import LoyaltyFortuneGenerator from "@/components/LoyaltyFortuneGenerator";
import ChartChatView from "@/components/ChartChatView";
import SolUsdcChart from "@/components/SolUsdcChart";

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

  const contractAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

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
    if (containerRef?.current) {
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
    const container = containerRef?.current;
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
            <div className="min-h-full max-w-6xl mx-auto">
              
              {/* Contract Address - Moved to top */}
              <div className="w-full max-w-2xl mx-auto mb-8">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-[rgba(245,158,11,0.3)]">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 justify-center">
                    <svg width="16" height="16" viewBox="0 0 643 643" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="643" height="643" fill="black"/>
                      <path d="M447.21 246.604C445.092 248.75 442.22 249.955 439.225 249.955H156.315C146.316 249.955 141.25 237.761 148.241 230.519L194.646 182.442C196.771 180.241 199.681 179 202.72 179H486.685C496.745 179 501.784 191.321 494.67 198.527L447.21 246.604Z" fill="url(#gradient1)"/>
                      <path d="M447.21 461.326C445.092 463.418 442.22 464.593 439.225 464.593H156.315C146.316 464.593 141.25 452.704 148.241 445.643L194.646 398.768C196.771 396.622 199.681 395.412 202.72 395.412H486.685C496.745 395.412 501.784 407.425 494.67 414.451L447.21 461.326Z" fill="url(#gradient2)"/>
                      <path d="M447.21 290.473C445.092 288.381 442.22 287.206 439.225 287.206L156.315 287.206C146.316 287.206 141.25 299.095 148.241 306.156L194.646 353.031C196.771 355.177 199.681 356.387 202.72 356.387L486.685 356.387C496.745 356.387 501.784 344.374 494.67 337.348L447.21 290.473Z" fill="url(#gradient3)"/>
                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00D4FF"/>
                          <stop offset="100%" stopColor="#14F195"/>
                        </linearGradient>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#14F195"/>
                          <stop offset="100%" stopColor="#00D4FF"/>
                        </linearGradient>
                        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00D4FF"/>
                          <stop offset="50%" stopColor="#14F195"/>
                          <stop offset="100%" stopColor="#00D4FF"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    Contract Address
                  </h3>
                  <div className="relative">
                    <input type="text" value={contractAddress} readOnly className="w-full bg-black/30 border border-[rgba(245,158,11,0.3)] rounded-lg px-4 py-3 font-mono text-sm text-gray-300 focus:outline-none text-center" />
                    <button onClick={copyToClipboard} className="absolute right-2 top-2 bottom-2 bg-[#D4AF37] text-black px-3 rounded text-xs font-bold hover:bg-[#D4AF37]/90">
                      {copiedAddress ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Hero Content - Left Title, Right Image */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                <div className="flex-1 text-center md:text-left space-y-6">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#D4AF37]">
                    Hachiko
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 max-w-xl">
                    Japan&apos;s Most Loyal Dog — A Story of Unwavering Devotion Reborn on Solana.
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
                    <a
                      href="https://jup.ag/swap/SOL-EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto bg-gradient-to-r from-[#D4AF37] to-[#C2B280] hover:from-[#D4AF37]/90 hover:to-[#C2B280]/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                      </svg>
                      Buy $HACHIKO
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
          </div>
        </section>

        {/* SECTION 2: DASHBOARD */}
        <section className="min-w-full h-full snap-start pt-16 bg-[#151515]">
          <div className="w-full h-full overflow-y-auto px-4 py-8 custom-scrollbar">
            <div className="min-h-full max-w-6xl mx-auto">
              
              {/* 2x2 Grid Layout */}
              <div className="grid lg:grid-cols-2 gap-6 h-full">
                
                {/* Chart - Top Left */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <SolUsdcChart />
                </div>

                {/* Chat - Top Right */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">💬</span>
                      <h3 className="text-lg font-bold text-[#D4AF37]">Community Chat</h3>
                    </div>
                  </div>
                  <div className="h-96">
                    <ChartChatView />
                  </div>
                </div>

                {/* Bottom Left - Additional Content or Spacer */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Token Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="text-[#D4AF37] font-bold text-lg">0</div>
                      <div className="text-xs text-white/60">Holders</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="text-[#D4AF37] font-bold text-lg">1B</div>
                      <div className="text-xs text-white/60">Total Supply</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="text-[#D4AF37] font-bold text-lg">$0</div>
                      <div className="text-xs text-white/60">Market Cap</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="text-[#D4AF37] font-bold text-lg">0%</div>
                      <div className="text-xs text-white/60">24h Change</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Right - Additional Content or Spacer */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
                  <div className="space-y-3">
                    <a
                      href="https://pump.fun"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all w-full"
                    >
                      <Image src="/icons/pumpfun.png" alt="Pump.fun" width={16} height={16} />
                      Pump.fun
                    </a>
                    <a
                      href="https://solscan.io"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all w-full"
                    >
                      <Image src="/icons/solscan.png" alt="Solscan" width={16} height={16} />
                      Solscan
                    </a>
                    <a
                      href="https://t.me/HachikoFunCom"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all w-full"
                    >
                      <Image src="/icons/telegram.svg" alt="Telegram" width={16} height={16} />
                      Telegram
                    </a>
                    <a
                      href="https://jupiter.ag"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-[rgba(245,158,11,0.3)] bg-[#D4AF37]/20 py-3 text-sm font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/30 transition-all w-full"
                    >
                      <Image src="/icons/jupiter.png" alt="Jupiter" width={16} height={16} />
                      Jupiter Swap
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* SECTION 3: SYMBOLS */}
        <section className="min-w-full h-full snap-start pt-16 bg-gradient-to-b from-[#151515] to-[#1a1a1a]">
          <div className="w-full h-full overflow-y-auto px-4 py-8 custom-scrollbar">
            <div className="min-h-full max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl md:text-6xl font-bold text-[#D4AF37] mb-4">Symbols of Devotion</h2>
                <p className="text-xl text-white/80">The enduring legacy of Hachiko's unwavering loyalty</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                {[
                  { 
                    icon: ClockIcon, 
                    title: "9 Years", 
                    desc: "The duration of his daily vigil at Shibuya Station.",
                    bg: "from-[#D4AF37]/10 to-[#C2B280]/10",
                    borderColor: "border-[#D4AF37]/30",
                    iconColor: "text-[#D4AF37]"
                  },
                  { 
                    icon: MapPinIcon, 
                    title: "Shibuya", 
                    desc: "The legendary Tokyo station where history was made.",
                    bg: "from-[#F59E0B]/10 to-[#D4AF37]/10", 
                    borderColor: "border-[#F59E0B]/30",
                    iconColor: "text-[#F59E0B]"
                  },
                  { 
                    icon: HeartIcon, 
                    title: "Loyalty", 
                    desc: "The virtue that defines our community and mission.",
                    bg: "from-[#C2B280]/10 to-[#D4AF37]/10",
                    borderColor: "border-[#C2B280]/30", 
                    iconColor: "text-[#C2B280]"
                  },
                  { 
                    icon: SparklesIcon, 
                    title: "Legacy", 
                    desc: "The bronze monument that immortalizes his spirit.",
                    bg: "from-[#D4AF37]/10 to-[#F59E0B]/10",
                    borderColor: "border-[#D4AF37]/30",
                    iconColor: "text-[#D4AF37]"
                  }
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className={`group relative bg-gradient-to-br ${item.bg} p-8 rounded-3xl border ${item.borderColor} hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden`}
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 bg-gradient-to-br ${item.bg} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border ${item.borderColor}`}>
                        <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors duration-300">{item.title}</h3>
                      <p className="text-white text-base leading-relaxed font-medium">{item.desc}</p>
                    </div>
                    
                    {/* Hover glow effect */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${item.bg} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}></div>
                  </div>
                ))}
              </div>

              {/* Who Was Hachiko Section */}
              <div className="mb-20">
                <h3 className="text-3xl font-bold text-[#D4AF37] mb-8 text-center">Who Was Hachiko?</h3>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#C2B280]/10 p-6 rounded-2xl border border-[#D4AF37]/30">
                      <h4 className="text-xl font-bold text-[#D4AF37] mb-3">The Beginning</h4>
                      <p className="text-white leading-relaxed">
                        Born in 1923 in Odate, Akita Prefecture, Hachiko was a golden Akita puppy adopted by Professor Hidesaburo Ueno, a distinguished professor at the University of Tokyo. Their bond began in 1924 when Hachiko was just 2 months old.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-[#F59E0B]/10 to-[#D4AF37]/10 p-6 rounded-2xl border border-[#F59E0B]/30">
                      <h4 className="text-xl font-bold text-[#F59E0B] mb-3">The Daily Ritual</h4>
                      <p className="text-white leading-relaxed">
                        Every morning, Hachiko would accompany Professor Ueno to Shibuya Station and return each evening at 3 PM to greet him when his train arrived. This daily routine continued for over a year, creating an unbreakable bond between them.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-[#C2B280]/10 to-[#D4AF37]/10 p-6 rounded-2xl border border-[#C2B280]/30">
                      <h4 className="text-xl font-bold text-[#C2B280] mb-3">The Tragedy</h4>
                      <p className="text-white leading-relaxed">
                        On May 21, 1925, Professor Ueno suffered a cerebral hemorrhage and died suddenly at work, never to return to Shibuya Station. But Hachiko, not understanding death, continued his daily vigil, waiting for his beloved owner to return.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#F59E0B]/10 p-6 rounded-2xl border border-[#D4AF37]/30">
                      <h4 className="text-xl font-bold text-[#D4AF37] mb-3">The Vigil</h4>
                      <p className="text-white leading-relaxed">
                        For nearly 10 years, Hachiko returned to Shibuya Station every single day, waiting patiently from morning until evening. Through harsh winters, scorching summers, rain and snow, he never missed a day - 3,650+ days of unwavering devotion.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-[#F59E0B]/10 to-[#C2B280]/10 p-6 rounded-2xl border border-[#F59E0B]/30">
                      <h4 className="text-xl font-bold text-[#F59E0B] mb-3">Community Response</h4>
                      <p className="text-white leading-relaxed">
                        Station workers and local vendors cared for Hachiko, providing food and shelter. News of his loyalty spread throughout Japan, drawing visitors from across the country to witness this faithful dog's extraordinary devotion.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-[#C2B280]/10 to-[#D4AF37]/10 p-6 rounded-2xl border border-[#C2B280]/30">
                      <h4 className="text-xl font-bold text-[#C2B280] mb-3">The Legacy</h4>
                      <p className="text-white leading-relaxed">
                        Hachiko passed away on March 8, 1935, but his story became immortal. A bronze statue was unveiled at Shibuya Station in 1934, and today he remains Japan's most beloved symbol of loyalty, teaching millions about the power of unconditional love.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Section */}
              <div className="mb-16">
                <h3 className="text-3xl font-bold text-[#D4AF37] mb-8 text-center">Gallery of Memories</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryImages.map((image, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-2xl cursor-pointer"
                      onClick={() => setLightboxIndex(index)}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white font-semibold text-sm">{image.label}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive quote section */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#C2B280]/10 rounded-3xl p-8 border border-[#D4AF37]/20">
                  <blockquote className="text-2xl text-white/90 italic mb-4">
                    "Loyalty is not just a virtue, it's the very essence of what makes us human."
                  </blockquote>
                  <cite className="text-[#D4AF37] font-semibold">— The Spirit of Hachiko</cite>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: LORE */}
        <section className="min-w-full h-full snap-start pt-16 bg-gradient-to-b from-[#151515] to-[#0f0f0f]">
          <div className="w-full h-full overflow-y-auto px-4 py-8 custom-scrollbar">
            <div className="min-h-full max-w-7xl mx-auto">
              {/* Hero Lore Header */}
              <div className="text-center mb-20">
                <h2 className="text-6xl md:text-7xl font-bold text-[#D4AF37] mb-6">The Legend</h2>
                <p className="text-2xl text-white/90 max-w-3xl mx-auto">A tale of unwavering devotion that touched the hearts of millions</p>
              </div>

              {/* Story Cards - Hachiko's Loyalty */}
              <div className="grid md:grid-cols-3 gap-8 mb-20">
                {[
                  {
                    title: "The Daily Promise",
                    desc: "Every morning at dawn, Hachiko would walk to Shibuya Station, waiting patiently until the evening trains arrived. For 3,650+ days, he never missed his vigil, demonstrating a loyalty that transcended human understanding.",
                    quote: "He waited for a master who would never return.",
                    stat: "10 years"
                  },
                  {
                    title: "Through Storm and Shine", 
                    desc: "Through harsh winters, scorching summers, rain and snow, Hachiko remained faithful. Station workers and local vendors cared for him, but his focus never wavered from the spot where he last saw his beloved owner.",
                    quote: "Weather could not break his spirit.",
                    stat: "Every season"
                  },
                  {
                    title: "A Nation's Heart",
                    desc: "News of Hachiko's unwavering loyalty spread throughout Japan. People traveled from far and wide to witness this faithful dog. His story became a symbol of pure devotion, teaching millions about the power of unconditional love.",
                    quote: "His loyalty became Japan's treasure.",
                    stat: "Millions inspired"
                  }
                ].map((item, i) => (
                  <div key={i} className="group relative">
                    <div className="bg-gradient-to-br from-[#D4AF37]/5 to-[#C2B280]/5 p-8 rounded-2xl border border-[#D4AF37]/20 hover:scale-105 transition-all duration-500">
                      <h4 className="text-2xl font-bold text-[#D4AF37] mb-4">{item.title}</h4>
                      <p className="text-white text-base leading-relaxed mb-6">{item.desc}</p>
                      <div className="bg-black/30 rounded-lg p-4 mb-4">
                        <p className="text-[#D4AF37] italic text-center">"{item.quote}"</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#D4AF37]">{item.stat}</div>
                        <div className="text-white/60 text-sm">Duration</div>
                      </div>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/20 to-[#C2B280]/20 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 rounded-2xl"></div>
                  </div>
                ))}
              </div>

              {/* Interactive Timeline */}
              <div className="mb-20">
                <h3 className="text-3xl font-bold text-[#D4AF37] mb-12 text-center">Journey Through Time</h3>
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#D4AF37] to-[#C2B280] opacity-30"></div>
                  
                  <div className="space-y-16">
                    {[
                      {
                        year: "1923",
                        title: "The Beginning",
                        desc: "A golden Akita puppy is born in Odate, Akita Prefecture, destined for greatness.",
                        side: "left"
                      },
                      {
                        year: "1924", 
                        title: "A New Family",
                        desc: "Professor Hidesaburo Ueno adopts Hachiko, beginning their extraordinary bond.",
                        side: "right"
                      },
                      {
                        year: "1925",
                        title: "The Promise Broken", 
                        desc: "Professor Ueno suddenly passes away, but Hachiko's vigil begins.",
                        side: "left"
                      },
                      {
                        year: "1934",
                        title: "Memorial Born",
                        desc: "A bronze statue is unveiled at Shibuya Station, honoring Hachiko's loyalty.",
                        side: "right"
                      },
                      {
                        year: "1935",
                        title: "Legacy Immortalized",
                        desc: "Hachiko passes away, but his spirit lives on in the hearts of millions.",
                        side: "left"
                      }
                    ].map((item, i) => (
                      <div key={i} className={`relative flex items-center ${item.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                        {/* Timeline Dot */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[#D4AF37] border-4 border-[#0f0f0f] z-10">
                          <div className="absolute inset-1 rounded-full bg-[#D4AF37] animate-pulse"></div>
                        </div>
                        
                        {/* Content Card */}
                        <div className={`w-full md:w-5/12 ${item.side === 'left' ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                          <div className="group bg-gradient-to-br from-[#D4AF37]/10 to-[#C2B280]/10 p-8 rounded-2xl border border-[#D4AF37]/30 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37]/20 to-[#C2B280]/20 rounded-full flex items-center justify-center">
                                <div className="w-4 h-4 bg-[#D4AF37] rounded-full"></div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-[#D4AF37]">{item.year}</div>
                                <div className="text-xl font-semibold text-white">{item.title}</div>
                              </div>
                            </div>
                            <p className="text-white text-base leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#C2B280]/10 rounded-3xl p-12 border border-[#D4AF37]/20">
                  <h3 className="text-3xl font-bold text-[#D4AF37] mb-4">Carry the Legacy Forward</h3>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Hachiko's story teaches us that true loyalty transcends time and circumstance. 
                    Join us in building a community that honors this eternal virtue.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button className="bg-gradient-to-r from-[#D4AF37] to-[#C2B280] hover:from-[#D4AF37]/90 hover:to-[#C2B280]/90 text-white px-8 py-3 rounded-xl font-bold transition-all hover:-translate-y-1">
                      Join the Community
                    </button>
                    <button className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 px-8 py-3 rounded-xl font-bold transition-all">
                      Share the Story
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: WISDOM */}
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

        {/* SECTION 6: FAQ */}
        <section className="min-w-full h-full snap-start pt-16 bg-[#151515]">
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
