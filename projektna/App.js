import { LogBox } from 'react-native';


  export default function App() {
  LogBox.ignoreLogs([`fontFamily "Inter`]); //Hide warnings
  return (
    <div>
      <h1>Pozdrav</h1>
    </div>
  );
}
