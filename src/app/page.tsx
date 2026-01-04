"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ExternalLink, Copy, Check, TrendingUp, Eye } from "lucide-react";
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
import ChartChatView from "@/components/ChartChatView";

export default function Home() {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    // Initialize scroll position on mount
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: 0, behavior: 'auto' });
    }
  }, []);


  const sections = [
    { id: "hero", title: "Home" },
    { id: "token", title: "Token" },
    { id: "proof", title: "Symbols" },
    { id: "community", title: "Lore" },
    { id: "gallery", title: "Gallery" },
    { id: "wisdom", title: "Wisdom" },
    { id: "faq", title: "FAQ" }
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
      const containerWidth = container.clientWidth;
      const targetScroll = containerWidth * index;

      // Use smooth scrolling with a more reliable approach
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth"
      });

      // Update active section after a short delay to ensure scroll completes
      setTimeout(() => {
        setActiveSection(index);

        // Ensure the container is scrolled to the exact position
        if (containerRef.current) {
          const currentContainer = containerRef.current;
          const currentScroll = currentContainer.scrollLeft;
          if (Math.abs(currentScroll - targetScroll) > 1) {
            // If we're not exactly at the target, adjust to the exact position
            currentContainer.scrollTo({
              left: targetScroll,
              behavior: "auto" // Use auto to avoid animation conflicts
            });
          }
        }
      }, 300);
    }
  };

  // Debounce scroll event to improve performance
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;

      // Calculate the current section based on scroll position
      let currentSection = 0;
      if (containerWidth > 0) {
        currentSection = Math.round(scrollLeft / containerWidth);
        // Ensure we don't exceed the number of sections
        currentSection = Math.min(currentSection, sections.length - 1);
        currentSection = Math.max(currentSection, 0);
      }

      // Only update if we've moved to a different section
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    }
  };

  const debouncedHandleScroll = debounce(handleScroll, 150);

  // Add a cleanup function for the scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", debouncedHandleScroll);
      return () => container.removeEventListener("scroll", debouncedHandleScroll);
    }
  }, [debouncedHandleScroll]); // Include debouncedHandleScroll in the dependency array

  // Ensure proper cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Clear any pending timeouts to prevent memory leaks
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#1a1a1a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(26,26,26,0.95)] backdrop-blur-md border-b border-[rgba(212,175,55,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <svg className="w-7 h-7 text-[#D4AF37]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C10.9 2 10 2.9 10 4C10 4.74 10.4 5.38 11 5.73V8C9 8 7.5 9.5 7.5 11.5C7.5 11.85 7.57 12.19 7.69 12.5L6.5 13.5C6.19 13.19 5.85 13 5.5 13C4.67 13 4 13.67 4 14.5C4 15.33 4.67 16 5.5 16C5.85 16 6.19 15.81 6.5 15.5L7.69 16.5C8.45 17.44 9.64 18 11 18H13C14.36 18 15.55 17.44 16.31 16.5L17.5 15.5C17.81 15.81 18.15 16 18.5 16C19.33 16 20 15.33 20 14.5C20 13.67 19.33 13 18.5 13C18.15 13 17.81 13.19 17.5 13.5L16.31 12.5C16.43 12.19 16.5 11.85 16.5 11.5C16.5 9.5 15 8 13 8V5.73C13.6 5.38 14 4.74 14 4C14 2.9 13.1 2 12 2M12 9C13.1 9 14 9.9 14 11C14 12.1 13.1 13 12 13C10.9 13 10 12.1 10 11C10 9.9 10.9 9 12 9M10 20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20H10Z" />
              </svg>
              <span className="text-xl font-bold text-[#D4AF37]">Hachiko</span>
            </div>
            <div className="hidden md:flex space-x-8">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(index)}
                  className={`hover:text-[#D4AF37] transition-colors text-white ${
                    activeSection === index ? "text-[#C2B280]" : ""
                  }`}
                  aria-label={`Go to ${section.title} section`}
                  aria-current={activeSection === index ? "page" : undefined}
                >
                  {section.title}
                </button>
              ))}
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md p-1"
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden bg-[#1a1a1a] border-t border-[rgba(212,175,55,0.3)]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => {
                    scrollToSection(index);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    activeSection === index
                      ? "text-[#C2B280] bg-[#D4AF37]/10"
                      : "text-white hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                  }`}
                  aria-label={`Go to ${section.title} section`}
                  aria-current={activeSection === index ? "page" : undefined}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Horizontal Scrolling Container */}
      <div
        ref={containerRef}
        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch', // For better touch scrolling on iOS
          scrollSnapType: 'x mandatory' // Additional CSS for better snap behavior
        }}
        onTouchStart={(e) => {
          // Store the initial touch position for swipe detection
          const touchStartX = e.touches[0].clientX;
          const element = e.currentTarget;

          const handleTouchMove = (moveEvent: TouchEvent) => {
            const touchCurrentX = moveEvent.touches[0].clientX;
            const diffX = touchStartX - touchCurrentX;

            // If swipe is significant, prevent default to allow horizontal scroll
            if (Math.abs(diffX) > 5) {
              // Allow the default horizontal scrolling behavior
            }
          };

          const handleTouchEnd = (endEvent: TouchEvent) => {
            // Calculate final position and potentially snap to section
            const touchEndX = endEvent.changedTouches[0].clientX;
            const diffX = touchStartX - touchEndX;

            // Determine direction of swipe
            if (Math.abs(diffX) > 30) { // Minimum swipe distance
              if (diffX > 0) {
                // Swiping left - go to next section
                if (activeSection < sections.length - 1) {
                  scrollToSection(activeSection + 1);
                }
              } else {
                // Swiping right - go to previous section
                if (activeSection > 0) {
                  scrollToSection(activeSection - 1);
                }
              }
            } else {
              // If swipe was not significant, snap back to current section
              scrollToSection(activeSection);
            }

            // Remove event listeners
            element.removeEventListener('touchmove', handleTouchMove as any);
            element.removeEventListener('touchend', handleTouchEnd as any);
          };

          element.addEventListener('touchmove', handleTouchMove as any, { passive: false });
          element.addEventListener('touchend', handleTouchEnd as any);
        }}
      >
        {/* Hero Section */}
        <section className="min-w-full h-full flex-shrink-0 flex items-center justify-center snap-start relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(26,26,26,0.9)] via-[rgba(212,175,55,0.3)] to-[rgba(194,178,128,0.2)]"></div>
          <div className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto px-4">
            <div className="flex-1 text-left">
              <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-[#D4AF37] bg-clip-text text-transparent">
                Hachiko
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white max-w-2xl">
                Japan's Most Loyal Dog - A Story of Unwavering Devotion
              </p>
              <div className="flex flex-wrap gap-8 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#D4AF37]">10+</div>
                  <div className="text-sm text-[#C2B280]">Years of Waiting</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#D4AF37]">1935</div>
                  <div className="text-sm text-[#C2B280]">Legacy Year</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#D4AF37]">∞</div>
                  <div className="text-sm text-[#C2B280]">Infinite Loyalty</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://pump.fun"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black px-8 py-3 rounded-lg font-semibold transition-all inline-flex items-center"
                >
                  Buy on pump.fun
                </a>
                <button
                  onClick={() => scrollToSection(3)}
                  className="border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 px-8 py-3 rounded-lg font-semibold transition-all inline-flex items-center"
                >
                  Read the Story
                </button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-96 h-96">
                <Image
                  src="/images/hachiko/hachiko-family.webp"
                  alt="Hachiko"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contract Address Section */}
        <section className="min-w-full h-full flex-shrink-0 flex items-center justify-center px-4 snap-start">
          <div className="w-full max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-[rgba(212,175,55,0.3)]">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Image src="/solana.svg" alt="Solana" width={32} height={32} />
                  <h2 className="text-2xl font-bold text-[#D4AF37]">
                    Hachiko Token on Solana
                  </h2>
                </div>
                <div className="bg-[#1a1a1a] text-[#D4AF37] px-3 py-1 rounded-full text-sm font-semibold border border-[#D4AF37]/40">
                  Launching on pump.fun
                </div>
              </div>
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={contractAddress}
                    readOnly
                    className="flex-1 bg-[#1a1a1a] border border-[rgba(212,175,55,0.3)] rounded-lg px-4 py-3 font-mono text-white"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
                  >
                    {copiedAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedAddress ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#1a1a1a]/30 text-white px-3 py-1 rounded-full text-sm">Solana</span>
                  <span className="bg-[#1a1a1a]/30 text-white px-3 py-1 rounded-full text-sm">pump.fun launch</span>
                  <span className="bg-[#1a1a1a]/30 text-white px-3 py-1 rounded-full text-sm">Bonding curve to Raydium</span>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-[1fr,1.1fr]">
                <div className="flex flex-wrap gap-4">
                  <a href="https://pump.fun" target="_blank" rel="noreferrer" className="bg-gradient-to-r from-[#1a1a1a] to-[#D4AF37] hover:from-[#1a1a1a]/90 hover:to-[#D4AF37]/90 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Buy on pump.fun
                  </a>
                  <a href="https://solscan.io" target="_blank" rel="noreferrer" className="bg-gradient-to-r from-[#1a1a1a] to-[#D4AF37] hover:from-[#1a1a1a]/90 hover:to-[#D4AF37]/90 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Solscan
                  </a>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-semibold text-[#D4AF37] mb-3">How to Buy</h3>
                  <ol className="space-y-2 text-[#DBEAFE] text-sm">
                    <li>1. Get a Solana wallet (Phantom or Solflare).</li>
                    <li>2. Fund it with SOL from your exchange.</li>
                    <li>3. Buy on pump.fun using the contract address.</li>
                    <li>4. Track price and volume after Raydium migration.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="min-w-full h-full flex-shrink-0 flex items-center justify-center px-4 overflow-y-auto snap-start">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-[#F59E0B]">The Story of Hachiko</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-[#FEF3C7] flex items-center gap-2">
                  <BookOpenIcon className="w-6 h-6" />
                  The Beginning
                </h3>
                <p className="text-lg mb-6 text-[#DBEAFE]">
                  Hachiko was born on November 10, 1923, in Odate, Akita Prefecture, Japan. He was brought to Tokyo in 1924 by his owner, Professor Hidesaburō Ueno, a professor at the Imperial University of Tokyo.
                </p>
                <h3 className="text-2xl font-semibold mb-4 text-[#FEF3C7] flex items-center gap-2">
                  <AcademicCapIcon className="w-6 h-6" />
                  The Bond
                </h3>
                <p className="text-lg mb-6 text-[#DBEAFE]">
                  Professor Ueno and Hachiko formed an incredibly strong bond. Each day, Hachiko would accompany his owner to Shibuya Station and wait for him to return from work.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-[#FEF3C7] flex items-center gap-2">
                  <HeartIcon className="w-6 h-6" />
                  The Tragedy
                </h3>
                <p className="text-lg mb-6 text-[#DBEAFE]">
                  On May 21, 1925, Professor Ueno suffered a fatal brain hemorrhage while at work and never returned home. Hachiko was just 18 months old.
                </p>
                <h3 className="text-2xl font-semibold mb-4 text-[#FEF3C7] flex items-center gap-2">
                  <ClockIcon className="w-6 h-6" />
                  The Vigil
                </h3>
                <p className="text-lg mb-6 text-[#DBEAFE]">
                  For the next 9 years, 9 months, and 15 days, Hachiko continued to wait at Shibuya Station every day, precisely when the trains were due, hoping his owner would return.
                </p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-[rgba(245,158,11,0.3)]">
              <h3 className="text-2xl font-semibold mb-4 text-[#F59E0B] flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6" />
                Key Facts
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="w-5 h-5 text-[#F59E0B]" />
                    <span className="font-semibold text-[#FEF3C7]">Timeline</span>
                  </div>
                  <p className="text-[#DBEAFE]">1923-1935 (12 years)</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPinIcon className="w-5 h-5 text-[#F59E0B]" />
                    <span className="font-semibold text-[#FEF3C7]">Location</span>
                  </div>
                  <p className="text-[#DBEAFE]">Shibuya Station, Tokyo</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ClockIcon className="w-5 h-5 text-[#F59E0B]" />
                    <span className="font-semibold text-[#FEF3C7]">Daily Routine</span>
                  </div>
                  <p className="text-[#DBEAFE]">Waited 10+ years daily</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Image Library Section */}
        <section className="min-w-full h-full flex-shrink-0 flex items-center justify-center px-4 overflow-y-auto snap-start">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-[#F59E0B]">Hachiko Image Library</h2>
            <p className="text-xl text-center mb-12 text-[#DBEAFE] max-w-3xl">
              A comprehensive visual archive documenting Hachiko's life, legacy, and cultural impact
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="relative group">
                <div className="relative w-full h-64 bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-[rgba(212,175,55,0.3)]">
                  <Image
                    src="/images/hachiko/hachiko-memorial.jpg"
                    alt="Hachiko Memorial Statue"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-[#D4AF37]">Hachiko Memorial</h3>
                  <p className="text-[#C2B280]">Bronze statue at Shibuya Station</p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="relative w-full h-64 bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-[rgba(212,175,55,0.3)]">
                  <Image
                    src="/images/hachiko/hachiko-funeral.webp"
                    alt="Hachiko Original Photo 1935"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-[#D4AF37]">Original Hachiko</h3>
                  <p className="text-[#C2B280]">Verified photo from 1935</p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="relative w-full h-64 bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-[rgba(212,175,55,0.3)]">
                  <Image
                    src="/images/hachiko/hachiko-family.webp"
                    alt="Historical Hachiko Photo"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-[#D4AF37]">Historical Photo</h3>
                  <p className="text-[#C2B280]">Rare historical image</p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="relative w-full h-64 bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-[rgba(212,175,55,0.3)]">
                  <Image
                    src="/images/hachiko/hachiko-waiting.webp"
                    alt="Historical Hachiko Photo 2"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-[#D4AF37]">Archive Photo</h3>
                  <p className="text-[#C2B280]">Historical archive image</p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="relative w-full h-64 bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-[rgba(212,175,55,0.3)]">
                  <Image
                    src="/images/hachiko/akita-modern.jpg"
                    alt="Modern Akita Inu dog"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-[#D4AF37]">1936 Anniversary</h3>
                  <p className="text-[#C2B280]">One year memorial photo</p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="relative w-full h-64 bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-[rgba(212,175,55,0.3)]">
                  <Image
                    src="/hachiko-curl-5.jpg"
                    alt="Hachiko Historical"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-[#D4AF37]">Vintage Photo</h3>
                  <p className="text-[#C2B280]">Historical period image</p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <a
                href="/hachiko-image-library.html"
                target="_blank"
                className="bg-gradient-to-r from-[#D4AF37] to-[#1a1a1a] hover:from-[#D4AF37]/90 hover:to-[#1a1a1a]/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all inline-flex items-center gap-3"
              >
                <Eye className="w-5 h-5" />
                View Full Image Library
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Token Section */}
        <section className="min-w-full h-full flex-shrink-0 flex items-center justify-center px-4 overflow-y-auto snap-start">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-[#F59E0B]">Hachiko Token</h2>
            <p className="text-xl text-center mb-12 text-[#DBEAFE] max-w-3xl">
              A cryptocurrency celebrating the spirit of unwavering loyalty and devotion
            </p>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-[rgba(245,158,11,0.3)]">
                <h3 className="text-2xl font-semibold mb-6 text-[#F59E0B] flex items-center gap-2">
                  <CurrencyDollarIcon className="w-6 h-6" />
                  Tokenomics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[#FEF3C7]">Total Supply</span>
                    <span className="text-white font-semibold">1,000,000,000 HACHIKO</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#FEF3C7]">Symbol</span>
                    <span className="text-white font-semibold">$HACHIKO</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#FEF3C7]">Decimals</span>
                    <span className="text-white font-semibold">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#FEF3C7]">Network</span>
                    <span className="text-white font-semibold">Ethereum</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-[rgba(245,158,11,0.3)]">
                <h3 className="text-2xl font-semibold mb-6 text-[#F59E0B] flex items-center gap-2">
                  <SparklesIcon className="w-6 h-6" />
                  Features
                </h3>
                <ul className="space-y-3 text-[#DBEAFE]">
                  <li className="flex items-start gap-3">
                    <ShieldCheckIcon className="w-5 h-5 text-[#F59E0B] mt-1 flex-shrink-0" />
                    <span>Loyalty rewards for long-term holders</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <HeartIcon className="w-5 h-5 text-[#F59E0B] mt-1 flex-shrink-0" />
                    <span>Community-driven charitable initiatives</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrophyIcon className="w-5 h-5 text-[#F59E0B] mt-1 flex-shrink-0" />
                    <span>NFT collection of historical moments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <GlobeAltIcon className="w-5 h-5 text-[#F59E0B] mt-1 flex-shrink-0" />
                    <span>Global awareness campaigns</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Chart and Chat Section */}
            <div className="mt-8 h-[500px]">
              <ChartChatView />
            </div>
          </div>
        </section>

        {/* Wisdom Section */}
        <section className="min-w-full h-full flex-shrink-0 flex items-center justify-center px-4 overflow-y-auto snap-start">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-[#F59E0B]">Wisdom of Hachiko</h2>
            <p className="text-xl text-center mb-12 text-[#DBEAFE] max-w-3xl">
              Timeless lessons from Japan's most loyal companion
            </p>

            <LoyaltyFortuneGenerator />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="min-w-full h-full flex-shrink-0 flex items-center justify-center px-4 overflow-y-auto snap-start">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-[rgba(212,175,55,0.3)]">
              <h2 className="text-2xl font-bold text-[#F59E0B] mb-6 flex items-center gap-2">
                <QuestionMarkCircleIcon className="w-6 h-6" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-6 text-left text-[#DBEAFE]">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#F59E0B]">When did Hachiko die?</h3>
                  <p>Hachiko passed away on March 8, 1935, at the age of 11 years. He was found on a street in Shibuya and taken to a veterinarian, where he died of cancer and was cremated.</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#F59E0B]">Where is Hachiko buried?</h3>
                  <p>Hachiko was cremated and his ashes were buried at Aoyama Cemetery in Tokyo. A bronze statue was later erected at Shibuya Station to honor his memory.</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#F59E0B]">Why is Hachiko famous?</h3>
                  <p>Hachiko became famous for his extraordinary loyalty and devotion, waiting at Shibuya Station for nearly 10 years after his owner's death, inspiring people worldwide with his unwavering loyalty.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] py-3 px-4 text-center z-40 border-t border-[rgba(212,175,55,0.3)]">
        <p className="text-[#C2B280] text-sm flex items-center justify-center gap-2">
          Dedicated to the memory of Hachiko and the enduring power of loyalty
          <HeartIcon className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
        </p>
        <p className="text-[#C2B280] text-xs mt-1">
          © 2026 Hachiko Token | Preserving the Legacy of Japan's Most Loyal Dog
        </p>
      </footer>
    </div>
  );
}
