import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export interface ErrorHandlerProps {
  error: any;
  customMessages?: {
    offline?: string;
    connectionError?: string;
    notFound?: string;
    unauthorized?: string;
    default?: string;
  };
  showIcon?: boolean;
  className?: string;
}

export function ErrorHandler({
  error,
  customMessages,
  showIcon = true,
  className = ''
}: ErrorHandlerProps) {
  const isOnline = useOnlineStatus();

  const defaultMessages = {
    offline: 'Você está offline. Verifique sua conexão com a internet.',
    connectionError: 'Erro de conexão. Verifique sua internet e tente novamente.',
    notFound: 'Conteúdo não encontrado.',
    unauthorized: 'Sessão expirada. Faça login novamente.',
    default: 'Ocorreu um erro inesperado.'
  };

  const messages = { ...defaultMessages, ...customMessages };

  const getErrorContent = () => {
    // Offline
    if (!isOnline) {
      return {
        message: messages.offline,
        icon: WifiOff
      };
    }

    if (!error) {
      return {
        message: messages.default,
        icon: null
      };
    }

    const errorData = error as any;
    const errorMessage = errorData?.message || 'Erro desconhecido';

    // Connection error
    if (errorMessage.includes('Failed to fetch')) {
      return {
        message: messages.connectionError,
        icon: WifiOff
      };
    }

    // HTTP Status errors
    if (errorData?.status) {
      switch (errorData.status) {
        case 404:
          return {
            message: messages.notFound,
            icon: null
          };
        case 401:
          return {
            message: messages.unauthorized,
            icon: null
          };
        default:
          return {
            message: `${messages.default}: ${errorMessage}`,
            icon: null
          };
      }
    }

    // Default error
    return {
      message: `${messages.default}: ${errorMessage}`,
      icon: null
    };
  };

  const { message, icon: IconComponent } = getErrorContent();

  if (!showIcon && !IconComponent) {
    return <span className={className}>{message}</span>;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {IconComponent && showIcon && (
        <IconComponent className="w-5 h-5 flex-shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}