import { EmpresaService } from '@/service/empresa.service';
import { setEmpresas } from '@/store/slices/empresaSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

interface WithInitialDataProps {
  children: React.ReactNode;
}

export const WithInitialData = ({ children }: WithInitialDataProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Carrega as empresas
        const empresas = await EmpresaService.getEmpresas();
        dispatch(setEmpresas(empresas));
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      }
    };

    loadInitialData();
  }, [dispatch]);

  return <>{children}</>;
};
