import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleGetStarted = () => {
    // Navigate to the tabs screen and don't allow going back
    router.replace('/(tabs)');
  };

  // Define the image source
//   const logoSource: ImageSourcePropType = require('../assets/images/welcome-logo.png');

  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }
    ]}>
      <View style={styles.content}>
        {/* App logo/image */}
        <View style={styles.logoContainer}>
          {/* <Image
            // source={logoSource}
            style={styles.logo}
            resizeMode="contain"
          /> */}
        </View>

        {/* Welcome text */}
        <Text style={[
          styles.title,
          { color: colorScheme === 'dark' ? '#fff' : '#000' }
        ]}>
          Welcome to Your App
        </Text>
        
        <Text style={[
          styles.subtitle,
          { color: colorScheme === 'dark' ? '#ccc' : '#666' }
        ]}>
          Get started with your amazing new experience
        </Text>

        {/* Get started button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});