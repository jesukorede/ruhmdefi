"use client";

import { memo, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

type MiniAreaProps = { values: number[]; accent?: string };

export default memo(function MiniArea({ values = [], accent = "#00ffc2" }: MiniAreaProps) {
  const labels = useMemo(() => values.map((_, i) => `${i}`), [values]);
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: values,
          fill: true,
          borderColor: accent,
          backgroundColor: (ctx: any) => {
            const { ctx: c, chartArea } = ctx.chart;
            if (!chartArea) return accent + "33";
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, accent + "55");
            gradient.addColorStop(1, accent + "00");
            return gradient;
          },
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    }),
    [labels, values, accent]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: true, intersect: false } },
      elements: { line: { borderJoinStyle: "round" } },
      scales: { x: { display: false }, y: { display: false } },
    }),
    []
  );

  return (
    <div style={{ height: 80 }}>
      <Line data={data} options={options as any} />
    </div>
  );
});
