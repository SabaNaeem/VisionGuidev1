import React, { useRef } from 'react';
import { Camera } from 'expo-camera';
import { StyleSheet, View } from 'react-native';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYtZ9gcdxSteuVeAF8EA4ExSHLY9K6Nvo",
  authDomain: "vision-guide-416620.firebaseapp.com",
  projectId: "vision-guide-416620",
  storageBucket: "gs://vision-guide-416620.appspot.com",
  messagingSenderId: "317489971015",
  appId: "1:317489971015:web:0e6232ac71faae9f5c1662",
  measurementId: "G-GZH1HMYK8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default function CameraPage() {
  const cameraRef = useRef(null);

  async function handleScreenTouch() {
    if (cameraRef.current) {
      const { uri } = await cameraRef.current.recordAsync({ maxDuration: 10, quality: Camera.Constants.VideoQuality['480p'] });
      console.log(uri);
      console.log('Recording stopped');
      
      // Replace 'videos' with the path to the Firebase Storage directory where you want to store videos
      const storageRef = ref(storage, '/videos');
      const videoFileName = Date.now() + '.mp4';
      const videoRef = ref(storageRef, videoFileName);
      
      try {
        // Upload the recorded video file to Firebase Storage
        await uploadBytes(videoRef, uri);

        // Get the download URL of the uploaded video
        const downloadURL = await getDownloadURL(videoRef);
        console.log('Video URL:', downloadURL);
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  }

  return (
    <View style={styles.container} onTouchStart={handleScreenTouch}>
      <Camera ref={cameraRef} style={styles.camera} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    width: '100%', // Ensure the camera takes the full width
  },
});
