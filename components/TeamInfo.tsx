'use client';

const teamMembers = [
  {
    name: 'Finn',
    role: 'Founder & Owner',
    bio: 'A craft beer enthusiast from Oslo, Finn founded Valhalla Beer Club with a dream to bring the finest Nordic and international craft beers to Prague. With 15 years in the industry, he\'s passionate about creating a welcoming space where beer lovers can discover new favorites.',
    preferences: ['Imperial Stouts', 'Belgian Tripels', 'Barrel-aged']
  },
  {
    name: 'Serghei',
    role: 'Administrator',
    bio: 'Originally from Moldova, Serghei brings precision and organization to everything at Valhalla. He manages the day-to-day operations and ensures our beer selection stays fresh and exciting. His meticulous attention to detail keeps everything running smoothly behind the scenes.',
    preferences: ['Czech Pilsners', 'German Lagers', 'Session IPAs']
  },
  {
    name: 'Eitan',
    role: 'Administrator',
    bio: 'Tel Aviv native Eitan handles our social media, events, and customer experience. His vibrant personality and deep knowledge of craft beer culture make him a favorite among regulars. He\'s always excited to share stories about the breweries we partner with.',
    preferences: ['Hazy IPAs', 'Fruit Sours', 'Wheat Beers']
  },
  {
    name: 'Pol',
    role: 'Head Bartender',
    bio: 'Barcelona-born Pol is the heart of our bar. With expert knowledge of every beer on tap and an incredible ability to match customers with their perfect pint, he\'s the person you want serving you. His friendly demeanor and quick wit make every visit memorable.',
    preferences: ['American IPAs', 'Brown Ales', 'Porters']
  },
];

export default function TeamInfo() {
  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-12">
      {/* Hero Title */}
      <div className="text-center mb-10 sm:mb-16 animate-fade-in-up">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display uppercase tracking-wider bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] dark:from-[var(--accent-secondary)] dark:via-[var(--accent-primary)] dark:to-[var(--accent-secondary)] viking:from-[var(--viking-secondary)] viking:via-[var(--viking-accent)] viking:to-[var(--viking-secondary)] bg-clip-text text-transparent mb-4">
          Meet Our Team
        </h2>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent dark:via-[var(--accent-secondary)] viking:via-[var(--viking-secondary)]"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className="group relative animate-scale-in"
            style={{ animationDelay: `${idx * 0.1}s`, opacity: 0 }}
          >
            {/* Glowing effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] viking:from-[var(--viking-secondary)] viking:to-[var(--viking-accent)] rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-300" />

            <div className="relative bg-[var(--bg-secondary)] dark:bg-[var(--bg-accent)] viking:bg-[var(--viking-bg-card)] rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-2xl viking:shadow-[var(--viking-glow)] viking:hover:shadow-[var(--viking-glow-intense)] transition-all duration-300 border border-[var(--border-color)] viking:border-[var(--viking-border)] hover:border-[var(--accent-primary)] dark:hover:border-[var(--accent-secondary)] viking:hover:border-[var(--viking-secondary)] hover:-translate-y-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl font-display uppercase tracking-wide text-[var(--text-primary)] dark:text-[var(--text-primary)] viking:text-[var(--viking-text-primary)] mb-2 group-hover:text-[var(--accent-primary)] dark:group-hover:text-[var(--accent-secondary)] viking:group-hover:text-[var(--viking-accent)] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[var(--accent-primary)] dark:text-[var(--accent-secondary)] viking:text-[var(--viking-secondary)] font-body font-semibold uppercase text-sm tracking-wider">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Decorative divider */}
              <div className="h-0.5 w-16 bg-gradient-to-r from-[var(--accent-primary)] to-transparent dark:from-[var(--accent-secondary)] viking:from-[var(--viking-secondary)] mb-4 group-hover:w-24 transition-all duration-300" />

              <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] viking:text-[var(--viking-text-secondary)] font-body mb-6 leading-relaxed">
                {member.bio}
              </p>

              <div>
                <h4 className="font-body font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] viking:text-[var(--viking-text-primary)] mb-3 uppercase text-sm tracking-wider">
                  Beer Preferences
                </h4>
                <div className="flex flex-wrap gap-2">
                  {member.preferences.map((pref, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-[var(--bg-accent)] dark:bg-[var(--bg-primary)] viking:bg-[var(--viking-bg-elevated)] text-[var(--accent-primary)] dark:text-[var(--accent-secondary)] viking:text-[var(--viking-accent)] rounded-full text-xs sm:text-sm font-body font-medium border border-[var(--accent-primary)] dark:border-[var(--accent-secondary)] viking:border-[var(--viking-secondary)] uppercase tracking-wider hover:scale-105 transition-transform"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


