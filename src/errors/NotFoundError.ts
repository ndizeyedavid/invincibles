import httpStatus from 'http-status';
import { CustomError } from './CustomError';

export class NotFoundError extends CustomError {
  statusCode = httpStatus.NOT_FOUND;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
