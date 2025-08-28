'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LoadingScreen from './LoadingScreen';

// Types

// Services

// Actions do Redux
import { useEtapaMovimento } from '@/hooks/useEtapaMovimento';
import { useOcorrencia } from '@/hooks/useOcorrencia';
import { usePrioridade } from '@/hooks/usePrioridade';
import { useTipo } from '@/hooks/useTipo';

interface LoadInitialDataProps {
  children: React.ReactNode;
}

export default function LoadInitialData({ children }: LoadInitialDataProps) {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  const {fetchPrioridades} = usePrioridade();
  const {fetchOcorrencias} = useOcorrencia();
  const {fetchTipos} = useTipo();
  const {fetchEtapas} = useEtapaMovimento();

  useEffect(() => {
    const loadAllData = async () => {
      try {
        await
        fetchPrioridades();
        fetchOcorrencias();
        fetchTipos();
        fetchEtapas();

        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        // Em caso de erro, redireciona para o login
        router.push('/signin');
      }
    };

    loadAllData();
  }, [dispatch, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
