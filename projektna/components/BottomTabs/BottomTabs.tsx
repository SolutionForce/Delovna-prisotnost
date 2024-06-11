import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../Home/Home';
import ScanQRCode from '../ScanQRCode/ScanQRCode';
import Tabela from '../Tabela/Tabela';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../Colors/Colors';
import React from 'react';

/* Tukaj importaj  */
const Tab = createBottomTabNavigator();


const BottomTabs = ({ uid }: { uid: string }) => {
    return (
        <Tab.Navigator
          initialRouteName="Feed"
          screenOptions={{
            tabBarActiveTintColor: Colors.tabBarActiveTintColor,
            tabBarBadgeStyle: { backgroundColor: Colors.tabBarBadgeStyle },
            tabBarActiveBackgroundColor: Colors.PURPLE,
            tabBarInactiveBackgroundColor: Colors.PURPLE,
            //Tukaj sem dodal da se skrije header
            headerShown: true,
          }}
        >

          <Tab.Screen
            name="Home"
            component={Home}
            initialParams={{ uid }}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Check in"
            component={ScanQRCode}
            options={{
              tabBarLabel: 'Check in',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="camera" color={color} size={size} />
              ),
            }}
          />
          
          <Tab.Screen name="History" component={Tabela}
          options={{
            tabBarLabel: 'History',
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="table" size={size} color={color} />
            )
          }}
        />
        </Tab.Navigator>
      );
}
export default BottomTabs;
