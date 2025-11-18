import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadMasterProof } from "../services/billing";

export const useUploadProof = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => uploadMasterProof(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master-billings"] });
      // Toast will be shown in component via onSuccess callback
    },
    // Error handling will be done in component via onError callback
  });
};
