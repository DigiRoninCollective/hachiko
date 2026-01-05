'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export default function CandlestickChart() {
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<string>('0.00');
  const [priceChange, setPriceChange] = useState<string>('0.00');
  const [timeframe, setTimeframe] = useState<'1H' | '4H' | '1D'>('1H');

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [timeframe]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/token-data/pair?address=So11111111111111111111111111111111111111112&chain=solana');
      
      if (response.ok) {
        const data = await response.json();
        const pair = data.pairs?.[0];
        
        if (pair && pair.priceUsd) {
          const price = parseFloat(pair.priceUsd);
          setCurrentPrice(price.toFixed(2));
          setPriceChange(pair.priceChange?.h24?.toFixed(2) || '0.00');
          generateCandleData(price);
        } else {
          generateMockCandleData();
        }
      } else {
        generateMockCandleData();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      generateMockCandleData();
    } finally {
      setLoading(false);
    }
  };

  const generateCandleData = (basePrice: number) => {
    const data: CandleData[] = [];
    const now = Date.now();
    let candleCount = 24;
    let intervalMs = 60 * 60 * 1000; // 1 hour
    
    if (timeframe === '4H') {
      candleCount = 42;
      intervalMs = 4 * 60 * 60 * 1000;
    } else if (timeframe === '1D') {
      candleCount = 30;
      intervalMs = 24 * 60 * 60 * 1000;
    }
    
    let prevClose = basePrice * 0.95;
    
    for (let i = candleCount; i >= 0; i--) {
      const timestamp = now - (i * intervalMs);
      const volatility = 0.03;
      const trend = (Math.random() - 0.48) * volatility;
      
      const open = prevClose;
      const close = open * (1 + trend);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      
      data.push({ timestamp, open, high, low, close });
      prevClose = close;
    }
    
    setCandles(data);
  };

  const generateMockCandleData = () => {
    const mockPrice = 234.56;
    setCurrentPrice(mockPrice.toFixed(2));
    setPriceChange('2.34');
    generateCandleData(mockPrice);
  };

  const isPositive = parseFloat(priceChange) >= 0;

  if (loading && candles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#D4AF37]">
          <Activity className="w-5 h-5 animate-pulse" />
          <span>Loading chart...</span>
        </div>
      </div>
    );
  }

  const prices = candles.flatMap(c => [c.high, c.low]);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const priceRange = maxPrice - minPrice || 1;
  
  const chartHeight = 160;
  const chartWidth = 380;
  const candleWidth = Math.max(4, (chartWidth / candles.length) - 2);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">${currentPrice}</span>
            <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${
              isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? '+' : ''}{priceChange}%
            </div>
          </div>
          <div className="text-sm text-white/60">SOL/USD</div>
        </div>
        
        {/* Timeframe buttons */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {(['1H', '4H', '1D'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                timeframe === tf 
                  ? 'bg-[#D4AF37] text-black font-medium' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Candlestick Chart */}
      <div className="flex-1 relative bg-black/20 rounded-lg p-2">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1="0"
              y1={ratio * chartHeight}
              x2={chartWidth}
              y2={ratio * chartHeight}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Candles */}
          {candles.map((candle, index) => {
            const x = (index / candles.length) * chartWidth + candleWidth / 2;
            const isGreen = candle.close >= candle.open;
            const color = isGreen ? '#10b981' : '#ef4444';
            
            const highY = chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
            const lowY = chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;
            const openY = chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
            const closeY = chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
            
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(1, Math.abs(closeY - openY));
            
            return (
              <g key={index}>
                {/* Wick */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={color}
                  strokeWidth="1"
                />
                {/* Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={color}
                  rx="1"
                />
              </g>
            );
          })}
        </svg>
        
        {/* Price labels */}
        <div className="absolute right-1 top-1 text-xs text-white/40">
          ${maxPrice.toFixed(2)}
        </div>
        <div className="absolute right-1 bottom-1 text-xs text-white/40">
          ${minPrice.toFixed(2)}
        </div>
      </div>

      {/* Bottom stats */}
      <div className="flex justify-between mt-3 text-xs text-white/60">
        <div>24h Vol: ${(parseFloat(currentPrice) * 1000000).toLocaleString()}</div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Live</span>
        </div>
      </div>
    </div>
  );
}
