import api from "@/lib/api";
import type { MasterProfile, MasterLeadStats, MasterDashboard } from "../types";

export async function getMasterSelf(): Promise<MasterProfile> {
  const res = await api.get(`/api/master/dashboard`);
  return res.data as MasterProfile;
}

export async function getMasterLeadStats(id: string): Promise<MasterLeadStats> {
  const res = await api.get(`/api/master/dashboard/lead-stats/master`, {
    params: { masterId: id },
  });
  return res.data as MasterLeadStats;
}

export async function getMasterProfileById(id: string): Promise<MasterProfile> {
  const res = await api.get(`/api/master/dashboard/${id}`, {
    params: { includeStats: "true" },
  });
  return res.data as MasterProfile;
}

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
