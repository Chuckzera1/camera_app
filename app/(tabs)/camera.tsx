import { useIsFocused } from "@react-navigation/native";
import { Camera, CameraType, FaceDetectionResult } from "expo-camera";
import {
  FaceDetectorClassifications,
  FaceDetectorLandmarks,
  FaceDetectorMode,
  FaceFeature,
} from "expo-face-detector";
import { ImageSourcePropType, StyleSheet, Text } from "react-native";
import { View } from "../../components/Themed";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import neutralEmoji from "../../assets/images/neutral.png";
import grinningEmoji from "../../assets/images/grinning.png";
import winkingEmoji from "../../assets/images/winking.png";

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

  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [emoji, setEmoji] = useState<ImageSourcePropType>(neutralEmoji);

  const faceValues = useSharedValue({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const getCorrectEmojiImage = (face: FaceFeature) => {
    if (face.smilingProbability && face.smilingProbability > 0.8)
      return grinningEmoji;
    if (
      face.leftEyeOpenProbability &&
      face.leftEyeOpenProbability < 0.5 &&
      face.rightEyeOpenProbability &&
      face.rightEyeOpenProbability > 0.5
    )
      return winkingEmoji;
    return neutralEmoji;
  };

  const handleFaceDetected = ({ faces }: FaceDetectionResult) => {
    const face = faces[0] as FaceFeature;
    if (face) {
      const { size, origin } = face.bounds;
      faceValues.value = {
        width: size.width,
        height: size.height,
        x: origin.x,
        y: origin.y + 300,
      };
      setFaceDetected(true);
      const correctEmoji = getCorrectEmojiImage(face);
      setEmoji(correctEmoji);
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
            <Animated.Image style={animatedStyle} source={emoji} />
          )}
          <Camera
            type={CameraType.front}
            style={{ flex: 1, width: "100%" }}
            onFacesDetected={handleFaceDetected}
            faceDetectorSettings={{
              mode: FaceDetectorMode.fast,
              detectLandmarks: FaceDetectorLandmarks.all,
              runClassifications: FaceDetectorClassifications.all,
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
