'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AnimatedCharacter, { type AnimationState } from '@/components/AnimatedCharacter';
import ChatBox from '@/components/ChatBox';
import BeerMenu from '@/components/BeerMenu';
import BeerLibrary from '@/components/BeerLibrary';
import TeamInfo from '@/components/TeamInfo';
import ContactsInfo from '@/components/ContactsInfo';
import AgeVerification from '@/components/AgeVerification';
import type { View } from '@/types/beer';

export default function MainPage() {
  const [view, setView] = useState<View>('chat');
  const [language, setLanguage] = useState('EN');
  const [animationState, setAnimationState] = useState<AnimationState>('wave');
  const [ageVerified, setAgeVerified] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if age verification was already done in this session
    const verified = sessionStorage.getItem('ageVerified');
    if (verified === 'true') {
      setAgeVerified(true);
    }
  }, []);

  const handleAgeConfirm = () => {
    sessionStorage.setItem('ageVerified', 'true');
    setAgeVerified(true);
  };

  const handleWaveComplete = () => {
    // Transition to idle animation after wave
    setAnimationState('idle');
  };

  const handleCharacterClick = () => {
    // Play wave animation when character is clicked (only if not already waving)
    if (animationState !== 'wave') {
      setAnimationState('wave');
    }
  };

  const handleAnimationStateChange = (state: 'idle' | 'thinking' | 'talking') => {
    setAnimationState(state);
  };

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null;
  }

  // Show age verification if not verified yet
  if (!ageVerified) {
    return <AgeVerification onConfirm={handleAgeConfirm} />;
  }

  return (
    <div className="min-h-screen bg-valhalla-bar transition-colors relative overflow-hidden">
      {/* Dark overlay for text readability */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-black/30 to-black/50 dark:from-black/60 dark:via-black/50 dark:to-black/70 from-black/50 via-black/40 to-black/60" />

      {/* Atmospheric overlay for depth */}
      <div className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-15 opacity-25 mix-blend-overlay"
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
           }}
      />

      <Header
        language={language}
        onLanguageChange={setLanguage}
        currentView={view}
        onViewChange={setView}
      />

      <main className="container mx-auto px-4 sm:px-6 relative z-10">
        {view === 'chat' && (
          <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col justify-center py-4 sm:py-8 animate-fade-in">
            <div className="relative w-full flex flex-col min-h-0">
              {/* Animated character positioned to sit on the chat box */}
              <div className="flex justify-start ml-[5%] sm:ml-[10%] md:ml-[15%] mb-[-10px] sm:mb-[-40px] relative z-10 flex-shrink-0 animate-slide-in-right">
                <AnimatedCharacter
                  animationState={animationState}
                  onWaveComplete={handleWaveComplete}
                  onClick={handleCharacterClick}
                />
              </div>

              {/* Chat box with flex-shrink to prevent overflow */}
              <div className="flex-shrink min-h-0 animate-fade-in-up stagger-1">
                <ChatBox onAnimationStateChange={handleAnimationStateChange} />
              </div>
            </div>
          </div>
        )}

        {view === 'menu' && <BeerMenu />}

        {view === 'library' && <BeerLibrary />}

        {view === 'team' && <TeamInfo />}

        {view === 'contacts' && <ContactsInfo />}
      </main>
    </div>
  );
}
