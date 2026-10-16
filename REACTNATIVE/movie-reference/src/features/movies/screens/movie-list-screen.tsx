import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMovies } from "@/features/movies/hooks/movie-queries";
import { MovieCard } from "@/features/movies/components/movie-card";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { StatusPanel } from "@/shared/ui/status-panel";
import { colors } from "@/shared/ui/theme";

export function MovieListScreen() {
  const [input, setInput] = useState("Batman");
  const term = input.trim();
  const debounced = useDebouncedValue(term);
  const waiting = term !== debounced;
  const query = useMovies(debounced, !waiting);
  const insets = useSafeAreaInsets();
  const movies = !waiting && term.length >= 2 ? (query.data ?? []) : [];
  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={movies}
      keyExtractor={(movie) => movie.id.toString()}
      renderItem={({ item }) => <MovieCard movie={item} />}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingBottom: insets.bottom + 24,
        maxWidth: 760,
        width: "100%",
        alignSelf: "center",
        flexGrow: 1,
      }}
      ListHeaderComponent={
        <View style={{ gap: 18, paddingTop: 20, paddingBottom: 12 }}>
          <Text
            style={{
              color: colors.accent,
              letterSpacing: 3,
              fontSize: 11,
              fontWeight: "700",
            }}
          >
            THE MOVIE EDIT
          </Text>
          <Text
            selectable
            style={{
              color: colors.text,
              fontSize: 36,
              fontWeight: "700",
              letterSpacing: -1,
            }}
          >
            Find your next film.
          </Text>
          <Text style={{ color: colors.muted, lineHeight: 23 }}>
            Explore movies, one good search at a time.
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 16,
              backgroundColor: colors.surface,
              paddingHorizontal: 16,
            }}
          >
            <TextInput
              accessibilityLabel="Search movies"
              placeholder="Search movies, actors, directors…"
              placeholderTextColor={colors.muted}
              value={input}
              onChangeText={setInput}
              autoCorrect={false}
              returnKeyType="search"
              style={{
                flex: 1,
                color: colors.text,
                fontSize: 16,
                minHeight: 56,
              }}
            />
            {!!input && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                onPress={() => setInput("")}
                hitSlop={12}
              >
                <Text style={{ color: colors.muted, fontSize: 22 }}>×</Text>
              </Pressable>
            )}
          </View>
          <Text
            accessibilityLiveRegion="polite"
            style={{ color: colors.muted, fontSize: 12, letterSpacing: 1 }}
          >
            {movies.length
              ? `${movies.length} RESULTS · US STORE`
              : "POWERED BY ITUNES"}
          </Text>
          {query.isFetching && !!movies.length && (
            <ActivityIndicator color={colors.accent} />
          )}
          {query.isError && !!movies.length && (
            <StatusPanel
              title="Could not update results"
              message={query.error.message}
              onRetry={() => void query.refetch()}
            />
          )}
        </View>
      }
      ListEmptyComponent={
        term.length < 2 ? (
          <StatusPanel
            title="What are you in the mood for?"
            message="Enter at least two characters to search movies."
          />
        ) : waiting || query.isPending ? (
          <StatusPanel title="Finding your movies…" loading />
        ) : query.isError ? (
          <StatusPanel
            title="Could not load movies"
            message={query.error.message}
            onRetry={() => void query.refetch()}
          />
        ) : (
          <StatusPanel
            title="No movies found"
            message={`Try a different title, actor, or director for “${debounced}”.`}
          />
        )
      }
      ListFooterComponent={
        movies.length ? (
          <Text
            style={{
              color: colors.muted,
              paddingVertical: 24,
              textAlign: "center",
              fontSize: 12,
            }}
          >
            Up to 50 matches. Refine your search to discover more.
          </Text>
        ) : undefined
      }
    />
  );
}
