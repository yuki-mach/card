import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppContextType {
  isFirstLaunch: boolean | null;
}

// Initialize with a default value that matches the type or undefined
const AppContext = createContext<AppContextType | undefined>(undefined); // Changed to allow undefined initially

interface AppProviderProps {
  children: ReactNode;
}

// Define the component (without 'export' here initially)
function AppProvider({ children }: AppProviderProps) {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if this is the first launch
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');

        if (hasLaunched === null) {
          // First time launching the app
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('hasLaunched', 'true');
        } else {
          // Not first launch
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
        // Default to not showing welcome in case of error
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  // Optional: You might want to render null or a loading indicator while isFirstLaunch is null
  // if you don't want the rest of your app to render until this is determined.
  // For example: if (isFirstLaunch === null) return null;

  return (
    <AppContext.Provider value={{ isFirstLaunch }}>
      {children}
    </AppContext.Provider>
  );
}

// --- Export the AppProvider component as the DEFAULT export ---
export default AppProvider; // <-- ADD THIS LINE

// --- Export the useAppContext hook as a NAMED export (which is fine) ---
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  // Add a check for undefined, as the context can be undefined if used outside the provider
  if (context === undefined) {
      throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}