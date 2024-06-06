import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";



function Register() {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Sorry, we need camera permissions to make this work!");
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    if (!result.cancelled && result.assets) {
      const imageInfo = result.assets[0];
      console.log(imageInfo)
      setImage(imageInfo); // Save the image info to state
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      if (image) {
        // The image state now has the full object including the URI
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
      console.log(formData["_parts"][1]);
      // When testing ensure you're using the correct server address
      const response = await axios.post(
        `${process.env.BASE_URL}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("This is the response from the server");
      console.log(response);
      navigation.navigate("Login");
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Muzan Bank</Text>
      <Text style={styles.subtitle}>Register here</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Take Photo" onPress={pickImage} />
      {image && (
        <Text style={styles.title}>Photo Taken</Text>
      )}
      <Button
        title={isLoading ? "Registering..." : "Register"}
        onPress={handleSubmit}
        disabled={isLoading}
      />

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    alignSelf: "center",
    padding: 20,
    marginTop: 50,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    textAlign: "center",
    color: "#007bff",
    marginBottom: 20,
    fontSize: 30,
  },
  subtitle: {
    textAlign: "center",
    color: "#007bff",
    marginBottom: 20,
    fontSize: 20,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  // Add more styles as needed
});

export default Register;
