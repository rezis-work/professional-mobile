import { useQuery } from "@tanstack/react-query";
import { getUnlockedMasterCities } from "../services/unlocked";

export const useGetUnlockedMasterLocations = () => {
  return useQuery({
    queryKey: ["unlocked-master-locations"],
    queryFn: getUnlockedMasterCities,
  });
};
