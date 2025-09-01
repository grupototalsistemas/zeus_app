import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/button';
import { PessoaService } from '@/service/pessoa.service';
import { StatusGenero, StatusRegistro } from '@/types/enum';
import { Pessoa } from '@/types/pessoa.type';
import { useEffect, useState } from 'react';

interface PessoaAutocompleteProps {
  onSelect: (pessoa: Pessoa | null) => void;
  disabled?: boolean;
}

export function PessoaAutocomplete({
  onSelect,
  disabled,
}: PessoaAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [filteredPessoas, setFilteredPessoas] = useState<Pessoa[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isCreatingPessoa, setIsCreatingPessoa] = useState(false);
  const [novaPessoa, setNovaPessoa] = useState<{
    nome: string;
    tipoId: number | null;
    genero: StatusGenero;
  }>({
    nome: '',
    tipoId: null,
    genero: StatusGenero.IGNORADO,
  });

  // Busca inicial de pessoas
  useEffect(() => {
    const fetchPessoas = async () => {
      try {
        const response = await PessoaService.getPessoas();
        setPessoas(response);
      } catch (error) {
        console.error('Erro ao buscar pessoas:', error);
      }
    };
    fetchPessoas();
  }, []);

  // Filtra pessoas baseado no termo de busca
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = pessoas.filter(
        (pessoa) =>
          pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pessoa.nomeSocial?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPessoas(filtered);
      setShowResults(true);
    } else {
      setFilteredPessoas([]);
      setShowResults(false);
    }
  }, [searchTerm, pessoas]);

  const handleSelectPessoa = (pessoa: Pessoa) => {
    setSearchTerm(pessoa.nomeSocial || pessoa.nome);
    onSelect(pessoa);
    setShowResults(false);
  };

  const handleCreatePessoa = async () => {
    if (!novaPessoa.tipoId) {
      alert('Por favor, selecione uma função');
      return;
    }

    try {
      const novaPessoaData: Pessoa = {
        nome: searchTerm,
        tipoId: novaPessoa.tipoId,
        genero: novaPessoa.genero,
        ativo: StatusRegistro.ATIVO,
      };

      const pessoaCriada = await PessoaService.createPessoa(novaPessoaData);
      setPessoas((prev) => [...prev, pessoaCriada]);
      handleSelectPessoa(pessoaCriada);
      setIsCreatingPessoa(false);
    } catch (error) {
      console.error('Erro ao criar pessoa:', error);
      alert('Erro ao criar pessoa. Por favor, tente novamente.');
    }
  };

  return (
    <div className="space-y-2">
      <Label>Identificação</Label>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite o nome da pessoa"
          className="w-full rounded-md border border-gray-300 p-2"
          disabled={disabled}
        />

        {showResults && filteredPessoas.length > 0 && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
            {filteredPessoas.map((pessoa) => (
              <div
                key={pessoa.id}
                onClick={() => handleSelectPessoa(pessoa)}
                className="cursor-pointer p-2 hover:bg-gray-100"
              >
                <div>{pessoa.nomeSocial || pessoa.nome}</div>
                {pessoa.nomeSocial && (
                  <div className="text-sm text-gray-500">{pessoa.nome}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {showResults && filteredPessoas.length === 0 && !isCreatingPessoa && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white p-4 shadow-lg">
            <p className="mb-2 text-gray-600">Nenhuma pessoa encontrada</p>
            <Button
              variant="secondary"
              onClick={() => setIsCreatingPessoa(true)}
            >
              Criar Nova Pessoa
            </Button>
          </div>
        )}

        {isCreatingPessoa && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white p-4 shadow-lg">
            <h3 className="mb-4 font-medium">Criar Nova Pessoa</h3>

            <div className="space-y-4">
              <div>
                <Label>Função</Label>
                <select
                  value={novaPessoa.tipoId || ''}
                  onChange={(e) =>
                    setNovaPessoa((prev) => ({
                      ...prev,
                      tipoId: parseInt(e.target.value),
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Selecione uma função</option>
                  {/* TODO: Adicionar opções de função */}
                </select>
              </div>

              <div>
                <Label>Gênero</Label>
                <select
                  value={novaPessoa.genero}
                  onChange={(e) =>
                    setNovaPessoa((prev) => ({
                      ...prev,
                      genero: e.target.value as StatusGenero,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  {Object.values(StatusGenero).map((genero) => (
                    <option key={genero} value={genero}>
                      {genero}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingPessoa(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreatePessoa}>Criar Pessoa</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
