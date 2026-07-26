"use client";

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from "react";

export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        // Fall back to `initial` when the stored shape doesn't match the
        // expected type (e.g. a stale/corrupt value from an older schema).
        // Prevents runtime crashes like `prev.includes is not a function`
        // when an array was previously stored as `{}`.
        let valid: unknown = parsed;
        if (Array.isArray(initial)) {
          valid = Array.isArray(parsed) ? parsed : initial;
        } else if (initial instanceof Date) {
          valid = initial;
        } else if (typeof initial === "object" && initial !== null) {
          valid =
            parsed && typeof parsed === "object" && !Array.isArray(parsed)
              ? parsed
              : initial;
        } else {
          valid = typeof parsed === typeof initial ? parsed : initial;
        }
        setValue(valid as T);
      }
    } catch {
      // ignore
    }
  }, [key]);

  const setStored: Dispatch<SetStateAction<T>> = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // ignore
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, setStored];
}
