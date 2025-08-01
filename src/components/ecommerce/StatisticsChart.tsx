'use client';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import ChartTab from '../common/ChartTab';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export default function StatisticsChart() {
  const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'ano'>('mes');

  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 310,
      toolbar: { show: false },
      fontFamily: 'Outfit, sans-serif',
      animations: { enabled: false }, // evita piscadas
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      labels: { colors: '#6B7280' },
    },
    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 0 },
    grid: { padding: { right: 0, left: 0 } },
    tooltip: {
      shared: true,
      x: { format: 'dd MMM yyyy' },
      theme: 'dark',
    },
    xaxis: {
      categories:
        periodo === 'semana'
          ? ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
          : periodo === 'mes'
            ? Array.from({ length: 30 }, (_, i) => `${i + 1}`)
            : [
                'Jan',
                'Fev',
                'Mar',
                'Abr',
                'Mai',
                'Jun',
                'Jul',
                'Ago',
                'Set',
                'Out',
                'Nov',
                'Dez',
              ],
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: { style: { colors: '#6B7280', fontSize: '12px' } },
    },
  };

  const series = [
    {
      name: 'Chamados Abertos',
      data:
        periodo === 'semana'
          ? [10, 15, 12, 20, 18, 25, 22]
          : periodo === 'mes'
            ? Array.from(
                { length: 30 },
                () => Math.floor(Math.random() * 25) + 10
              )
            : Array.from(
                { length: 12 },
                () => Math.floor(Math.random() * 300) + 100
              ),
    },
    {
      name: 'Chamados Fechados',
      data:
        periodo === 'semana'
          ? [5, 10, 9, 15, 14, 20, 18]
          : periodo === 'mes'
            ? Array.from(
                { length: 30 },
                () => Math.floor(Math.random() * 20) + 5
              )
            : Array.from(
                { length: 12 },
                () => Math.floor(Math.random() * 250) + 50
              ),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Total de Chamados
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            Estatísticas por {periodo}
          </p>
        </div>
        <ChartTab value={periodo} onChange={setPeriodo} />
      </div>

      <div className="overflow-hidden">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={310}
          width="100%" // garante que não vai estourar
        />
      </div>
    </div>
  );
}
