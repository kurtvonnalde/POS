import axios from "axios";
import { useCallback } from "react";
import { useNotifications, type NotificationPayload } from "./NotificationProvider";

interface ApiSuccessOptions {
  title?: string;
  message: string;
  durationMs?: number;
}

interface ApiErrorOptions {
  title?: string;
  fallbackMessage?: string;
  durationMs?: number;
}

function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    const message = error.response?.data?.message;

    if (typeof detail === "string" && detail.trim()) {
      return detail;
    }

    if (Array.isArray(detail)) {
      const joined = detail
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          if (item && typeof item === "object" && "msg" in item) {
            return String((item as { msg: unknown }).msg);
          }

          return "";
        })
        .filter(Boolean)
        .join(", ");

      if (joined) {
        return joined;
      }
    }

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

export function useApiNotifier() {
  const { success, error } = useNotifications();

  const notifyApiSuccess = useCallback(
    ({ title = "Success", message, durationMs }: ApiSuccessOptions) => {
      const payload: Omit<NotificationPayload, "type"> = {
        title,
        message,
        durationMs,
      };

      success(payload);
    },
    [success],
  );

  const notifyApiError = useCallback(
    (err: unknown, { title = "Request failed", fallbackMessage = "Something went wrong.", durationMs }: ApiErrorOptions = {}) => {
      const message = getApiErrorMessage(err, fallbackMessage);

      const payload: Omit<NotificationPayload, "type"> = {
        title,
        message,
        durationMs,
      };

      error(payload);
      return message;
    },
    [error],
  );

  return {
    notifyApiSuccess,
    notifyApiError,
    getApiErrorMessage,
  };
}
