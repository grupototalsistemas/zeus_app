'use client';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  ChatIcon,
  CloseIcon,
  GroupIcon,
} from '@/icons';
import dynamic from 'next/dynamic';
import Badge from '../ui/badge/Badge';

// Sparkline (pequeno gráfico de tendência)
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export const EcommerceMetrics = () => {
  // Configuração simples para mini gráfico
  const sparklineOptions = {
    chart: { type: 'line' as const, sparkline: { enabled: true } },
    stroke: { curve: 'smooth' as const, width: 2 },
    colors: ['#465FFF'],
    tooltip: { enabled: false },
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
      {/* Chamados Abertos */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <GroupIcon className="size-6 text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Chamados Abertos (Mês)
          </span>
          <div className="flex items-center justify-between">
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">
              782
            </h4>
            <Badge color="success">
              <ArrowUpIcon /> 11%
            </Badge>
          </div>
          <div className="mt-3">
            <ReactApexChart
              options={sparklineOptions}
              series={[{ data: [50, 60, 55, 70, 80, 82, 78] }]}
              type="line"
              height={50}
            />
          </div>
        </div>
      </div>

      {/* Chamados Fechados */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Chamados Fechados (Mês)
          </span>
          <div className="flex items-center justify-between">
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">
              650
            </h4>
            <Badge color="error">
              <ArrowDownIcon /> 5%
            </Badge>
          </div>
          <div className="mt-3">
            <ReactApexChart
              options={{ ...sparklineOptions, colors: ['#FF5A5F'] }}
              series={[{ data: [60, 58, 65, 62, 60, 55, 50] }]}
              type="line"
              height={50}
            />
          </div>
        </div>
      </div>

      {/* Tempo Médio de Resolução */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <CloseIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Tempo Médio de Resolução
          </span>
          <div className="flex items-center justify-between">
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">
              3.2 dias
            </h4>
            <Badge color="success">
              <ArrowDownIcon /> -8%
            </Badge>
          </div>
          <div className="mt-3">
            <ReactApexChart
              options={{ ...sparklineOptions, colors: ['#FFA500'] }}
              series={[{ data: [4, 3.8, 3.5, 3.3, 3.1, 3.0, 2.9] }]}
              type="line"
              height={50}
            />
          </div>
        </div>
      </div>

      {/* SLA Cumprido */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <ChatIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            SLA Cumprido
          </span>
          <div className="flex items-center justify-between">
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">
              92%
            </h4>
            <Badge color="success">
              <ArrowUpIcon /> 3%
            </Badge>
          </div>
          <div className="mt-3">
            <ReactApexChart
              options={{ ...sparklineOptions, colors: ['#28A745'] }}
              series={[{ data: [85, 87, 88, 90, 91, 92, 92] }]}
              type="line"
              height={50}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
