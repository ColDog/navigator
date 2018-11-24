export class ValidationError extends Error {
  errors: Array<{ field: string; error: string }> = [];
  status: number = 0;

  constructor(
    message: string,
    errors?: Array<{ argument: string; message: string }>
  ) {
    super(`${message}: ${errors.map(e => e.message).join(", ")}`);
    const errList = errors
      ? errors.map(msg => ({
          field: msg.argument,
          error: msg.message
        }))
      : [];
    this.status = 400;
  }
}

export class HTTPError extends Error {
  status: number = 500;
}


export class NotFoundError extends HTTPError {
  status: number = 404;
}

export class UnauthorizedError extends HTTPError {
  status: number = 401;
}
