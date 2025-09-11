'use client';

import useDebounce from '@/hooks/useDebounce';
import { useAppSelector } from '@/hooks/useRedux';

import { EmpresaService } from '@/service/empresa.service';
import { selectTiposFormatados } from '@/store/slices/empresaTipoSlice';
import { Empresa } from '@/types/empresa.type';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Label from '../Label';
import Input from '../input/InputField';

interface EmpresaAutocompleteProps {
  onSelect: (empresa: Empresa | null) => void;
  empresa_nome?: string;
  disabled?: boolean;
  resetSelection?: boolean; // Nova prop
  onResetComplete?: () => void;
}

export default function EmpresaAutocomplete({
  onSelect,
  empresa_nome,
  disabled = false,
  resetSelection = false,
  onResetComplete,
}: EmpresaAutocompleteProps) {
  const router = useRouter();
  const { empresas } = useAppSelector((state) => state.empresa);

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Empresa[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado do formulário de criação
  const [newEmpresa, setNewEmpresa] = useState<Partial<Empresa>>({
    nomeFantasia: '',
    cnpj: '',
    tipoId: undefined,
  });

  // Novo: estado da empresa selecionada
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

  const empresaTipos = useAppSelector(selectTiposFormatados);
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Effect para resetar a seleção quando resetSelection mudar
  useEffect(() => {
    if (resetSelection) {
      setSelectedEmpresa(null);
      setSearchTerm('');
      onSelect(null);
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [resetSelection, onSelect, onResetComplete]);

  // Buscar empresas quando o termo de pesquisa mudar
  useEffect(() => {
    if (selectedEmpresa) return; // 🚀 Evita buscar novamente se já está selecionado

    const searchEmpresas = async () => {
      if (debouncedSearch.trim().length < 3) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response =
          empresas?.length > 0 ? empresas : await EmpresaService.getEmpresas();
        const filtered = response.filter((empresa) =>
          empresa.nomeFantasia
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
        );
        setResults(filtered);
        setShowResults(true);
      } catch (err) {
        setError('Erro ao buscar empresas');
        console.error('Erro ao buscar empresas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    searchEmpresas();
  }, [debouncedSearch, selectedEmpresa]);

  // Marca a empresa escolhida
  const handleSelect = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setSearchTerm(empresa.nomeFantasia);
    setShowResults(false);
    onSelect(empresa);
  };

  // Permite escolher novamente
  const handleClearSelection = () => {
    setSelectedEmpresa(null);
    setSearchTerm('');
    onSelect(null);
  };

  const handleCreateEmpresa = async () => {
    if (!newEmpresa.nomeFantasia || !newEmpresa.tipoId) {
      setError('Nome, função e serventia são obrigatórios');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const createdEmpresa = await EmpresaService.createEmpresa(
        newEmpresa as Empresa
      );
      handleSelect(createdEmpresa);
      setShowCreateForm(false);
      setNewEmpresa({
        nomeFantasia: '',
        cnpj: '',
        tipoId: undefined,
      });
    } catch (err) {
      setError('Erro ao criar empresa');
      console.error('Erro ao criar empresa:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative dark:text-white">
      <Label>Cliente *</Label>
      <Input
        type="text"
        placeholder="Pesquisar Cliente por nome..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setSelectedEmpresa(null); // 🚀 Se o usuário alterar o campo, limpa seleção
        }}
        disabled={disabled}
      />

      {/* Mostrar info da empresa selecionada */}
      {selectedEmpresa && (
        <div className="mt-2 flex items-center justify-between rounded bg-gray-100 p-2 text-sm dark:bg-gray-700">
          <span>{selectedEmpresa.nomeFantasia}</span>
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
      {!selectedEmpresa &&
        showResults &&
        searchTerm.length >= 3 &&
        !showCreateForm && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Carregando...</div>
            ) : results.length > 0 ? (
              <ul className="max-h-48 overflow-auto">
                {results.map((empresa) => (
                  <li
                    key={empresa.id}
                    className="cursor-pointer rounded-md px-4 py-2 hover:bg-gray-500"
                    onClick={() => handleSelect(empresa)}
                  >
                    {empresa.nomeFantasia}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 dark:text-gray-700">
                <p className="mb-2 text-gray-500">Nenhum cliente encontrado</p>
                <button
                  type="button"
                  onClick={() => {
                    router.push('/gerenciar-empresas');
                    // setShowCreateForm(true);
                    // setShowResults(false);
                    // setNewEmpresa({ ...newEmpresa, nomeFantasia: searchTerm });
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Criar novo cliente
                </button>
              </div>
            )}
          </div>
        )}

      {/* Formulário de criação */}
      {showCreateForm && (
        <div className="mt-4 space-y-4 rounded-md bg-gray-50 p-4 dark:bg-gray-800">
          <h3 className="font-medium">Nova Empresa</h3>
          <div>
            <Label>Nome *</Label>
            <Input
              type="text"
              value={newEmpresa.nomeFantasia}
              onChange={(e) =>
                setNewEmpresa({ ...newEmpresa, nomeFantasia: e.target.value })
              }
              disabled={isLoading}
            />
          </div>
          <div>
            {/* <Label>Função *</Label>
            <Select
              options={empresaTipos}
              value={newEmpresa.tipoId?.toString()}
              onChange={(value: any) =>
                setNewEmpresa({ ...newEmpresa, tipoId: value })
              }
              placeholder="Selecione a função"
            /> */}
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
              onClick={handleCreateEmpresa}
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
