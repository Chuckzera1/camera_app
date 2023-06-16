import { useIsFocused } from "@react-navigation/native";
import {
  Camera,
  CameraType,
  FaceDetectionResult,
  PermissionStatus,
} from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { StyleSheet, Text } from "react-native";
import { View } from "../../components/Themed";
import { useEffect } from "react";

export default function TabTwoScreen() {
  const isFocused = useIsFocused();

  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission?.granted) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff" }}>Focus: {isFocused}</Text>
      {isFocused && (
        <>
          <Camera
            type={CameraType.front}
            style={{ flex: 1, width: "100%" }}
            faceDetectorSettings={{
              mode: FaceDetector.FaceDetectorMode.fast,
              detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
              runClassifications: FaceDetector.FaceDetectorClassifications.none,
              minDetectionInterval: 100,
              tracking: true,
            }}
          ></Camera>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
