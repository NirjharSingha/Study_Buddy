"use client";

import React from "react";
import Leaderboard from "@/components/charts/LeaderBoard";
import LineChart from "@/components/charts/LineChart";
import Doughnut from "@/components/charts/Doughnut";
import PieChart from "@/components/charts/PieChart"; // Make sure this path is correct

const leaderboardData = [
  { name: "Alice", points: 1500 },
  { name: "Bob", points: 1400 },
  { name: "Charlie", points: 1350 },
  { name: "David", points: 1200 }, // YOU
  { name: "Eva", points: 1100 },
  { name: "Frank", points: 1000 },
  { name: "Grace", points: 950 },
  { name: "Henry", points: 900 },
  { name: "Isla", points: 850 },
  { name: "Jack", points: 800 },
];

const currentUser = "David";
const currentUserData = leaderboardData.find(
  (entry) => entry.name === currentUser
);
const rank =
  leaderboardData.findIndex((entry) => entry.name === currentUser) + 1;

const getLast12Months = () => {
  const labels = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(
      d.toLocaleString("default", { month: "short", year: "2-digit" })
    );
  }
  return labels;
};

const getRandomData = (n, min = 500, max = 1600) =>
  Array.from(
    { length: n },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );

const monthlyLabels = getLast12Months();
const monthlyPoints = getRandomData(12, 800, 1600);
const contributionPoints = getRandomData(12, 100, 500);

// New pie chart data
const pieLabels = ["Articles", "Videos", "Animations"];
const pieData = [8, 4, 2]; // You can replace these with dynamic values
const articleCount = pieData[0];
const videoCount = pieData[1];
const animationCount = pieData[2];

const totalPoints = articleCount * 10 + videoCount * 20 + animationCount * 30;

export default function LeaderboardPage() {
  return (
    <main
      className="bg-gray-50 p-6 overflow-y-auto"
      style={{ height: "calc(100svh - 69.6px)" }}
    >
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-12">
        {/* Leaderboard Section */}
        <section>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            CONTRIBUTIONS
          </h1>
          <Leaderboard leaderboardData={leaderboardData} />

          <p className="text-center text-lg text-gray-600 mt-4">
            Your Rank: <span className="font-semibold">{rank}</span>
          </p>
        </section>

        {/* Quiz Points Section */}
        <section>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Monthly Achieved Points from QUIZ
          </h2>
          <LineChart
            allLabels={[...monthlyLabels].reverse()}
            allData={[...monthlyPoints].reverse()}
          />
          <p className="text-center text-lg text-gray-600 mt-4">
            Your Total Points from QUIZ:{" "}
            <span className="font-semibold">{currentUserData?.points}</span>
          </p>
        </section>

        {/* Contributions & Earnings Section */}
        <section>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Your Contributions and Earnings
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="flex-1">
              <Doughnut
                allLabels={monthlyLabels}
                allData={contributionPoints}
              />
            </div>
            <div className="flex-1 mt-8">
              <PieChart allLabels={pieLabels} allData={pieData} />
            </div>
          </div>

          <div className="overflow-x-auto mt-12">
            <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200">
              <thead className="bg-gray-100 text-gray-900">
                <tr>
                  <th className="px-6 py-3 font-semibold border-b">Type</th>
                  <th className="px-6 py-3 font-semibold border-b">Quantity</th>
                  <th className="px-6 py-3 font-semibold border-b">
                    Points per Item
                  </th>
                  <th className="px-6 py-3 font-semibold border-b">
                    Total Points
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4 border-b">Articles</td>
                  <td className="px-6 py-4 border-b">{articleCount}</td>
                  <td className="px-6 py-4 border-b">10</td>
                  <td className="px-6 py-4 border-b">{articleCount * 10}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b">Videos</td>
                  <td className="px-6 py-4 border-b">{videoCount}</td>
                  <td className="px-6 py-4 border-b">20</td>
                  <td className="px-6 py-4 border-b">{videoCount * 20}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b">Animations</td>
                  <td className="px-6 py-4 border-b">{animationCount}</td>
                  <td className="px-6 py-4 border-b">30</td>
                  <td className="px-6 py-4 border-b">{animationCount * 30}</td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-50 text-gray-900 font-medium">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right border-t">
                    Total Contribution Points
                  </td>
                  <td className="px-6 py-4 border-t">{totalPoints}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right border-t">
                    Total Earnings (1 Point = 1 Tk)
                  </td>
                  <td className="px-6 py-4 border-t">৳{totalPoints}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
