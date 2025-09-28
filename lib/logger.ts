type LogLevel = "debug" | "info" | "warn" | "error";

const PREFIX = "[mobile]";

function log(level: LogLevel, message: string, meta?: unknown) {
  const time = new Date().toISOString();
  // eslint-disable-next-line no-console
  console[level](`${PREFIX} ${time} ${message}`, meta ?? "");
}

export const logger = {
  debug: (msg: string, meta?: unknown) => log("debug", msg, meta),
  info: (msg: string, meta?: unknown) => log("info", msg, meta),
  warn: (msg: string, meta?: unknown) => log("warn", msg, meta),
  error: (msg: string, meta?: unknown) => log("error", msg, meta),
};

export default logger;
