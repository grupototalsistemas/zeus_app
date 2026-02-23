'use client';
import { BoxIconLine, GroupIcon } from '@/icons';
import { MetricasChamado } from '@/types/chamado.type';

interface EcommerceMetricsProps {
  metricas: MetricasChamado | null;
}

export const EcommerceMetrics = ({ metricas }: EcommerceMetricsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {/* Total de Chamados */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
          <GroupIcon className="size-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total de Chamados
          </span>
          <h4 className="text-title-lg mt-2 font-bold text-gray-800 dark:text-white/90">
            {metricas?.totalChamados ?? 0}
          </h4>
        </div>
      </div>

      {/* Chamados Abertos */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
          <GroupIcon className="size-6 text-green-600 dark:text-green-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Chamados Abertos
          </span>
          <h4 className="text-title-lg mt-2 font-bold text-gray-800 dark:text-white/90">
            {metricas?.chamadosAbertos ?? 0}
          </h4>
        </div>
      </div>

      {/* Chamados Fechados */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
          <BoxIconLine className="size-6 text-red-600 dark:text-red-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Chamados Fechados
          </span>
          <h4 className="text-title-lg mt-2 font-bold text-gray-800 dark:text-white/90">
            {metricas?.chamadosFechados ?? 0}
          </h4>
        </div>
      </div>
    </div>
  );
};
