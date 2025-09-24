// src/Components/SwipeDeck.jsx
import React, { useState } from 'react';
import UserCard from './UserCard'; // adjust path if different

export default function SwipeDeck({ initialProfiles }) {
  const profiles = initialProfiles || [
    {
      id: 'p1',
      name: 'Aisha',
      role: 'Backend Engineer',
      stack: ['Node', 'Postgres', 'Docker'],
      bio: 'I love building robust APIs.',
      lastActive: '30m',
    },
    {
      id: 'p2',
      name: 'Ravi',
      role: 'Frontend Engineer',
      stack: ['React', 'TypeScript'],
      bio: 'Pixel-perfect UI dev.',
      lastActive: '1h',
    },
    {
      id: 'p3',
      name: 'Sana',
      role: 'ML Engineer',
      stack: ['Python', 'PyTorch'],
      bio: 'Models & MLOps.',
      lastActive: '3h',
    },
  ];

  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false); // prevents double actions during animation

  function onPass(profile) {
    if (busy) return;
    setBusy(true);
    console.log('Passed:', profile.name);
    setTimeout(() => {
      setIndex((i) => Math.min(i + 1, profiles.length));
      setBusy(false);
    }, 220);
  }

  function onConnect(profile) {
    if (busy) return;
    setBusy(true);
    console.log('Connect:', profile.name);
    // TODO: create match / open chat logic here
    setTimeout(() => {
      setIndex((i) => Math.min(i + 1, profiles.length));
      setBusy(false);
    }, 220);
  }

  if (index >= profiles.length) {
    return (
      <div className="max-w-md mx-auto p-8 text-center text-gray-300">
        No more profiles — come back later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-start justify-center p-6">
      <div className="max-w-2xl w-full grid grid-cols-3 gap-6">
        {/* Left: swipe deck */}
        <div className="col-span-1">
          <div className="bg-gray-800 rounded-xl p-4 shadow-md">
            <div className="text-sm text-gray-400 mb-3">Discover</div>
            <div className="relative h-[420px]">
              {profiles.map((p, idx) => {
                const offset = idx - index;
                return (
                  <div
                    key={p.id}
                    className="absolute inset-0 rounded-lg p-5 transition-transform duration-300 ease-out"
                    style={{
                      transform: `translateY(${offset * 12}px) scale(${
                        1 - Math.max(0, offset) * 0.03
                      })`,
                      zIndex: profiles.length - idx,
                      opacity: offset < 0 ? 0.25 : 1,
                      pointerEvents: idx === index ? 'auto' : 'none',
                    }}
                  >
                    <UserCard
                      profile={p}
                      index={idx}
                      onPass={onPass}
                      onConnect={onConnect}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-xs text-gray-400">
              Tip: Connect only with devs you want to pair-program with.
            </div>
            <div className="mt-3 text-sm text-gray-300">
              Viewing {Math.min(index + 1, profiles.length)} / {profiles.length}
            </div>
          </div>
        </div>

        {/* Middle: placeholder - you can replace with Matches or Feed */}
        <div className="col-span-1">
          <div className="bg-gray-800 rounded-xl p-4 h-full shadow-md">
            <div className="font-medium text-gray-200">Matches</div>
            <div className="mt-3 text-xs text-gray-400">
              (Hardcoded UI for now)
            </div>
            <div className="mt-4 p-3 rounded-lg bg-indigo-700/30 text-sm">
              New: Code Golf — Sunday 8 PM
            </div>
          </div>
        </div>

        {/* Right: chat placeholder */}
        <div className="col-span-1">
          <div className="bg-gray-800 rounded-xl p-4 h-full shadow-md">
            <div className="font-medium text-gray-200">Chat</div>
            <div className="mt-3 text-xs text-gray-400">
              Select a match to start chatting
            </div>
            <div className="mt-4 text-sm text-gray-300">
              UI-only chat preview here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
