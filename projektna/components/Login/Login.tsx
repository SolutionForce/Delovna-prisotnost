import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Button, Input, Text } from "tamagui";
import { auth } from "../../services/api/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Colors from "../Colors/Colors";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
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
      >
        <Text style={styles.buttonText}>Login</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 0,
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
  buttonText: {
    color: Colors.WHITE,
  },
});

export default Login;
