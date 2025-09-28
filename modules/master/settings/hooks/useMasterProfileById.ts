import { useQuery } from "@tanstack/react-query";
import { getMasterProfileById } from "@/modules/master/profile/services/profile";
import type { MasterProfile } from "@/modules/master/profile/types";

export const useMasterProfileById = (id: string) => {
  return useQuery<MasterProfile, Error>({
    queryKey: ["master-profile", id],
    queryFn: () => getMasterProfileById(id),
    enabled: !!id,
  });
};
