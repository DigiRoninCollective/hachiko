"use client";

import { useState } from "react";
import { ExternalLink, Palette, Wand2, Download, CheckCircle } from "lucide-react";
import { CanvaAPI, type FortuneDesignData } from "../lib/canva-api";

interface CanvaFortuneIntegrationProps {
  fortune: {
    category: string;
    fortune: string;
  };
}

export default function CanvaFortuneIntegration({ fortune }: CanvaFortuneIntegrationProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("minimal-elegant");
  const [createdDesign, setCreatedDesign] = useState<any>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Loyalty": return "#F59E0B";
      case "Devotion": return "#10B981";
      case "Companionship": return "#F97316";
      case "Wisdom": return "#DBEAFE";
      default: return "#F59E0B";
    }
  };

  // Initialize Canva API (in production, these would come from environment variables)
  const canvaAPI = new CanvaAPI(
    process.env.NEXT_PUBLIC_CANVA_CLIENT_ID || "demo_client_id",
    process.env.NEXT_PUBLIC_CANVA_CLIENT_SECRET || "demo_client_secret"
  );

  const connectToCanva = async () => {
    setIsConnecting(true);
    
    try {
      // In production, this would redirect to Canva OAuth
      const redirectUri = `${window.location.origin}/canva-callback`;
      const authUrl = canvaAPI.getAuthUrl(redirectUri);
      
      // For demo, simulate the OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsConnected(true);
      alert('Connected to Canva! (Demo mode - in production, this would open OAuth flow)');
    } catch (error) {
      console.error('Error connecting to Canva:', error);
      alert('Failed to connect to Canva. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const createCanvaDesign = async () => {
    if (!isConnected) {
      alert('Please connect to Canva first');
      return;
    }

    setIsCreating(true);
    
    try {
      const designData: FortuneDesignData = {
        fortune: fortune.fortune,
        category: fortune.category,
        colors: {
          primary: getCategoryColor(fortune.category),
          background: "#1E3A8A",
          accent: "#F59E0B"
        },
        template: selectedTemplate
      };

      // In production, this would make actual API calls to Canva
      // const design = await canvaAPI.createFortuneDesign(designData);
      
      // For demo, simulate the creation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockDesign = {
        id: `design_${Date.now()}`,
        name: `Hachiko ${fortune.category} Wisdom`,
        edit_url: "https://www.canva.com/design/edit",
        thumbnail_url: "/api/placeholder/300/200"
      };
      
      setCreatedDesign(mockDesign);
      alert('Design created successfully! (Demo mode - in production, this would open actual Canva editor)');
    } catch (error) {
      console.error('Error creating Canva design:', error);
      alert('Failed to create design. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const openInCanva = () => {
    if (createdDesign) {
      window.open(createdDesign.edit_url, '_blank');
    }
  };

  const canvaTemplates = [
    {
      id: "minimal-elegant",
      name: "Minimal Elegant",
      description: "Clean, sophisticated design with subtle gradients",
      preview: "🎨"
    },
    {
      id: "mystical-wisdom", 
      name: "Mystical Wisdom",
      description: "Magical effects with glowing elements",
      preview: "✨"
    },
    {
      id: "modern-bold",
      name: "Modern Bold", 
      description: "Contemporary design with strong typography",
      preview: "💪"
    },
    {
      id: "vintage-classic",
      name: "Vintage Classic",
      description: "Traditional aesthetic with ornate details",
      preview: "📜"
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#F59E0B]" />
            Canva Design Studio
            {isConnected && <CheckCircle className="w-5 h-5 text-green-500" />}
          </h3>
          <p className="text-white/60 text-sm mt-1">
            {isConnected ? 'Create professional designs' : 'Connect to create designs'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00C4CC] to-[#7B2FF7] flex items-center justify-center">
          <span className="text-white font-bold text-lg">C</span>
        </div>
      </div>

      {/* Templates */}
      <div className="space-y-4">
        <h4 className="text-white/80 font-medium">Choose Template Style</h4>
        <div className="grid grid-cols-2 gap-3">
          {canvaTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`bg-white/5 border rounded-lg p-4 text-left transition-all duration-300 group ${
                selectedTemplate === template.id 
                  ? 'border-[#F59E0B] bg-white/10' 
                  : 'border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{template.preview}</span>
                <span className="text-white font-medium group-hover:text-[#F59E0B] transition-colors">
                  {template.name}
                </span>
              </div>
              <p className="text-white/60 text-xs">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div className="space-y-3">
        <h4 className="text-white/80 font-medium">Color Palette</h4>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full border-2 border-white/30"
              style={{ backgroundColor: getCategoryColor(fortune.category) }}
            />
            <span className="text-white/60 text-sm">Primary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] border-2 border-white/30" />
            <span className="text-white/60 text-sm">Background</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F59E0B] border-2 border-white/30" />
            <span className="text-white/60 text-sm">Accent</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {!isConnected ? (
          <button
            onClick={connectToCanva}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#00C4CC] text-black font-medium rounded-lg hover:bg-[#00A8B0] transition-colors duration-300 disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <ExternalLink className="w-5 h-5" />
                Connect to Canva
              </>
            )}
          </button>
        ) : (
          <>
            <button
              onClick={createCanvaDesign}
              disabled={isCreating}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7B2FF7] to-[#00C4CC] text-white font-medium rounded-lg hover:from-[#6B1FE7] hover:to-[#00A8B0] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
            >
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Design...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Create in Canva
                </>
              )}
            </button>

            {createdDesign && (
              <button
                onClick={openInCanva}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#F59E0B] text-black font-medium rounded-lg hover:bg-[#F97316] transition-colors duration-300"
              >
                <ExternalLink className="w-5 h-5" />
                Open in Canva Editor
              </button>
            )}
          </>
        )}
      </div>

      {/* Features */}
      <div className="border-t border-white/10 pt-4">
        <h4 className="text-white/80 font-medium mb-3">Canva Features</h4>
        <ul className="space-y-2 text-white/60 text-sm">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            Professional design templates
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            Advanced typography options
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            Custom graphics and elements
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            Multiple export formats
          </li>
        </ul>
      </div>

      {/* Production Setup Notice */}
      <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-[#F59E0B] flex-shrink-0 mt-0.5">
            <span className="text-black text-xs font-bold flex items-center justify-center h-full">!</span>
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium">Production Setup</p>
            <p className="text-white/60 text-xs mt-1">
              To enable real Canva integration: 1) Create Canva Developer account, 2) Set up OAuth app, 3) Add environment variables for client ID/secret, 4) Configure redirect URI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
