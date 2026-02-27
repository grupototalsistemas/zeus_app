import React from 'react';

type BadgeVariant = 'light' | 'solid';
type BadgeSize = 'sm' | 'md';
type BadgeColor =
  | 'primary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | string; // Aceita cores hexadecimais também

interface BadgeProps {
  variant?: BadgeVariant; // Light or solid variant
  size?: BadgeSize; // Badge size
  color?: BadgeColor; // Badge color (pode ser nome padrão ou hexadecimal)
  startIcon?: React.ReactNode; // Icon at the start
  endIcon?: React.ReactNode; // Icon at the end
  children: React.ReactNode; // Badge content
}

// Função auxiliar para verificar se é uma cor hexadecimal
const isHexColor = (color: string): boolean => {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
};

// Função para calcular luminosidade e definir se o texto deve ser claro ou escuro
const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'light',
  color = 'primary',
  size = 'md',
  startIcon,
  endIcon,
  children,
}) => {
  const baseStyles =
    'inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium';

  // Define size styles
  const sizeStyles = {
    sm: 'text-theme-xs', // Smaller padding and font size
    md: 'text-sm', // Default padding and font size
  };

  // Define color styles for variants
  const variants = {
    light: {
      primary:
        'bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400',
      success:
        'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
      error:
        'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500',
      warning:
        'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400',
      info: 'bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500',
      light: 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80',
      dark: 'bg-gray-500 text-white dark:bg-white/5 dark:text-white',
    },
    solid: {
      primary: 'bg-brand-500 text-white dark:text-white',
      success: 'bg-success-500 text-white dark:text-white',
      error: 'bg-error-500 text-white dark:text-white',
      warning: 'bg-warning-500 text-white dark:text-white',
      info: 'bg-blue-light-500 text-white dark:text-white',
      light: 'bg-gray-400 dark:bg-white/5 text-white dark:text-white/80',
      dark: 'bg-gray-700 text-white dark:text-white',
    },
  };

  // Get styles based on size and color variant
  const sizeClass = sizeStyles[size];

  // Verificar se é uma cor hexadecimal
  const isCustomColor = isHexColor(color);

  // Se for hexadecimal, aplicar estilos inline
  if (isCustomColor) {
    const textColor = getContrastColor(color);
    const bgColor = variant === 'light' ? `${color}20` : color; // 20 = ~12% de opacidade para variant light

    const customStyle = {
      backgroundColor: bgColor,
      color: variant === 'light' ? color : textColor,
    };

    return (
      <span className={`${baseStyles} ${sizeClass}`} style={customStyle}>
        {startIcon && <span className="mr-1">{startIcon}</span>}
        {children}
        {endIcon && <span className="ml-1">{endIcon}</span>}
      </span>
    );
  }

  // Caso contrário, usar as classes Tailwind pré-definidas
  const colorStyles =
    variants[variant][color as keyof typeof variants.light] ||
    variants[variant].primary;

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorStyles}`}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
