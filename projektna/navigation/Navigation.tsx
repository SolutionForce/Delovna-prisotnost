import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from '../components/BottomTabs/BottomTabs';

const NavigationContainerComponent = ({ uid }: { uid: string }) => {
  return (
    <NavigationContainer>
      <BottomTabs uid={uid} />
    </NavigationContainer>
  );
};

export default NavigationContainerComponent;
