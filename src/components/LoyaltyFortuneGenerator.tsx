"use client";

import { useState } from "react";
import { BookOpen, Sparkles, Copy, Check, RefreshCw } from "lucide-react";

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
  "Legacy grows when loyalty becomes habit.",
  "True loyalty speaks louder than any promise made.",
  "The heart that remains faithful becomes a beacon of hope.",
  "In the silence of waiting, loyalty finds its true voice.",
  "Devotion measured in years outweighs words spoken in moments.",
  "A loyal soul creates ripples of trust that span generations.",
  "The greatest love stories are written in patience, not passion.",
  "Hachiko taught the world that waiting can be an act of worship.",
  "Loyalty is the bridge between hearts that time cannot break.",
  "In a world of change, faithfulness is the anchor of the soul.",
  "The most profound connections are those that weather every storm.",
  "True devotion needs no audience, only a faithful heart.",
  "Hachiko's vigil became Japan's most beautiful poem.",
  "Loyalty is the language that hearts understand best.",
  "In waiting, Hachiko found his purpose and his peace.",
  "The strongest bonds are forged in the fires of time and faithfulness.",
  "A loyal companion transforms ordinary moments into sacred memories.",
  "Patience is love's way of saying 'I'm not going anywhere.'",
  "The legacy of loyalty is written in the heart, not on stone.",
  "Hachiko's story became Japan's most beautiful love letter.",
  "In the rhythm of daily return, loyalty finds its true expression.",
  "The greatest loyalty is the one that asks for nothing in return.",
  "A faithful heart becomes a lighthouse for lost souls seeking direction.",
  "Hachiko proved that love is measured in presence, not distance.",
  "In Japanese tradition, loyalty is the highest form of respect.",
  "The spirit of Hachiko lives in every heart that chooses to wait.",
  "True devotion is a promise kept even when the world has forgotten.",
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

const pickRandom = (items: string[]) => items[Math.floor(Math.random() * items.length)];

export default function LoyaltyFortuneGenerator() {
  const [current, setCurrent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setCurrent(pickRandom(wisdoms));
  };

  const copyToClipboard = async () => {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(current);
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

      <div className="mt-8">
        <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#C2B280]/10 rounded-2xl p-8 border border-[rgba(245,158,11,0.3)]">
          <div className="flex items-center gap-3 text-[#D4AF37] font-semibold mb-4">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-xl font-bold">Wisdom of Hachiko</h3>
          </div>
          <p className="text-white text-lg leading-relaxed italic">
            {current || "Generate wisdom inspired by Hachiko's extraordinary loyalty and devotion."}
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
