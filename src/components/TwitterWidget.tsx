'use client';

import { useEffect } from 'react';

interface TwitterWidgetProps {
  username?: string;
  height?: number;
}

export default function TwitterWidget({ 
  username = 'HachikoInuNFT',
  height = 400 
}: TwitterWidgetProps) {
  
  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <h3 className="text-lg font-bold text-white">@{username}</h3>
        <a 
          href={`https://x.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-sm text-[#D4AF37] hover:underline"
        >
          Follow
        </a>
      </div>
      
      <div 
        className="rounded-xl overflow-hidden bg-black/30"
        style={{ height: `${height}px` }}
      >
        <a 
          className="twitter-timeline" 
          data-theme="dark"
          data-chrome="noheader nofooter noborders transparent"
          data-height={height}
          href={`https://twitter.com/${username}?ref_src=twsrc%5Etfw`}
        >
          <div className="flex items-center justify-center h-full text-white/60">
            Loading tweets...
          </div>
        </a>
      </div>
    </div>
  );
}
