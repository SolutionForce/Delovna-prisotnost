import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { StyleSheet, View, Text } from "react-native";
import Home from "../Home/Home";
import ScanQRCode from "../ScanQRCode/ScanQRCode";
import Tabela from "../Tabela/Tabela";
import Colors from "../Colors/Colors";

const Tab = createBottomTabNavigator();

const Header = ({ title }: { title: string }) => (
  <View style={styles.header}>
    <Text style={styles.headerText}>{title}</Text>
  </View>
);

const BottomTabs = ({ uid }: { uid: string }) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors.tabBarActiveTintColor,
        tabBarBadgeStyle: { backgroundColor: Colors.tabBarBadgeStyle },
        tabBarActiveBackgroundColor: Colors.PURPLE,
        tabBarInactiveBackgroundColor: Colors.PURPLE,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={{ uid }}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          header: () => <Header title="Home" />,
        }}
      />
      <Tab.Screen
        name="Check in"
        component={ScanQRCode}
        options={{
          tabBarLabel: "Check in",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="camera" color={color} size={size} />
          ),
          header: () => <Header title="Check in" />,
        }}
      />
      <Tab.Screen
        name="History"
        component={Tabela}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="table" size={size} color={color} />
          ),
          header: () => <Header title="History" />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.PURPLE,
    height: 60,
    borderTopWidth: 0,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    margin: 0,
    padding: 0,
    color: Colors.WHITE,
  },
  tabBarIcon: {
    marginBottom: -3,
  },
  header: {
    backgroundColor: Colors.PURPLE,
    padding: 15,
    alignItems: "center",
    paddingTop: 40,
  },
  headerText: {
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default BottomTabs;
