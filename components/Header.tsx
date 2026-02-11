'use client';

import Image from 'next/image';
import type { View } from '@/types/beer';

interface HeaderProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function Header({ language, onLanguageChange, currentView, onViewChange }: HeaderProps) {

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg-secondary)]/95 dark:bg-[var(--bg-accent)]/95 border-b border-[var(--border-color)] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Mobile and Desktop Layout */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Logo */}
          <div className="flex items-center gap-3 min-w-0 flex-shrink group">
            <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-[var(--accent-primary)] dark:ring-[var(--accent-secondary)] group-hover:ring-4 transition-all">
              <Image
                src="/logo/valhalla.jpg"
                alt="Valhalla Beer Club Logo"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                priority
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-display uppercase tracking-wider truncate text-[var(--text-primary)] dark:text-[var(--text-primary)]">
              <span className="hidden sm:inline bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] dark:from-[var(--accent-secondary)] dark:to-[var(--accent-primary)] bg-clip-text text-transparent">Valhalla Beer Club</span>
              <span className="sm:hidden bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">Valhalla</span>
            </h1>
          </div>

          {/* Center: Navigation - Hidden on mobile, shown on md+ */}
          <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-2">
            <button
              onClick={() => onViewChange('chat')}
              className={`px-4 py-2 rounded-lg font-body font-medium transition-all text-sm lg:text-base ${
                currentView === 'chat'
                  ? 'bg-[var(--accent-primary)] dark:bg-[var(--accent-primary)] text-white shadow-lg'
                  : 'text-[var(--text-secondary)] dark:text-[var(--text-secondary)] hover:bg-[var(--bg-accent)] dark:hover:bg-[var(--bg-primary)]'
              }`}
            >
              Chat
            </button>

            {/* <button
              onClick={() => onViewChange('menu')}
              className={`px-4 py-2 rounded-lg font-body font-medium transition-all text-sm lg:text-base ${
                currentView === 'menu'
                  ? 'bg-[var(--accent-primary)] dark:bg-[var(--accent-primary)] text-white shadow-lg'
                  : 'text-[var(--text-secondary)] dark:text-[var(--text-secondary)] hover:bg-[var(--bg-accent)] dark:hover:bg-[var(--bg-primary)]'
              }`}
            >
              Menu
            </button> */}

            <button
              onClick={() => onViewChange('library')}
              className={`px-4 py-2 rounded-lg font-body font-medium transition-all text-sm lg:text-base ${
                currentView === 'library'
                  ? 'bg-[var(--accent-primary)] dark:bg-[var(--accent-primary)] text-white shadow-lg'
                  : 'text-[var(--text-secondary)] dark:text-[var(--text-secondary)] hover:bg-[var(--bg-accent)] dark:hover:bg-[var(--bg-primary)]'
              }`}
            >
              Beer Menu
            </button>

            <button
              onClick={() => onViewChange('team')}
              className={`px-4 py-2 rounded-lg font-body font-medium transition-all text-sm lg:text-base ${
                currentView === 'team'
                  ? 'bg-[var(--accent-primary)] dark:bg-[var(--accent-primary)] text-white shadow-lg'
                  : 'text-[var(--text-secondary)] dark:text-[var(--text-secondary)] hover:bg-[var(--bg-accent)] dark:hover:bg-[var(--bg-primary)]'
              }`}
            >
              Team
            </button>

            <button
              onClick={() => onViewChange('contacts')}
              className={`px-4 py-2 rounded-lg font-body font-medium transition-all text-sm lg:text-base ${
                currentView === 'contacts'
                  ? 'bg-[var(--accent-primary)] dark:bg-[var(--accent-primary)] text-white shadow-lg'
                  : 'text-[var(--text-secondary)] dark:text-[var(--text-secondary)] hover:bg-[var(--bg-accent)] dark:hover:bg-[var(--bg-primary)]'
              }`}
            >
              Contacts
            </button>

            {/* <a
              href="https://untappd.com/v/valhalla-beer-club/13672441"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg font-body font-medium transition-all text-sm lg:text-base text-[var(--text-secondary)] dark:text-[var(--text-secondary)] hover:bg-[var(--bg-accent)] dark:hover:bg-[var(--bg-primary)]"
            >
              Untappd
            </a> */}
          </nav>

          {/* Right: Settings */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 flex-shrink-0">
            <button className="hidden sm:inline px-4 py-2 rounded-lg bg-[var(--accent-primary)] dark:bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-secondary)] dark:hover:bg-[var(--accent-secondary)] transition-all text-sm lg:text-base font-body font-semibold shadow-lg hover:shadow-xl hover:scale-105">
              Login
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Shown only on small screens */}
        <nav className="md:hidden flex items-center justify-center gap-1 mt-3 pt-3 border-t border-[var(--border-color)] flex-wrap">
          <button
            onClick={() => onViewChange('chat')}
            className={`px-3 py-1.5 rounded-lg font-body font-medium transition-all text-sm ${
              currentView === 'chat'
                ? 'bg-[var(--accent-primary)] text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-accent)]'
            }`}
          >
            Chat
          </button>

          {/* <button
            onClick={() => onViewChange('menu')}
            className={`px-3 py-1.5 rounded-lg font-body font-medium transition-all text-sm ${
              currentView === 'menu'
                ? 'bg-[var(--accent-primary)] text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-accent)]'
            }`}
          >
            Menu
          </button> */}

          <button
            onClick={() => onViewChange('library')}
            className={`px-3 py-1.5 rounded-lg font-body font-medium transition-all text-sm ${
              currentView === 'library'
                ? 'bg-[var(--accent-primary)] text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-accent)]'
            }`}
          >
            Beer Menu
          </button>

          <button
            onClick={() => onViewChange('team')}
            className={`px-3 py-1.5 rounded-lg font-body font-medium transition-all text-sm ${
              currentView === 'team'
                ? 'bg-[var(--accent-primary)] text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-accent)]'
            }`}
          >
            Team
          </button>

          <button
            onClick={() => onViewChange('contacts')}
            className={`px-3 py-1.5 rounded-lg font-body font-medium transition-all text-sm ${
              currentView === 'contacts'
                ? 'bg-[var(--accent-primary)] text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-accent)]'
            }`}
          >
            Contacts
          </button>

          {/* <a
            href="https://untappd.com/v/valhalla-beer-club/13672441"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg font-body font-medium transition-all text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-accent)]"
          >
            Untappd
          </a> */}
        </nav>
      </div>
    </header>
  );
}

