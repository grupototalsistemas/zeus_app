'use client';
import { MetricasChamado } from '@/types/chamado.type';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface StatisticsChartProps {
  metricas: MetricasChamado | null;
}

export default function StatisticsChart({ metricas }: StatisticsChartProps) {
  // Processa os dados das métricas para o formato do gráfico
  const chartData = useMemo(() => {
    if (!metricas) {
      return {
        categories: [],
        abertos: [],
        fechados: [],
      };
    }

    // Agrupa os dados por data
    const agruparPorData = (dados: any[]) => {
      const mapa = new Map<string, number>();
      dados.forEach((item) => {
        const data = new Date(item.createdAt);
        const dataStr = data.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        });
        mapa.set(dataStr, (mapa.get(dataStr) || 0) + item._count.id);
      });
      return mapa;
    };

    const abertosMap = agruparPorData(metricas.chamadosAbertosPorDia || []);
    const fechadosMap = agruparPorData(metricas.chamadosFechadosPorDia || []);

    // Combina todas as datas únicas
    const todasDatas = new Set([
      ...Array.from(abertosMap.keys()),
      ...Array.from(fechadosMap.keys()),
    ]);

    const datasOrdenadas = Array.from(todasDatas).sort((a, b) => {
      const [diaA, mesA] = a.split('/').map(Number);
      const [diaB, mesB] = b.split('/').map(Number);
      if (mesA !== mesB) return mesA - mesB;
      return diaA - diaB;
    });

    return {
      categories: datasOrdenadas,
      abertos: datasOrdenadas.map((data) => abertosMap.get(data) || 0),
      fechados: datasOrdenadas.map((data) => fechadosMap.get(data) || 0),
    };
  }, [metricas]);

  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 310,
      toolbar: { show: false },
      fontFamily: 'Outfit, sans-serif',
      animations: { enabled: false },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      labels: { colors: '#6B7280' },
    },
    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 4 },
    grid: { padding: { right: 0, left: 0 } },
    tooltip: {
      shared: true,
      theme: 'dark',
    },
    xaxis: {
      categories:
        chartData.categories.length > 0 ? chartData.categories : ['Sem dados'],
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: {
        style: { colors: '#6B7280', fontSize: '12px' },
      },
    },
    yaxis: {
      labels: { style: { colors: '#6B7280', fontSize: '12px' } },
    },
    colors: ['#10B981', '#EF4444'],
  };

  const series = [
    {
      name: 'Chamados Abertos',
      data: chartData.abertos.length > 0 ? chartData.abertos : [0],
    },
    {
      name: 'Chamados Fechados',
      data: chartData.fechados.length > 0 ? chartData.fechados : [0],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Chamados por Dia
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            Estatísticas do período selecionado
          </p>
        </div>
      </div>

      <div className="overflow-hidden">
        {chartData.categories.length > 0 ? (
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={310}
            width="100%"
          />
        ) : (
          <div className="flex h-[310px] items-center justify-center text-gray-500 dark:text-gray-400">
            Nenhum dado disponível para o período
          </div>
        )}
      </div>
    </div>
  );
}
