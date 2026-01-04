"use client";

import { Heart, Gem, Users, Eye } from "lucide-react";

interface ShareableFortuneImageProps {
  fortune: {
    category: string;
    fortune: string;
  };
}

export default function ShareableFortuneImage({ fortune }: ShareableFortuneImageProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Loyalty": return <Heart className="w-8 h-8" />;
      case "Devotion": return <Gem className="w-8 h-8" />;
      case "Companionship": return <Users className="w-8 h-8" />;
      case "Wisdom": return <Eye className="w-8 h-8" />;
      default: return <Heart className="w-8 h-8" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Loyalty": return "#F59E0B";
      case "Devotion": return "#10B981";
      case "Companionship": return "#F97316";
      case "Wisdom": return "#DBEAFE";
      default: return "#F59E0B";
    }
  };

  // This component will be used with html2canvas to generate shareable images
  return (
    <div 
      className="w-[600px] h-[600px] relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, #1E3A8A 0%, #1E293B 100%)`,
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, ${getCategoryColor(fortune.category)}20 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, ${getCategoryColor(fortune.category)}15 0%, transparent 50%),
                           linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, transparent 75%, transparent)`,
          backgroundSize: '400px 400px, 300px 300px, 20px 20px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: getCategoryColor(fortune.category) }}
            >
              {getCategoryIcon(fortune.category)}
            </div>
            <h2 
              className="text-2xl font-bold"
              style={{ color: getCategoryColor(fortune.category) }}
            >
              Hachiko's {fortune.category} Wisdom
            </h2>
          </div>
        </div>

        {/* Fortune Text */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="text-center">
            <div 
              className="text-4xl font-light leading-tight mb-6"
              style={{ 
                color: getCategoryColor(fortune.category),
                textShadow: '0 0 20px rgba(245, 158, 11, 0.3)'
              }}
            >
              "
            </div>
            <p className="text-2xl font-medium leading-relaxed text-white/95">
              {fortune.fortune}
            </p>
            <div 
              className="text-4xl font-light leading-tight mt-6"
              style={{ 
                color: getCategoryColor(fortune.category),
                textShadow: '0 0 20px rgba(245, 158, 11, 0.3)'
              }}
            >
              "
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center">
              <span className="text-black font-bold text-sm">H</span>
            </div>
            <span className="text-white/80 font-medium">Hachiko Token</span>
          </div>
          <div className="text-white/60 text-sm">
            Loyalty That Lasts Forever 🐕
          </div>
          <div className="text-white/40 text-xs">
            hachiko-token.com
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div 
        className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-30"
        style={{ 
          backgroundColor: getCategoryColor(fortune.category),
          filter: 'blur(20px)'
        }}
      />
      <div 
        className="absolute bottom-4 left-4 w-12 h-12 rounded-full opacity-20"
        style={{ 
          backgroundColor: getCategoryColor(fortune.category),
          filter: 'blur(15px)'
        }}
      />
    </div>
  );
}
