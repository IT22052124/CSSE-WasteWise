import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import SignInPage from "./User/Screens/SignIn";
import SignUpPage from "./User/Screens/SignUp";
import UserDetailsPage from "./User/Screens/Profile";
import BinPurchasePage from "./User/Screens/PurchaseBin";
import PaymentPage from "./User/Screens/Payment";
import PaymentHistoryPage from "./User/Screens/PaymentHistory";
import BillHistory from "./User/Screens/Bill";
import MyBins from "./User/Screens/MyBins"
import "react-native-reanimated";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator({ route }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "PaymentPage") {
            iconName = focused ? "document" : "document-outline"; // Icon for company profile
          } else if (route.name === "UserDetailsPage") {
            iconName = focused ? "briefcase" : "briefcase-outline"; // Icon for posted jobs
          } else if (route.name === "BillHistory") {
            iconName = focused ? "briefcase" : "briefcase-outline"; // Icon for posted jobs
          } else if (route.name === "PaymentHistoryPage") {
            iconName = focused ? "document" : "document-outline"; // Icon for company profile
          }else if (route.name === "BinPurchasePage") {
            iconName = focused ? "document" : "document-outline"; // Icon for company profile
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Stack.Screen
        name="PaymentPage"
        component={MyBins}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentHistoryPage"
        component={PaymentHistoryPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BillHistory"
        component={BillHistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserDetailsPage"
        component={UserDetailsPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BinPurchasePage"
        component={BinPurchasePage}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs">
        <Stack.Screen
          name="SignUpPage"
          component={SignUpPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyBins"
          component={MyBins}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignInPage"
          component={SignInPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserDetailsPage"
          component={UserDetailsPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BinPurchasePage"
          component={BinPurchasePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentPage"
          component={PaymentPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentHistoryPage"
          component={PaymentHistoryPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BillHistory"
          component={BillHistory}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}
