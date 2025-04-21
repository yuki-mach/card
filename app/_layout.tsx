import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AppProvider, useAppContext } from './context/AppContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppProvider>
      <RootLayoutNavigation colorScheme={colorScheme} />
    </AppProvider>
  );
}

interface RootLayoutNavigationProps {
  colorScheme: 'light' | 'dark' | null | undefined; // <-- Allow null or undefined
}

function RootLayoutNavigation({ colorScheme }: RootLayoutNavigationProps) {
  const { isFirstLaunch } = useAppContext();
  
  // Wait until we know if it's first launch
  if (isFirstLaunch === null) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isFirstLaunch ? (
        // If it's the first launch, redirect to welcome screen
        <Redirect href="/welcome" />
      ) : (
        // Otherwise, show the stack with tabs as initial screen
        <Stack>
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="welcome" 
            options={{ 
              headerShown: false,
              presentation: 'modal' 
            }} 
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      )}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}