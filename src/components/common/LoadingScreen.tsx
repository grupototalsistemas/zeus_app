'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 300);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="text-[120px] font-bold text-brand-500">Z</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[150px] w-[150px] animate-spin rounded-full border-b-2 border-t-2 border-brand-500" />
          </div>
        </div>
        <div className="w-64 bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-brand-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 text-white text-sm">Carregando recursos...</p>
      </div>
    </div>
  );
}
