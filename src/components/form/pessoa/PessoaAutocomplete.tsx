'use client';

import useDebounce from '@/hooks/useDebounce';
import { useAppSelector } from '@/hooks/useRedux';
import { PessoaService } from '@/service/pessoa.service';
import { selectPessoasTiposFormatados } from '@/store/slices/pessoaTipoSlice';
import { StatusGenero } from '@/types/enum';
import { Pessoa } from '@/types/pessoa.type';
import { useEffect, useState } from 'react';
import Label from '../Label';
import Select from '../Select';
import Input from '../input/InputField';

interface PessoaAutocompleteProps {
  onSelect: (pessoa: Pessoa | null) => void;
  empresaId?: string;
  disabled?: boolean;
  resetSelection?: boolean; // Nova prop
  onResetComplete?: () => void;
}

export default function PessoaAutocomplete({
  onSelect,
  empresaId,
  disabled = false,
  resetSelection = false,
  onResetComplete,
}: PessoaAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Pessoa[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado do formulário de criação
  const [newPessoa, setNewPessoa] = useState<Partial<Pessoa>>({
    nome: '',
    genero: StatusGenero.IGNORADO,
    tipoId: undefined,
    empresaId: undefined,
  });

  // Novo: estado da pessoa selecionada
  const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | null>(null);

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

  // Buscar pessoas quando o termo de pesquisa mudar
  useEffect(() => {
    if (selectedPessoa) return; // 🚀 Evita buscar novamente se já está selecionado

    const searchPessoas = async () => {
      if (debouncedSearch.trim().length < 3) {
        setResults([]);
        return;
      }

      if (!empresaId) {
        setError('Selecione uma serventia antes de buscar pessoas');
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await PessoaService.getPessoas(empresaId);
        const filtered = response.filter((pessoa) =>
          (
            pessoa.pessoaFisica?.nome_social ||
            pessoa.pessoaFisica?.nome_registro
          )
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
        );
        setResults(filtered);
        setShowResults(true);
      } catch (err) {
        setError('Erro ao buscar pessoas');
        console.error('Erro ao buscar pessoas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    searchPessoas();
  }, [debouncedSearch, empresaId, selectedPessoa]);

  const handleSelect = (pessoa: Pessoa) => {
    setSelectedPessoa(pessoa); // 🚀 Marca a pessoa escolhida
    setSearchTerm(pessoa.nome);
    setShowResults(false);
    onSelect(pessoa);
  };

  const handleClearSelection = () => {
    setSelectedPessoa(null); // 🚀 Permite escolher novamente
    setSearchTerm('');
    onSelect(null);
  };

  const handleCreatePessoa = async () => {
    if (!newPessoa.nome || !newPessoa.tipoId || !empresaId) {
      setError('Nome, função e serventia são obrigatórios');
      return;
    }

    newPessoa.empresaId = parseInt(empresaId);

    setIsLoading(true);
    setError(null);

    try {
      const createdPessoa = await PessoaService.createPessoa(
        newPessoa as Pessoa
      );
      handleSelect(createdPessoa);
      setShowCreateForm(false);
      setNewPessoa({
        nome: '',
        genero: StatusGenero.IGNORADO,
        tipoId: undefined,
      });
    } catch (err) {
      setError('Erro ao criar pessoa');
      console.error('Erro ao criar pessoa:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative dark:text-white">
      <Label>Pessoa *</Label>
      <Input
        type="text"
        placeholder="Pesquisar pessoa por nome..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setSelectedPessoa(null); // 🚀 Se o usuário alterar o campo, limpa seleção
        }}
        disabled={disabled}
      />

      {/* Mostrar info da pessoa selecionada */}
      {selectedPessoa && (
        <div className="mt-2 flex items-center justify-between rounded bg-gray-100 p-2 text-sm dark:bg-gray-700">
          <span>
            {selectedPessoa.pessoaFisica?.nome_social ||
              selectedPessoa.pessoaFisica?.nome_registro}
          </span>
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
                {results.map((pessoa) => (
                  <li
                    key={pessoa.id}
                    className="cursor-pointer rounded-md px-4 py-2 hover:bg-gray-500"
                    onClick={() => handleSelect(pessoa)}
                  >
                    {pessoa.pessoaFisica?.nome_social ||
                      pessoa.pessoaFisica?.nome_registro}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 dark:text-gray-700">
                <p className="mb-2 text-gray-500">Nenhuma pessoa encontrada</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(true);
                    setShowResults(false);
                    setNewPessoa({ ...newPessoa, nome: searchTerm });
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Criar nova pessoa
                </button>
              </div>
            )}
          </div>
        )}

      {/* Formulário de criação */}
      {showCreateForm && (
        <div className="mt-4 space-y-4 rounded-md bg-gray-50 p-4 dark:bg-gray-800">
          <h3 className="font-medium">Nova Pessoa</h3>
          <div>
            <Label>Nome *</Label>
            <Input
              type="text"
              value={newPessoa.nome}
              onChange={(e) =>
                setNewPessoa({ ...newPessoa, nome: e.target.value })
              }
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Função *</Label>
            <Select
              options={pessoaTipos}
              value={newPessoa.tipoId?.toString()}
              onChange={(value: any) =>
                setNewPessoa({ ...newPessoa, tipoId: value })
              }
              placeholder="Selecione a função"
            />
          </div>
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
