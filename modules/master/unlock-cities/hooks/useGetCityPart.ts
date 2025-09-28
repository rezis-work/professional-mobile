import { useQuery } from "@tanstack/react-query";
import { getCityPartById } from "../services/city";

export const useGetCityPart = (id: string) => {
  return useQuery({
    queryKey: ["city-part", id],
    queryFn: () => getCityPartById(id),
    enabled: !!id,
  });
};
