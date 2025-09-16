import { useChamado } from '@/hooks/useChamado';
import { usePessoa } from '@/hooks/usePessoa';
import { Chamado } from '@/types/chamado.type';
import { Pessoa } from '@/types/pessoa.type';
import { useEffect, useState } from 'react';

const SearchInput = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filteredChamados, setFilteredChamados] = useState<Chamado[]>([]);
  const [filteredPessoas, setFilteredPessoas] = useState<Pessoa[]>([]);
  const { chamados } = useChamado();
  const { pessoas } = usePessoa();

  useEffect(() => {
    handleSearch();
  }, [search]);

  const handleSearch = () => {
    if (search === '') {
      return;
    }
    if (chamados) {
      setFilteredChamados(
        chamados.filter((chamado: Chamado) =>
          JSON.stringify(chamado).toLowerCase().includes(search.toLowerCase())
        )
      );
      console.log(filteredChamados);
    }
    if (pessoas) {
      setFilteredPessoas(
        pessoas.filter(
          (pessoa: Pessoa) =>
            pessoa.nome.toLowerCase().includes(search.toLowerCase()) ||
            pessoa.nomeSocial?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  };
  return (
    <>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pr-14 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[430px] dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
      />
      {filteredChamados.length > 0 && (
        <div className="shadow-theme-xs absolute top-14 z-10 w-full rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 dark:text-white/90">
          {filteredChamados.map((chamado) => (
            <div
              key={chamado.id}
              className="flex cursor-pointer items-center gap-2 border-b border-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:border-gray-800 dark:text-white/90 dark:hover:bg-gray-800"
            >
              <span className="font-semibold">{chamado.titulo}</span>
            </div>
          ))}
        </div>
      )}
      {filteredPessoas.length > 0 && (
        <div className="shadow-theme-xs absolute top-14 z-10 w-full rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 dark:text-white/90">
          {filteredPessoas.map((pessoa) => (
            <div
              key={pessoa.id}
              className="flex cursor-pointer items-center gap-2 border-b border-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:border-gray-800 dark:text-white/90 dark:hover:bg-gray-800"
            >
              <span className="font-semibold">{pessoa.nome}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SearchInput;
