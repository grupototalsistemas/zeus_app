// src/components/WithReduxInitialData.tsx
'use client';

import { EmpresaService } from '@/service/empresa.service';
import { RootState } from '@/store/rootReducer';
import { setEmpresas } from '@/store/slices/empresaSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


// src/components/WithReduxInitialData.tsx
// Pegar os dados iniciais necessários para a aplicação
// e armazená-los no Redux Store
export function WithReduxInitialData({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const empresas = useSelector((state: RootState) => state.empresa.empresas);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!empresas || empresas.length === 0) {
          const response = await EmpresaService.getEmpresas();
          dispatch(setEmpresas(response));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        router.push('/error');
      }
    };

    fetchData();
  }, [dispatch, empresas, router]);

  if (isLoading) {
    return <div>Loading application...</div>;
  }

  return <>{children}</>;
}
