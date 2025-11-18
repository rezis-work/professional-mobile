import { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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
import { useTranslation } from "react-i18next";
import { useThemeColorPalette } from "@/hooks/use-theme-color-palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useToast } from "@/components/toast";
import { Ionicons } from "@expo/vector-icons";

export function JobAssignView() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = useThemeColorPalette();
  const { showToast } = useToast();

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
          showToast("Job assigned successfully", "success");
          handleBackToCategories();
        },
        onError: (error: any) => {
          showToast(
            error?.response?.data?.message || "Failed to assign job",
            "error"
          );
        },
      }
    );
  };

  const getStepTitle = () => {
    switch (step) {
      case "category":
        return t("masterNavigation.jobAssignment");
      case "job":
        return "Select Job";
      case "details":
        return "Job Details";
      case "confirm":
        return "Confirmation";
      default:
        return "";
    }
  };

  const getBackHandler = () => {
    if (step === "job") return handleBackToCategories;
    if (step === "details") return handleBackToJobs;
    if (step === "confirm") return () => setStep("details");
    return undefined;
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {step !== "category" && (
            <TouchableOpacity
              onPress={getBackHandler()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          <ThemedText type="title" style={styles.title}>
            {getStepTitle()}
          </ThemedText>
        </View>
      </View>

      {/* Category Step */}
      {step === "category" && (
        <View>
          {categoriesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <ThemedText style={styles.loadingText}>
                Loading categories...
              </ThemedText>
            </View>
          ) : categoriesError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={32} color={colors.error} />
              <ThemedText style={[styles.errorText, { color: colors.error }]}>
                Failed to load categories
              </ThemedText>
            </View>
          ) : categoriesData?.data?.length ? (
            <CategoryGrid
              categories={categoriesData.data}
              onSelect={handleCategorySelect}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open" size={32} color={colors.mutedIcon} />
              <ThemedText style={styles.emptyText}>No categories</ThemedText>
            </View>
          )}
        </View>
      )}

      {/* Job Step */}
      {step === "job" && (
        <View>
          {jobsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <ThemedText style={styles.loadingText}>Loading jobs...</ThemedText>
            </View>
          ) : jobsError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={32} color={colors.error} />
              <ThemedText style={[styles.errorText, { color: colors.error }]}>Failed to load jobs</ThemedText>
            </View>
          ) : jobsData?.data?.length ? (
            <JobsGrid jobs={jobsData.data} onSelect={handleJobSelect} />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="briefcase-outline" size={32} color={colors.mutedIcon} />
              <ThemedText style={styles.emptyText}>No jobs available</ThemedText>
            </View>
          )}
        </View>
      )}

      {/* Details Step */}
      {step === "details" && selectedJob && (
        <View>
          <AssignmentForm
            onBack={handleBackToJobs}
            onSubmit={handleProceedToConfirm}
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            control={control}
          />
        </View>
      )}

      {/* Confirm Step */}
      {step === "confirm" && selectedJob && (
        <View>
          <View style={styles.confirmHeader}>
            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            <ThemedText type="title" style={styles.confirmTitle}>
              Confirm Job Assignment
            </ThemedText>
          </View>

          <View style={[styles.confirmDetails, { backgroundColor: `${colors.primary}0D` }]}>
            <View style={styles.confirmRow}>
              <ThemedText style={styles.confirmLabel}>Job:</ThemedText>
              <ThemedText style={styles.confirmValue}>
                {selectedJob.title.en}
              </ThemedText>
            </View>
            {(() => {
              const formData = getValues();
              return (
                <>
                  <View style={styles.confirmRow}>
                    <ThemedText style={styles.confirmLabel}>Price Range:</ThemedText>
                    <ThemedText style={styles.confirmValue}>
                      {formData.priceMin} - {formData.priceMax}
                    </ThemedText>
                  </View>
                  {formData.durationMinutes && (
                    <View style={styles.confirmRow}>
                      <ThemedText style={styles.confirmLabel}>Duration:</ThemedText>
                      <ThemedText style={styles.confirmValue}>
                        {formData.durationMinutes} minutes
                      </ThemedText>
                    </View>
                  )}
                  {formData.note && (
                    <View style={styles.confirmRow}>
                      <ThemedText style={styles.confirmLabel}>Note:</ThemedText>
                      <ThemedText style={styles.confirmValue}>
                        {formData.note}
                      </ThemedText>
                    </View>
                  )}
                </>
              );
            })()}
          </View>

          <View style={styles.confirmActions}>
            <TouchableOpacity
              onPress={() => setStep("details")}
              style={[
                styles.confirmButton, 
                styles.backConfirmButton,
                { 
                  backgroundColor: colors.secondaryBackground,
                  borderColor: colors.border 
                }
              ]}
              activeOpacity={0.7}
            >
              <ThemedText style={[styles.backConfirmButtonText, { color: colors.mutedIcon }]}>Edit</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirmAssignment}
              disabled={isAssigningJob}
              style={[
                styles.confirmButton,
                { backgroundColor: colors.success },
                isAssigningJob && styles.confirmButtonDisabled,
              ]}
              activeOpacity={0.7}
            >
              {isAssigningJob ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color={colors.white} />
                  <ThemedText
                    style={[styles.confirmButtonText, { color: colors.white }]}
                    lightColor={colors.white}
                    darkColor={colors.white}
                  >
                    Confirm
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    marginBottom: 0,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardDark: {
    borderWidth: 1,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  loadingText: {
    opacity: 0.7,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  errorText: {
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  emptyText: {
    opacity: 0.7,
    textAlign: "center",
  },
  confirmHeader: {
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  confirmTitle: {
    textAlign: "center",
  },
  confirmDetails: {
    gap: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  confirmLabel: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
    flex: 1,
  },
  confirmValue: {
    fontSize: 14,
    flex: 2,
    textAlign: "right",
  },
  confirmActions: {
    flexDirection: "row",
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  backConfirmButton: {
    borderWidth: 1,
  },
  backConfirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
