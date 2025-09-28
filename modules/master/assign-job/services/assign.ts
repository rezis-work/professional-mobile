import api from "@/lib/api";

export async function getCategories() {
  const res = await api.get("/api/categories");
  return res.data;
}

export async function getJobsByCategoryId(categoryId: string) {
  if (!categoryId) return { data: [] };
  const res = await api.get(`/api/categories/${categoryId}/jobs`);
  return res.data;
}

export async function assignJob(
  jobId: string,
  priceMin: number,
  priceMax: number,
  durationMinutes?: number,
  note?: string,
  isActive: boolean = true
) {
  const res = await api.post("/api/masters/me/jobs", {
    jobId,
    priceMin,
    priceMax,
    durationMinutes,
    note,
    isActive,
  });
  return res.data;
}
