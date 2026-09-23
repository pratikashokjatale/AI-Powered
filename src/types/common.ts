export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  path?: string;
  validationErrors?: string[];
  timestamp: string;
}

export type ConnectionStatus = 'connected' | 'offline_fallback' | 'checking';
