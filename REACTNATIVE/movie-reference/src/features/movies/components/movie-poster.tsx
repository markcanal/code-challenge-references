import { useState } from "react";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { colors } from "@/shared/ui/theme";

export function MoviePoster({
  uri,
  large = false,
}: {
  uri?: string;
  large?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const width = large ? 164 : 78;
  return (
    <View
      style={{
        width,
        height: width * 1.5,
        backgroundColor: colors.surface,
        borderRadius: 12,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {uri && !failed ? (
        <Image
          source={uri}
          recyclingKey={uri}
          contentFit="cover"
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <Text style={{ color: colors.muted }}>NO ART</Text>
      )}
    </View>
  );
}
