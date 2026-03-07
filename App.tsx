import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GluestackUIProvider, Text, Box } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { RootNavigator } from './src/navigation';
import { StatusBar } from 'expo-status-bar';

// Set up React Query client
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider config={config}>
        <RootNavigator />
        <StatusBar style="auto" />
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
