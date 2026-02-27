'use client';

import { Chamado } from '@/types/chamado.type';
import React, { useState } from 'react';
import TextArea from '../form/input/TextArea';
import Label from '../form/Label';
import { Modal } from '../ui/modal';

interface DeleteChamadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => Promise<void>;
  chamado: Chamado | null;
}

const DeleteChamadoModal: React.FC<DeleteChamadoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  chamado,
}) => {
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!chamado) return null;

  const handleConfirm = async () => {
    if (!motivo.trim()) {
      setError('Por favor, informe o motivo da exclusão.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onConfirm(motivo);
      // Reseta o formulário se a confirmação for bem-sucedida
      setMotivo('');
      onClose();
    } catch (err) {
      setError('Erro ao excluir o chamado. Tente novamente.');
      console.error('Erro ao excluir:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMotivo('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="min-h-[24rem] w-full max-w-2xl rounded-2xl"
      showCloseButton={true}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Excluir Chamado
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Tem certeza que deseja excluir o chamado{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              "{chamado.titulo}"
            </span>
            ? Esta ação não pode ser desfeita.
          </p>
        </div>

        {/* Form */}
        <div className="mb-6">
          <Label>Motivo da Exclusão</Label>
          <TextArea
            placeholder="Digite o motivo da exclusão..."
            value={motivo}
            onChange={setMotivo}
            rows={4}
            error={!!error}
            disabled={loading}
          />
          {error && (
            <p className="text-error-500 dark:text-error-400 mt-2 text-sm">
              {error}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-error-500 hover:bg-error-600 dark:bg-error-600 dark:hover:bg-error-700 flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteChamadoModal;
