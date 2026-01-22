import { useState, useEffect } from "react";

interface Conversion {
  id: number;
  sessionId: string;
  amount: string;
  result: string;
  createdAt: string;
}

const STORAGE_KEY = "currency_converter_history";

function getStoredConversions(): Conversion[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveStoredConversions(conversions: Conversion[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversions));
}

export function useLocalConversions(sessionId: string) {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredConversions();
    const sessionConversions = stored.filter(c => c.sessionId === sessionId);
    setConversions(sessionConversions);
    setIsLoading(false);
  }, [sessionId]);

  return { data: conversions, isLoading };
}

export function useCreateLocalConversion() {
  const createConversion = (sessionId: string, amount: string, result: string) => {
    const stored = getStoredConversions();
    const newConversion: Conversion = {
      id: Date.now(),
      sessionId,
      amount,
      result,
      createdAt: new Date().toISOString(),
    };
    const updated = [newConversion, ...stored];
    saveStoredConversions(updated);
    return newConversion;
  };

  return { mutate: createConversion };
}

export function useClearLocalHistory() {
  const clearHistory = (sessionId: string) => {
    const stored = getStoredConversions();
    const filtered = stored.filter(c => c.sessionId !== sessionId);
    saveStoredConversions(filtered);
  };

  return { mutate: clearHistory };
}
