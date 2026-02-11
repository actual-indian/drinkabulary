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

  // Fetch beers from library once on component mount
  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const libraryRes = await fetch('/data/scraped-beers.json');
        const libraryData = await libraryRes.json();

        // Add IDs based on array index and map to Beer format
        const beersWithIds: Beer[] = libraryData.beers.map((beer: any, index: number) => ({
          id: index.toString(),
          name: beer.name,
          brewery: beer.brewery,
          category: 'Beer', // Library only has beers
          style: beer.style || 'unknown',
          abv: beer.abv || 'unknown',
          price: 'unknown', // Library doesn't have price info
          url: beer.url,
          urlDisplay: beer.url,
          rating: beer.rating,
          ibu: beer.ibu,
          description: beer.description,
        }));

        setBeers(beersWithIds);
      } catch (error) {
        console.error('Failed to fetch library beers:', error);
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
    <div className="relative">
      {/* Glowing backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-5 dark:opacity-10 opacity-15 rounded-2xl blur-xl" />

      <div className="relative bg-[var(--bg-secondary)] backdrop-blur-sm rounded-2xl shadow-2xl p-3 sm:p-6 w-full mx-auto border border-[var(--border-color)] dark:border-[var(--border-color)] border-[] shadow-[]">
        {(messages.length > 0 || isLoading) && (
          <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto mb-3 sm:mb-4 space-y-2 sm:space-y-3 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className="animate-fade-in-up">
                {/* Only show text bubble if there's content or if it's a user message */}
                {(msg.content || msg.role === 'user') && (
                  <div
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 sm:px-5 sm:py-3 text-sm sm:text-base font-body shadow-md hover:shadow-lg transition-all ${
                        msg.role === 'user'
                          ? 'bg-[var(--accent-primary)] dark:bg-[var(--accent-primary)] bg-[] text-white'
                          : 'bg-[var(--bg-accent)] dark:bg-[var(--bg-accent)] bg-[] text-[var(--text-primary)] dark:text-[var(--text-primary)] text-[] border border-[var(--border-color)] border-[]'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                )}
                {/* Display beer cards if this is an assistant message with recommendations */}
                {msg.role === 'assistant' && msg.beers && msg.beers.length > 0 && (
                  <div className="mt-3 px-0 sm:px-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.beers.map((beer, beerIdx) => (
                        <div key={beer.id} className="animate-scale-in" style={{ animationDelay: `${beerIdx * 0.1}s` }}>
                          <BeerCard beer={beer} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-[var(--bg-accent)] dark:bg-[var(--bg-accent)] bg-[] rounded-2xl px-5 py-3 shadow-md border border-[var(--border-color)] border-[]">
                  <div className="flex gap-1.5">
                    <div
                      className="w-2.5 h-2.5 bg-[var(--accent-primary)] dark:bg-[var(--accent-secondary)] bg-[] rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                      className="w-2.5 h-2.5 bg-[var(--accent-primary)] dark:bg-[var(--accent-secondary)] bg-[] rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                      className="w-2.5 h-2.5 bg-[var(--accent-primary)] dark:bg-[var(--accent-secondary)] bg-[] rounded-full animate-bounce"
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
        <div className="flex gap-2 sm:gap-3 items-end">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Ask me about our beers..."
            className="flex-1 px-4 py-3 sm:px-5 sm:py-3 text-sm sm:text-base font-body border-2 border-[var(--border-color)] dark:border-[var(--border-color)] border-[] bg-[var(--bg-secondary)] dark:bg-[var(--bg-accent)] bg-[] text-[var(--text-primary)] dark:text-[var(--text-primary)] text-[] placeholder-[var(--text-muted)] dark:placeholder-[var(--text-muted)] placeholder-[] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] dark:focus:ring-[var(--accent-secondary)] focus:ring-[] focus:border-transparent transition-all resize-none min-h-[46px] max-h-[150px] sm:max-h-[200px] shadow-sm hover:shadow-md"
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
            className="p-3 rounded-xl bg-[var(--accent-primary)] dark:bg-[var(--accent-primary)] bg-[] text-white hover:bg-[var(--accent-secondary)] dark:hover:bg-[var(--accent-secondary)] hover:bg-[] disabled:bg-[var(--text-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
