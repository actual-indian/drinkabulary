'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import funFactsData from '@/data/funfacts.json';
import greetingsData from '@/data/greetings.json';

export type AnimationState = 'wave' | 'idle' | 'thinking' | 'talking';

interface AnimatedCharacterProps {
  animationState: AnimationState;
  onWaveComplete?: () => void;
  onClick?: () => void;
}

const funFacts = Object.values(funFactsData);
const greetings = greetingsData;

export default function AnimatedCharacter({ animationState, onWaveComplete, onClick }: AnimatedCharacterProps) {
  const [currentFrame, setCurrentFrame] = useState('/frames/wave-hand-1.png');
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState('');
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Show greeting on mount, auto-hide after 4 seconds
  useEffect(() => {
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setBubbleText(randomGreeting);
    setShowBubble(true);

    // Auto-hide after 4 seconds
    hideTimeoutRef.current = setTimeout(() => {
      setShowBubble(false);
    }, 4000);

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Hide bubble when user starts typing or AI is responding
  useEffect(() => {
    if (animationState === 'thinking' || animationState === 'talking') {
      // Clear any pending hide timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      setShowBubble(false);
    }
  }, [animationState]);

  const handleClick = () => {
    // Clear any existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    // Show random fun fact
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    setBubbleText(randomFact);
    setShowBubble(true);

    // Auto-hide after 8 seconds
    hideTimeoutRef.current = setTimeout(() => {
      setShowBubble(false);
    }, 8000);

    onClick?.();
  };

  useEffect(() => {
    let isCancelled = false;
    let animationLoop: NodeJS.Timeout | null = null;

    const playAnimation = async () => {
      if (animationState === 'wave') {
        // Play wave animation once: 1 -> 2 -> 3
        const frames = ['/frames/wave-hand-1.png', '/frames/wave-hand-2.png', '/frames/wave-hand-3.png'];
        for (let i = 0; i < frames.length; i++) {
          if (isCancelled) return;
          setCurrentFrame(frames[i]);
          await new Promise(resolve => setTimeout(resolve, 400));
        }
        // Stay on final frame briefly before calling completion
        await new Promise(resolve => setTimeout(resolve, 200));
        if (!isCancelled && onWaveComplete) {
          onWaveComplete();
        }
      } else if (animationState === 'idle') {
        // Idle blinking animation
        const blink = async () => {
          while (!isCancelled) {
            // Blink twice
            setCurrentFrame('/frames/eyes-closed.png');
            await new Promise(resolve => setTimeout(resolve, 150));
            if (isCancelled) return;

            setCurrentFrame('/frames/eyes-open.png');
            await new Promise(resolve => setTimeout(resolve, 150));
            if (isCancelled) return;

            setCurrentFrame('/frames/eyes-closed.png');
            await new Promise(resolve => setTimeout(resolve, 150));
            if (isCancelled) return;

            setCurrentFrame('/frames/eyes-open.png');
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        };
        blink();
      } else if (animationState === 'thinking') {
        // Thinking animation: cycle through 1-4
        const frames = [
          '/frames/thinking-1.png',
          '/frames/thinking-2.png',
          '/frames/thinking-3.png',
          '/frames/thinking-4.png'
        ];
        let frameIndex = 0;

        const cycle = () => {
          if (isCancelled) return;
          setCurrentFrame(frames[frameIndex]);
          frameIndex = (frameIndex + 1) % frames.length;
          animationLoop = setTimeout(cycle, 500);
        };
        cycle();
      } else if (animationState === 'talking') {
        // Talking animation: alternate between mouth-closed and mouth-open
        const frames = ['/frames/mouth-closed.png', '/frames/mouth-open.png'];
        let frameIndex = 0;

        const cycle = () => {
          if (isCancelled) return;
          setCurrentFrame(frames[frameIndex]);
          frameIndex = (frameIndex + 1) % frames.length;
          animationLoop = setTimeout(cycle, 300);
        };
        cycle();
      }
    };

    playAnimation();

    return () => {
      isCancelled = true;
      if (animationLoop) {
        clearTimeout(animationLoop);
      }
    };
  }, [animationState, onWaveComplete]);

  return (
    <div className="relative flex items-center pointer-events-none">
      {/* Container matches actual image aspect ratio (315:227 ≈ 1.39:1) */}
      <div className="relative w-24 h-24 sm:w-64 sm:h-64">
        <Image
          src={currentFrame}
          alt="Animated character"
          fill
          className="object-contain pointer-events-none"
          priority
        />
        {/* Clickable area - only covers visible part (top portion not overlapping chat) */}
        <div
          className="absolute top-0 left-0 w-full h-[81px] sm:h-[196px] cursor-pointer hover:scale-105 transition-transform pointer-events-auto"
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick();
            }
          }}
          aria-label="Click to wave"
        />
      </div>

      {/* Speech Bubble - Positioned to the right on both mobile and desktop */}
      {showBubble && (
        <>
          {/* Mobile: To the right of character, centered at half character height - 1/2 of chat box width */}
          <div className="sm:hidden absolute left-full ml-2 top-12 -translate-y-1/2 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="relative bg-[#1F1410] rounded-2xl px-3 py-2 shadow-lg shadow-black/50 border border-[#3D2B1F] w-[48vw] pointer-events-auto">
              <p className="text-[#F5E6D3] font-medium text-xs text-left leading-relaxed break-words">
                {bubbleText}
              </p>
              {/* Speech bubble tail pointing left */}
              <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-[#1F1410]"></div>
            </div>
          </div>

          {/* Desktop: To the right of character, centered at half character height - exactly 1/3 of max-w-3xl (768px) */}
          <div className="hidden sm:block absolute left-full ml-6 top-32 -translate-y-1/2 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="relative bg-[#1F1410] rounded-2xl px-4 py-3 shadow-lg shadow-black/50 border border-[#3D2B1F] w-64 pointer-events-auto">
              <p className="text-[#F5E6D3] font-medium text-sm leading-relaxed break-words">
                {bubbleText}
              </p>
              {/* Speech bubble tail pointing left */}
              <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-[#1F1410]"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
