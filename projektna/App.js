import React, { useState, useEffect } from 'react';
import { TamaguiProvider, Theme } from 'tamagui';
import config from './tamagui.config';
import Inicialization from './components/Inicialization/Inicialization';
import NavigationContainerComponent from './navigation/Navigation';
import { LogBox, View } from 'react-native';
import Login from './components/Login/Login';
import { auth } from './services/api/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

LogBox.ignoreLogs([`fontFamily "Inter`]);

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
      console.log(user, 'user');
    });

    return () => subscriber();
  }, [initializing]);

  if (initializing) return null;

  if (!user) {
    return (
      <TamaguiProvider config={config}>
        <Theme name="light">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Login />
          </View>
        </Theme>
      </TamaguiProvider>
    );
  }

  return (
    <TamaguiProvider config={config}>
      <Inicialization />
      <Theme name="blue">
        <NavigationContainerComponent uid={user.uid} />
      </Theme>
    </TamaguiProvider>
  );
}
