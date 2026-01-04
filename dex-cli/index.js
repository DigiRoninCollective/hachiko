#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import ora from 'ora';
import { searchByQuery, searchByToken, getHistoricalPriceData } from './dexscreener-api.js';
import { Chart } from 'cli-chart';

const program = new Command();

program
  .name('nomnom-dex')
  .description('CLI tool to interact with DEX Screener and other DEX APIs')
  .version('1.0.0');

program
  .command('price')
  .description('Get token price from DEX Screener')
  .argument('<tokenAddress>', 'Token contract address')
  .option('-c, --chain <chain>', 'Chain name (e.g., eth, bsc, polygon, all)', 'eth')
  .action(async (tokenAddress, options) => {
    const spinner = ora('Fetching token data from DEX Screener...');
    spinner.start();

    try {
      // Search for pairs with this token
      const response = await searchByToken(tokenAddress, options.chain);

      if (!response || !response.pairs || response.pairs.length === 0) {
        spinner.fail('No pairs found for this token');
        return;
      }

      // Get the first pair (usually the one with the most liquidity)
      const pair = response.pairs[0];

      spinner.succeed('Token data fetched successfully!');

      console.log(chalk.blue('\n--- Token Information ---'));
      console.log(chalk.green(`Token: ${pair.baseToken.name} (${pair.baseToken.symbol})`));
      console.log(chalk.green(`Address: ${pair.baseToken.address}`));
      console.log(chalk.yellow(`Price (USD): $${pair.priceUsd}`));

      if (pair.priceChange) {
        const change24h = parseFloat(pair.priceChange.h24);
        console.log(chalk.yellow(`Price Change (24h): ${change24h >= 0 ? '+' : ''}${pair.priceChange.h24}%`));
      }

      if (pair.liquidity) {
        console.log(chalk.cyan(`Liquidity: $${parseFloat(pair.liquidity.usd).toLocaleString()}`));
      }

      if (pair.volume) {
        console.log(chalk.cyan(`Volume (24h): $${parseFloat(pair.volume.h24.usd).toLocaleString()}`));
      }

      console.log(chalk.magenta(`Pair Address: ${pair.pairAddress}`));
      console.log(chalk.magenta(`DEX: ${pair.dexId}`));

    } catch (error) {
      spinner.fail('Failed to fetch token data');
      console.error(chalk.red('Error:'), error.message);
    }
  });

program
  .command('search')
  .description('Search for a token by name or symbol')
  .argument('<query>', 'Token name or symbol to search for')
  .option('-c, --chain <chain>', 'Chain name (e.g., eth, bsc, polygon, all)', 'eth')
  .action(async (query, options) => {
    const spinner = ora('Searching for token on DEX Screener...');
    spinner.start();

    try {
      const response = await searchByQuery(query);
      const basePairs = response?.pairs || [];
      const pairs = options.chain && options.chain !== 'all'
        ? basePairs.filter((pair) => pair.chainId === options.chain)
        : basePairs;

      if (!response || pairs.length === 0) {
        spinner.fail('No tokens found matching your query');
        return;
      }

      spinner.succeed('Search completed!');

      console.log(chalk.blue('\n--- Search Results ---'));
      pairs.slice(0, 5).forEach((pair, index) => { // Show top 5 results
        console.log(chalk.green(`${index + 1}. ${pair.baseToken.name} (${pair.baseToken.symbol})`));
        console.log(chalk.yellow(`   Address: ${pair.baseToken.address}`));
        console.log(chalk.cyan(`   Price: $${pair.priceUsd}`));
        console.log(chalk.magenta(`   DEX: ${pair.dexId}`));
        console.log(chalk.blue(`   Liquidity: $${parseFloat(pair.liquidity.usd).toLocaleString()}\n`));
      });

    } catch (error) {
      spinner.fail('Search failed');
      console.error(chalk.red('Error:'), error.message);
    }
  });

program
  .command('chart')
  .description('Display price chart for a token')
  .argument('<tokenAddress>', 'Token contract address')
  .option('-t, --timeframe <timeframe>', 'Time frame for the chart (1h, 4h, 1d, 7d)', '1d')
  .option('-c, --chain <chain>', 'Chain name (e.g., eth, bsc, polygon, all)', 'eth')
  .action(async (tokenAddress, options) => {
    const spinner = ora(`Fetching ${options.timeframe} price data...`);
    spinner.start();

    try {
      // Search for pairs with this token
      const response = await searchByToken(tokenAddress, options.chain);

      if (!response || !response.pairs || response.pairs.length === 0) {
        spinner.fail('No pairs found for this token');
        return;
      }

      // Get the first pair (usually the one with the most liquidity)
      const pair = response.pairs[0];

      // Get historical price data
      const historicalData = await getHistoricalPriceData(pair.pairAddress, options.timeframe);

      spinner.succeed(`Historical data fetched for ${pair.baseToken.name} (${pair.baseToken.symbol})`);

      // Extract prices for the chart
      const prices = historicalData.map(item => item.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const priceRange = maxPrice - minPrice;

      // Create a chart
      console.log(chalk.blue(`\n--- Price Chart for ${pair.baseToken.name} (${pair.baseToken.symbol}) - ${options.timeframe} ---`));

      // Create chart using cli-chart
      const chart = new Chart({
        width: 80,
        height: 20,
        xlabel: 'Time',
        ylabel: 'Price (USD)',
        direction: 'y'
      });

      // Add data points to the chart
      for (let i = 0; i < prices.length; i++) {
        // Normalize the price to fit the chart height
        const normalizedPrice = priceRange !== 0 ?
          ((prices[i] - minPrice) / priceRange) * 100 :
          50; // Default to middle if no range

        chart.addPoint(i, normalizedPrice, '*');
      }

      chart.draw();

      // Print min and max prices
      console.log(chalk.green(`Min Price: $${minPrice.toFixed(10)}`));
      console.log(chalk.red(`Max Price: $${maxPrice.toFixed(10)}`));
      console.log(chalk.yellow(`Current Price: $${pair.priceUsd}`));

    } catch (error) {
      spinner.fail('Failed to fetch chart data');
      console.error(chalk.red('Error:'), error.message);
    }
  });

program.parse();
