import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { RootNavigator } from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular: require('./assets/fonts/Montserrat_400Regular.ttf'),
    Montserrat_500Medium: require('./assets/fonts/Montserrat_500Medium.ttf'),
    Montserrat_600SemiBold: require('./assets/fonts/Montserrat_600SemiBold.ttf'),
    Montserrat_700Bold: require('./assets/fonts/Montserrat_700Bold.ttf'),
    Poppins_400Regular: require('./assets/fonts/Poppins_400Regular.ttf'),
    Poppins_500Medium: require('./assets/fonts/Poppins_500Medium.ttf'),
    Poppins_600SemiBold: require('./assets/fonts/Poppins_600SemiBold.ttf'),
    Poppins_700Bold: require('./assets/fonts/Poppins_700Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider config={config}>
        <RootNavigator />
        <StatusBar style="auto" />
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
