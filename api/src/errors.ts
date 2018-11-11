export class ValidationError extends Error {
  errors: Array<{ field: string; error: string }> = [];
  status: number = 0;

  constructor(
    message: string,
    errors?: Array<{ argument: string; message: string }>
  ) {
    super(message);
    this.errors = errors
      ? errors.map(msg => ({
          field: msg.argument,
          error: msg.message
        }))
      : [];
    this.status = 400;
  }
}

export class NotFoundError extends Error {
  status: number = 0;

  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}
