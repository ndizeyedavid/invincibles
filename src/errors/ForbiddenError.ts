import httpStatus from 'http-status';
import { CustomError } from './CustomError';

export class ForbiddenError extends CustomError {
  statusCode = httpStatus.FORBIDDEN;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
