import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Text } from 'tamagui';
import { auth } from '../../services/api/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    console .log('login', email, password)
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text fontSize={24} fontWeight="bold" marginBottom={20}>Login</Text>
      {error ? <Text color="red" marginBottom={10}>{error}</Text> : null}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 20, width: '100%' }}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 20, width: '100%' }}
      />
      <Button onPress={handleLogin} width="100%" backgroundColor="blue" color="white">Login</Button>
    </View>
  );
};

export default Login;
