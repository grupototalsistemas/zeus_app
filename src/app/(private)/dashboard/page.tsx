'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics';
import StatisticsChart from '@/components/ecommerce/StatisticsChart';
import { usePessoa } from '@/hooks/usePessoa';
import { ChamadoService } from '@/service/chamado.service';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { pessoaInfo, pessoaLogada, pessoas } = usePessoa();
  const [metricas, setMetricas] = useState(null);
  // Define começo e final do mês atual
  const dataAtual = new Date();
  const primeiroDiaMes = new Date(
    dataAtual.getFullYear(),
    dataAtual.getMonth(),
    1
  );
  const ultimoDiaMes = new Date(
    dataAtual.getFullYear(),
    dataAtual.getMonth() + 1,
    0
  );
  useEffect(() => {
    console.log('Pessoa Logada:', pessoaLogada);
    console.log('pessoas', pessoas);
    console.log('info:', pessoaInfo);
    const fetchMetricas = async () => {
      const response = await ChamadoService.metricas(
        Number(pessoaInfo?.id_pessoa_usuario),
        primeiroDiaMes,
        ultimoDiaMes
      );
      console.log('Métricas do mês:', response);
      setMetricas(response);
    };
    fetchMetricas();
  }, [pessoaInfo]);

  return (
    <div className="col-span-10 space-y-8 xl:col-span-7">
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics metricas={metricas || null} />
      </div>
      <div className="col-span-12">
        <StatisticsChart metricas={metricas || null} />
      </div>
    </div>
  );
}
