"use client";

import { useEffect, useState, useCallback } from 'react';

interface JupiterSwapProps {
  tokenAddress?: string;
}

declare global {
  interface Window {
    Jupiter?: {
      init: (config: Record<string, unknown>) => void;
    };
  }
}

export default function JupiterSwap({ tokenAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" }: JupiterSwapProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initJupiter = useCallback(() => {
    if (typeof window !== 'undefined' && window.Jupiter) {
      // Jupiter is loaded and ready
      setIsLoaded(true);
      setError(null);
    }
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://terminal.jup.ag/main-v2.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      setIsLoaded(true);
      setError(null);
      initJupiter();
    };
    
    script.onerror = () => {
      setError('Failed to load Jupiter swap');
      setIsLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [initJupiter]);

  const launchJupiter = () => {
    if (typeof window !== 'undefined' && window.Jupiter) {
      try {
        window.Jupiter.init({
          displayMode: 'modal',
          defaultExplorer: 'Solscan',
          strictTokenList: false,
          formProps: {
            fixedOutputMint: true,
            initialOutputMint: tokenAddress,
          },
        });
      } catch (err) {
        console.error('Jupiter initialization error:', err);
        setError('Failed to open Jupiter swap');
      }
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={launchJupiter}
        disabled={!isLoaded || !!error}
        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C2B280] hover:from-[#D4AF37]/90 hover:to-[#C2B280]/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
        {error ? 'Swap Unavailable' : isLoaded ? 'Buy $HACHIKO' : 'Loading...'}
      </button>
      {error && (
        <p className="text-xs text-red-400 mt-1 text-center">{error}</p>
      )}
    </div>
  );
}
