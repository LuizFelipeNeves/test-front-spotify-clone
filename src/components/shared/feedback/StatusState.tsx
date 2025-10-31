import React from 'react';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import type { StatusType } from '@/constants/ui';

interface StatusStateProps {
  type: StatusType;
  message?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
}

const ICON_SIZES = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export const StatusState: React.FC<StatusStateProps> = ({
  type,
  message,
  description,
  onRetry,
  className = '',
  iconSize = 'md',
}) => {
  const renderIcon = () => {
    const iconClass = `${ICON_SIZES[iconSize]}`;

    switch (type) {
      case 'loading':
        return <Loader2 className={`${iconClass} animate-spin text-white`} />;
      case 'error':
        return <AlertCircle className={`${iconClass} text-red-500`} />;
      case 'empty':
        return <AlertCircle className={`${iconClass} text-gray-400`} />;
      default:
        return null;
    }
  };

  const getDefaultMessages = () => {
    switch (type) {
      case 'loading':
        return {
          message: 'Carregando...',
          description: 'Conteúdo sendo carregado, aguarde...',
        };
      case 'error':
        return {
          message: 'Ops! Algo deu errado',
          description: 'Ocorreu um erro ao carregar o conteúdo. Tente novamente.',
        };
      case 'empty':
        return {
          message: 'Nenhum item encontrado',
          description: 'Não há itens para exibir no momento.',
        };
      default:
        return { message: '', description: '' };
    }
  };

  const defaultMessages = getDefaultMessages();
  const showMessage = message && message.trim() !== '' ? message : (message === '' ? null : defaultMessages.message);
  const showDescription = description && description.trim() !== '' ? description : (description === '' ? null : defaultMessages.description);

  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      <div className="mb-4">
        {renderIcon()}
      </div>

      {showMessage && (
        <h3 className="text-white text-lg font-medium mb-2">
          {showMessage}
        </h3>
      )}

      {showDescription && (
        <p className="text-gray-400 text-sm mb-4 max-w-md">
          {showDescription}
        </p>
      )}

      {type === 'error' && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Tentar novamente</span>
        </button>
      )}
    </div>
  );
};

// Especializações para facilitar o uso
export const EmptyState: React.FC<Omit<StatusStateProps, 'type'>> = (props) => (
  <StatusState type="empty" {...props} />
);

export const ErrorState: React.FC<Omit<StatusStateProps, 'type'>> = (props) => (
  <StatusState type="error" {...props} />
);

export const LoadingState: React.FC<Omit<StatusStateProps, 'type'>> = (props) => (
  <StatusState type="loading" {...props} />
);