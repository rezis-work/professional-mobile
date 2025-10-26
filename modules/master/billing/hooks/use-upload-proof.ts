import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadMasterProof } from "../services/billing";
import { Alert } from "react-native";

export const useUploadProof = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => uploadMasterProof(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master-billings"] });
      Alert.alert("Success", "Proof uploaded successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to upload proof";
      Alert.alert("Error", message);
    },
  });
};
