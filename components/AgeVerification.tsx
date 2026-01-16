'use client';

import Image from 'next/image';

interface AgeVerificationProps {
  onConfirm: () => void;
}

export default function AgeVerification({ onConfirm }: AgeVerificationProps) {
  return (
    <div className="min-h-screen bg-gradient-warmth flex items-center justify-center p-4 transition-colors relative overflow-hidden">
      {/* Atmospheric overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20 viking:opacity-40 mix-blend-overlay"
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
           }}
      />

      <div className="relative animate-scale-in">
        {/* Glowing backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-10 dark:opacity-15 viking:opacity-20 rounded-3xl blur-2xl" />

        <div className="relative bg-[var(--bg-secondary)] backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 max-w-lg w-full text-center transition-colors border-2 border-[var(--border-color)] viking:border-[var(--viking-border)]">
          {/* Logo */}
          <div className="mb-10 flex justify-center animate-fade-in">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden ring-4 ring-[var(--accent-primary)] dark:ring-[var(--accent-secondary)] viking:ring-[var(--viking-secondary)] shadow-xl">
              <Image
                src="/logo/valhalla.jpg"
                alt="Valhalla Beer Club Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-display uppercase tracking-wider bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] dark:from-[var(--accent-secondary)] dark:via-[var(--accent-primary)] dark:to-[var(--accent-secondary)] viking:from-[var(--viking-secondary)] viking:via-[var(--viking-accent)] viking:to-[var(--viking-secondary)] bg-clip-text text-transparent mb-3 animate-fade-in-up stagger-1">
            Valhalla Beer Club
          </h1>

          {/* Decorative divider */}
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent dark:via-[var(--accent-secondary)] viking:via-[var(--viking-secondary)] mb-8 animate-fade-in-up stagger-2" />

          {/* Subtitle */}
          <h2 className="text-xl sm:text-2xl font-display uppercase tracking-wide text-[var(--text-primary)] dark:text-[var(--text-primary)] viking:text-[var(--viking-text-primary)] mb-6 animate-fade-in-up stagger-3">
            Age Verification Required
          </h2>

          {/* Description */}
          <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] viking:text-[var(--viking-text-secondary)] font-body text-base sm:text-lg mb-10 leading-relaxed animate-fade-in-up stagger-4">
            You must be <span className="font-bold text-[var(--accent-primary)] dark:text-[var(--accent-secondary)] viking:text-[var(--viking-accent)]">18 years or older</span> to enter this website. Please confirm your age to continue.
          </p>

          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            className="w-full px-8 py-5 bg-[var(--accent-primary)] dark:bg-[var(--accent-primary)] viking:bg-[var(--viking-primary)] text-white text-lg sm:text-xl font-body font-bold rounded-2xl hover:bg-[var(--accent-secondary)] dark:hover:bg-[var(--accent-secondary)] viking:hover:bg-[var(--viking-accent)] transition-all shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 uppercase tracking-wider animate-fade-in-up stagger-5"
          >
            I am 18 or older
          </button>

          {/* Legal disclaimer */}
          <p className="text-xs sm:text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)] viking:text-[var(--viking-text-muted)] font-body mt-8 leading-relaxed animate-fade-in-up stagger-6">
            By entering this site, you agree that you are of legal drinking age in your country.
          </p>
        </div>
      </div>
    </div>
  );
}
