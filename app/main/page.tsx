'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AnimatedCharacter, { type AnimationState } from '@/components/AnimatedCharacter';
import ChatBox from '@/components/ChatBox';
import BeerMenu from '@/components/BeerMenu';
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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 viking:bg-[#1A1410] transition-colors">
      <Header
        language={language}
        onLanguageChange={setLanguage}
        currentView={view}
        onViewChange={setView}
      />

      <main className="container mx-auto px-4 sm:px-6">
        {view === 'chat' && (
          <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col justify-center py-4 sm:py-8">
            <div className="relative w-full flex flex-col min-h-0">
              {/* Animated character positioned to overlap the chat box */}
              <div className="flex justify-start ml-[5%] sm:ml-[10%] md:ml-[15%] mb-[-15px] sm:mb-[-20px] relative z-10 flex-shrink-0">
                <AnimatedCharacter
                  animationState={animationState}
                  onWaveComplete={handleWaveComplete}
                  onClick={handleCharacterClick}
                />
              </div>

              {/* Chat box with flex-shrink to prevent overflow */}
              <div className="flex-shrink min-h-0">
                <ChatBox onAnimationStateChange={handleAnimationStateChange} />
              </div>
            </div>
          </div>
        )}
        
        {view === 'menu' && <BeerMenu />}

        {view === 'team' && <TeamInfo />}

        {view === 'contacts' && <ContactsInfo />}
      </main>
    </div>
  );
}
