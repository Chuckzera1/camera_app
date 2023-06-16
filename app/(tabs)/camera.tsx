import { useIsFocused } from "@react-navigation/native";
import { Camera, CameraType, FaceDetectionResult } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { StyleSheet, Text } from "react-native";
import { View } from "../../components/Themed";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import winkingImg from "../../assets/images/winking.png";

interface FaceType {
  bounds: {
    size: {
      width: number;
      height: number;
    };
    origin: {
      x: number;
      y: number;
    };
  };
}

export default function TabTwoScreen() {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const faceValues = useSharedValue({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const handleFaceDetected = ({ faces }: FaceDetectionResult) => {
    const face = faces[0] as FaceType;
    if (face) {
      const { size, origin } = face.bounds;
      faceValues.value = {
        width: size.width,
        height: size.height,
        x: origin.x,
        y: origin.y,
      };
      setFaceDetected(true);
    } else {
      setFaceDetected(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    zIndex: 1,
    width: faceValues.value.width,
    height: faceValues.value.height,
    transform: [
      { translateX: faceValues.value.x },
      { translateY: faceValues.value.y },
    ],
  }));

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission?.granted) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <>
          {faceDetected && (
            <Animated.Image style={animatedStyle} source={winkingImg} />
          )}
          <Camera
            type={CameraType.front}
            style={{ flex: 1, width: "100%" }}
            onFacesDetected={handleFaceDetected}
            faceDetectorSettings={{
              mode: FaceDetector.FaceDetectorMode.fast,
              detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
              runClassifications: FaceDetector.FaceDetectorClassifications.all,
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
    flexGrow: 1,
  },
});
