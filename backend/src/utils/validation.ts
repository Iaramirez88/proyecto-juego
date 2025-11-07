/**
 * Utilidades de validación para controladores
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Valida que un parámetro no sea undefined
 */
export function validateRequiredParam(value: string | undefined, paramName: string): string {
  if (!value) {
    throw new ValidationError(`Missing required parameter: ${paramName}`);
  }
  return value;
}

/**
 * Valida múltiples parámetros requeridos
 */
export function validateRequiredParams(params: Record<string, string | undefined>): Record<string, string> {
  const validated: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(params)) {
    validated[key] = validateRequiredParam(value, key);
  }
  
  return validated;
}

/**
 * Valida que un ID sea un UUID válido
 */
export function validateUUID(value: string | undefined, paramName: string): string {
  const id = validateRequiredParam(value, paramName);
  
  // Regex para UUID v4
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(id)) {
    throw new ValidationError(`Invalid UUID format for parameter: ${paramName}`);
  }
  
  return id;
}