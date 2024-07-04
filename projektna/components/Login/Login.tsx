import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView, SafeAreaView } from "react-native";
import { Button, Input, Text } from "tamagui";
import { auth } from "../../services/api/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Colors from "../Colors/Colors";
import ResetUserPassword from "./ResetUserPassword/ResetUserPassword";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalModalVisible] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.absoluteTopRectangle} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Solution force</Text>
            <Image source={require("../../assets/Logo.png")} style={styles.logo} />
            <Text style={styles.title}>Login</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, styles.inputText]}
              placeholderTextColor={Colors.PURPLE}
            />
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={[styles.input, styles.inputText]}
              placeholderTextColor={Colors.PURPLE}
            />
            <Button
              scaleIcon={1.2}
              marginHorizontal="$2"
              theme="active"
              onPress={handleLogin}
              backgroundColor={Colors.PURPLE}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Login</Text>
            </Button>
            <Text style={styles.forgotPasswordText} onPress={() => setIsForgotPasswordModalModalVisible(true)}>Forgot password?</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      <ResetUserPassword 
        visible={isForgotPasswordModalVisible} 
        onClose={() => setIsForgotPasswordModalModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  absoluteTopRectangle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "9%",
    backgroundColor: Colors.WHITE,
    zIndex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: "9%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.PURPLE,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  input: {
    marginBottom: 20,
    width: "100%",
    borderColor: Colors.PURPLE,
    color: Colors.PURPLE,
  },
  inputText: {
    color: Colors.PURPLE,
  },
  button: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.WHITE,
  },
  forgotPasswordText: {
    alignSelf: "flex-end",
    marginTop: 10,
    color: Colors.PURPLE,
  }
});

export default Login;
