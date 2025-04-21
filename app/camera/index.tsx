// HomeScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Image, StyleSheet, View, Button, Platform, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CameraComponent, { CameraRef } from '@/components/CameraComponent';
// Import the direct web camera implementation
import { initializeWebCamera } from '@/components/SimpleWebCamera';

export default function HomeScreen() {
  const cameraRef = useRef<CameraRef>(null);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const [isCameraView, setIsCameraView] = useState<boolean>(false);
  const [isWebCameraActive, setIsWebCameraActive] = useState<boolean>(false);
  // Store web camera controller
  const webCameraController = useRef<any>(null);

  // Initialize web camera when camera view becomes active
  useEffect(() => {
    if (Platform.OS === 'web' && isCameraView && !capturedPhotoUri) {
      // Delay slightly to ensure the DOM is ready
      setTimeout(() => {
        webCameraController.current = initializeWebCamera(
          'web-camera-container',
          (isActive) => setIsWebCameraActive(isActive)
        );
      }, 100);
    }
    
    // Cleanup when camera view is hidden
    return () => {
      if (Platform.OS === 'web' && webCameraController.current) {
        webCameraController.current.stopCamera();
      }
    };
  }, [isCameraView, capturedPhotoUri]);

  const handleTakePicture = async () => {
    if (Platform.OS === 'web' && webCameraController.current) {
      // Use direct web implementation
      const photo = await webCameraController.current.takePicture();
      if (photo) {
        setCapturedPhotoUri(photo.uri);
      }
    } else if (cameraRef.current) {
      // Use component ref for native platforms
      const photo = await cameraRef.current.takePicture();
      if (photo) {
        setCapturedPhotoUri(photo.uri);
      }
    }
  };

  const handleRetakePicture = () => {
    setCapturedPhotoUri(null);
  };

  const handleToggleCamera = () => {
    setIsCameraView(!isCameraView);
    setCapturedPhotoUri(null);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>

      {/* Button to show/hide camera */}
      <View style={styles.toggleButtonContainer}>
        <Button 
          title={isCameraView ? "Show Content" : "Open Camera"} 
          onPress={handleToggleCamera}
          color="#007BFF"
        />
      </View>

      {/* Main content area */}
      {isCameraView ? (
        // Camera View
        capturedPhotoUri ? (
          // Photo Preview
          <View style={styles.photoPreviewContainer}>
            <Image source={{ uri: capturedPhotoUri }} style={styles.photoPreview} />
            <Button title="Retake Photo" onPress={handleRetakePicture} />
          </View>
        ) : (
          // Camera
          <View style={styles.cameraAndButtonContainer}>
            {Platform.OS === 'web' ? (
              // Web Direct DOM implementation
              <View id="web-camera-container" style={styles.webCameraContainer} />
            ) : (
              // Native implementation
              <CameraComponent ref={cameraRef} />
            )}
            <View style={styles.takePhotoButtonContainer}>
              <Button 
                title="Take Photo" 
                onPress={handleTakePicture} 
                color="#007BFF"
                disabled={Platform.OS === 'web' && !isWebCameraActive}
              />
            </View>
          </View>
        )
      ) : (
        // Regular Content
        <>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Welcome!</ThemedText>
            <HelloWave />
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Step 1: Try it</ThemedText>
            <ThemedText>Tap the "Open Camera" button to use the camera functionality.</ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
            <ThemedText>This example shows how to use the Camera component with proper platform compatibility handling.</ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
            <ThemedText>Camera functionality works across platforms with different implementations for web and native.</ThemedText>
          </ThemedView>
        </>
      )}

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  toggleButtonContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  cameraAndButtonContainer: {
    height: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  webCameraContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    position: 'relative',
  },
  takePhotoButtonContainer: {
    position: 'absolute',
    bottom: 20,
    zIndex: 10,
  },
  photoPreviewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 400,
    marginBottom: 20,
  },
  photoPreview: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
});