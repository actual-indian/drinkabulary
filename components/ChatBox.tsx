'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import type { Message, Beer } from '@/types/beer';
import BeerCard from './BeerCard';

interface ChatBoxProps {
  onAnimationStateChange: (state: 'idle' | 'thinking' | 'talking') => void;
}

export default function ChatBox({ onAnimationStateChange }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [beers, setBeers] = useState<Beer[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch beers once on component mount
  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const beersRes = await fetch('/api/beers');
        const beersData: Beer[] = await beersRes.json();
        setBeers(beersData);
      } catch (error) {
        console.error('Failed to fetch beers:', error);
      }
    };
    fetchBeers();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading || beers.length === 0) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    onAnimationStateChange('thinking'); // Switch to thinking animation

    try {
      // Send chat message with cached beers
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, beers }),
      });

      const data = await chatRes.json();
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: data.response,
        beers: data.recommendedBeers || []
      }]);

      // Show talking animation when response arrives
      onAnimationStateChange('talking');

      // After showing the response, go back to idle after a short delay
      setTimeout(() => {
        onAnimationStateChange('idle');
      }, 2000);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
      onAnimationStateChange('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // When user starts typing, show thinking animation
    onAnimationStateChange(e.target.value.length > 0 ? 'thinking' : 'idle');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white dark:bg-stone-800 viking:bg-[#3D2B1F] rounded-lg shadow-lg viking:shadow-[#8B1A1A]/30 p-3 sm:p-4 w-full mx-auto transition-colors viking:border viking:border-[#5C4A35]">
      {(messages.length > 0 || isLoading) && (
        <div className="max-h-[65vh] sm:max-h-96 overflow-y-auto mb-3 sm:mb-4 space-y-2 sm:space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx}>
              {/* Only show text bubble if there's content or if it's a user message */}
              {(msg.content || msg.role === 'user') && (
                <div
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 text-sm sm:text-base ${
                      msg.role === 'user'
                        ? 'bg-stone-700 dark:bg-stone-600 viking:bg-[#8B1A1A] text-white viking:text-[#F5E6D3]'
                        : 'bg-stone-100 dark:bg-stone-700 viking:bg-[#2B1F17] text-stone-900 dark:text-stone-100 viking:text-[#F5E6D3]'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              )}
              {/* Display beer cards if this is an assistant message with recommendations */}
              {msg.role === 'assistant' && msg.beers && msg.beers.length > 0 && (
                <div className="mt-3 px-2 sm:px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {msg.beers.map((beer) => (
                      <BeerCard key={beer.id} beer={beer} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-stone-100 dark:bg-stone-700 viking:bg-[#2B1F17] rounded-lg px-3 py-2 sm:px-4">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-stone-400 dark:bg-stone-300 viking:bg-[#CD7F32] rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-stone-400 dark:bg-stone-300 viking:bg-[#CD7F32] rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-stone-400 dark:bg-stone-300 viking:bg-[#CD7F32] rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      )}
      <div className="flex gap-2 items-end">
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Ask me about our beers..."
          className="flex-1 px-3 py-2 sm:px-4 text-sm sm:text-base border border-stone-300 dark:border-stone-600 viking:border-[#5C4A35] dark:bg-stone-700 viking:bg-[#2B1F17] dark:text-white viking:text-[#F5E6D3] viking:placeholder-[#9B8767] rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400 viking:focus:ring-[#CD7F32] transition-colors resize-none min-h-[42px] max-h-[150px] sm:max-h-[200px]"
          disabled={isLoading}
          rows={1}
          style={{
            height: 'auto',
            overflowY: input.split('\n').length > 5 ? 'auto' : 'hidden'
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = target.scrollHeight + 'px';
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="text-stone-800 dark:text-stone-50 viking:text-[#F5E6D3] hover:underline disabled:text-stone-400 dark:disabled:text-stone-500 viking:disabled:text-[#5C4A35] disabled:cursor-not-allowed disabled:no-underline transition flex-shrink-0"
        >
          <Send className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}
