import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "./Collector/Login";
import HomeScreen from "./Collector/HomeScreen";
import QRScannerScreen from "./Collector/QRScannerScreen";
import BinDataScreen from "./Collector/BinDataScreen";
import ProfileScreen from "./Collector/ProfileScreen";
import Toast from "react-native-toast-message";
import { LogBox } from 'react-native';
import CollectedHistoryScreen from "./Collector/history"

  
// Ignore specific warning messages
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state.',
]);


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "QRScanner") {
            iconName = focused ? "qr-code" : "qr-code-outline";
           } else if (route.name === "History") {
              iconName = focused ? "time" : "time-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="QRScanner"
        component={QRScannerScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="History"
        component={CollectedHistoryScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen
          name="BinData"
          component={BinDataScreen}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />

    </NavigationContainer>
  );
}
LogBox.ignoreAllLogs(true);
