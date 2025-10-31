import type { ApiError } from '@/types';

const ERROR_MESSAGES = {
  OFFLINE: 'Você está offline. Verifique sua conexão com a internet.',
  REQUEST_FAILED:
    'A requisição falhou. Verifique sua conexão ou tente novamente.',
  ARTIST_NOT_FOUND: 'Artista não encontrado.',
  SESSION_EXPIRED: 'Sessão expirada. Faça login novamente.',
  GENERIC_ARTIST_ERROR: 'Erro ao carregar dados do artista.',
  GENERIC_ERROR: 'Ocorreu um erro inesperado.',
};

export const toApiError = (
  error: Error | null | undefined
): ApiError | undefined => {
  if (!error) return undefined;
  if ('status' in error && typeof (error as ApiError).status === 'number') {
    return error as ApiError;
  }
  return {
    message: error.message || ERROR_MESSAGES.GENERIC_ERROR,
    status: 500, // Default status for generic errors
    code: 'GENERIC_ERROR',
  };
};

export const getArtistErrorMessage = (
  isOnline: boolean,
  artistErrorData: ApiError | undefined,
  albumsErrorData: ApiError | undefined
): string => {
  if (!isOnline) {
    return ERROR_MESSAGES.OFFLINE;
  }

  const errorData = artistErrorData || albumsErrorData;

  if (errorData?.message?.includes('Failed to fetch')) {
    return ERROR_MESSAGES.REQUEST_FAILED;
  }
  if (errorData?.status === 404) {
    return ERROR_MESSAGES.ARTIST_NOT_FOUND;
  }
  if (errorData?.status === 401) {
    return ERROR_MESSAGES.SESSION_EXPIRED;
  }
  return errorData?.message || ERROR_MESSAGES.GENERIC_ARTIST_ERROR;
};
