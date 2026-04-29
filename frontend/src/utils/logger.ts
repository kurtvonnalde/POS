type LogMeta = Record<string, unknown>;

function shouldLog() {
  return import.meta.env.DEV;
}

export const appLogger = {
  error(message: string, error?: unknown, meta?: LogMeta) {
    if (!shouldLog()) {
      return;
    }

    console.error(`[app] ${message}`, {
      error,
      ...meta,
    });
  },

  info(message: string, meta?: LogMeta) {
    if (!shouldLog()) {
      return;
    }

    console.info(`[app] ${message}`, meta ?? {});
  },
};
