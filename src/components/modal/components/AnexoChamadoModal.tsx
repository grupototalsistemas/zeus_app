'use client';

import { Chamado } from '@/types/chamado.type';
import { formatarData } from '@/utils/fomata-data';
import React, { useState } from 'react';
import { Collapse } from '../CollapseModal';
import { Modal } from '../ui/modal';

interface Anexo {
  id?: number;
  nomeOriginal?: string;
  mimeType?: string;
  ativo?: string;
  usuarioId?: number;
  createdAt?: string;
  url?: string; // URL para acessar o arquivo
  base64?: string; // Dados base64 caso disponível
}

interface ChamadoModalAnexosProps {
  chamado: Chamado;
}

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  anexo: Anexo | null;
}

// Modal para visualizar imagens
const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  onClose,
  anexo,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!anexo) return null;

  const handleDownload = () => {
    // Implementar lógica de download aqui
    // Por exemplo, usando fetch para baixar o arquivo
    console.log('Download anexo:', anexo.nomeOriginal);
  };

  const getImageSrc = () => {
    if (anexo.base64) {
      return `data:${anexo.mimeType};base64,${anexo.base64}`;
    }
    if (anexo.url) {
      return anexo.url;
    }
    // Fallback - construir URL baseada no ID ou outro identificador
    return `/api/anexos/${anexo.id}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-4 my-4 flex h-[calc(100vh-2rem)] max-w-6xl flex-col overflow-hidden"
      showCloseButton={false}
    >
      {/* Header do Modal */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {anexo.nomeOriginal}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {anexo.mimeType} • {formatarData(anexo.createdAt || '', 'data')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-500"
          >
            <svg
              className="mr-1 inline h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-gray-500"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Conteúdo do Modal */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
        {anexo.mimeType?.startsWith('image/') ? (
          <div className="relative max-h-full max-w-full">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              </div>
            )}
            {imageError ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <svg
                  className="mb-4 h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                  Erro ao carregar imagem
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Não foi possível carregar esta imagem. Tente fazer o download.
                </p>
              </div>
            ) : (
              <img
                src={getImageSrc()}
                alt={anexo.nomeOriginal}
                className="max-h-full max-w-full rounded-lg object-contain shadow-lg"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setImageError(true);
                }}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-6">
              {anexo.mimeType === 'application/pdf' ? (
                <svg
                  className="h-20 w-20 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-20 w-20 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              {anexo.nomeOriginal}
            </h3>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Este tipo de arquivo não pode ser visualizado no navegador.
            </p>
            <button
              onClick={handleDownload}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-500"
            >
              <svg
                className="mr-2 inline h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Fazer Download
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export const ChamadoModalAnexos: React.FC<ChamadoModalAnexosProps> = ({
  chamado,
}) => {
  const [selectedAnexo, setSelectedAnexo] = useState<Anexo | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const anexos = chamado.movimentos?.flatMap((mov) => mov.anexos) || [];

  const getFileIcon = (tipo: string) => {
    if (tipo.startsWith('image/')) {
      return (
        <svg
          className="h-8 w-8 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (tipo === 'application/pdf') {
      return (
        <svg
          className="h-8 w-8 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return (
      <svg
        className="h-8 w-8 text-gray-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const handleAnexoClick = (anexo: Anexo) => {
    setSelectedAnexo(anexo);
    setIsViewerOpen(true);
  };

  const handleDownload = (anexo: Anexo, event: React.MouseEvent) => {
    event.stopPropagation(); // Previne a abertura do modal
    // Implementar lógica de download direto aqui
    console.log('Download direto:', anexo.nomeOriginal);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setSelectedAnexo(null);
  };

  return (
    <>
      <Collapse title="Anexos" count={anexos.length}>
        <div className="max-h-80 space-y-3 overflow-y-auto p-4">
          {anexos.map((anexo) => (
            <div
              key={anexo?.id}
              className="flex cursor-pointer items-center space-x-3 rounded-lg bg-gray-50 p-3 transition-all hover:bg-gray-100 hover:shadow-md dark:bg-gray-900/50 dark:hover:bg-gray-800/50"
              onClick={() => handleAnexoClick(anexo)}
            >
              <div className="flex-shrink-0">
                {getFileIcon(anexo?.mimeType || '')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {anexo?.nomeOriginal}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {anexo?.ativo} • {anexo?.usuarioId} •{' '}
                  {formatarData(anexo?.createdAt || '', 'data')}
                </p>
                {anexo?.mimeType?.startsWith('image/') && (
                  <span className="mt-1 inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    <svg
                      className="mr-1 h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Clique para visualizar
                  </span>
                )}
              </div>
              <div className="flex flex-shrink-0 items-center space-x-2">
                {anexo?.mimeType?.startsWith('image/') && (
                  <button
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    title="Visualizar imagem"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                )}
                <button
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={(e) => handleDownload(anexo, e)}
                  title="Fazer download"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </Collapse>

      {/* Modal de Visualização */}
      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={closeViewer}
        anexo={selectedAnexo}
      />
    </>
  );
};
