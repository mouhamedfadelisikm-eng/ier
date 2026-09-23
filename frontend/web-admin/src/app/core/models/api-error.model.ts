export interface ApiValidationError {
  message: string;
  errors?: Record<string, string[]>;
}
