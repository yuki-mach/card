// WebCameraDebug.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';

const WebCameraDebug = () => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const log = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const checkCamera = async () => {
    log("Checking camera availability...");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        log("⛔ Camera API not available in this browser");
        setHasCamera(false);
        return;
      }

      log("📷 Camera API available, requesting permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      log(`✅ Camera permission granted. Tracks: ${stream.getVideoTracks().length}`);
      log(`📊 Track info: ${JSON.stringify(stream.getVideoTracks()[0].getSettings())}`);
      
      setHasCamera(true);
      setCameraStream(stream);
    } catch (err) {
      log(`❌ Camera error: ${err.message || "Unknown error"}`);
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => {
        log(`Stopping track: ${track.kind}`);
        track.stop();
      });
      setCameraStream(null);
      log("Camera stopped");
    }
  };

  // Clear log and reset
  const reset = () => {
    stopCamera();
    setDebugInfo([]);
    setHasCamera(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Web Camera Debug</Text>
      
      <View style={styles.buttonRow}>
        <Button 
          title="Check Camera" 
          onPress={checkCamera} 
          disabled={cameraStream !== null}
        />
        <Button 
          title="Stop Camera" 
          onPress={stopCamera}
          disabled={cameraStream === null} 
        />
        <Button 
          title="Reset" 
          onPress={reset} 
        />
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Camera Status: {
            hasCamera === null ? "Unknown" : 
            hasCamera ? "Available ✅" : "Unavailable ❌"
          }
        </Text>
      </View>
      
      <ScrollView style={styles.logContainer}>
        {debugInfo.map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
        {debugInfo.length === 0 && (
          <Text style={styles.placeholder}>Press "Check Camera" to start debugging</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statusContainer: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    padding: 8,
    borderRadius: 4,
  },
  logText: {
    color: '#0f0',
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 4,
  },
  placeholder: {
    color: '#aaa',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default WebCameraDebug;