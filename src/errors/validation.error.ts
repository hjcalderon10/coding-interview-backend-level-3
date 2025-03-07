export class ValidationError extends Error {
    message: string
    errors: Array<{ field: string; message: string }>
  
    constructor(message: string, errors: Array<{ field: string; message: string }>) {
      super("Validation error")
      this.name = "ValidationError"
      this.message = message
      this.errors = errors
    }
  }
  