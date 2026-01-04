'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface PricePoint {
  time: string;
  price: number;
}

interface PriceChartProps {
  tokenName?: string;
  initialData?: PricePoint[];
}

export function PriceChart({ tokenName = 'NOMNOM', initialData }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState<'1h' | '4h' | '1d' | '7d'>('1d');
  const [priceData, setPriceData] = useState<PricePoint[]>(initialData || []);
  const [loading, setLoading] = useState(true);

  // Simulate fetching price data based on timeframe
  useEffect(() => {
    const fetchPriceData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock data based on timeframe
      const now = Date.now();
      const intervals = timeframe === '1h' ? 60 : 
                       timeframe === '4h' ? 48 : 
                       timeframe === '1d' ? 24 : 
                       7; // 7 days
      
      const intervalMs = timeframe === '1h' ? 60000 : // 1 minute
                         timeframe === '4h' ? 300000 : // 5 minutes
                         timeframe === '1d' ? 3600000 : // 1 hour
                         86400000; // 1 day
      
      const basePrice = 0.00001234 + Math.random() * 0.000001;
      const data: PricePoint[] = [];
      
      for (let i = intervals; i >= 0; i--) {
        const timestamp = now - (i * intervalMs);
        // Create a somewhat realistic price movement
        const variation = (Math.random() - 0.5) * 0.05; // ±5% variation
        const price = basePrice * (1 + variation);
        
        data.push({
          time: new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          price: parseFloat(price.toFixed(10))
        });
      }
      
      setPriceData(data);
      setLoading(false);
    };

    fetchPriceData();
  }, [timeframe]);

  // Calculate min/max for scaling the chart
  const prices = priceData.map(d => d.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1;
  const priceRange = maxPrice - minPrice || 1; // Avoid division by zero

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border-pink-500/30">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">{tokenName} Price Chart</h3>
        <div className="flex space-x-2 mt-2 sm:mt-0">
          {(['1h', '4h', '1d', '7d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-sm ${
                timeframe === tf 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-white">Loading chart...</div>
          </div>
        ) : (
          <div className="h-full w-full relative">
            {/* Chart grid */}
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-0">
              {[...Array(5)].map((_, i) => (
                <div key={`row-${i}`} className="border-t border-gray-700/50"></div>
              ))}
              {[...Array(5)].map((_, i) => (
                <div key={`col-${i}`} className="border-l border-gray-700/50"></div>
              ))}
            </div>
            
            {/* Price line */}
            <svg 
              className="absolute inset-0 w-full h-full"
              viewBox={`0 0 ${priceData.length * 10} 100`}
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="url(#priceGradient)"
                strokeWidth="2"
                points={priceData.map((point, i) => 
                  `${i * 10},${100 - ((point.price - minPrice) / priceRange) * 100}`
                ).join(' ')}
              />
              <defs>
                <linearGradient id="priceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Price labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
              <span>${maxPrice.toFixed(10)}</span>
              <span>${((maxPrice + minPrice) / 2).toFixed(10)}</span>
              <span>${minPrice.toFixed(10)}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between text-sm text-gray-400">
        <span>Time: {timeframe}</span>
        <span>Current: ${priceData.length > 0 ? priceData[priceData.length - 1].price.toFixed(10) : '0.0000000000'}</span>
      </div>
    </Card>
  );
}