// CardStage.jsx
import React from 'react';

export default function CardStage({ children, index = 1, total = 1 }) {
  return (
    <div className="flex flex-col justify-between items-center min-h-[calc(100vh-5rem)] pt-8 pb-10 relative z-10">
      {/* Top tip */}
      <div className="absolute top-2 text-slate-400 text-sm select-none">
        <span className="bg-slate-800/60 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow">
          ➜ Swipe → to connect &nbsp; • &nbsp; Tap buttons below
        </span>
      </div>

      <div className="flex-1 flex justify-center items-center">{children}</div>

      <div className="w-full max-w-md text-center space-y-2">
        <p className="text-sm text-slate-400">
          Profiles curated for you • Tap “Interested” to invite or match
        </p>

        <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 to-sky-400"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>

        <p className="text-xs text-slate-500">
          {index}/{total} profiles
        </p>
      </div>
    </div>
  );
}
