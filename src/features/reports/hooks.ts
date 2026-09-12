import { useQuery } from "@tanstack/react-query";
import { getReportsData } from "./api";

export function useReportsData() {
  return useQuery({ queryKey: ["reports"], queryFn: getReportsData });
}
