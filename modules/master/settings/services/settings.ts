import api from "@/lib/api";

export async function upsertMasterProfile(payload: {
  bio: string;
  city: string;
  image?: { uri: string; name: string; type: string } | null;
}): Promise<{ success: boolean }> {
  const form = new FormData();
  form.append("bio", payload.bio);
  form.append("city", payload.city);
  if (payload.image) {
    form.append("image", {
      // @ts-ignore react-native file
      uri: payload.image.uri,
      name: payload.image.name,
      type: payload.image.type,
    } as any);
  }
  const res = await api.post(`/api/masters/profile`, form as any, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateAvailability(
  availability: "now" | "tomorrow" | "next_week" | "on_holiday"
) {
  const res = await api.patch(`/api/masters/availability`, { availability });
  return res.data;
}
