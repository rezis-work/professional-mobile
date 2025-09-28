import { useQuery } from "@tanstack/react-query";
import { getAllCities } from "../services/city";

export const useGetCities = () => {
  return useQuery({
    queryKey: ["cities"],
    queryFn: getAllCities,
  });
};
