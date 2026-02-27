'use client';
import { MovimentoAnexoService } from '@/service/movimentoAnexo.service';
import { ChamadoMovimentoAnexo } from '@/types/chamadoMovimentoAnexo.type';
import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import ComponentCard from '../../common/ComponentCard';

interface ExistingAttachment {
  id: number;
  name: string;
  size?: number;
  descricao?: string;
}

interface DropzoneProps {
  onFilesChange: (files: File[]) => void;
  resetFiles?: boolean;
  onResetComplete?: () => void;
  existingAttachments?: ChamadoMovimentoAnexo[];
}

const DropzoneComponent: React.FC<DropzoneProps> = ({
  onFilesChange,
  resetFiles = false,
  onResetComplete,
  existingAttachments = [],
}) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [existingFiles, setExistingFiles] = React.useState<
    ExistingAttachment[]
  >([]);

  // Carregar anexos existentes
  useEffect(() => {
    if (existingAttachments && existingAttachments.length > 0) {
      const mapped = existingAttachments.map((anexo) => ({
        id: anexo.id || 0,
        name: anexo.descricao || `Anexo ${anexo.id}`,
        descricao: anexo.descricao,
      }));
      setExistingFiles(mapped);
    }
  }, [existingAttachments]);

  useEffect(() => {
    if (resetFiles) {
      setFiles([]);
      setExistingFiles([]);
      onFilesChange([]);
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [resetFiles, onFilesChange, onResetComplete]);

  const onDrop = (acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    setFiles((prev) => [...prev, ...acceptedFiles]);
    onFilesChange([...files, ...acceptedFiles]);
  };

  const removeFile = (fileIndex: number) => {
    const newFiles = files.filter((_, index) => index !== fileIndex);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const removeExistingFile = (fileId: number) => {
    const newExistingFiles = existingFiles.filter((file) => file.id !== fileId);
    setExistingFiles(newExistingFiles);
    // Aqui você pode adicionar lógica para marcar para exclusão no backend
  };

  const downloadExistingFile = async (file: ExistingAttachment) => {
    try {
      const blob = await MovimentoAnexoService.downloadAnexo(file.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      alert('Erro ao baixar arquivo. Por favor, tente novamente.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 31457280, // 30MB em bytes
    accept: {
      'image/png': [],
      'image/jpeg': [],
      'image/webp': [],
      'image/svg+xml': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        [], // .docx
    },
  });

  return (
    <ComponentCard title="Anexar arquivos" className="mb-5">
      <div className="dark:hover:border-brand-500 hover:border-brand-500 cursor-pointer rounded-xl border border-dashed border-gray-300 transition dark:border-gray-700">
        <div
          {...getRootProps()}
          className={`dropzone cursor-pointer rounded-xl border-dashed border-gray-300 p-7 lg:p-10 ${
            isDragActive
              ? 'border-brand-500 bg-gray-100 dark:bg-gray-800'
              : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
          } `}
          id="demo-upload"
        >
          {/* Hidden Input */}
          <input {...getInputProps()} />

          <div className="dz-message m-0! flex flex-col items-center">
            {/* Icon Container */}
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                  />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <h4 className="text-theme-xl mb-3 font-semibold text-gray-800 dark:text-white/90">
              {isDragActive
                ? 'Solte arquivos aqui'
                : 'Arraste e solte os arquivos aqui'}
            </h4>

            <span className="mb-5 block w-full max-w-[290px] text-center text-sm text-gray-700 dark:text-gray-400">
              PNG, JPG, WebP, SVG, PDF (máx. 30MB).
            </span>

            <span className="text-theme-sm text-brand-500 font-medium underline">
              Procurar arquivos
            </span>
          </div>
        </div>

        {/* Lista de anexos existentes */}
        {existingFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-gray-800 dark:text-white/90">
              Anexos existentes:
            </h4>
            <ul className="space-y-2">
              {existingFiles.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between rounded-lg border border-blue-300 bg-blue-50 p-2 dark:border-blue-700 dark:bg-blue-900/20"
                >
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {file.name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => downloadExistingFile(file)}
                      className="text-blue-500 hover:text-blue-600"
                      title="Baixar anexo"
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExistingFile(file.id)}
                      className="text-red-500 hover:text-red-600"
                      title="Remover anexo"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lista de arquivos novos */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-gray-800 dark:text-white/90">
              Novos arquivos:
            </h4>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-300 p-2 dark:border-gray-700"
                >
                  <div className="flex items-center">
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-400">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ComponentCard>
  );
};

export default DropzoneComponent;
