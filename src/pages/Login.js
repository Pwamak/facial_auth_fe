import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Camera, FlashMode } from "expo-camera/legacy";
import { Video } from "expo-av";

function Login() {
  const [username, setUsername] = useState("");
  const [heartRate, setHeartRate] = useState(0);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingHeartRate, setIsGettingHeartRate] = useState(false);
  const [hasHeartRate, setHasHeartRate] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();
  const [hasRecorded, setHasRecorded] = useState(false);
  const [flash, setFlash] = useState(FlashMode.off); // Initialize flashMode state

  let cameraRef = useRef();

  useEffect(() => {
    const getPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission =
        await Camera.requestMicrophonePermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
    };

    getPermissions();
  }, []);

  if (
    hasCameraPermission === undefined ||
    hasMicrophonePermission === undefined
  ) {
    return <Text>Requesting permissions</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted</Text>;
  }

  const navigation = useNavigation();

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets) {
      const imageInfo = result.assets[0];
      setImage(imageInfo);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("heart_rate", parseInt(heartRate));
      if (image) {
        const uriParts = image.uri.split("/");
        const fileName = uriParts[uriParts.length - 1];
        const fileType = image.mimeType || "image/jpeg";

        formData.append("image", {
          uri: image.uri,
          name: fileName,
          type: fileType,
        });
      }
      console.log(formData);
      const response = await axios.post(
        `${process.env.BASE_URL}/login`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(response.data);
      navigation.navigate("Home", { username: username });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecording = async () => {
    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
      setFlash(FlashMode.off);
    } else {
      setIsRecording(true);
      setFlash(FlashMode.torch); // Enable the flash when recording starts
      const video = await cameraRef.current?.recordAsync({
        quality: "1080p",
        maxDuration: 10,
      });
      console.log(video);
      setIsRecording(false);
      setVideo(video);
      setFlash(FlashMode.off); // Disable the flash when recording stops
      setHasRecorded(true);
    }
  };

  const getHeartRate = async () => {
    setIsGettingHeartRate(true);
    try {
      const formData = new FormData();

      if (video) {
        const uriParts = video.uri.split("/");
        const fileName = uriParts[uriParts.length - 1];
        const fileType = video.mimeType || "video/mp4";

        formData.append("video", {
          uri: video.uri,
          name: fileName,
          type: fileType,
        });
      }

      const response = await axios.post(
        `${process.env.BASE_URL}/get_heart_rate`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(response.data);
      setHeartRate(response.data.heart_rate);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGettingHeartRate(false);
      setHasHeartRate(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Muzan Bank</Text>
      <Text style={styles.subtitle}>Login here</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoCapitalize="none"
      />

      {!hasRecorded ? (
        <Camera
          ref={cameraRef}
          style={[styles.camera, { aspectRatio: 16 / 9 }]}
          flashMode={flash} // Use flashMode state variable
        >
          <View style={styles.buttonContainer}>
            <Button
              title={isRecording ? "Stop Recording" : "Record Video"}
              onPress={isRecording ? handleRecording : handleRecording}
            />
          </View>
        </Camera>
      ) : (
        <View></View>
      )}

      {video ? (
        <View>
          <Video
            style={styles.video}
            source={{ uri: video.uri }}
            resizeMode="contain"
            isLooping
          />
          <Button
            title={!hasHeartRate ? "Get heart rate" : ""}
            onPress={getHeartRate}
          />
        </View>
      ) : (
        <View>
          <Text>No video yet</Text>
        </View>
      )}

      {isGettingHeartRate ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TextInput
          style={styles.input}
          value={heartRate.toString()}
          placeholder="Heart rate"
          keyboardType="numeric"
          editable={false}
        />
      )}

      <Button title="Take Photo" onPress={pickImage} />
      {image && (
        <Text style={styles.title}>Photo Taken</Text>
      )}
      <Button
        title={isLoading ? "Logging in..." : "Login"}
        onPress={handleSubmit}
        disabled={isLoading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    color: "#007bff",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#007bff",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
    marginTop: 20,
  },
  video: {
    flex: 1,
    alignSelf: "stretch",
  },
});

export default Login;