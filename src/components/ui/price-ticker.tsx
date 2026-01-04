'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface TokenData {
  price: number;
  change: number;
  liquidity: number;
  volume: number;
}

export function PriceTicker() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real implementation, this would fetch from DEX Screener API
  // For now, we'll simulate data
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulated data - in a real app, this would come from DEX Screener API
        const mockData: TokenData = {
          price: 0.00001234 + Math.random() * 0.000001, // Random price around 0.000012
          change: (Math.random() - 0.5) * 20, // Random change between -10% and +10%
          liquidity: 1250000 + Math.random() * 100000, // Random liquidity around 1.25M
          volume: 450000 + Math.random() * 50000, // Random volume around 450k
        };
        
        setTokenData(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch price data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data immediately
    fetchTokenData();

    // Set up interval to update data every 30 seconds
    const interval = setInterval(fetchTokenData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-4 bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-sm border-emerald-500/30">
      <div className="flex flex-wrap items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-emerald-300">NOMNOM Price</h3>
          {loading ? (
            <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <p className="text-2xl font-bold text-white">
              ${tokenData?.price.toFixed(8)}
            </p>
          )}
        </div>
        
        <div className="text-right">
          <h3 className="text-lg font-bold text-emerald-300">24h Change</h3>
          {loading ? (
            <div className="h-6 w-16 bg-gray-700 rounded animate-pulse ml-auto"></div>
          ) : error ? (
            <p className="text-red-400">N/A</p>
          ) : (
            <p className={`text-xl font-bold ${tokenData?.change && tokenData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {tokenData?.change && tokenData.change >= 0 ? '↑' : '↓'} {Math.abs(tokenData?.change || 0).toFixed(2)}%
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-400">Liquidity</p>
          {loading ? (
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <p className="text-white">${(tokenData?.liquidity ? tokenData.liquidity / 1000000 : 0).toFixed(2)}M</p>
          )}
        </div>
        <div>
          <p className="text-gray-400">Volume (24h)</p>
          {loading ? (
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <p className="text-white">${(tokenData?.volume ? tokenData.volume / 1000 : 0).toFixed(2)}K</p>
          )}
        </div>
      </div>
    </Card>
  );
}