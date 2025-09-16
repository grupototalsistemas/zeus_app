import { selectEmpresas } from '@/store/slices/empresaSlice';
import { useSelector } from 'react-redux';

export function selectEmpresasById(empresaId: number) {
  const empresas = useSelector(selectEmpresas);
  return empresas.find((empresa) => empresa.id === Number(empresaId));
}
