'use client';

import useDebounce from '@/hooks/useDebounce';
import { useAppSelector } from '@/hooks/useRedux';

import { selectPessoasTiposFormatados } from '@/store/slices/pessoaTipoSlice';

import { PessoaTipoService } from '@/service/pessoaTipo.service';
import { PessoaTipo } from '@/types/pessoaTipo.type';
import { useEffect, useState } from 'react';
import Label from '../Label';
import Input from '../input/InputField';

interface PessoaTipoAutocompleteProps {
  onSelect: (pessoaTipo: PessoaTipo | null) => void;
  empresaId?: string;
  disabled?: boolean;
  resetSelection?: boolean; // Nova prop
  onResetComplete?: () => void;
}

export default function PessoaTipoAutocomplete({
  onSelect,
  empresaId,
  disabled = false,
  resetSelection = false,
  onResetComplete,
}: PessoaTipoAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<PessoaTipo[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado do formulário de criação
  const [newPessoa, setNewPessoa] = useState<Partial<PessoaTipo>>({
    descricao: '',
    empresaId: undefined,
  });

  // Novo: estado da pessoaTipo selecionada
  const [selectedPessoa, setSelectedPessoa] = useState<PessoaTipo | null>(null);

  const pessoaTipos = useAppSelector(selectPessoasTiposFormatados);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (resetSelection) {
      setSelectedPessoa(null);
      setSearchTerm('');
      onSelect(null);
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [resetSelection, onSelect, onResetComplete]);

  // Buscar pessoasTipos quando o termo de pesquisa mudar
  useEffect(() => {
    if (selectedPessoa) return; // 🚀 Evita buscar novamente se já está selecionado

    const searchPessoas = async () => {
      if (debouncedSearch.trim().length < 3) {
        setResults([]);
        return;
      }

      if (!empresaId) {
        setError('Selecione uma serventia antes de buscar pessoasTipos');
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await PessoaTipoService.getPessoasTiposPorEmpresa(
          Number(empresaId)
        );
        const filtered = response.filter((pessoaTipo) =>
          pessoaTipo.descricao
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
        );
        setResults(filtered);
        setShowResults(true);
      } catch (err) {
        setError('Erro ao buscar pessoasTipos');
        console.error('Erro ao buscar pessoasTipos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    searchPessoas();
  }, [debouncedSearch, empresaId, selectedPessoa]);

  const handleSelect = (pessoaTipo: PessoaTipo) => {
    setSelectedPessoa(pessoaTipo); // 🚀 Marca a pessoaTipo escolhida
    setSearchTerm(pessoaTipo.descricao);
    setShowResults(false);
    onSelect(pessoaTipo);
  };

  const handleClearSelection = () => {
    setSelectedPessoa(null); // 🚀 Permite escolher novamente
    setSearchTerm('');
    onSelect(null);
  };

  const handleCreatePessoa = async () => {
    if (!newPessoa.descricao || !empresaId) {
      setError('Nome, função e serventia são obrigatórios');
      return;
    }

    newPessoa.empresaId = parseInt(empresaId);

    setIsLoading(true);
    setError(null);

    try {
      const createdPessoa = await PessoaTipoService.createPessoaTipo(
        newPessoa as PessoaTipo
      );
      handleSelect(createdPessoa);
      setShowCreateForm(false);
      setNewPessoa({
        descricao: '',
      });
    } catch (err) {
      setError('Erro ao criar pessoaTipo');
      console.error('Erro ao criar pessoaTipo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative dark:text-white">
      {/* Input de pesquisa */}
      <Input
        type="text"
        placeholder="Pesquisar pessoaTipo por descricao..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setSelectedPessoa(null); // 🚀 Se o usuário alterar o campo, limpa seleção
        }}
        disabled={disabled}
      />

      {/* Mostrar info da pessoaTipo selecionada */}
      {selectedPessoa && (
        <div className="mt-2 flex items-center justify-between rounded bg-gray-100 p-2 text-sm dark:bg-gray-700">
          <span>{selectedPessoa.descricao}</span>
          <button
            type="button"
            onClick={handleClearSelection}
            className="ml-2 text-xs text-red-500 hover:underline"
          >
            Trocar
          </button>
        </div>
      )}

      {/* Lista de resultados */}
      {!selectedPessoa &&
        showResults &&
        searchTerm.length >= 3 &&
        !showCreateForm && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Carregando...</div>
            ) : results.length > 0 ? (
              <ul className="max-h-48 overflow-auto">
                {results.map((pessoaTipo) => (
                  <li
                    key={pessoaTipo.id}
                    className="cursor-pointer rounded-md px-4 py-2 hover:bg-gray-500"
                    onClick={() => handleSelect(pessoaTipo)}
                  >
                    {pessoaTipo.descricao}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 dark:text-gray-700">
                <p className="mb-2 text-gray-500">
                  Nenhuma pessoaTipo encontrada
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(true);
                    setShowResults(false);
                    setNewPessoa({ ...newPessoa, descricao: searchTerm });
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Criar nova pessoaTipo
                </button>
              </div>
            )}
          </div>
        )}

      {/* Formulário de criação */}
      {showCreateForm && (
        <div className="mt-4 space-y-4 rounded-md bg-gray-50 p-4 dark:bg-gray-800">
          <h3 className="font-medium">Nova PessoaTipo</h3>
          <div>
            <Label>Nome *</Label>
            <Input
              type="text"
              value={newPessoa.descricao}
              onChange={(e) =>
                setNewPessoa({ ...newPessoa, descricao: e.target.value })
              }
              disabled={isLoading}
            />
          </div>
          {/* <div>
            <Label>Função *</Label>
            <Select
              options={pessoaTipos}
              value={newPessoa.tipoId?.toString()}
              onChange={(value: any) =>
                setNewPessoa({ ...newPessoa, tipoId: value })
              }
              placeholder="Selecione a função"
            />
          </div> */}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setError(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleCreatePessoa}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
