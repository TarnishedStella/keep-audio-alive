class Logger {
  log(message?: unknown, ...optionalParams: unknown[]): void {
    console.log(message, ...optionalParams);
  }

  debug(message?: unknown, ...optionalParams: unknown[]): void {
    console.debug(message, ...optionalParams);
  }

  info(message?: unknown, ...optionalParams: unknown[]): void {
    console.info(message, ...optionalParams);
  }

  warn(message?: unknown, ...optionalParams: unknown[]): void {
    console.warn(message, ...optionalParams);
  }

  error(message?: unknown, ...optionalParams: unknown[]): void {
    console.error(message, ...optionalParams);
  }
}

export const defaultLogger = new Logger();

// Export the logger and LogLevel type for external use
export { defaultLogger as Logger };
