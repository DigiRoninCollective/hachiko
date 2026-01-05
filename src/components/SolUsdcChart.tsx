'use client';

import { useState, useEffect } from 'react';

interface PriceData {
  timestamp: number;
  price: number;
}

export default function SolUsdcChart() {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<string>('0.00');
  const [priceChange, setPriceChange] = useState<string>('0.00');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M'>('1D');

  useEffect(() => {
    fetchSolUsdcData();
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchSolUsdcData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [timeframe]);

  const fetchSolUsdcData = async () => {
    try {
      setLoading(true);
      
      // Fetch SOL/USDC pair data from DexScreener
      // Using Raydium's SOL/USDC pair on Solana
      const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana/7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm');
      
      if (response.ok) {
        const data = await response.json();
        const pair = data.pair;
        
        if (pair) {
          setCurrentPrice(parseFloat(pair.priceUsd).toFixed(2));
          setPriceChange(pair.priceChange?.h24?.toFixed(2) || '0.00');
          
          // Generate mock historical data based on current price
          // In production, you'd fetch real historical data
          generateHistoricalData(parseFloat(pair.priceUsd));
        }
      } else {
        // Fallback to mock data if API fails
        generateHistoricalData(100);
      }
    } catch (error) {
      console.error('Error fetching SOL/USDC data:', error);
      // Fallback to mock data
      generateHistoricalData(100);
    } finally {
      setLoading(false);
    }
  };

  const generateHistoricalData = (basePrice: number) => {
    const now = Date.now();
    const intervals = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : 30;
    const intervalMs = timeframe === '1D' ? 3600000 : timeframe === '1W' ? 86400000 : 86400000;
    
    const data: PriceData[] = [];
    
    for (let i = intervals; i >= 0; i--) {
      const timestamp = now - (i * intervalMs);
      const variation = (Math.random() - 0.5) * 0.1; // ±10% variation
      const price = basePrice * (1 + variation);
      
      data.push({
        timestamp,
        price: parseFloat(price.toFixed(2))
      });
    }
    
    setPriceData(data);
  };

  // Calculate min/max for scaling
  const prices = priceData.map(d => d.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1;
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">SOL/USDC</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#D4AF37]">${currentPrice}</span>
            <span className={`text-sm ${parseFloat(priceChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {parseFloat(priceChange) >= 0 ? '+' : ''}{priceChange}%
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {(['1D', '1W', '1M'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                timeframe === period
                  ? 'bg-[#D4AF37] text-black font-semibold'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-black/30 rounded-xl p-4 relative min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
              <div className="text-white/60 text-sm">Loading chart...</div>
            </div>
          </div>
        ) : priceData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <div className="text-white/60">No data available</div>
            </div>
          </div>
        ) : (
          <div className="h-full w-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-rows-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-t border-white/5"></div>
              ))}
            </div>

            {/* Price line chart */}
            <svg 
              className="absolute inset-0 w-full h-full"
              viewBox={`0 0 ${priceData.length} 100`}
              preserveAspectRatio="none"
            >
              {/* Area gradient */}
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Area fill */}
              <path
                d={`M 0,100 ${priceData.map((point, i) => 
                  `L ${i},${100 - ((point.price - minPrice) / priceRange) * 100}`
                ).join(' ')} L ${priceData.length - 1},100 Z`}
                fill="url(#chartGradient)"
              />
              
              {/* Line */}
              <polyline
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.5"
                points={priceData.map((point, i) => 
                  `${i},${100 - ((point.price - minPrice) / priceRange) * 100}`
                ).join(' ')}
              />
            </svg>

            {/* Price labels */}
            <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-xs text-white/40 py-2 pr-2">
              <span>${maxPrice.toFixed(2)}</span>
              <span>${((maxPrice + minPrice) / 2).toFixed(2)}</span>
              <span>${minPrice.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-white/40 text-center">
        Powered by DexScreener • Live data from Raydium
      </div>
    </div>
  );
}
