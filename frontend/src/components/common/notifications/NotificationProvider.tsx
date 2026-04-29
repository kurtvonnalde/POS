import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle, FaRegBell } from "react-icons/fa";
import "./NotificationProvider.scss";

export type NotificationType = "success" | "error" | "warning" | "info" | "neutral";

export interface NotificationPayload {
  type?: NotificationType;
  title?: string;
  message: string;
  durationMs?: number;
  dismissible?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationItem extends Required<Pick<NotificationPayload, "message">> {
  id: number;
  type: NotificationType;
  title?: string;
  durationMs: number;
  dismissible: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationContextValue {
  notify: (payload: NotificationPayload | string) => number;
  remove: (id: number) => void;
  clear: () => void;
  success: (payload: Omit<NotificationPayload, "type"> | string) => number;
  error: (payload: Omit<NotificationPayload, "type"> | string) => number;
  warning: (payload: Omit<NotificationPayload, "type"> | string) => number;
  info: (payload: Omit<NotificationPayload, "type"> | string) => number;
  neutral: (payload: Omit<NotificationPayload, "type"> | string) => number;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

const MAX_NOTIFICATIONS = 5;
const DEFAULT_DURATION = 4500;

const iconByType: Record<NotificationType, ReactNode> = {
  success: <FaCheckCircle />,
  error: <FaTimesCircle />,
  warning: <FaExclamationTriangle />,
  info: <FaInfoCircle />,
  neutral: <FaRegBell />,
};

function normalizePayload(input: NotificationPayload | string, forcedType?: NotificationType): NotificationPayload {
  if (typeof input === "string") {
    return {
      type: forcedType,
      message: input,
    };
  }

  return {
    ...input,
    type: forcedType ?? input.type,
  };
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const idRef = useRef(0);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const remove = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));

    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const notify = useCallback((payload: NotificationPayload | string) => {
    idRef.current += 1;
    const id = idRef.current;

    const normalized = normalizePayload(payload);
    const item: NotificationItem = {
      id,
      type: normalized.type ?? "info",
      title: normalized.title,
      message: normalized.message,
      durationMs: normalized.durationMs ?? DEFAULT_DURATION,
      dismissible: normalized.dismissible ?? true,
      actionLabel: normalized.actionLabel,
      onAction: normalized.onAction,
    };

    setNotifications((prev) => {
      const next = [item, ...prev];
      return next.slice(0, MAX_NOTIFICATIONS);
    });

    if (item.durationMs > 0) {
      const timer = setTimeout(() => {
        remove(id);
      }, item.durationMs);

      timersRef.current.set(id, timer);
    }

    return id;
  }, [remove]);

  const clear = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setNotifications([]);
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  const createTypedNotifier = useCallback(
    (type: NotificationType) =>
      (payload: Omit<NotificationPayload, "type"> | string) => {
        return notify(normalizePayload(payload, type));
      },
    [notify],
  );

  const value = useMemo<NotificationContextValue>(() => {
    return {
      notify,
      remove,
      clear,
      success: createTypedNotifier("success"),
      error: createTypedNotifier("error"),
      warning: createTypedNotifier("warning"),
      info: createTypedNotifier("info"),
      neutral: createTypedNotifier("neutral"),
    };
  }, [clear, createTypedNotifier, notify, remove]);

  return (
    <NotificationContext.Provider value={value}>
      {children}

      <div className="notification-viewport" aria-live="polite" aria-atomic="true">
        {notifications.map((item) => (
          <article key={item.id} className={`notification-card notification-card--${item.type}`} role="status">
            <div className="notification-card__icon" aria-hidden="true">
              {iconByType[item.type]}
            </div>

            <div className="notification-card__content">
              {item.title ? <h4>{item.title}</h4> : null}
              <p>{item.message}</p>

              {item.actionLabel ? (
                <button
                  className="notification-card__action"
                  type="button"
                  onClick={() => {
                    item.onAction?.();
                    remove(item.id);
                  }}
                >
                  {item.actionLabel}
                </button>
              ) : null}
            </div>

            {item.dismissible ? (
              <button
                className="notification-card__close"
                type="button"
                aria-label="Dismiss notification"
                onClick={() => remove(item.id)}
              >
                x
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }

  return context;
}
