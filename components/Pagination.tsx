import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";

interface PaginationProps {
  totalcount: number;
  limit: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  totalcount,
  limit,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalcount / limit);

  if (totalPages <= 1) return null;

  const windowSize = 3;
  const halfWindow = Math.floor(windowSize / 2);

  let startPage = Math.max(currentPage - halfWindow, 1);
  let endPage = startPage + windowSize - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - windowSize + 1, 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <View style={styles.container}>
      <View style={styles.paginationContainer}>
        {/* Previous Button */}
        <TouchableOpacity
          onPress={() => {
            if (currentPage > 1) {
              onPageChange(currentPage - 1);
            }
          }}
          disabled={currentPage === 1}
          style={[
            styles.button,
            styles.navButton,
            currentPage === 1 && styles.buttonDisabled,
          ]}
          activeOpacity={currentPage === 1 ? 1 : 0.7}
        >
          <ThemedText
            style={[
              styles.buttonText,
              currentPage === 1 && styles.buttonTextDisabled,
            ]}
          >
            Prev
          </ThemedText>
        </TouchableOpacity>

        {/* First page + ellipsis */}
        {startPage > 1 && (
          <>
            <TouchableOpacity
              onPress={() => onPageChange(1)}
              style={[styles.button, styles.pageButton]}
            >
              <ThemedText style={styles.buttonText}>1</ThemedText>
            </TouchableOpacity>
            {startPage > 2 && (
              <ThemedText style={styles.ellipsis}>...</ThemedText>
            )}
          </>
        )}

        {/* Page numbers */}
        {pages.map((page) => (
          <TouchableOpacity
            key={page}
            onPress={() => onPageChange(page)}
            style={[
              styles.button,
              styles.pageButton,
              page === currentPage && styles.pageButtonActive,
            ]}
          >
            <ThemedText
              style={[
                styles.buttonText,
                page === currentPage && styles.buttonTextActive,
              ]}
            >
              {page}
            </ThemedText>
          </TouchableOpacity>
        ))}

        {/* Last page + ellipsis */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <ThemedText style={styles.ellipsis}>...</ThemedText>
            )}
            <TouchableOpacity
              onPress={() => onPageChange(totalPages)}
              style={[styles.button, styles.pageButton]}
            >
              <ThemedText style={styles.buttonText}>{totalPages}</ThemedText>
            </TouchableOpacity>
          </>
        )}

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => {
            if (currentPage < totalPages) {
              onPageChange(currentPage + 1);
            }
          }}
          disabled={currentPage === totalPages}
          style={[
            styles.button,
            styles.navButton,
            currentPage === totalPages && styles.buttonDisabled,
          ]}
          activeOpacity={currentPage === totalPages ? 1 : 0.7}
        >
          <ThemedText
            style={[
              styles.buttonText,
              currentPage === totalPages && styles.buttonTextDisabled,
            ]}
          >
            Next
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  button: {
    minWidth: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  navButton: {
    paddingHorizontal: 12,
  },
  pageButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  pageButtonActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    color: "#64748b",
  },
  buttonTextActive: {
    color: "white",
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: "#94a3b8",
  },
  ellipsis: {
    paddingHorizontal: 4,
    fontSize: 14,
    color: "#94a3b8",
  },
});
