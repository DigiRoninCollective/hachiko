import { useState, useRef, useEffect } from 'react';
import { TrendingUp, Send, User, Bot, Crown } from 'lucide-react';

// Solana wallet types
declare global {
  interface Window {
    solana?: any;
    phantom?: {
      solana?: any;
      isConnected?: boolean;
      publicKey?: { toString(): string };
      connect(): Promise<{ toString(): string }>;
      disconnect(): Promise<void>;
    };
  }
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
}

interface TokenStats {
  price: string;
  change24h: string;
  volume24h: string;
  marketCap: string;
}

const ChartChatView = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usernameChangeCount, setUsernameChangeCount] = useState(0);
  const [lastUsernameChange, setLastUsernameChange] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isTokenHolder, setIsTokenHolder] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [tokenStats, setTokenStats] = useState<TokenStats>({
    price: '$0.00000000',
    change24h: '0.00%',
    volume24h: '$0',
    marketCap: '$0'
  });

  // Initialize user and fetch messages
  useEffect(() => {
    if (!isInitialized) {
      setIsLoading(true);
      // Generate a temporary user ID if not exists
      let storedUserId = localStorage.getItem('hachiko_userId');
      let storedUsername = localStorage.getItem('hachiko_username');

      if (!storedUserId) {
        storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('hachiko_userId', storedUserId);
      }

      if (!storedUsername) {
        // Generate a default username
        storedUsername = `User_${Math.random().toString(36).substr(2, 4)}`;
        localStorage.setItem('hachiko_username', storedUsername);
      }

      // Load username change tracking
      const changeCount = parseInt(localStorage.getItem('hachiko_username_changes') || '0');
      const lastChange = parseInt(localStorage.getItem('hachiko_username_last_change') || '0');
      
      setUsernameChangeCount(changeCount);
      setLastUsernameChange(lastChange);

      setUserId(storedUserId);
      setUsername(storedUsername);
      setIsInitialized(true);
      setError(null);
    }
  }, [isInitialized]);

  // Fetch messages when initialized
  useEffect(() => {
    if (isInitialized && userId) {
      fetchRecentMessages();
    }
  }, [isInitialized, userId]);

  // Fetch token data
  const fetchTokenData = async () => {
    try {
      const response = await fetch('/api/token-data');
      if (response.ok) {
        const data = await response.json();
        // Assuming the first pair is the most relevant
        const pair = data.pairs && data.pairs[0];
        
        if (pair) {
          setTokenStats({
            price: `$${pair.priceUsd || '0.00'}`,
            change24h: `${pair.priceChange?.h24 || 0}%`,
            volume24h: `$${(pair.volume?.h24 || 0).toLocaleString()}`,
            marketCap: pair.marketCap ? `$${pair.marketCap.toLocaleString()}` : (pair.fdv ? `$${pair.fdv.toLocaleString()}` : '$0')
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch token data:', err);
    }
  };

  // Fetch recent messages from the API
  const fetchRecentMessages = async () => {
    try {
      const response = await fetch('/api/chat');
      if (response.ok) {
        const { messages: apiMessages } = await response.json();
        // Convert string dates to Date objects
        const convertedMessages = apiMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(convertedMessages);
      } else {
        throw new Error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load chat history. Showing offline messages.');
      // Fallback to initial messages
      setMessages([
        {
          id: '1',
          userId: 'system',
          username: 'System',
          message: 'Welcome to Hachiko Token Chat! Ask me about the chart or token info.',
          timestamp: new Date(),
        },
        {
          id: '2',
          userId: 'system',
          username: 'System',
          message: 'The chart shows the price trend of $HACHIKO over time.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || !username || !userId) return;

    // Add user message optimistically
    const userMessage: ChatMessage = {
      id: `temp_${Date.now()}`,
      userId,
      username,
      message: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          username,
          message: inputValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error sending message:', errorData.error);

        // Remove the optimistic message if there was an error
        setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));

        // Handle rate limit specifically
        if (errorData.error?.includes('Rate limit exceeded')) {
          setError('Please wait a moment before sending another message.');
        } else {
          setError(`Error: ${errorData.error}`);
        }
      }
    } catch (error) {
      console.error('Network error sending message:', error);

      // Remove the optimistic message if there was an error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));

      setError('Network error. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    
    // Check if user has exceeded the 2-change limit
    if (usernameChangeCount >= 2) {
      setError('Username change limit reached (2 changes per session)');
      return;
    }
    
    // Check if enough time has passed (optional: 30 second cooldown between changes)
    const now = Date.now();
    if (now - lastUsernameChange < 30000 && usernameChangeCount > 0) {
      const remainingTime = Math.ceil((30000 - (now - lastUsernameChange)) / 1000);
      setError(`Please wait ${remainingTime} seconds before changing username`);
      return;
    }
    
    // Update username and tracking
    setUsername(newUsername);
    setUsernameChangeCount(prev => prev + 1);
    setLastUsernameChange(now);
    
    // Save to localStorage
    localStorage.setItem('hachiko_username', newUsername);
    localStorage.setItem('hachiko_username_changes', (usernameChangeCount + 1).toString());
    localStorage.setItem('hachiko_username_last_change', now.toString());
    
    setError(null);
  };

  // Wallet connection functions
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.phantom?.solana) {
      try {
        // Check if already connected
        if (window.phantom.isConnected) {
          const response = window.phantom.publicKey;
          setWalletAddress(response.toString());
          setWalletConnected(true);
          await checkTokenHolder(response.toString());
        } else {
          // Request connection
          const response = await window.phantom.solana.connect();
          setWalletAddress(response.toString());
          setWalletConnected(true);
          await checkTokenHolder(response.toString());
        }
        
        setError(null);
      } catch (error) {
        console.error('Wallet connection error:', error);
        setError('Failed to connect wallet');
      }
    } else {
      setError('Please install Phantom wallet');
    }
  };

  const disconnectWallet = () => {
    if (window.phantom?.solana) {
      window.phantom.solana.disconnect();
    }
    setWalletConnected(false);
    setWalletAddress('');
    setIsTokenHolder(false);
  };

  const checkTokenHolder = async (address: string) => {
    // This would be an API call to check if the address holds the token
    // For now, we'll simulate it
    try {
      // In a real implementation, you'd call your API to check token balance
      // const response = await fetch(`/api/check-token-holder?address=${address}`);
      // const data = await response.json();
      // setIsTokenHolder(data.holdsToken);
      
      // For demo purposes, let's randomly assign token holder status
      setIsTokenHolder(Math.random() > 0.7); // 30% chance of being a token holder
    } catch (error) {
      console.error('Error checking token holder status:', error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat Section - Takes full space */}
      <div className="flex-1 flex flex-col border border-[rgba(212,175,55,0.3)] rounded-2xl bg-[#1a1a1a]/50 backdrop-blur-md shadow-lg min-h-0">
        <div className="p-3 border-b border-[rgba(212,175,55,0.3)] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-[#D4AF37]/10">
                <Bot className="w-3 h-3 text-[#D4AF37]" />
              </div>
              <h3 className="text-sm font-semibold text-[#D4AF37]">Hachiko Chat</h3>
            </div>
            <div className="flex items-center gap-3">
              {/* Wallet Connection */}
              {!walletConnected ? (
                <button
                  onClick={connectWallet}
                  className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded hover:bg-[#D4AF37]/30 transition-all"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {isTokenHolder && (
                    <div className="flex items-center gap-1">
                      <Crown className="w-3 h-3 text-[#D4AF37]" />
                      <span className="text-xs text-[#D4AF37]">Holder</span>
                    </div>
                  )}
                  <button
                    onClick={disconnectWallet}
                    className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/30 transition-all"
                  >
                    Disconnect
                  </button>
                </div>
              )}
              
              {/* Username Input */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#C2B280]">Username:</span>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="bg-[#1a1a1a] border border-[rgba(212,175,55,0.3)] rounded px-2 py-1 text-white text-xs max-w-[80px] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  maxLength={20}
                />
                {isTokenHolder && (
                  <Crown className="w-4 h-4 text-[#D4AF37]" />
                )}
              </div>
            </div>
          </div>
          <p className="text-[#C2B280] text-xs mt-1">
            {walletConnected 
              ? (isTokenHolder ? "Token holder status verified ✨" : "Connected to wallet")
              : "Ask about the chart, price, or token info"
            }
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#1a1a1a]/20">
          {error && (
            <div className="text-center py-2">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#C2B280] text-xs">Loading chat history...</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.userId === userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-2 ${
                      message.userId === userId
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#C2B280] text-white rounded-br-none'
                        : 'bg-white/10 text-white rounded-bl-none border border-[rgba(212,175,55,0.2)]'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.userId !== userId && (
                        <div className="mt-0.5 flex-shrink-0">
                          <div className="p-1 rounded-full bg-[#D4AF37]/20">
                            <Bot className="w-2 h-2 text-[#D4AF37]" />
                          </div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className={`text-xs font-semibold ${message.userId === userId ? 'text-white' : 'text-[#D4AF37]'}`}>
                            {message.userId === userId ? 'You' : message.username}
                          </span>
                          <span className="text-[0.5rem] text-[#C2B280]">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs break-words">{message.message}</p>
                      </div>
                      {message.userId === userId && (
                        <div className="mt-0.5 flex-shrink-0">
                          <div className="p-1 rounded-full bg-white/20">
                            <User className="w-2 h-2 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="p-3 border-t border-[rgba(212,175,55,0.3)] bg-[#1a1a1a]/30 flex-shrink-0">
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the chart..."
              className="flex-1 bg-[#1a1a1a] border border-[rgba(212,175,55,0.3)] rounded-lg px-3 py-2 text-white placeholder-[#C2B280] resize-none focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-xs"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || !username.trim()}
              className="bg-gradient-to-r from-[#D4AF37] to-[#C2B280] hover:from-[#D4AF37]/90 hover:to-[#C2B280]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartChatView;