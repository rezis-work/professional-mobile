import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/assign";

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: getCategories });
}
