// CameraComponent.tsx
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Text, View, Platform, Button } from 'react-native';
import { Camera, CameraType } from 'expo-camera'; // Import directly

// Define the interface for the methods exposed by the CameraComponent ref
export interface CameraRef {
  takePicture: () => Promise<{ uri: string; width: number; height: number; [key: string]: any } | null>;
}

// Web camera implementation (using from SimpleWebCamera.js)
const WebCamera = forwardRef<CameraRef, {}>((props, ref) => {
  // Just a placeholder component - actual implementation is in SimpleWebCamera.js
  useImperativeHandle(ref, () => ({
    takePicture: async () => {
      return null; // Will be handled by external controller
    }
  }));

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Text style={{ color: 'white', textAlign: 'center' }}>
        Web Camera Placeholder
      </Text>
    </View>
  );
});

// Native Camera component using expo-camera
const NativeCamera = forwardRef<CameraRef, {}>((props, ref) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const cameraRef = useRef<any>(null);

  const requestCameraPermission = async () => {
    console.log("Requesting camera permission...");
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      console.log("Permission status:", status);
      
      if (status !== 'granted') {
        setPermissionError("Permission not granted");
      }
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      setHasPermission(false);
      setPermissionError(error.toString());
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  useImperativeHandle(ref, () => ({
    takePicture: async () => {
      if (cameraRef.current) {
        try {
          const photo = await cameraRef.current.takePictureAsync();
          return photo;
        } catch (error) {
          console.error("Error taking picture:", error);
          return null;
        }
      }
      return null;
    },
  }));

  // Function to toggle between front and back camera
  const toggleCameraType = () => {
    setCameraType(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  // Show loading state while checking permissions
  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting camera permission...</Text>
        {permissionError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {permissionError}</Text>
          </View>
        )}
      </View>
    );
  }
  
  // No permission granted
  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text style={{marginBottom: 20}}>No access to camera</Text>
        {permissionError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error details: {permissionError}</Text>
          </View>
        )}
        <Button 
          title="Request Camera Permission" 
          onPress={requestCameraPermission} 
        />
        <Text style={{marginTop: 15, textAlign: 'center'}}>
          You can also enable camera access in your device settings:
          Settings → Privacy → Camera → Enable for this app
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera 
        style={styles.camera} 
        type={cameraType}
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <Button 
            title="Flip Camera" 
            onPress={toggleCameraType} 
            color="#fff" 
          />
        </View>
      </Camera>
    </View>
  );
});

// Main component that decides which camera to use based on platform
const CameraComponent = forwardRef<CameraRef, {}>((props, ref) => {
  // Use WebCamera for web, NativeCamera for native platforms
  return Platform.OS === 'web' 
    ? <WebCamera ref={ref} /> 
    : <NativeCamera ref={ref} />;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
    height: 400, // Fixed height for better layout consistency
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  errorContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#ffeeee',
    borderRadius: 5,
    width: '100%',
  },
  errorText: {
    color: 'red',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  }
});

export default CameraComponent;