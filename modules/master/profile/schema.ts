import { z } from "zod";

export const profileSchema = z.object({
  bio: z
    .string({ required_error: "Bio is required" })
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be at most 500 characters"),
  city: z
    .string({ required_error: "City is required" })
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be at most 100 characters"),
});

export type ProfileFormValues = z.infer<typeof profileSchema> & {
  image?: { uri: string; name: string; type: string } | null;
};

export const availabilitySchema = z.object({
  availability: z.enum(["now", "tomorrow", "next_week", "on_holiday"], {
    required_error: "Availability is required",
  }),
});

export type AvailabilityFormValues = z.infer<typeof availabilitySchema>;
