// Lightweight draft persistence utilities
// Persist partial form state to localStorage and restore on revisit.

export type DraftKey = string;

const STORAGE_PREFIX = "kyrgyzstanheritage:draft:";

function storageKey(key: DraftKey) {
  return `${STORAGE_PREFIX}${key}`;
}

export function saveDraft<T>(key: DraftKey, data: T) {
  try {
    const value = JSON.stringify({ data, ts: Date.now() });
    localStorage.setItem(storageKey(key), value);
  } catch (e) {
    // no-op
  }
}

export function loadDraft<T>(key: DraftKey): T | null {
  try {
    const raw = localStorage.getItem(storageKey(key));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data ?? null;
  } catch (e) {
    return null;
  }
}

export function clearDraft(key: DraftKey) {
  try {
    localStorage.removeItem(storageKey(key));
  } catch (e) {
    // no-op
  }
}

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * useDraftState
 * Drop-in replacement for useState that persists to localStorage.
 * - Provide a unique `key` (e.g., based on route and entity type)
 * - Returns [state, setState, helpers]
 * - Call `helpers.clear()` on successful submit
 */
export function useDraftState<T>(key: DraftKey, initial: T) {
  const initialFromStorage = useMemo(() => {
    const saved = loadDraft<T>(key);
    return saved ?? initial;
  }, [key]);

  const [state, setState] = useState<T>(initialFromStorage);
  const keyRef = useRef(key);

  // Persist whenever state changes
  useEffect(() => {
    saveDraft<T>(keyRef.current, state);
  }, [state]);

  // Update key if it changes (rare)
  useEffect(() => {
    keyRef.current = key;
  }, [key]);

  // Auto-save on tab close/navigation just in case
  useEffect(() => {
    const handler = () => saveDraft<T>(keyRef.current, state);
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [state]);

  const helpers = {
    clear: () => clearDraft(keyRef.current),
    reload: (): T => {
      const saved = loadDraft<T>(keyRef.current);
      return saved ?? initial;
    },
  };

  return [state, setState, helpers] as const;
}

// React Hook Form integration: persist entire form values via watch/reset
type RHFMethods<T> = {
  reset: (values: Partial<T>) => void;
  watch: (names?: string | string[]) => T;
};

export function useFormDraft<T extends Record<string, any>>(
  key: DraftKey,
  methods: RHFMethods<T>,
  options?: { omit?: string[] }
) {
  const omit = options?.omit ?? [];

  // Load saved draft into form on mount
  useEffect(() => {
    const saved = loadDraft<Partial<T>>(key);
    if (saved && typeof methods.reset === "function") {
      methods.reset(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Subscribe to changes and persist
  useEffect(() => {
    const subscription = (methods as any).watch((values: T) => {
      try {
        const filtered = { ...values } as Record<string, any>;
        // remove omitted and unserializable (File, FileList)
        omit.forEach((k) => {
          if (k in filtered) delete filtered[k];
        });
        Object.keys(filtered).forEach((k) => {
          const v = filtered[k];
          if (
            v instanceof File ||
            v instanceof Blob ||
            (typeof v === "object" && v !== null && "size" in v && "type" in v)
          ) {
            delete filtered[k];
          }
          // arrays of files
          if (Array.isArray(v) && v.length && v[0] instanceof File) {
            delete filtered[k];
          }
        });
        saveDraft<Partial<T>>(key, filtered as Partial<T>);
      } catch (_) {
        // ignore
      }
    });
    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return {
    clear: () => clearDraft(key),
    load: () => loadDraft<Partial<T>>(key),
  };
}
