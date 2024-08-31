const log = require('electron-log');

export function setupLogging(): void {
  const logLevel = getLogLevelFromArgs();
  log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
  log.transports.console.useStyles = true;
  log.transports.file.maxSize = 20 * 1024 * 1024; // 20 MB;
  log.transports.console.level = logLevel;
  log.transports.file.level = logLevel;
  log.initialize({ preload: true });
}

function getLogLevelFromArgs(): string {
  const logLevelArg = process.argv.find((arg) => arg.startsWith('--log-level='));
  if (logLevelArg) {
    const [, logLevel] = logLevelArg.split('='); // Split to get the value after '='
    return logLevel; // Return the log level
  }
  return 'info'; // Default log level
}
