import { useQuery } from "@tanstack/react-query";
import { getJobsByCategoryId } from "../services/assign";

export function useJobsByCategoryId(categoryId: string) {
  return useQuery({
    queryKey: ["jobs-by-category", categoryId],
    queryFn: () => getJobsByCategoryId(categoryId),
    enabled: !!categoryId,
  });
}
