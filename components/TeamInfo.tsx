'use client';

import { useState } from 'react';
import Image from 'next/image';
import teamData from '@/data/team.json';
import { TeamMember } from '@/types/beer';

const teamMembers: TeamMember[] = teamData;

export default function TeamInfo() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-12">
      {/* Hero Title */}
      <div className="text-center mb-10 sm:mb-16 animate-fade-in-up">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display uppercase tracking-wider bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] dark:from-[var(--accent-secondary)] dark:via-[var(--accent-primary)] dark:to-[var(--accent-secondary)] viking:from-[var(--viking-secondary)] viking:via-[var(--viking-accent)] viking:to-[var(--viking-secondary)] bg-clip-text text-transparent mb-4">
          Meet Our Team
        </h2>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent dark:via-[var(--accent-secondary)] viking:via-[var(--viking-secondary)]"></div>
      </div>

      {/* Team Photos Row */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className="group relative cursor-pointer animate-scale-in"
            style={{ animationDelay: `${idx * 0.1}s`, opacity: 0 }}
            onClick={() => setSelectedMember(selectedMember?.name === member.name ? null : member)}
            onMouseEnter={() => setSelectedMember(member)}
          >
            {/* Glowing effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] viking:from-[var(--viking-secondary)] viking:to-[var(--viking-accent)] rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-300" />

            <div className="relative flex flex-col items-center">
              {/* Photo */}
              <div className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                selectedMember?.name === member.name
                  ? 'border-[var(--accent-secondary)] dark:border-[var(--accent-primary)] viking:border-[var(--viking-accent)] scale-105'
                  : 'border-[var(--accent-primary)] dark:border-[var(--accent-secondary)] viking:border-[var(--viking-secondary)] group-hover:border-[var(--accent-secondary)] dark:group-hover:border-[var(--accent-primary)] viking:group-hover:border-[var(--viking-accent)]'
              }`}>
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className={`object-cover ${member.name === 'Serghei' ? 'object-top' : 'object-center'}`}
                  sizes="(max-width: 640px) 128px, 160px"
                />
              </div>

              {/* Name and Role */}
              <div className="mt-3 text-center">
                <h3 className={`text-xl sm:text-2xl font-display uppercase tracking-wide transition-colors ${
                  selectedMember?.name === member.name
                    ? 'text-[var(--accent-secondary)] dark:text-[var(--accent-primary)] viking:text-[var(--viking-accent)]'
                    : 'text-[var(--text-primary)] dark:text-[var(--text-primary)] viking:text-[var(--viking-text-primary)] group-hover:text-[var(--accent-primary)] dark:group-hover:text-[var(--accent-secondary)] viking:group-hover:text-[var(--viking-accent)]'
                }`}>
                  {member.name}
                </h3>
                <p className="text-[var(--accent-primary)] dark:text-[var(--accent-secondary)] viking:text-[var(--viking-secondary)] font-body font-semibold uppercase text-xs sm:text-sm tracking-wider mt-1">
                  {member.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Member Bio */}
      {selectedMember && (
        <div className="animate-fade-in-up">
          <div className="relative group">
            {/* Glowing background */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] viking:from-[var(--viking-secondary)] viking:to-[var(--viking-accent)] rounded-2xl opacity-20 blur" />

            <div className="relative bg-[var(--bg-secondary)] dark:bg-[var(--bg-accent)] viking:bg-[var(--viking-bg-card)] rounded-2xl shadow-lg p-6 sm:p-8 border border-[var(--accent-primary)] dark:border-[var(--accent-secondary)] viking:border-[var(--viking-secondary)]">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-display uppercase tracking-wide text-[var(--accent-primary)] dark:text-[var(--accent-secondary)] viking:text-[var(--viking-accent)] mb-1">
                    {selectedMember.name}
                  </h3>
                  <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] viking:text-[var(--viking-text-secondary)] font-body uppercase text-sm tracking-wider">
                    {selectedMember.role}
                  </p>
                </div>
              </div>

              {/* Decorative divider */}
              <div className="h-0.5 w-20 bg-gradient-to-r from-[var(--accent-primary)] to-transparent dark:from-[var(--accent-secondary)] viking:from-[var(--viking-secondary)] mb-6" />

              {/* Bio */}
              <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] viking:text-[var(--viking-text-secondary)] font-body mb-6 leading-relaxed">
                {selectedMember.bio}
              </p>

              {/* Details */}
              <div className="space-y-3 mb-6">
                {selectedMember.details.map((detail, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-[var(--accent-primary)] dark:text-[var(--accent-secondary)] viking:text-[var(--viking-secondary)] font-body font-semibold">
                      {detail.label}:{' '}
                    </span>
                    <span className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] viking:text-[var(--viking-text-secondary)] font-body">
                      {detail.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Favorite Beer */}
              <div>
                <h4 className="font-body font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] viking:text-[var(--viking-text-primary)] mb-2 uppercase text-sm tracking-wider">
                  Favorite Beer
                </h4>
                <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] viking:text-[var(--viking-text-secondary)] font-body text-sm leading-relaxed">
                  {selectedMember.favoriteBeer}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


