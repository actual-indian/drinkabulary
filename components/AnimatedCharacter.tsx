'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export type AnimationState = 'wave' | 'idle' | 'thinking' | 'talking';

interface AnimatedCharacterProps {
  animationState: AnimationState;
  onWaveComplete?: () => void;
  onClick?: () => void;
}

const greetings = [
  "Heya stranger!",
  "Hi there!",
  "Welcome to Valhalla!",
  "What can I get you?",
  "Greetings, friend!",
  "Howdy ho!",
  "Fancy a beer, eh?",
  "Skål, thirsty traveler!",
  "Hop in - pun intended!",
  "Ale yeah!"
];

export default function AnimatedCharacter({ animationState, onWaveComplete, onClick }: AnimatedCharacterProps) {
  const [currentFrame, setCurrentFrame] = useState('/frames/wave-hand-1.png');
  const [showBubble, setShowBubble] = useState(false);
  const [greeting, setGreeting] = useState('');

  // Show greeting on mount
  useEffect(() => {
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
    setShowBubble(true);

    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
    setShowBubble(true);

    setTimeout(() => {
      setShowBubble(false);
    }, 3000);

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
    <div className="relative flex items-center">
      <div
        className="relative w-24 h-24 sm:w-32 sm:h-32 cursor-pointer hover:scale-105 transition-transform"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
        aria-label="Click to wave"
      >
        <Image
          src={currentFrame}
          alt="Animated character"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Speech Bubble - Positioned to the right on both mobile and desktop */}
      {showBubble && (
        <>
          {/* Mobile: To the right of character, lower position */}
          <div className="sm:hidden absolute left-full ml-2 top-1/2 -translate-y-1/2 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="relative bg-white dark:bg-stone-700 viking:bg-[#3D2B1F] rounded-2xl px-3 py-2 shadow-lg viking:shadow-[#8B1A1A]/30 viking:border viking:border-[#5C4A35] max-w-[180px]">
              <p className="text-stone-800 dark:text-stone-100 viking:text-[#F5E6D3] font-medium text-xs text-left">
                {greeting}
              </p>
              {/* Speech bubble tail pointing left */}
              <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white dark:border-r-stone-700 viking:border-r-[#3D2B1F]"></div>
            </div>
          </div>

          {/* Desktop: To the right of character */}
          <div className="hidden sm:block absolute left-full ml-4 top-6 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="relative bg-white dark:bg-stone-700 viking:bg-[#3D2B1F] rounded-2xl px-4 py-3 shadow-lg viking:shadow-[#8B1A1A]/30 viking:border viking:border-[#5C4A35] min-w-[180px]">
              <p className="text-stone-800 dark:text-stone-100 viking:text-[#F5E6D3] font-medium text-sm whitespace-nowrap">
                {greeting}
              </p>
              {/* Speech bubble tail pointing left */}
              <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white dark:border-r-stone-700 viking:border-r-[#3D2B1F]"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
