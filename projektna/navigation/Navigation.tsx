import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabs from '../components/BottomTabs/BottomTabs';
const Stack = createNativeStackNavigator();
const NavigationContainerComponent = () => {
  return (
    <NavigationContainer>
        <BottomTabs />
    </NavigationContainer>
  );
};

export default NavigationContainerComponent;
