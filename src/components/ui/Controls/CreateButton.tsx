import React from 'react';

export interface CreateButtonProps {
  onClick: () => void;
  text: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
  ariaLabel?: string;
}

export function CreateButton({
  onClick,
  text,
  icon,
  variant = 'primary',
  size = 'md',
  className = '',
  title,
  ariaLabel,
}: CreateButtonProps) {
  const baseClasses =
    'font-semibold rounded-full transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';

  const variantClasses = {
    primary:
      'bg-green-500 text-black hover:bg-green-400 focus:bg-green-400 focus:ring-green-500',
    secondary:
      'bg-gray-700 text-white hover:bg-gray-600 focus:bg-gray-600 focus:ring-gray-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 sm:px-6 py-3 text-base',
    lg: 'px-4 sm:px-8 py-4 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const defaultIcon = (
    <svg
      className={iconSizes[size]}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  );

  const buttonIcon = icon || defaultIcon;

  return (
    <button
      onClick={onClick}
      data-testid="create-playlist-button"
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      title={title}
      aria-label={ariaLabel}
    >
      {buttonIcon}
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
}
