import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { movieOptions } from "@/features/movies/hooks/movie-queries";
import { MoviePoster } from "@/features/movies/components/movie-poster";
import { StatusPanel } from "@/shared/ui/status-panel";
import { colors } from "@/shared/ui/theme";

export function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = typeof id === "string" && /^\d+$/.test(id) ? Number(id) : NaN;
  const valid = Number.isSafeInteger(movieId) && movieId > 0;
  const query = useQuery(movieOptions(movieId));
  const [linkError, setLinkError] = useState(false);
  const insets = useSafeAreaInsets();
  const movie = query.data;
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        paddingBottom: insets.bottom + 32,
        gap: 24,
        maxWidth: 760,
        width: "100%",
        alignSelf: "center",
      }}
    >
      <Stack.Screen options={{ title: movie?.title ?? "Movie details" }} />
      {!valid ? (
        <StatusPanel
          title="Invalid movie link"
          message="Go back and choose a movie from search."
        />
      ) : query.isPending ? (
        <StatusPanel title="Loading movie…" loading />
      ) : !movie && query.isError ? (
        <StatusPanel
          title="Could not load movie"
          message={query.error.message}
          onRetry={() => void query.refetch()}
        />
      ) : !movie ? (
        <StatusPanel
          title="Movie unavailable"
          message="This movie may no longer be available in the US store."
        />
      ) : (
        <>
          <View style={{ alignItems: "center", paddingVertical: 12 }}>
            <MoviePoster uri={movie.artwork} large />
          </View>
          <View style={{ gap: 12 }}>
            <Text
              style={{
                color: colors.accent,
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {movie.genre}
            </Text>
            <Text
              selectable
              style={{
                color: colors.text,
                fontSize: 32,
                fontWeight: "700",
                letterSpacing: -0.7,
              }}
            >
              {movie.title}
            </Text>
            <Text selectable style={{ color: colors.muted, lineHeight: 24 }}>
              {[
                movie.year,
                movie.runtimeMinutes && `${movie.runtimeMinutes} min`,
                movie.rating,
              ]
                .filter(Boolean)
                .join(" · ")}
            </Text>
            <Text selectable style={{ color: colors.text }}>
              By {movie.creator}
            </Text>
          </View>
          <View style={{ height: 1, backgroundColor: colors.border }} />
          <Text style={{ color: colors.text, fontSize: 21, fontWeight: "600" }}>
            The story
          </Text>
          <Text
            selectable
            style={{ color: colors.muted, fontSize: 16, lineHeight: 27 }}
          >
            {movie.synopsis}
          </Text>
          {movie.price !== undefined && movie.currency && (
            <Text selectable style={{ color: colors.text }}>
              Buy · {movie.currency} {movie.price.toFixed(2)}
            </Text>
          )}
          {movie.storeUrl && (
            <Pressable
              accessibilityRole="link"
              onPress={async () => {
                setLinkError(false);
                try {
                  await Linking.openURL(movie.storeUrl!);
                } catch {
                  setLinkError(true);
                }
              }}
              style={{
                backgroundColor: colors.accent,
                borderRadius: 16,
                padding: 18,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                View on Apple TV ↗
              </Text>
            </Pressable>
          )}
          {linkError && (
            <Text accessibilityRole="alert" style={{ color: colors.danger }}>
              Could not open the store. Please try again.
            </Text>
          )}
          {query.isError && (
            <StatusPanel
              title="Could not refresh movie"
              message={query.error.message}
              onRetry={() => void query.refetch()}
            />
          )}
          <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 20 }}>
            Movie information and artwork provided by iTunes. Availability and
            prices are for the US store.
          </Text>
        </>
      )}
    </ScrollView>
  );
}
