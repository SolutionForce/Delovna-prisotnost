import { BarCodeScanningResult, Camera, CameraType } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, TouchableOpacity, View} from 'react-native';
import { Button as ButtonT, ScrollView, Text, XStack, YStack } from 'tamagui'
import ConfirmScan from './ConfirmScan/ConfirmScan';
import { useIsFocused } from '@react-navigation/native';
import Colors from '../Colors/Colors';


export default function ScanQRCode() {
  const [type, setType] = useState<CameraType>(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanned, setScanned] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<string>("");
  const isScreenFocused = useIsFocused();

  useEffect(() => {
    setScanned(false);
  }, [isScreenFocused])

  const handleBarCodeScanned = async (scanningResult: BarCodeScanningResult) => {
    if (scanned)
      return;
    
    //console.log("NEW code scanned");
    setScannedData(scanningResult.data);
    setScanned(true);
  };

  if (!permission) {
    // Camera permissions are still loading
    return <><View /></>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <>
        <View style={styles.container}>
          <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      </>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <>
      <View style={styles.container}>
        {!isScreenFocused &&
          <XStack space="$2" justifyContent="center" marginTop="$2"><Text style={styles.instructionText} >Camera is loading...</Text></XStack>
        }
        {isScreenFocused && !scanned && 
          <>
            <Camera style={styles.camera} 
              type={type} 
              onBarCodeScanned={handleBarCodeScanned}
            >
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                  <Text style={styles.text}>Flip Camera</Text>
                </TouchableOpacity>
              </View>
            </Camera>
            <XStack space="$2" justifyContent="center" marginTop="$2"><Text style={styles.instructionText} >Scan QR code</Text></XStack>
          </>
        }
        {scanned &&
          <ScrollView padding="$2" paddingTop="$2" space="$3" style={styles.background}>
            <YStack space="$2" justifyContent="center" paddingBottom="$11">
              <XStack space="$2" justifyContent="center" marginTop="$2"><ButtonT  style = {styles.gumb}theme='gray' onPress={() => {setScanned(false)}}>Scan again</ButtonT><Text style={styles.Text}>Successfully scanned</Text></XStack>
              <ConfirmScan scannedData={scannedData} />
            </YStack>
          </ScrollView>
        }
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    justifyContent: 'center',
    padding: 0,
    margin: 0,
  },
  camera: {
    //flex: 1,
    aspectRatio: 1,
    padding: 0,
    margin: 0
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 15,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  instructionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50
  },
  gumb: {
    borderRadius: 50,
    backgroundColor:Colors.PURPLE,
  },
  Text: {
    marginTop: 15,
    fontSize: 10,
    color: Colors.BLACK,
  },
  background: {
    backgroundColor: "#FFFFFF",
  }
});
