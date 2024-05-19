import { ScrollView, TamaguiProvider, View } from 'tamagui'
import ScanQRCode from '../ScanQRCode/ScanQRCode';



const ScannerPage =  () => {
 
    
    return (
        <ScrollView padding="$2" paddingTop="$10" space="$3">
          <View paddingBottom="$11">
            <ScanQRCode />
          </View>
        </ScrollView>
    )

}