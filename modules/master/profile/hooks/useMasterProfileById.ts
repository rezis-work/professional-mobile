import { useQuery } from "@tanstack/react-query";
import { getMasterProfileById } from "../services/profile";
import type { MasterProfile } from "../types";

export const useMasterProfileById = (id: string) => {
  return useQuery<MasterProfile, Error>({
    queryKey: ["master-profile", id],
    queryFn: () => getMasterProfileById(id),
    enabled: !!id,
  });
};
