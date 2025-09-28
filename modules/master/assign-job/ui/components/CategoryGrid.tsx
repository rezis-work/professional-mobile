import { ThemedText } from "@/components/themed-text";
import { Pressable, View } from "react-native";
import type { Category } from "../../types";

export function CategoryGrid({
  categories,
  onSelect,
}: {
  categories: Category[];
  onSelect: (category: Category) => void;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      {categories.map((category) => (
        <Pressable
          key={category.id}
          onPress={() => onSelect(category)}
          style={{
            width: "48%",
            backgroundColor: "white",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#e2e8f0",
            padding: 12,
          }}
        >
          <ThemedText type="subtitle">{category.name.en}</ThemedText>
          <ThemedText style={{ marginTop: 4 }}>{category.name.ka}</ThemedText>
          <ThemedText style={{ marginTop: 4 }}>{category.name.ru}</ThemedText>
          {typeof category.jobCount === "number" ? (
            <ThemedText style={{ marginTop: 6, color: "#2563eb" }}>
              {category.jobCount} jobs
            </ThemedText>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}
