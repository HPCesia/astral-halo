import { AstroError } from 'astro/errors';

export class AstroParameterConflictError extends AstroError {
  constructor(...params: string[]) {
    let message = `The following parameters are in conflict: ${params.join(', ')}. Please ensure that only one of these parameters is provided.`;
    super(message);
    this.name = 'ParameterConflictError';
  }
}
