"use client";

import React from "react";
import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const Doughnut = ({ allLabels, allData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "doughnut",
        data: {
          labels: allLabels,
          datasets: [
            {
              label: "Info",
              data: allData,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(205, 105, 126, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(201, 203, 207, 0.2)",
              ],
              borderColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(205, 105, 126)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                "rgb(153, 102, 255)",
                "rgb(201, 203, 207)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {},
      });

      chartRef.current.chart = newChart;
    }
  }, [allLabels, allData]);

  return (
    <div className="flex justify-center overflow-x-auto">
      <canvas
        ref={chartRef}
        className="max-w-[80%] min-w-[18rem] min-h-[18rem] overflow-x-auto"
      />
    </div>
  );
};

export default Doughnut;

// responsive
