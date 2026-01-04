import axios from 'axios';

// DEX Screener API base URL
const DEX_SCREENER_BASE_URL = 'https://api.dexscreener.com';

export interface DexToken {
  address: string;
  name: string;
  symbol: string;
}

export interface DexPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: DexToken;
  quoteToken: DexToken;
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity?: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv?: number;
  marketCap?: number;
}

export interface DexSearchResponse {
  schemaVersion: string;
  pairs: DexPair[];
}

export interface HistoricalPricePoint {
  timestamp: number;
  price: number;
  timeLabel: string;
}

/**
 * Fetches pair data from DEX Screener
 * @param pairAddress - The pair address to fetch data for
 * @param chain - Chain identifier (e.g., 'solana', 'ethereum', 'bsc')
 */
export async function getPairData(pairAddress: string, chain: string = 'solana'): Promise<DexSearchResponse> {
  try {
    const response = await axios.get<DexSearchResponse>(`${DEX_SCREENER_BASE_URL}/latest/dex/pairs/${chain}/${pairAddress}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching pair data:', error.message);
    throw error;
  }
}

/**
 * Searches for pairs by token address
 * @param tokenAddress - The token address to search for
 * @param chain - Chain identifier (e.g., 'solana', 'ethereum', 'bsc')
 */
export async function searchByToken(tokenAddress: string, chain: string = 'solana'): Promise<DexSearchResponse> {
  try {
    const response = await axios.get<DexSearchResponse>(`${DEX_SCREENER_BASE_URL}/latest/dex/tokens/${tokenAddress}`);
    
    if (!chain || chain === 'all') {
      return response.data;
    }

    const filteredPairs = (response.data?.pairs || []).filter(
      (pair) => pair.chainId === chain
    );

    return { ...response.data, pairs: filteredPairs };
  } catch (error: any) {
    console.error('Error searching by token:', error.message);
    throw error;
  }
}

/**
 * Searches for pairs by query string
 * @param query - The search query
 */
export async function searchByQuery(query: string): Promise<DexSearchResponse> {
  try {
    const response = await axios.get<DexSearchResponse>(`${DEX_SCREENER_BASE_URL}/latest/dex/search/?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error: any) {
    console.error('Error searching by query:', error.message);
    throw error;
  }
}

/**
 * Fetches historical price data for a token
 * @param pairAddress - The pair address to fetch data for
 * @param timeFrame - Time frame for the chart (e.g., '1h', '4h', '1d', '7d')
 */
export async function getHistoricalPriceData(pairAddress: string, timeFrame: string = '1d'): Promise<HistoricalPricePoint[]> {
  try {
    // Note: DEX Screener doesn't have a direct public historical endpoint for free
    // In a real implementation, we might use an alternative API or cache historical data
    // For now, we'll simulate historical data with realistic movement

    // Simulate historical data for the requested time frame
    const now = Date.now();
    const intervals = timeFrame === '1h' ? 60 :
                     timeFrame === '4h' ? 48 :
                     timeFrame === '1d' ? 24 :
                     timeFrame === '7d' ? 7 : 24; // Default to 24 hours

    const intervalMs = timeFrame === '1h' ? 60000 : // 1 minute
                       timeFrame === '4h' ? 300000 : // 5 minutes
                       timeFrame === '1d' ? 3600000 : // 1 hour
                       timeFrame === '7d' ? 86400000 : // 1 day
                       3600000; // Default to 1 hour

    const basePrice = 0.00001234 + Math.random() * 0.000001;
    const data: HistoricalPricePoint[] = [];

    for (let i = intervals; i >= 0; i--) {
      const timestamp = now - (i * intervalMs);
      // Create a somewhat realistic price movement
      const variation = (Math.random() - 0.5) * 0.05; // ±5% variation
      const price = basePrice * (1 + variation);

      data.push({
        timestamp,
        price: parseFloat(price.toFixed(10)),
        timeLabel: new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      });
    }

    return data;
  } catch (error: any) {
    console.error('Error fetching historical price data:', error.message);
    throw error;
  }
}

const dexScreenerApi = {
  getPairData,
  searchByToken,
  searchByQuery,
  getHistoricalPriceData
};

export default dexScreenerApi;
