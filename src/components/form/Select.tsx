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
}

const CustomSelect: React.FC<SelectProps> = ({
  options,
  placeholder = 'Select an option',
  onChange,
  className = '',
  value = '',
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const handleSelect = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <div className={`relative w-full ${className}`} ref={ref}>
      {/* Botão principal */}
      <button
        type="button"
        className={`h-11 w-full rounded-lg border border-gray-300 bg-white px-4 pr-10 text-left text-sm shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 ${
          selectedValue ? 'text-gray-800 dark:text-white/90' : 'text-gray-400'
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedOption ? selectedOption.label : placeholder}

        {/* Ícone seta */}
        <svg
          className={`pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-500 transition-transform ${
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
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value.toString())}
              className={`cursor-pointer px-4 py-2 text-sm hover:bg-blue-100 dark:hover:bg-gray-700 ${
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
