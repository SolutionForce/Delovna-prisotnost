/* 
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text } from 'react-native';
import { Theme } from 'tamagui'
import Weather from '../Weather/Weather';
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "tamagui";
import {
  H1,
  Paragraph,
  View,
  YStack
} from "tamagui";
import { getUsers } from '../../services/api/api';
const Home = () => {

  const [users, setUsers] = useState<any>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Theme name="blue">
      <SafeAreaView style={styles.container}>
      <MySafeAreaView>
      <MyStack>
        <YStack
          space="$4"
          maxWidth={600}
          alignItems="center"
        >
          <H1 textAlign="center">
            Welcome back, &nbsp;
            {users && users.length > 0 && users[0].name && (
                  <Text>{`${users[0].name}`}</Text>            )}
            </H1>
            <View style={{ marginTop: 10 }}>
                <Weather />
              </View>
        </YStack>
      </MyStack>
    </MySafeAreaView>

       </SafeAreaView>
  </Theme>
  );
};



export const MySafeAreaView = styled(SafeAreaView, {
  name: "MySafeAreaView",
  flex: 1,
  backgroundColor: "$backgroundStrong"
});
export const MyStack = styled(YStack, {
    name: "MyStack",
    backgroundColor: "$backgroundStrong",
    flex: 1,
    justifyContent: "space-between",
    padding: "$4",
    space: "$true"
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});



export default Home; */
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { TamaguiProvider, Theme } from 'tamagui';
import config from '../../tamagui.config'; // Adjust the import path as needed
import { auth } from '../../services/api/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <TamaguiProvider config={config}>
      <Theme name="blue">
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Login" onPress={handleLogin} />
        </View>
      </Theme>
    </TamaguiProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});

export default Login;
