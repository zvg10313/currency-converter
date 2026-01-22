import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertConversion } from "@shared/routes";
import { z } from "zod";

// Helper to validate and fetch
async function fetcher<T>(url: string, schema: z.ZodSchema<T>) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`Error ${res.status}: Failed to fetch`);
  const data = await res.json();
  return schema.parse(data);
}

export function useConversions(sessionId: string) {
  const queryKey = [api.conversions.list.path, sessionId];
  
  return useQuery({
    queryKey,
    queryFn: () => {
      const url = buildUrl(api.conversions.list.path, { sessionId });
      return fetcher(url, api.conversions.list.responses[200]);
    },
    enabled: !!sessionId, // Only fetch if we have a session ID
  });
}

export function useCreateConversion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InsertConversion) => {
      const res = await fetch(api.conversions.create.path, {
        method: api.conversions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to save conversion");
      }
      return api.conversions.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      // Invalidate the list for this session
      queryClient.invalidateQueries({ 
        queryKey: [api.conversions.list.path, data.sessionId] 
      });
    },
  });
}

export function useClearHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const url = buildUrl(api.conversions.clear.path, { sessionId });
      const res = await fetch(url, {
        method: api.conversions.clear.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to clear history");
    },
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ 
        queryKey: [api.conversions.list.path, sessionId] 
      });
    },
  });
}
