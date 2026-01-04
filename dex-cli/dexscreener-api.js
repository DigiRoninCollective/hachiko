// Example script to demonstrate DEX Screener API integration
// This would replace the simulated API calls in the CLI

import axios from 'axios';

// DEX Screener API base URL
const DEX_SCREEENER_BASE_URL = 'https://api.dexscreener.com';

/**
 * Fetches pair data from DEX Screener
 * @param {string} pairAddress - The pair address to fetch data for
 * @param {string} chain - Chain identifier (e.g., 'eth', 'bsc', 'polygon')
 * @returns {Promise<Object>} The pair data
 */
export async function getPairData(pairAddress, chain = 'eth') {
  try {
    const response = await axios.get(`${DEX_SCREEENER_BASE_URL}/dex/pairs/${chain}/${pairAddress}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pair data:', error.message);
    throw error;
  }
}

/**
 * Searches for pairs by token address
 * @param {string} tokenAddress - The token address to search for
 * @param {string} chain - Chain identifier (e.g., 'eth', 'bsc', 'polygon')
 * @returns {Promise<Object>} The search results
 */
export async function searchByToken(tokenAddress, chain = 'eth') {
  try {
    const response = await axios.get(`${DEX_SCREEENER_BASE_URL}/dex/tokens/${tokenAddress}`);
    if (!chain || chain === 'all') {
      return response.data;
    }

    const filteredPairs = (response.data?.pairs || []).filter(
      (pair) => pair.chainId === chain
    );

    return { ...response.data, pairs: filteredPairs };
  } catch (error) {
    console.error('Error searching by token:', error.message);
    throw error;
  }
}

/**
 * Searches for pairs by query string
 * @param {string} query - The search query
 * @returns {Promise<Object>} The search results
 */
export async function searchByQuery(query) {
  try {
    const response = await axios.get(`${DEX_SCREEENER_BASE_URL}/dex/search/?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching by query:', error.message);
    throw error;
  }
}

/**
 * Fetches historical price data for a token
 * @param {string} pairAddress - The pair address to fetch data for
 * @param {string} timeFrame - Time frame for the chart (e.g., '1h', '4h', '1d', '7d')
 * @returns {Promise<Array>} Array of price data points
 */
export async function getHistoricalPriceData(pairAddress, timeFrame = '1d') {
  try {
    // Note: DEX Screener doesn't have a direct historical endpoint
    // In a real implementation, we might use an alternative API or cache historical data
    // For now, we'll simulate historical data

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
    const data = [];

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
  } catch (error) {
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
