import { ScreenHeader } from "@/components/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAssignJob } from "../../hooks/useAssignJob";
import { useCategories } from "../../hooks/useCategories";
import { useJobsByCategoryId } from "../../hooks/useJobsByCategoryId";
import { jobAssignmentFormSchema } from "../../schema";
import type { Category, Job } from "../../types";
import {
  AssignmentForm,
  type JobAssignmentFormData,
} from "../components/AssignmentForm";
import { CategoryGrid } from "../components/CategoryGrid";
import { JobsGrid } from "../components/JobsGrid";

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

  const getTitle = () => {
    switch (step) {
      case "category":
        return "Choose Category";
      case "job":
        return "Select Job";
      case "details":
        return "Job Details";
      case "confirm":
        return "Review & Confirm";
    }
  };

  const handleBack = () => {
    if (step === "job") {
      handleBackToCategories();
    } else if (step === "details") {
      handleBackToJobs();
    } else if (step === "confirm") {
      setStep("details");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader
        title={getTitle()}
        showBack={step !== "category"}
        onBack={handleBack}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle */}
        <View className="mb-8">
          <Text className="text-base text-gray-600 dark:text-gray-400 leading-6">
            {step === "category" && "Select a category to see available jobs"}
            {step === "job" && "Choose the job you want to assign"}
            {step === "details" && "Fill in the job assignment details"}
            {step === "confirm" && "Review your assignment before confirming"}
          </Text>
        </View>

        {/* Content */}
        {step === "category" && (
          <>
            {categoriesLoading ? (
              <View className="items-center justify-center py-16">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="text-base font-medium text-gray-600 dark:text-gray-400 mt-6">
                  Loading categories...
                </Text>
              </View>
            ) : categoriesError ? (
              <View
                className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800"
                style={{
                  shadowColor: "#ef4444",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-center mb-3">
                  <View className="bg-red-100 dark:bg-red-900/40 rounded-full p-2 mr-3">
                    <Ionicons name="alert-circle" size={24} color="#ef4444" />
                  </View>
                  <Text className="text-lg font-bold text-red-600 dark:text-red-400">
                    Failed to load categories
                  </Text>
                </View>
                <Text className="text-sm font-medium text-red-600 dark:text-red-400 ml-11">
                  Please try again later
                </Text>
              </View>
            ) : categoriesData?.data?.length ? (
              <CategoryGrid
                categories={categoriesData.data}
                onSelect={handleCategorySelect}
              />
            ) : (
              <View className="items-center justify-center py-16">
                <View className="bg-gray-100 dark:bg-neutral-800 rounded-full p-6 mb-4">
                  <Ionicons name="folder-outline" size={56} color="#9ca3af" />
                </View>
                <Text className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  No categories available
                </Text>
              </View>
            )}
          </>
        )}

        {step === "job" && (
          <>
            {jobsLoading ? (
              <View className="items-center justify-center py-16">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="text-base font-medium text-gray-600 dark:text-gray-400 mt-6">
                  Loading jobs...
                </Text>
              </View>
            ) : jobsError ? (
              <View
                className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800"
                style={{
                  shadowColor: "#ef4444",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-center mb-3">
                  <View className="bg-red-100 dark:bg-red-900/40 rounded-full p-2 mr-3">
                    <Ionicons name="alert-circle" size={24} color="#ef4444" />
                  </View>
                  <Text className="text-lg font-bold text-red-600 dark:text-red-400">
                    Failed to load jobs
                  </Text>
                </View>
                <Text className="text-sm font-medium text-red-600 dark:text-red-400 ml-11">
                  Please try again later
                </Text>
              </View>
            ) : jobsData?.data?.length ? (
              <JobsGrid jobs={jobsData.data} onSelect={handleJobSelect} />
            ) : (
              <View className="items-center justify-center py-16">
                <View className="bg-gray-100 dark:bg-neutral-800 rounded-full p-6 mb-4">
                  <Ionicons
                    name="briefcase-outline"
                    size={56}
                    color="#9ca3af"
                  />
                </View>
                <Text className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  No jobs available in this category
                </Text>
              </View>
            )}
          </>
        )}

        {step === "details" && selectedJob && (
          <AssignmentForm
            onSubmit={handleProceedToConfirm}
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            control={control}
            selectedJob={selectedJob}
          />
        )}

        {step === "confirm" && selectedJob && (
          <View className="gap-6">
            {/* Job Summary Card */}
            <View
              className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-neutral-700"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
              <View className="flex-row items-center mb-5">
                <View
                  className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 mr-4"
                  style={{
                    shadowColor: "#2563eb",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Ionicons name="briefcase" size={28} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-extrabold text-text mb-2">
                    {selectedJob.title.en}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 leading-5">
                    {selectedJob.description.en}
                  </Text>
                </View>
              </View>
            </View>

            {/* Assignment Details Card */}
            <View
              className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-neutral-700"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
              <View className="flex-row items-center mb-5">
                <Ionicons name="list" size={24} color="#2563eb" />
                <Text className="text-xl font-extrabold text-text ml-3">
                  Assignment Details
                </Text>
              </View>
              <View className="gap-4">
                <View className="flex-row justify-between items-center py-3 border-b-2 border-gray-100 dark:border-neutral-700">
                  <View className="flex-row items-center">
                    <Ionicons name="cash-outline" size={20} color="#64748b" />
                    <Text className="text-base font-semibold text-gray-600 dark:text-gray-400 ml-2">
                      Min Price
                    </Text>
                  </View>
                  <Text className="text-lg font-extrabold text-text">
                    ₾{getValues().priceMin}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center py-3 border-b-2 border-gray-100 dark:border-neutral-700">
                  <View className="flex-row items-center">
                    <Ionicons name="cash" size={20} color="#64748b" />
                    <Text className="text-base font-semibold text-gray-600 dark:text-gray-400 ml-2">
                      Max Price
                    </Text>
                  </View>
                  <Text className="text-lg font-extrabold text-text">
                    ₾{getValues().priceMax}
                  </Text>
                </View>
                {getValues().durationMinutes && (
                  <View className="flex-row justify-between items-center py-3 border-b-2 border-gray-100 dark:border-neutral-700">
                    <View className="flex-row items-center">
                      <Ionicons name="time-outline" size={20} color="#64748b" />
                      <Text className="text-base font-semibold text-gray-600 dark:text-gray-400 ml-2">
                        Duration
                      </Text>
                    </View>
                    <Text className="text-lg font-extrabold text-text">
                      {getValues().durationMinutes} min
                    </Text>
                  </View>
                )}
                {getValues().note && (
                  <View className="py-3 bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-4 mt-2">
                    <View className="flex-row items-center mb-2">
                      <Ionicons
                        name="document-text-outline"
                        size={20}
                        color="#64748b"
                      />
                      <Text className="text-base font-semibold text-gray-600 dark:text-gray-400 ml-2">
                        Note
                      </Text>
                    </View>
                    <Text className="text-base text-text leading-6">
                      {getValues().note}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-4 mt-4">
              <Pressable
                onPress={() => setStep("details")}
                className="flex-1 bg-gray-100 dark:bg-neutral-700 py-5 items-center rounded-2xl active:opacity-70"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text className="text-base font-bold text-text">
                  Edit Details
                </Text>
              </Pressable>
              <Pressable
                onPress={handleConfirmAssignment}
                disabled={isAssigningJob}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 py-5 items-center rounded-2xl flex-row justify-center active:opacity-80"
                style={{
                  shadowColor: "#16a34a",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                {isAssigningJob ? (
                  <>
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-base font-bold text-white ml-3">
                      Assigning...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={24} color="white" />
                    <Text className="text-base font-bold text-white ml-3">
                      Confirm Assignment
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
