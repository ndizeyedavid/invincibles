import httpStatus from 'http-status';
import { CustomError } from './CustomError';

export class UnauthorizedError extends CustomError {
  statusCode = httpStatus.UNAUTHORIZED;

  constructor() {
    super('Not Authorized, Please login again!');

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
