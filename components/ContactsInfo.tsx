'use client';

import { Globe, Instagram, Mail } from 'lucide-react';

export default function ContactsInfo() {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12">
      {/* Hero Title */}
      <div className="text-center mb-10 sm:mb-16 animate-fade-in-up">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display uppercase tracking-wider bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] dark:from-[var(--accent-secondary)] dark:via-[var(--accent-primary)] dark:to-[var(--accent-secondary)] viking:from-[var(--viking-secondary)] viking:via-[var(--viking-accent)] viking:to-[var(--viking-secondary)] bg-clip-text text-transparent mb-4">
          Get In Touch
        </h2>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent dark:via-[var(--accent-secondary)] viking:via-[var(--viking-secondary)]"></div>
      </div>

      <div className="relative animate-scale-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
        {/* Glowing backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-5 dark:opacity-10 viking:opacity-15 rounded-2xl blur-xl" />

        <div className="relative bg-[var(--bg-secondary)] dark:bg-[var(--bg-accent)] viking:bg-[var(--viking-bg-card)] rounded-2xl shadow-2xl p-6 sm:p-10 transition-colors border border-[var(--border-color)] viking:border-[var(--viking-border)]">
          <div className="space-y-5 sm:space-y-6">
            {/* Website */}
            <div className="group flex items-start gap-4 sm:gap-5 p-5 sm:p-6 bg-[var(--bg-accent)] dark:bg-[var(--bg-primary)] viking:bg-[var(--viking-bg-elevated)] rounded-xl hover:bg-[var(--bg-primary)] dark:hover:bg-[var(--bg-secondary)] viking:hover:bg-[var(--viking-bg-card)] transition-all duration-300 border border-transparent hover:border-[var(--accent-primary)] dark:hover:border-[var(--accent-secondary)] viking:hover:border-[var(--viking-secondary)] hover:shadow-lg hover:-translate-y-0.5">
              <div className="p-3 rounded-lg bg-[var(--accent-primary)]/10 dark:bg-[var(--accent-secondary)]/10 viking:bg-[var(--viking-secondary)]/10 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-[var(--accent-primary)] dark:text-[var(--accent-secondary)] viking:text-[var(--viking-secondary)] flex-shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display uppercase tracking-wider text-[var(--text-primary)] dark:text-[var(--text-primary)] viking:text-[var(--viking-text-primary)] mb-2 text-lg">Website</h3>
                <a
                  href="https://www.valhalla-beer.cz/"
                  className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] viking:text-[var(--viking-text-secondary)] hover:text-[var(--accent-primary)] dark:hover:text-[var(--accent-secondary)] viking:hover:text-[var(--viking-accent)] transition-colors font-body break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  valhalla-beer.cz
                </a>
              </div>
            </div>

            {/* Instagram */}
            <div className="group flex items-start gap-4 sm:gap-5 p-5 sm:p-6 bg-[var(--bg-accent)] dark:bg-[var(--bg-primary)] viking:bg-[var(--viking-bg-elevated)] rounded-xl hover:bg-[var(--bg-primary)] dark:hover:bg-[var(--bg-secondary)] viking:hover:bg-[var(--viking-bg-card)] transition-all duration-300 border border-transparent hover:border-[var(--accent-primary)] dark:hover:border-[var(--accent-secondary)] viking:hover:border-[var(--viking-secondary)] hover:shadow-lg hover:-translate-y-0.5">
              <div className="p-3 rounded-lg bg-[var(--accent-primary)]/10 dark:bg-[var(--accent-secondary)]/10 viking:bg-[var(--viking-secondary)]/10 group-hover:scale-110 transition-transform">
                <Instagram className="w-6 h-6 text-[var(--accent-primary)] dark:text-[var(--accent-secondary)] viking:text-[var(--viking-secondary)] flex-shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display uppercase tracking-wider text-[var(--text-primary)] dark:text-[var(--text-primary)] viking:text-[var(--viking-text-primary)] mb-2 text-lg">Instagram</h3>
                <a
                  href="https://www.instagram.com/valhalla_beer_club/"
                  className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] viking:text-[var(--viking-text-secondary)] hover:text-[var(--accent-primary)] dark:hover:text-[var(--accent-secondary)] viking:hover:text-[var(--viking-accent)] transition-colors font-body break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @valhalla_beer_club
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="group flex items-start gap-4 sm:gap-5 p-5 sm:p-6 bg-[var(--bg-accent)] dark:bg-[var(--bg-primary)] viking:bg-[var(--viking-bg-elevated)] rounded-xl hover:bg-[var(--bg-primary)] dark:hover:bg-[var(--bg-secondary)] viking:hover:bg-[var(--viking-bg-card)] transition-all duration-300 border border-transparent hover:border-[var(--accent-primary)] dark:hover:border-[var(--accent-secondary)] viking:hover:border-[var(--viking-secondary)] hover:shadow-lg hover:-translate-y-0.5">
              <div className="p-3 rounded-lg bg-[var(--accent-primary)]/10 dark:bg-[var(--accent-secondary)]/10 viking:bg-[var(--viking-secondary)]/10 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-[var(--accent-primary)] dark:text-[var(--accent-secondary)] viking:text-[var(--viking-secondary)] flex-shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display uppercase tracking-wider text-[var(--text-primary)] dark:text-[var(--text-primary)] viking:text-[var(--viking-text-primary)] mb-2 text-lg">Email</h3>
                <a
                  href="mailto:lucerna@valhalla-beer.cz"
                  className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] viking:text-[var(--viking-text-secondary)] hover:text-[var(--accent-primary)] dark:hover:text-[var(--accent-secondary)] viking:hover:text-[var(--viking-accent)] transition-colors font-body break-all"
                >
                  lucerna@valhalla-beer.cz
                </a>
              </div>
            </div>
          </div>

          {/* Visit Us Section */}
          <div className="mt-8 sm:mt-10 pt-8 border-t-2 border-[var(--border-color)] viking:border-[var(--viking-border)]">
            <h3 className="font-display uppercase tracking-wider text-2xl sm:text-3xl text-[var(--text-primary)] dark:text-[var(--text-primary)] viking:text-[var(--viking-text-primary)] mb-4">Visit Us</h3>
            <div className="h-0.5 w-16 bg-gradient-to-r from-[var(--accent-primary)] to-transparent dark:from-[var(--accent-secondary)] viking:from-[var(--viking-secondary)] mb-5" />
            <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] viking:text-[var(--viking-text-secondary)] font-body text-lg mb-4">
              Vodičkova 36, 110 00 Nové Město
            </p>
            <a
              href="https://maps.app.goo.gl/KaPWLkCcaYECAy3E8"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] dark:bg-[var(--accent-primary)] viking:bg-[var(--viking-primary)] text-white rounded-xl hover:bg-[var(--accent-secondary)] dark:hover:bg-[var(--accent-secondary)] viking:hover:bg-[var(--viking-accent)] transition-all shadow-lg hover:shadow-xl hover:scale-105 font-body font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
