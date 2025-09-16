import { useChamado } from '@/hooks/useChamado';
import { usePessoa } from '@/hooks/usePessoa';
import { Chamado } from '@/types/chamado.type';
import { Pessoa } from '@/types/pessoa.type';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface SearchInputProps {
  onChamadoSelect?: (chamado: Chamado) => void;
  onPessoaSelect?: (pessoa: Pessoa) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  minSearchLength?: number;
}

const SearchInput = ({
  onChamadoSelect,
  onPessoaSelect,
  placeholder = 'Procurar por chamado ou pessoa',
  className = '',
  debounceMs = 300,
  minSearchLength = 2,
}: SearchInputProps) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { chamados } = useChamado();
  const { pessoas } = usePessoa();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        setIsLoading(false);
      }, debounceMs);
    },
    [debounceMs]
  );

  // Memoized filtered results
  const { filteredChamados, filteredPessoas } = useMemo(() => {
    if (search.length < minSearchLength) {
      return { filteredChamados: [], filteredPessoas: [] };
    }

    const searchLower = search.toLowerCase().trim();

    const chamadosFiltered =
      chamados?.filter((chamado: Chamado) => {
        // Busca mais específica ao invés de JSON.stringify
        JSON.stringify(chamado).toLowerCase().includes(searchLower);
      }) || [];

    const pessoasFiltered =
      pessoas?.filter((pessoa: Pessoa) => {
        JSON.stringify(pessoa).toLowerCase().includes(searchLower);
      }) || [];

    return {
      filteredChamados: chamadosFiltered.slice(0, 10), // Limita resultados
      filteredPessoas: pessoasFiltered.slice(0, 10),
    };
  }, [search, chamados, pessoas, minSearchLength]);

  // All results combined for keyboard navigation
  const allResults = useMemo(
    () => [
      ...filteredChamados.map((item) => ({
        type: 'chamado' as const,
        data: item,
      })),
      ...filteredPessoas.map((item) => ({
        type: 'pessoa' as const,
        data: item,
      })),
    ],
    [filteredChamados, filteredPessoas]
  );

  const hasResults = filteredChamados.length > 0 || filteredPessoas.length > 0;

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setActiveIndex(-1);

    if (value.length >= minSearchLength) {
      setIsLoading(true);
      setIsOpen(true);
      debouncedSearch(value);
    } else {
      setIsOpen(false);
      setIsLoading(false);
    }
  };

  // Handle item selection
  const handleItemSelect = useCallback(
    (item: Chamado | Pessoa, type: 'chamado' | 'pessoa') => {
      if (type === 'chamado') {
        onChamadoSelect?.(item as Chamado);
      } else {
        onPessoaSelect?.(item as Pessoa);
      }
      setSearch('');
      setIsOpen(false);
      setActiveIndex(-1);
    },
    [onChamadoSelect, onPessoaSelect]
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || allResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < allResults.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : allResults.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && allResults[activeIndex]) {
          const result = allResults[activeIndex];
          handleItemSelect(result.data, result.type);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const inputClasses = `
    dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 
    dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-200 
    bg-transparent py-2.5 pr-14 pl-12 text-sm text-gray-800 
    placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[430px] 
    dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 
    dark:placeholder:text-white/30 ${className}
  `.trim();

  const dropdownClasses = `
    shadow-theme-xs absolute top-14 z-50 w-full max-h-96 overflow-y-auto
    rounded-lg border border-gray-200 bg-white 
    dark:border-gray-800 dark:bg-gray-900 dark:text-white/90
  `;

  const itemClasses = (isActive: boolean) => `
    flex cursor-pointer items-center gap-2 border-b border-gray-200 
    px-4 py-3 text-sm text-gray-800 
    ${
      isActive
        ? 'bg-brand-50 dark:bg-brand-900/20'
        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
    }
    dark:border-gray-800 dark:text-white/90 transition-colors
  `;

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={inputClasses}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Search chamados and pessoas"
      />

      {isLoading && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <div className="border-brand-300 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      )}

      {isOpen && (hasResults || search.length >= minSearchLength) && (
        <div className={dropdownClasses} role="listbox">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              Searching...
            </div>
          ) : !hasResults ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No results found
            </div>
          ) : (
            <>
              {/* Chamados Section */}
              {filteredChamados.length > 0 && (
                <>
                  <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                    CHAMADOS ({filteredChamados.length})
                  </div>
                  {filteredChamados.map((chamado, index) => {
                    const globalIndex = index;
                    return (
                      <div
                        key={`chamado-${chamado.id}`}
                        className={itemClasses(activeIndex === globalIndex)}
                        onClick={() => handleItemSelect(chamado, 'chamado')}
                        role="option"
                        aria-selected={activeIndex === globalIndex}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold">
                            {chamado.titulo}
                          </div>
                          {chamado.descricao && (
                            <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                              {chamado.descricao}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          #{chamado.id}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Pessoas Section */}
              {filteredPessoas.length > 0 && (
                <>
                  <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                    PESSOAS ({filteredPessoas.length})
                  </div>
                  {filteredPessoas.map((pessoa, index) => {
                    const globalIndex = filteredChamados.length + index;
                    return (
                      <div
                        key={`pessoa-${pessoa.id}`}
                        className={itemClasses(activeIndex === globalIndex)}
                        onClick={() => handleItemSelect(pessoa, 'pessoa')}
                        role="option"
                        aria-selected={activeIndex === globalIndex}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold">
                            {pessoa.nome}
                          </div>
                          {pessoa.nomeSocial && (
                            <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                              {pessoa.nomeSocial}
                            </div>
                          )}
                          {pessoa.nome && (
                            <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                              {pessoa.nome}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
