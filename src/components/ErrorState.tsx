import type { ReactNode } from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({ 
  title = 'Ops! Algo deu errado', 
  message, 
  action, 
  className = '' 
}: ErrorStateProps) {
  return (
    <div 
      className={`flex flex-col items-center justify-center text-center py-12 px-4 sm:px-8 ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="mb-4 text-red-500" aria-hidden="true">
        <svg 
          className="w-12 h-12 sm:w-16 sm:h-16" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-2 sm:mb-3">
        {title}
      </h2>
      
      <p className="text-sm sm:text-base text-gray-400 mb-6 max-w-md leading-relaxed">
        {message}
      </p>
      
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}