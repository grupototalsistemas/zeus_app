'use client';

import LoadInitialData from '@/components/common/LoadInitialData';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Loading() {
  console.log('carregando...');
  const router = useRouter();

  useEffect(() => {
    console.log('redirecionando...');
    // Uma vez que os dados são carregados, redireciona
    router.push('/listar-chamado');
  }, [router]);

  return (
    <LoadInitialData>
      <div className="hidden"></div>
    </LoadInitialData>
  );
}
