import httpStatus from 'http-status';
import { CustomError } from './CustomError';

export class BadRequestError extends CustomError {
  statusCode = httpStatus.BAD_REQUEST;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
