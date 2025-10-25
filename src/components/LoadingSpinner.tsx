interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  message = 'Carregando...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center py-8 px-4 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div 
        className={`${sizeClasses[size]} border-2 border-gray-600 border-t-green-500 rounded-full animate-spin mb-4`}
        aria-hidden="true"
      />
      
      <p className={`${textSizeClasses[size]} text-gray-400 text-center`}>
        {message}
      </p>
      
      <span className="sr-only">
        Conteúdo sendo carregado, aguarde...
      </span>
    </div>
  );
}