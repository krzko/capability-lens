"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface RadialChartProps {
  facets: Array<{
    name: string;
    score: number;
    maxScore: number;
  }>;
}

export function RadialChart({ facets }: RadialChartProps) {
  const getChartOptions = () => {
    return {
      series: facets.map(f => (f.score / f.maxScore) * 100),
      colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#9061F9", "#E74694"],
      chart: {
        height: 320,
        width: "100%",
        type: "radialBar",
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          track: {
            background: '#E5E7EB',
          },
          dataLabels: {
            show: false,
          },
          hollow: {
            margin: 0,
            size: "28%",
          }
        },
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: -23,
          bottom: -15,
        },
      },
      labels: facets.map(f => f.name),
      legend: {
        show: true,
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      yaxis: {
        show: false,
        labels: {
          formatter: function (value: number) {
            return value + '%';
          }
        }
      }
    };
  };

  return (
    <div className="mt-6">
      <ApexCharts
        options={getChartOptions()}
        series={getChartOptions().series}
        type="radialBar"
        height={320}
      />
    </div>
  );
}
