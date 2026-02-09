import { StatusCodes } from 'http-status-codes';

/**
 * Standard response envelope used across API routes.
 * Keeps message + requestId consistent while allowing a typed payload.
 */
export class ResponseService<T = null> {
  readonly success: boolean;
  readonly message: string;
  readonly responseObject: T;
  readonly statusCode: number;
  readonly requestId: string;

  private constructor(
    success: boolean,
    message: string,
    responseObject: T,
    statusCode: number
  ) {
    this.success = success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
    this.requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  /**
   * Build a success response with a typed payload.
   */
  static success<T>(
    message: string,
    data: T,
    statusCode: number = StatusCodes.OK
  ) {
    const { responseObject, ...response } = new ResponseService(
      true,
      message,
      data,
      statusCode
    );

    return { ...response, data: responseObject };
  }

  /**
   * Build a failure response with a typed error payload.
   */
  static failure<T>(
    message: string,
    error: T,
    statusCode: number = StatusCodes.BAD_REQUEST
  ) {
    const { responseObject, ...response } = new ResponseService(
      false,
      message,
      error,
      statusCode
    );

    return { ...response, error: responseObject };
  }
}
