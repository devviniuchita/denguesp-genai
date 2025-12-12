import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Custom hook for persisting state in localStorage with proper hydration handling
 * Prevents race conditions in Next.js by only saving after initial load
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  }
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  // Store options in refs to avoid re-running effects when they change
  const serializeRef = useRef(options?.serialize || JSON.stringify);
  const deserializeRef = useRef(options?.deserialize || JSON.parse);

  // Update refs when options change
  useEffect(() => {
    if (options?.serialize) serializeRef.current = options.serialize;
    if (options?.deserialize) deserializeRef.current = options.deserialize;
  }, [options?.serialize, options?.deserialize]);

  // Track if we've loaded from localStorage
  const isHydrated = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize with the provided initial value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load from localStorage on mount (client-side only) - runs ONCE
  useEffect(() => {
    // Skip if already hydrated or on server
    if (isHydrated.current) return;
    if (typeof globalThis.window === "undefined") return;

    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        const parsed = deserializeRef.current(item);
        setStoredValue(parsed);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }

    // Mark as hydrated after loading
    isHydrated.current = true;
    setIsLoaded(true);
  }, [key]); // Only depend on key, not deserialize

  // Save to localStorage whenever value changes (but only after hydration)
  useEffect(() => {
    if (typeof globalThis.window === "undefined") return;
    if (!isHydrated.current) return; // Don't save before hydration

    try {
      localStorage.setItem(key, serializeRef.current(storedValue));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]); // Only depend on key and value

  // Setter function that updates state
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const newValue = typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
      return newValue;
    });
  }, []);

  return [storedValue, setValue, isLoaded];
}

/**
 * Hook for persisting chat list with Date restoration
 */
export function useChatStorage<T extends { lastMessageTime?: Date | string }[]>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  // Memoize the serialize/deserialize functions
  const serialize = useCallback((value: T) => JSON.stringify(value), []);

  const deserialize = useCallback((str: string) => {
    const parsed = JSON.parse(str) as T;
    // Restore Date objects
    return parsed.map((item) => ({
      ...item,
      lastMessageTime: item.lastMessageTime
        ? new Date(item.lastMessageTime as string)
        : undefined,
    })) as T;
  }, []);

  return useLocalStorage<T>(key, initialValue, {
    serialize,
    deserialize,
  });
}
