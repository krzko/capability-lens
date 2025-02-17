"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface MaturityDistributionProps {
  services: Array<{
    id: string;
    name: string;
    assessments: Array<{
      id: string;
      createdAt: string;
      scores: Record<string, number>;
    }>;
  }>;
}

export function MaturityDistribution({ services }: MaturityDistributionProps) {
  const calculateMaturityDistribution = () => {
    // Create a map of services to their maturity levels
    const serviceData = services.map(service => {
      if (service.assessments && service.assessments.length > 0) {
        const latestAssessment = [...service.assessments].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        const scores = Object.values(latestAssessment.scores);
        if (scores.length > 0) {
          const avgScore = Math.min(Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length), 5);
          return {
            name: service.name,
            data: [0, 0, 0, 0, 0].map((_, i) => i + 1 === avgScore ? 1 : 0)
          };
        }
      }
      return {
        name: service.name,
        data: [0, 0, 0, 0, 0]
      };
    });

    return serviceData;
  };

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 0,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['L1', 'L2', 'L3', 'L4', 'L5'],
      title: {
        text: 'Maturity Levels',
        style: {
          color: '#6B7280',
          fontSize: '12px',
        },
      },
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Services',
        style: {
          color: '#6B7280',
          fontSize: '12px',
        },
      },
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px',
        },
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const serviceName = w.globals.seriesNames[seriesIndex];
        const level = `L${dataPointIndex + 1}`;
        const isPresent = series[seriesIndex][dataPointIndex] === 1;
        return `<div class="p-2">
          <div class="font-medium">${serviceName}</div>
          <div class="text-sm text-gray-500">${level}</div>
        </div>`;
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
    },
    colors: [
      '#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899',
      '#8B5CF6', '#14B8A6', '#F97316', '#4F46E5', '#D946EF',
      '#06B6D4', '#84CC16', '#EAB308', '#6D28D9', '#DB2777',
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution by Maturity Levels</CardTitle>
      </CardHeader>
      <CardContent>
        <ApexCharts
          options={chartOptions}
          series={calculateMaturityDistribution()}
          type="bar"
          height={350}
        />
      </CardContent>
    </Card>
  );
}
