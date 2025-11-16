import { Ionicons } from "@expo/vector-icons";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { Controller, type Control } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import type { Job } from "../../types";

export type JobAssignmentFormData = {
  priceMin: number;
  priceMax: number;
  durationMinutes?: number;
  note?: string;
};

export function AssignmentForm({
  onSubmit,
  register,
  errors,
  handleSubmit,
  control,
  selectedJob,
}: {
  onSubmit: (data: JobAssignmentFormData) => void;
  register: UseFormRegister<JobAssignmentFormData>;
  errors: FieldErrors<JobAssignmentFormData>;
  handleSubmit: UseFormHandleSubmit<JobAssignmentFormData>;
  control: Control<JobAssignmentFormData>;
  selectedJob?: Job;
}) {
  return (
    <View className="gap-5">
      {/* Selected Job Preview */}
      {selectedJob && (
        <View
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800 shadow-sm"
          style={{
            shadowColor: "#2563eb",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View className="flex-row items-center">
            <View className="bg-blue-600 dark:bg-blue-500 rounded-full p-3 mr-4 shadow-lg">
              <Ionicons name="briefcase" size={22} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1.5 uppercase tracking-wide">
                Selected Job
              </Text>
              <Text className="text-base font-bold text-text leading-5">
                {selectedJob.title.en}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Form Fields */}
      <View className="gap-4">
        <View className="gap-2">
          <View className="flex-row items-center mb-1">
            <Ionicons name="cash-outline" size={18} color="#64748b" />
            <Text className="text-base font-semibold text-text ml-2">
              Minimum Price
            </Text>
            <Text className="text-red-500 ml-1">*</Text>
          </View>
          <Controller
            control={control}
            name="priceMin"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                className={`border-2 rounded-xl p-4 ${
                  errors.priceMin
                    ? "border-red-500 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10"
                    : "border-input-border bg-input-background"
                }`}
              >
                <View className="flex-row items-center">
                  <Text className="text-lg text-gray-500 dark:text-gray-400 mr-2">
                    ₾
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={
                      value !== undefined && value !== null ? String(value) : ""
                    }
                    placeholder="100"
                    placeholderTextColor="#9ca3af"
                    className="flex-1 text-text text-base"
                  />
                </View>
              </View>
            )}
          />
          {errors.priceMin?.message ? (
            <View className="flex-row items-center mt-1">
              <Ionicons name="alert-circle" size={16} color="#ef4444" />
              <Text className="text-sm text-red-500 ml-1">
                {String(errors.priceMin.message)}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="gap-2">
          <View className="flex-row items-center mb-1">
            <Ionicons name="cash" size={18} color="#64748b" />
            <Text className="text-base font-semibold text-text ml-2">
              Maximum Price
            </Text>
            <Text className="text-red-500 ml-1">*</Text>
          </View>
          <Controller
            control={control}
            name="priceMax"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                className={`border-2 rounded-xl p-4 ${
                  errors.priceMax
                    ? "border-red-500 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10"
                    : "border-input-border bg-input-background"
                }`}
              >
                <View className="flex-row items-center">
                  <Text className="text-lg text-gray-500 dark:text-gray-400 mr-2">
                    ₾
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={
                      value !== undefined && value !== null ? String(value) : ""
                    }
                    placeholder="500"
                    placeholderTextColor="#9ca3af"
                    className="flex-1 text-text text-base"
                  />
                </View>
              </View>
            )}
          />
          {errors.priceMax?.message ? (
            <View className="flex-row items-center mt-1">
              <Ionicons name="alert-circle" size={16} color="#ef4444" />
              <Text className="text-sm text-red-500 ml-1">
                {String(errors.priceMax.message)}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="gap-2">
          <View className="flex-row items-center mb-1">
            <Ionicons name="time-outline" size={18} color="#64748b" />
            <Text className="text-base font-semibold text-text ml-2">
              Duration (minutes)
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              Optional
            </Text>
          </View>
          <Controller
            control={control}
            name="durationMinutes"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                className={`border-2 rounded-xl p-4 ${
                  errors.durationMinutes
                    ? "border-red-500 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10"
                    : "border-input-border bg-input-background"
                }`}
              >
                <TextInput
                  keyboardType="numeric"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={
                    value !== undefined && value !== null ? String(value) : ""
                  }
                  placeholder="60"
                  placeholderTextColor="#9ca3af"
                  className="text-text text-base"
                />
              </View>
            )}
          />
          {errors.durationMinutes?.message ? (
            <View className="flex-row items-center mt-1">
              <Ionicons name="alert-circle" size={16} color="#ef4444" />
              <Text className="text-sm text-red-500 ml-1">
                {String(errors.durationMinutes.message)}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="gap-2">
          <View className="flex-row items-center mb-1">
            <Ionicons name="document-text-outline" size={18} color="#64748b" />
            <Text className="text-base font-semibold text-text ml-2">Note</Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              Optional
            </Text>
          </View>
          <View
            className={`border rounded-xl ${
              errors.note
                ? "border-red-500 dark:border-red-500"
                : "border-input-border"
            } bg-input-background`}
          >
            <TextInput
              {...(register("note") as any)}
              placeholder="Add any additional notes or requirements..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              className="text-text text-base p-4"
              style={{ textAlignVertical: "top", minHeight: 100 }}
            />
          </View>
          {errors.note?.message ? (
            <View className="flex-row items-center mt-1">
              <Ionicons name="alert-circle" size={16} color="#ef4444" />
              <Text className="text-sm text-red-500 ml-1">
                {String(errors.note.message)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Action Button */}
      <View className="mt-4">
        <Pressable
          onPress={handleSubmit(onSubmit)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 py-5 items-center rounded-2xl flex-row justify-center active:opacity-80"
          style={{
            shadowColor: "#2563eb",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text className="text-base font-bold text-white mr-2">Continue</Text>
          <Ionicons name="arrow-forward" size={22} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
