import { ThemedText } from "@/components/themed-text";
import {
  TouchableOpacity,
  TextInput,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { Controller, type Control } from "react-hook-form";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export type JobAssignmentFormData = {
  priceMin: number;
  priceMax: number;
  durationMinutes?: number;
  note?: string;
};

export function AssignmentForm({
  onBack,
  onSubmit,
  register,
  errors,
  handleSubmit,
  control,
}: {
  onBack: () => void;
  onSubmit: (data: JobAssignmentFormData) => void;
  register: UseFormRegister<JobAssignmentFormData>;
  errors: FieldErrors<JobAssignmentFormData>;
  handleSubmit: UseFormHandleSubmit<JobAssignmentFormData>;
  control: Control<JobAssignmentFormData>;
}) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const borderColor = useThemeColor(
    { light: "#E5E7EB", dark: "#374151" },
    "text"
  );
  const errorBorderColor = "#EF4444";
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor(
    { light: "#9CA3AF", dark: "#6B7280" },
    "text"
  );
  const backgroundColor = useThemeColor(
    { light: "#F9FAFB", dark: "#111827" },
    "background"
  );
  const tint = useThemeColor(
    { light: "#3B82F6", dark: "#2563EB" },
    "tint"
  );

  const InputField = ({
    label,
    icon,
    name,
    placeholder,
    error,
    isNumeric = false,
    isMultiline = false,
  }: {
    label: string;
    icon: string;
    name: keyof JobAssignmentFormData;
    placeholder: string;
    error?: string;
    isNumeric?: boolean;
    isMultiline?: boolean;
  }) => (
    <View style={styles.fieldContainer}>
      <View style={styles.labelContainer}>
        <Ionicons name={icon as any} size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <ThemedText style={styles.label}>{label}</ThemedText>
      </View>
      {name === "note" ? (
        <TextInput
          {...(register(name) as any)}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          multiline={isMultiline}
          numberOfLines={isMultiline ? 4 : 1}
          textAlignVertical={isMultiline ? "top" : "center"}
          style={[
            styles.input,
            styles.multilineInput,
            { borderColor: error ? errorBorderColor : borderColor, backgroundColor, color: textColor },
            isDark && styles.inputDark,
          ]}
        />
      ) : (
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              keyboardType={isNumeric ? "numeric" : "default"}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value !== undefined && value !== null ? String(value) : ""}
              placeholder={placeholder}
              placeholderTextColor={placeholderColor}
              style={[
                styles.input,
                { borderColor: error ? errorBorderColor : borderColor, backgroundColor, color: textColor },
                isDark && styles.inputDark,
              ]}
            />
          )}
        />
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <InputField
        label="Minimum Price"
        icon="cash-outline"
        name="priceMin"
        placeholder="100"
        error={errors.priceMin?.message}
        isNumeric
      />
      <InputField
        label="Maximum Price"
        icon="cash"
        name="priceMax"
        placeholder="500"
        error={errors.priceMax?.message}
        isNumeric
      />
      <InputField
        label="Duration (minutes)"
        icon="time-outline"
        name="durationMinutes"
        placeholder="60"
        error={errors.durationMinutes?.message}
        isNumeric
      />
      <InputField
        label="Note (optional)"
        icon="document-text-outline"
        name="note"
        placeholder="Add any additional notes..."
        error={errors.note?.message}
        isMultiline
      />

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.button, styles.backButton]}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={18} color="#6B7280" />
          <ThemedText style={styles.backButtonText}>Back</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={[styles.button, { backgroundColor: tint }]}
          activeOpacity={0.7}
        >
          <ThemedText
            style={styles.nextButtonText}
            lightColor="#FFFFFF"
            darkColor="#FFFFFF"
          >
            Next
          </ThemedText>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  fieldContainer: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 16,
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
        paddingVertical: 0,
        textAlignVertical: "center",
      },
    }),
  },
  inputDark: {
    borderWidth: 1,
  },
  multilineInput: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
    ...Platform.select({
      android: {
        textAlignVertical: "top",
      },
    }),
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
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
  backButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  backButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
