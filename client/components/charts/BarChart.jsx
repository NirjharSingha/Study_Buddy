"use client";

import React from "react";
import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const BarChart = ({ allLabels, allData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "bar",
        data: {
          labels: allLabels,
          datasets: [
            {
              label: "Info",
              data: allData,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(205, 205, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(201, 203, 207, 0.2)",
              ],
              borderColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(205, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                "rgb(153, 102, 255)",
                "rgb(201, 203, 207)",
              ],
              borderWidth: 1,
              barThickness: 50,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "category",
            },
            y: {
              min: 0,
              beginAtZero: true,
            },
          },
        },
      });

      chartRef.current.chart = newChart;
    }
  }, [allLabels, allData]);

  return (
    <div className="overflow-x-auto">
      <canvas
        ref={chartRef}
        className="min-h-[60svh] w-[95%] min-w-[400px] max-w-[800px] mx-auto"
      />
    </div>
  );
};

export default BarChart;

// responsive
