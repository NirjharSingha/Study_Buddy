"use client";

import React from "react";
import { Crown } from "lucide-react";

// Background + Border color pairs matching your BarChart
const bgAndBorderColors = [
  { bg: "bg-[rgba(255,99,132,0.2)]", border: "border-[rgb(255,99,132)]" },
  { bg: "bg-[rgba(255,159,64,0.2)]", border: "border-[rgb(255,159,64)]" },
  { bg: "bg-[rgba(205,205,86,0.2)]", border: "border-[rgb(205,205,86)]" },
  { bg: "bg-[rgba(75,192,192,0.2)]", border: "border-[rgb(75,192,192)]" },
  { bg: "bg-[rgba(54,162,235,0.2)]", border: "border-[rgb(54,162,235)]" },
  { bg: "bg-[rgba(153,102,255,0.2)]", border: "border-[rgb(153,102,255)]" },
  { bg: "bg-[rgba(201,203,207,0.2)]", border: "border-[rgb(201,203,207)]" },
];

const Leaderboard = ({ leaderboardData }) => {
  const sortedData = [...leaderboardData].sort((a, b) => b.points - a.points);

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 border dark:border-zinc-700 mt-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-zinc-800 dark:text-zinc-200">
        🏆 Leaderboard
      </h2>
      <ul className="space-y-4">
        {sortedData.map((entry, index) => {
          const color = bgAndBorderColors[index % bgAndBorderColors.length];
          return (
            <li
              key={entry.name}
              className={`flex justify-between items-center py-4 px-6 rounded-xl transition-all text-zinc-800 dark:text-zinc-200 border-2 ${color.bg} ${color.border}`}
            >
              <div className="flex items-center gap-3 font-medium">
                <span className="w-6 text-right text-sm text-zinc-500">
                  {index + 1}
                </span>
                <span>{entry.name}</span>
                {index === 0 && (
                  <Crown className="w-5 h-5 text-yellow-500 ml-2" />
                )}
              </div>
              <span className="text-base font-semibold text-blue-600 dark:text-blue-400">
                {entry.points}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Leaderboard;
