import httpStatus from 'http-status';
import { CustomError } from './CustomError';

export class TooManyRequestError extends CustomError {
  statusCode = httpStatus.TOO_MANY_REQUESTS;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, TooManyRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
