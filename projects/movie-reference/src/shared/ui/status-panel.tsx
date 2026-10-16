import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { colors } from "@/shared/ui/theme";

type Props = {
  title: string;
  message?: string;
  loading?: boolean;
  onRetry?: () => void;
};
export function StatusPanel({ title, message, loading, onRetry }: Props) {
  return (
    <View
      accessibilityLiveRegion="polite"
      style={{ padding: 32, gap: 14, alignItems: "center" }}
    >
      {loading && <ActivityIndicator color={colors.accent} />}
      <Text
        selectable
        style={{
          color: colors.text,
          fontSize: 20,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      {message && (
        <Text
          selectable
          style={{ color: colors.muted, textAlign: "center", lineHeight: 23 }}
        >
          {message}
        </Text>
      )}
      {onRetry && (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={{
            backgroundColor: colors.accent,
            padding: 14,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: colors.background, fontWeight: "700" }}>
            Try again
          </Text>
        </Pressable>
      )}
    </View>
  );
}
