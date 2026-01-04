"use client";

import { useState } from "react";
import { BookOpen, PawPrint, Sparkles, Copy, Check, RefreshCw } from "lucide-react";

const fortunes = [
  "Loyalty is the quiet power that outlasts every storm.",
  "The heart that waits with love becomes immortal.",
  "True devotion turns ordinary days into legend.",
  "Steady steps build unbreakable bonds.",
  "Faithfulness is a promise kept without words.",
  "The strongest legacy is the one you live daily.",
  "Patience is courage in slow motion.",
  "Real loyalty never needs applause.",
  "A loyal heart becomes a lighthouse for others.",
  "Love is proven in the long wait, not the loud shout."
];

const wisdoms = [
  "In Japanese culture, loyalty is an everyday practice, not a grand gesture.",
  "Hachiko's story reminds us that devotion can be a form of quiet strength.",
  "Honor (giri) is carried through actions, not announcements.",
  "To keep a promise is to keep a part of yourself alive.",
  "Waiting is not weakness when it is love with direction.",
  "The spirit of omotenashi begins with showing up, again and again.",
  "A bond is strongest when tested by time, not comfort.",
  "The most powerful tribute is to live with the same steadfastness.",
  "Patience is a kind of respect for what matters most.",
  "Legacy grows when loyalty becomes habit."
];

const facts = [
  "Hachiko was an Akita dog born in 1923 in Odate, Japan.",
  "He met his owner, Professor Hidesaburo Ueno, in 1924.",
  "Hachiko waited at Shibuya Station daily after Ueno passed in 1925.",
  "He kept his vigil for nearly 10 years until his death in 1935.",
  "A bronze statue of Hachiko was unveiled at Shibuya Station in 1934.",
  "Hachiko became a national symbol of loyalty in Japan.",
  "His remains are preserved at the National Museum of Nature and Science in Tokyo.",
  "Shibuya Station's Hachiko Exit is named in his honor.",
  "His story inspired books, films, and commemorations worldwide.",
  "Hachiko's legacy is celebrated every year in Shibuya."
];

const pickRandom = (items: string[]) => items[Math.floor(Math.random() * items.length)];

export default function LoyaltyFortuneGenerator() {
  const [current, setCurrent] = useState<{
    fortune: string;
    wisdom: string;
    fact: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setCurrent({
      fortune: pickRandom(fortunes),
      wisdom: pickRandom(wisdoms),
      fact: pickRandom(facts)
    });
  };

  const copyToClipboard = async () => {
    if (!current) return;
    try {
      const text = [
        `Fortune: ${current.fortune}`,
        `Wisdom: ${current.wisdom}`,
        `Hachiko Fact: ${current.fact}`
      ].join("\n");
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-[rgba(245,158,11,0.3)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#F59E0B]">Hachiko Wisdom Generator</h3>
          <p className="text-[#DBEAFE]">A blend of loyalty, culture, and true dog history.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={generate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#F59E0B] text-black font-semibold hover:bg-[#F59E0B]/90 transition"
          >
            <Sparkles className="w-4 h-4" />
            Generate
          </button>
          <button
            onClick={copyToClipboard}
            disabled={!current}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#F59E0B]/60 text-[#F59E0B] font-semibold hover:bg-[#F59E0B]/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-[#F59E0B] font-semibold">
            <Sparkles className="w-4 h-4" />
            Fortune
          </div>
          <p className="mt-3 text-[#DBEAFE] italic">
            {current?.fortune || "Generate a fortune inspired by Hachiko's loyalty."}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-[#F59E0B] font-semibold">
            <BookOpen className="w-4 h-4" />
            Wisdom
          </div>
          <p className="mt-3 text-[#DBEAFE] italic">
            {current?.wisdom || "A cultural note that ties patience to honor."}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-[#F59E0B] font-semibold">
            <PawPrint className="w-4 h-4" />
            Dog Fact
          </div>
          <p className="mt-3 text-[#DBEAFE] italic">
            {current?.fact || "A historical fact from Hachiko's life."}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-[#C2B280]">
        <span>Local, randomized, and lore-accurate.</span>
        <button
          onClick={generate}
          className="inline-flex items-center gap-2 text-[#F59E0B] hover:text-[#F59E0B]/80 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Roll again
        </button>
      </div>
    </div>
  );
}
