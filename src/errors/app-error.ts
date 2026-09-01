import { ErrorCode } from './error-codes.ts';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  public constructor(
    code: ErrorCode,
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any,
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Set the prototype explicitly to maintain the correct prototype chain
    Object.setPrototypeOf(this, AppError.prototype);
  }

  public static badRequest(message: string, details?: unknown): AppError {
    return new AppError(ErrorCode.ValidationError, message, 400, true, details);
  }

  public static unauthorized(message = 'Authentication is required'): AppError {
    return new AppError(ErrorCode.Unauthorized, message, 401, true);
  }

  public static forbidden(message = 'You are not allowed to perform this action'): AppError {
    return new AppError(ErrorCode.Forbidden, message, 403, true);
  }

  public static notFound(message: string): AppError {
    return new AppError(ErrorCode.NotFound, message, 404, true);
  }

  public static conflict(message: string): AppError {
    return new AppError(ErrorCode.Conflict, message, 409, true);
  }
}
