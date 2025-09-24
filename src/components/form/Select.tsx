import React, { useEffect, useRef, useState } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  value?: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<SelectProps> = ({
  options,
  placeholder = 'Select an option',
  onChange,
  className = '',
  value = '',
  disabled = false,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false); // novo estado
  const ref = useRef<HTMLDivElement>(null);

  // Determine input styles based on state (disabled, success, error)
  // ajuste em inputClasses: aumente o padding-right
  let inputClasses = `h-full w-full rounded-lg flex flex-row items-center justify-between border appearance-none px-2 pr-9 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

  // Add styles for the different states
  if (disabled || options.length === 0) {
    inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = Math.min(options.length * 40, 240); // altura estimada (40px/item máx 240px)
      setOpenUp(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue);
    setIsOpen(false);
  };

  //caso seja desabilitado novamente limpa o select
  useEffect(() => {
    if (disabled) {
      setSelectedValue(''); // Limpa o select
    }
  }, [disabled]);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <div className={`relative w-full ${className}`} ref={ref}>
      {/* Botão principal */}
      <button
        type="button"
        className={inputClasses}
        onClick={handleToggle}
        disabled={disabled || options.length === 0}
      >
        {disabled ? (
          'Selecione uma empresa para continuar'
        ) : options.length === 0 ? (
          'Não ha sistemas cadastrados pra esta empresa'
        ) : (
          <>{selectedOption ? selectedOption.label : placeholder}</>
        )}

        {/* Ícone seta */}
        <svg
          className={`ml-2 h-5 w-5 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul
          className={`absolute z-50 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 ${
            openUp ? 'bottom-full mb-1' : 'mt-1'
          }`}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value.toString())}
              className={`cursor-pointer px-4 py-2 text-sm hover:bg-blue-100 dark:text-white dark:hover:bg-gray-700 ${
                option.value === selectedValue
                  ? 'bg-blue-50 font-medium dark:bg-gray-700'
                  : ''
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
