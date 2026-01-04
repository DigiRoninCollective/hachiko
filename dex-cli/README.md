# NOMNOM DEX CLI

A command-line interface tool to interact with DEX Screener and other DEX APIs for the NOMNOM memecoin project.
This CLI is experimental and not used by the website yet. Token addresses and examples are placeholders until launch.

## Features

- Get real-time token prices from DEX Screener
- Search for tokens by name or symbol
- View liquidity and volume data
- Display price charts with historical data
- More DEX integrations coming soon

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the CLI directory
cd dex-cli

# Install dependencies
npm install
```

## Usage

### Get Token Price

```bash
# Get price for a token (default chain: eth)
node index.js price <token-address>

# Get price for a token on a specific chain
node index.js price <token-address> --chain bsc
```

### Search for Tokens

```bash
# Search for tokens by name or symbol
node index.js search <query>

# Search on a specific chain
node index.js search <query> --chain polygon
```

### Display Price Chart

```bash
# Display 1-day price chart for a token
node index.js chart <token-address>

# Display price chart with specific time frame
node index.js chart <token-address> --timeframe 4h

# Display price chart on a specific chain
node index.js chart <token-address> --timeframe 7d --chain eth
```

## Examples

```bash
# Get NOMNOM token price
node index.js price 0x1234567890abcdef

# Search for NOMNOM token
node index.js search NOMNOM

# Get token price on BSC
node index.js price 0x1234567890abcdef --chain bsc

# Show 4-hour price chart
node index.js chart 0x1234567890abcdef --timeframe 4h

# Show 7-day price chart
node index.js chart 0x1234567890abcdef --timeframe 7d
```

## Commands

- `price <tokenAddress>`: Get token price and details from DEX Screener
- `search <query>`: Search for tokens by name or symbol
- `chart <tokenAddress>`: Display price chart with historical data
- `--chain, -c`: Specify the chain (default: eth)
- `--timeframe, -t`: Time frame for charts (1h, 4h, 1d, 7d) (default: 1d)

## Planned Features

- Integration with more DEXs (Uniswap, PancakeSwap, etc.)
- Portfolio tracking
- Transaction simulation
- Price alerts
- Real historical data from DEX Screener API
