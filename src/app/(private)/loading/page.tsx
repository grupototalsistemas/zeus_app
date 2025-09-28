'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// Hooks de dados
import LoadingScreen from '@/components/common/LoadingScreen';
import { useChamado } from '@/hooks/useChamado';
import { useEmpresaCategoria } from '@/hooks/useEmpresaCategoria';
import { useEmpresaSistema } from '@/hooks/useEmpresaSistema';
import { useEmpresaTipo } from '@/hooks/useEmpresaTipo';
import { useEtapaMovimento } from '@/hooks/useEtapaMovimento';
import { useMovimentoMensagem } from '@/hooks/useMovimentoMensagem';
import { useOcorrencia } from '@/hooks/useOcorrencia';
import { useOcorrenciaTipo } from '@/hooks/useOcorrenciaTipo';
import { usePerfil } from '@/hooks/usePerfil';
import { usePessoa } from '@/hooks/usePessoa';
import { usePessoaTipo } from '@/hooks/usePessoaTipo';
import { usePessoaUsuario } from '@/hooks/usePessoaUsuario';
import { usePrioridade } from '@/hooks/usePrioridade';
import { useSistema } from '@/hooks/useSistema';

export default function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Hooks
  const { getAll: getAllChamados } = useChamado();
  const { getAll: getAllMovimentoMensagens } = useMovimentoMensagem();
  const { fetchPrioridades } = usePrioridade();
  const { fetchOcorrencias } = useOcorrencia();
  const { fetchEtapas } = useEtapaMovimento();
  const { buscarOcorrenciasTipos } = useOcorrenciaTipo();
  const { getAll: getAllPessoaUsuarios } = usePessoaUsuario();
  const { fetchPessoas } = usePessoa();
  const { fetchPessoasTipos } = usePessoaTipo();
  const { fetchPerfis } = usePerfil();
  const { getAll: getAllEmpresaCategorias } = useEmpresaCategoria();
  const { getAll: getAllSistemas } = useSistema();
  const { getAll: getAllEmpresaTipos } = useEmpresaTipo();
  const { getAll: getAllEmpresaSistemas } = useEmpresaSistema();

  useEffect(() => {
    const loadAllData = async () => {
      try {
        console.log('Carregando dados iniciais...');

        // Executa em paralelo
        const results = await Promise.all([
          fetchPrioridades(),
          fetchOcorrencias(),
          fetchPessoasTipos(),
          fetchPessoas(),
          fetchEtapas(),
          getAllChamados(),
          getAllMovimentoMensagens(),
          buscarOcorrenciasTipos(),
          getAllPessoaUsuarios(),
          fetchPerfis(),
          getAllEmpresaCategorias(),
          getAllSistemas(),
          getAllEmpresaTipos(),
          getAllEmpresaSistemas(),
        ]);

        setIsLoading(false);
        router.push('/listar-chamado');
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        setHasError(true);
        router.push('/signin');
      }
    };

    loadAllData();
  }, [dispatch, router]);

  if (isLoading && !hasError) {
    return <LoadingScreen />;
  }

  return null;
}
