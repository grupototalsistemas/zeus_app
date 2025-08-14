// src/app/page.tsx
import { EmpresaService } from '@/service/empresa.service';
import { setEmpresas } from '@/store/slices/empresaSlice';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await EmpresaService.getEmpresas();
        if (!response) {
          throw new Error('Failed to fetch empresas');  
        }
        dispatch(setEmpresas(response));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching empresas:', error);
      }
    };
    fetchEmpresas();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }else {
  redirect('/signin');
  }
}


