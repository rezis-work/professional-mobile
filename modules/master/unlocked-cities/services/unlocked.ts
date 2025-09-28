import api from "@/lib/api";

export const getUnlockedMasterCities = async () => {
  const response = await api.get("/api/masters/locations/unlocked");
  return response.data;
};

export const removeUnlockedMasterCity = async (cityPartId: string) => {
  const response = await api.delete(`/api/masters/me/locations/${cityPartId}`);
  return response.data;
};
