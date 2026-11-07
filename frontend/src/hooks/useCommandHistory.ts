import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type { CommandHistory } from "../utils/types";

const REFETCH_INTERVAL = 1000;

const API_DOMAIN = "http://localhost:8001"

export function useCommandHistory(
  commandId: string,
): UseQueryResult<CommandHistory[]> {
  // This hook should use React Query and return CommandHistory[].
  // Define the refetch interval as a local constant.
  return useQuery({
    queryKey: ["commandHistory", commandId],
    queryFn: async () => {
      const response = await fetch(API_DOMAIN + `/api/commands/${commandId}/history`);
      if (!response.ok) {
        throw new Error("Command history couldn't be fetched.");
      }
      const json = await response.json();
      return json.data;
    },
    refetchInterval: REFETCH_INTERVAL,
  });
}
