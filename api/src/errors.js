class ValidationError extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors && errors.map(msg => ({
      field: msg.argument,
      error: msg.stack
    }));
    this.status = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.status = 400;
  }
}

module.exports = { NotFoundError, ValidationError };
