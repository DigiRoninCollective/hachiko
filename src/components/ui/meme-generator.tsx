'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type SpiritMode = 'loyal-companion' | 'playful-pup' | 'wise-guardian';
type Intensity = 'low' | 'medium' | 'high';

interface MemeGeneratorProps {
  initialSpiritMode?: SpiritMode;
  initialIntensity?: Intensity;
}

export function MemeGenerator({ initialSpiritMode = 'loyal-companion', initialIntensity = 'medium' }: MemeGeneratorProps) {
  const [spiritMode, setSpiritMode] = useState<SpiritMode>(initialSpiritMode);
  const [intensity, setIntensity] = useState<Intensity>(initialIntensity);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [imageUrl, setImageUrl] = useState('/placeholder-meme.jpg');
  const [isGenerating, setIsGenerating] = useState(false);
  const memeRef = useRef<HTMLDivElement>(null);

  const handleGenerateMeme = () => {
    setIsGenerating(true);
    // Simulate meme generation process
    setTimeout(() => {
      setIsGenerating(false);
      // In a real implementation, this would generate an actual meme
      alert('Meme generated! In a real implementation, this would create a shareable meme image.');
    }, 1000);
  };

  const handleShare = () => {
    if (memeRef.current) {
      // In a real implementation, this would share the meme
      alert('Meme shared! In a real implementation, this would share the meme to social media.');
    }
  };

  const handleDownload = () => {
    if (memeRef.current) {
      // In a real implementation, this would download the meme
      alert('Download started! In a real implementation, this would download the meme as an image.');
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border-pink-500">
      <h3 className="text-xl font-bold text-white mb-4">Hachiko Meme Generator</h3>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <button 
            onClick={() => setSpiritMode('loyal-companion')}
            className={`px-4 py-2 rounded-lg ${spiritMode === 'loyal-companion' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Loyal Companion
          </button>
          <button 
            onClick={() => setSpiritMode('playful-pup')}
            className={`px-4 py-2 rounded-lg ${spiritMode === 'playful-pup' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Playful Pup
          </button>
          <button 
            onClick={() => setSpiritMode('wise-guardian')}
            className={`px-4 py-2 rounded-lg ${spiritMode === 'wise-guardian' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Wise Guardian
          </button>
        </div>
        
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setIntensity('low')}
            className={`px-3 py-1 rounded ${intensity === 'low' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Low
          </button>
          <button 
            onClick={() => setIntensity('medium')}
            className={`px-3 py-1 rounded ${intensity === 'medium' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Medium
          </button>
          <button 
            onClick={() => setIntensity('high')}
            className={`px-3 py-1 rounded ${intensity === 'high' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            High
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-white mb-2">Top Text</label>
          <input
            type="text"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
            placeholder="Enter top text"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Bottom Text</label>
          <input
            type="text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            placeholder="Enter bottom text"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-white mb-2">Image URL</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex flex-wrap gap-3 mb-6">
        <Button 
          onClick={handleGenerateMeme} 
          disabled={isGenerating}
          className="bg-pink-600 hover:bg-pink-700 text-white"
        >
          {isGenerating ? 'Generating...' : 'Generate Meme'}
        </Button>
        <Button 
          onClick={handleShare} 
          variant="outline" 
          className="border-white text-white hover:bg-white/20"
        >
          Share
        </Button>
        <Button 
          onClick={handleDownload} 
          variant="outline" 
          className="border-white text-white hover:bg-white/20"
        >
          Download
        </Button>
      </div>
      
      {/* Preview */}
      <div className="mt-6">
        <h4 className="text-lg font-bold text-white mb-3">Preview</h4>
        <div 
          ref={memeRef}
          className={`relative w-full h-64 bg-cover bg-center rounded-xl border-4 ${spiritMode} ${intensity === 'low' ? 'intensity-low' : intensity === 'medium' ? 'intensity-medium' : 'intensity-high'}`}
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          {topText && (
            <div className="absolute top-2 left-0 right-0 text-center">
              <p className="text-white text-2xl font-bold meme-text px-4">{topText}</p>
            </div>
          )}
          {bottomText && (
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <p className="text-white text-2xl font-bold meme-text px-4">{bottomText}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}