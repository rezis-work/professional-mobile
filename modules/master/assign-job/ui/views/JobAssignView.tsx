import { useState } from "react";
import { ScrollView, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useCategories } from "../../hooks/useCategories";
import { useJobsByCategoryId } from "../../hooks/useJobsByCategoryId";
import type { Category, Job } from "../../types";
import { CategoryGrid } from "../components/CategoryGrid";
import { JobsGrid } from "../components/JobsGrid";
import { useAssignJob } from "../../hooks/useAssignJob";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobAssignmentFormSchema } from "../../schema";
import {
  AssignmentForm,
  type JobAssignmentFormData,
} from "../components/AssignmentForm";

export function JobAssignView() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [step, setStep] = useState<"category" | "job" | "details" | "confirm">(
    "category"
  );

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();
  const {
    data: jobsData,
    isLoading: jobsLoading,
    isError: jobsError,
  } = useJobsByCategoryId(selectedCategoryId || "");

  const { mutate: assignJob, isPending: isAssigningJob } = useAssignJob();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    control,
  } = useForm<JobAssignmentFormData>({
    resolver: zodResolver(jobAssignmentFormSchema),
  });

  const handleCategorySelect = (category: Category) => {
    setSelectedCategoryId(category.id);
    setSelectedJob(null);
    setStep("job");
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setStep("details");
  };

  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    setSelectedJob(null);
    reset();
    setStep("category");
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
    reset();
    setStep("job");
  };

  const handleProceedToConfirm = (data: JobAssignmentFormData) => {
    setStep("confirm");
  };

  const handleConfirmAssignment = () => {
    if (!selectedJob) return;
    const formData = getValues();
    assignJob(
      {
        jobId: selectedJob.id,
        priceMin: Number(formData.priceMin),
        priceMax: Number(formData.priceMax),
        durationMinutes: formData.durationMinutes
          ? Number(formData.durationMinutes)
          : undefined,
        note: formData.note || undefined,
        isActive: true,
      },
      {
        onSuccess: () => {
          handleBackToCategories();
        },
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <ThemedText type="title">
        {step === "category" && "Choose Category"}
        {step === "job" && "Select Job"}
        {step === "details" && "Job Details"}
        {step === "confirm" && "Confirmation"}
      </ThemedText>

      {step === "category" && (
        <>
          {categoriesLoading ? (
            <ThemedText>Loading categories...</ThemedText>
          ) : categoriesError ? (
            <ThemedText>Failed to load categories</ThemedText>
          ) : categoriesData?.data?.length ? (
            <CategoryGrid
              categories={categoriesData.data}
              onSelect={handleCategorySelect}
            />
          ) : (
            <ThemedText>No categories</ThemedText>
          )}
        </>
      )}

      {step === "job" && (
        <>
          <ThemedText
            onPress={handleBackToCategories}
            style={{ color: "#2563eb" }}
          >
            ← Back
          </ThemedText>
          {jobsLoading ? (
            <ThemedText>Loading jobs...</ThemedText>
          ) : jobsError ? (
            <ThemedText>Failed to load jobs</ThemedText>
          ) : jobsData?.data?.length ? (
            <JobsGrid jobs={jobsData.data} onSelect={handleJobSelect} />
          ) : (
            <ThemedText>No jobs</ThemedText>
          )}
        </>
      )}

      {step === "details" && selectedJob && (
        <>
          <ThemedText onPress={handleBackToJobs} style={{ color: "#2563eb" }}>
            ← Back
          </ThemedText>
          <AssignmentForm
            onBack={handleBackToJobs}
            onSubmit={handleProceedToConfirm}
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            control={control}
          />
        </>
      )}

      {step === "confirm" && selectedJob && (
        <View style={{ gap: 12 }}>
          <ThemedText>Confirm Job Assignment</ThemedText>
          <ThemedText>Job: {selectedJob.title.en}</ThemedText>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <ThemedText
              onPress={() => setStep("details")}
              style={{ color: "#2563eb" }}
            >
              Back to Details
            </ThemedText>
            <ThemedText
              onPress={handleConfirmAssignment}
              style={{ color: "#16a34a" }}
            >
              {isAssigningJob ? "Assigning..." : "Confirm"}
            </ThemedText>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
