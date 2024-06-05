//import '@tamagui/core/reset.css' // To ne sme biti, drugače native ne dela (je samo za web)
import { TamaguiProvider, Theme } from 'tamagui';
import config from './tamagui.config';
import Inicialization from './components/Inicialization/Inicialization';
import React, { useState, useEffect } from 'react';
import NavigationContainerComponent from './navigation/Navigation';
import { LogBox, View } from 'react-native';
import Login from './components/Login/Login';
import { auth } from './services/api/firebaseConfig'; // Ensure the path is correct
import { onAuthStateChanged } from 'firebase/auth'; // Ensure this is imported from the correct Firebase package

LogBox.ignoreLogs([`fontFamily "Inter`]); // Hide warnings

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return () => subscriber(); // Unsubscribe on unmount
  }, [initializing]);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <Login />
      </View>
    );
  }

  return (
    <TamaguiProvider config={config}>
      <Inicialization />
      <Theme name="blue">
        <NavigationContainerComponent />
      </Theme>
    </TamaguiProvider>
  );
}
