import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { ApiError } from "@/shared/api/http";
import { colors } from "@/shared/ui/theme";

export default function RootLayout() {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60_000,
            gcTime: 30 * 60_000,
            refetchOnWindowFocus: false,
            retry: (count, error) =>
              count < 1 &&
              !(
                error instanceof ApiError &&
                error.status !== undefined &&
                error.status < 500
              ),
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Frame" }} />
        <Stack.Screen name="movie/[id]" options={{ title: "Movie details" }} />
      </Stack>
    </QueryClientProvider>
  );
}
