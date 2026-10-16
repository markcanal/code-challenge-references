import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import type { Movie } from "@/features/movies/model/movie";
import { MoviePoster } from "@/features/movies/components/movie-poster";
import { colors } from "@/shared/ui/theme";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={{ pathname: "/movie/[id]", params: { id: movie.id.toString() } }}
      asChild
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${movie.title}`}
        style={({ pressed }) => ({
          flexDirection: "row",
          gap: 18,
          paddingVertical: 18,
          borderBottomWidth: 1,
          borderColor: colors.border,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <MoviePoster uri={movie.artwork} />
        <View style={{ flex: 1, gap: 8, justifyContent: "center" }}>
          <Text
            selectable
            style={{ color: colors.text, fontSize: 19, fontWeight: "600" }}
          >
            {movie.title}
          </Text>
          <Text
            style={{
              color: colors.accent,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {movie.genre}
          </Text>
          <Text style={{ color: colors.muted }}>
            {movie.year}
            {movie.runtimeMinutes ? ` · ${movie.runtimeMinutes} min` : ""}
          </Text>
        </View>
        <Text
          style={{ color: colors.accent, alignSelf: "center", fontSize: 24 }}
        >
          ›
        </Text>
      </Pressable>
    </Link>
  );
}
