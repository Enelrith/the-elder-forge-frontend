export interface ErrorResponse {
  timestamp: string;
  status: number;
  message: string;
  error: string;
  path: string;
  validationErrors: Record<string, string> | null;
}

export interface ActionState {
  errors: ErrorResponse | null;
}
