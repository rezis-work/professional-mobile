import api from "@/lib/api";

export const getAllCities = async () => {
  const response = await api.get("/api/masters/cities");
  return response.data;
};

export const getCityPartById = async (id: string) => {
  const response = await api.get(`/api/masters/cities/${id}/parts`);
  return response.data;
};

export const unlockCity = async (
  locationId: string,
  cityId: string,
  cityPartId: string
) => {
  const response = await api.post("/api/masters/master/unlock-location", {
    locationId,
    cityId,
    cityPartId,
  });
  return response.data;
};
