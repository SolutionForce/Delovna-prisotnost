//import '@tamagui/core/reset.css' //To ne sme biti, drugače native ne dela (je samo za web)
import {  TamaguiProvider, Theme } from 'tamagui'
import config from './tamagui.config'
import Inicialization from './components/Inicialization/Inicialization';
import NavigationContainerComponent from './navigation/Navigation';
import { LogBox } from 'react-native';


  export default function App() {
  LogBox.ignoreLogs([`fontFamily "Inter`]); //Hide warnings
  return (
    <TamaguiProvider config={config}>
      <Inicialization />
      <Theme name="blue">
        <NavigationContainerComponent />
      </Theme>
    </TamaguiProvider>
  );
}