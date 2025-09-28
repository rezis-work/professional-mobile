import { ThemedText } from "@/components/themed-text";
import { Pressable, TextInput, View } from "react-native";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { Controller, type Control } from "react-hook-form";

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
  return (
    <View style={{ gap: 12 }}>
      <View style={{ gap: 6 }}>
        <ThemedText>Minimum Price</ThemedText>
        <Controller
          control={control}
          name="priceMin"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              keyboardType="numeric"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value !== undefined && value !== null ? String(value) : ""}
              placeholder="100"
              style={styles.input}
            />
          )}
        />
        {errors.priceMin?.message ? (
          <ThemedText style={{ color: "#ef4444" }}>
            {String(errors.priceMin.message)}
          </ThemedText>
        ) : null}
      </View>
      <View style={{ gap: 6 }}>
        <ThemedText>Maximum Price</ThemedText>
        <Controller
          control={control}
          name="priceMax"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              keyboardType="numeric"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value !== undefined && value !== null ? String(value) : ""}
              placeholder="500"
              style={styles.input}
            />
          )}
        />
        {errors.priceMax?.message ? (
          <ThemedText style={{ color: "#ef4444" }}>
            {String(errors.priceMax.message)}
          </ThemedText>
        ) : null}
      </View>
      <View style={{ gap: 6 }}>
        <ThemedText>Duration (minutes)</ThemedText>
        <Controller
          control={control}
          name="durationMinutes"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              keyboardType="numeric"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value !== undefined && value !== null ? String(value) : ""}
              placeholder="60"
              style={styles.input}
            />
          )}
        />
        {errors.durationMinutes?.message ? (
          <ThemedText style={{ color: "#ef4444" }}>
            {String(errors.durationMinutes.message)}
          </ThemedText>
        ) : null}
      </View>
      <View style={{ gap: 6 }}>
        <ThemedText>Note</ThemedText>
        <TextInput
          {...(register("note") as any)}
          placeholder="Optional note"
          style={styles.input}
        />
        {errors.note?.message ? (
          <ThemedText style={{ color: "#ef4444" }}>
            {String(errors.note.message)}
          </ThemedText>
        ) : null}
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable
          onPress={onBack}
          style={[styles.button, { backgroundColor: "#e2e8f0" }]}
        >
          <ThemedText>Back</ThemedText>
        </Pressable>
        <Pressable
          onPress={handleSubmit(onSubmit)}
          style={[styles.button, { backgroundColor: "#16a34a" }]}
        >
          <ThemedText style={{ color: "white" }}>Next</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center" as const,
    borderRadius: 8,
  },
};
