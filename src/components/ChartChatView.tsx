import { useState, useRef, useEffect } from 'react';
import { TrendingUp, Send, User, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
}

const ChartChatView = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      setUserId(storedUserId);
      setUsername(storedUsername);

      // Fetch recent messages
      fetchRecentMessages();
      setIsInitialized(true);
    }
  }, [isInitialized]);

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

        // Show error to user
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Network error sending message:', error);

      // Remove the optimistic message if there was an error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));

      alert('Network error. Please try again.');
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
    if (newUsername.length <= 20) {
      setUsername(newUsername);
      localStorage.setItem('hachiko_username', newUsername);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-4">
      {/* Chart Section */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-[rgba(245,158,11,0.3)] h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#F59E0B] flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Hachiko Token Price Chart
            </h2>
            <div className="flex gap-2">
              <button className="bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] px-3 py-1 rounded-lg text-sm transition-colors">
                1D
              </button>
              <button className="bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] px-3 py-1 rounded-lg text-sm transition-colors">
                1W
              </button>
              <button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white px-3 py-1 rounded-lg text-sm transition-colors">
                1M
              </button>
              <button className="bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] px-3 py-1 rounded-lg text-sm transition-colors">
                3M
              </button>
              <button className="bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] px-3 py-1 rounded-lg text-sm transition-colors">
                1Y
              </button>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-[#1a1a1a]/50 rounded-xl p-4 h-[70%] flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block p-4 rounded-full bg-[#D4AF37]/10 mb-4">
                  <TrendingUp className="w-12 h-12 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Hachiko Token Chart</h3>
                <p className="text-[#C2B280]">Interactive price chart with real-time data</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-4">
            <div className="bg-[#1a1a1a]/30 p-3 rounded-lg">
              <p className="text-[#C2B280] text-sm">Price</p>
              <p className="text-white font-semibold">$0.001234</p>
            </div>
            <div className="bg-[#1a1a1a]/30 p-3 rounded-lg">
              <p className="text-[#C2B280] text-sm">24h Change</p>
              <p className="text-green-500 font-semibold">+12.34%</p>
            </div>
            <div className="bg-[#1a1a1a]/30 p-3 rounded-lg">
              <p className="text-[#C2B280] text-sm">Volume (24h)</p>
              <p className="text-white font-semibold">$1.23M</p>
            </div>
            <div className="bg-[#1a1a1a]/30 p-3 rounded-lg">
              <p className="text-[#C2B280] text-sm">Market Cap</p>
              <p className="text-white font-semibold">$12.34M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="w-full lg:w-96 flex flex-col border border-[rgba(212,175,55,0.3)] rounded-2xl bg-[#1a1a1a]/50 backdrop-blur-md shadow-lg">
        <div className="p-4 border-b border-[rgba(212,175,55,0.3)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#D4AF37]/10">
                <Bot className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-semibold text-[#D4AF37]">Hachiko Chat</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#C2B280]">Username:</span>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className="bg-[#1a1a1a] border border-[rgba(212,175,55,0.3)] rounded px-2 py-1 text-white text-xs max-w-[100px] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                maxLength={20}
              />
            </div>
          </div>
          <p className="text-[#C2B280] text-xs mt-1">Ask about the chart, price, or token info</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 lg:max-h-[calc(100vh-220px)] bg-[#1a1a1a]/20">
          {error && (
            <div className="text-center py-2">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#C2B280] text-sm">Loading chat history...</p>
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
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.userId === userId
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#C2B280] text-white rounded-br-none'
                        : 'bg-white/10 text-white rounded-bl-none border border-[rgba(212,175,55,0.2)]'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.userId !== userId && (
                        <div className="mt-0.5 flex-shrink-0">
                          <div className="p-1 rounded-full bg-[#D4AF37]/20">
                            <Bot className="w-3 h-3 text-[#D4AF37]" />
                          </div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className={`text-xs font-semibold ${message.userId === userId ? 'text-white' : 'text-[#D4AF37]'}`}>
                            {message.userId === userId ? 'You' : message.username}
                          </span>
                          <span className="text-[0.6rem] text-[#C2B280]">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm break-words">{message.message}</p>
                      </div>
                      {message.userId === userId && (
                        <div className="mt-0.5 flex-shrink-0">
                          <div className="p-1 rounded-full bg-white/20">
                            <User className="w-3 h-3 text-white" />
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

        <div className="p-4 border-t border-[rgba(212,175,55,0.3)] bg-[#1a1a1a]/30">
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the chart..."
              className="flex-1 bg-[#1a1a1a] border border-[rgba(212,175,55,0.3)] rounded-lg px-4 py-2 text-white placeholder-[#C2B280] resize-none focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || !username.trim()}
              className="bg-gradient-to-r from-[#D4AF37] to-[#C2B280] hover:from-[#D4AF37]/90 hover:to-[#C2B280]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-all self-end flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartChatView;