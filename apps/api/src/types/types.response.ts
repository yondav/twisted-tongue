export interface TwisterResponse {
  id: string;
  theme: string;
  twister: string;
  tokens: string[];
  createdAt: string;
  provider: string;
}

export type ApiErrorCode =
  | 'INVALID_THEME'
  | 'INVALID_DIFFICULTY'
  | 'INVALID_LENGTH'
  | 'PROVIDER_FAILURE'
  | 'INTERNAL_ERROR';

export interface ApiErrorResponse {
  error: {
    code: ApiErrorCode;
    message: string;
    requestId: string;
  };
}

export type ApiResponse<T> =
  | { success: true; data: T; requestId: string }
  | { success: false; error: ApiErrorResponse['error']; requestId: string };
