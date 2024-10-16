import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import SignInPage from "./User/Screens/SignIn";
import SignUpPage from "./User/Screens/SignUp";
import UserDetailsPage from "./User/Screens/Profile";

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  BinData: { binId: string };
};

export type MainTabParamList = {
  Home: undefined;
  QRScanner: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/*function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "QRScanner") {
            iconName = focused ? "qr-code" : "qr-code-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "alert-circle";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="QRScanner" component={QRScannerScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}*/

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignInPage"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="SignUpPage"
          component={SignUpPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignInPage"
          component={SignInPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserDetailsPage"
          component={UserDetailsPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}
