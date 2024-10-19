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
import MyBins from "./User/Screens/MyBins";
import "react-native-reanimated";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator({ route }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Bins") {
            iconName = focused ? "trash" : "trash-outline"; // Trash icon for bins
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"; // Person icon for user profile
          } else if (route.name === "Bills") {
            iconName = focused ? "receipt" : "receipt-outline"; // Receipt icon for bill history
          } else if (route.name === "Payments") {
            iconName = focused ? "card" : "card-outline"; // Credit card icon for payment history
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Stack.Screen
        name="Bins"
        component={MyBins}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Bills"
        component={BillHistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Payments"
        component={PaymentHistoryPage}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Profile"
        component={UserDetailsPage}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignInPage">
        <Stack.Screen
          name="SignUpPage"
          component={SignUpPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Bins"
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
          name="Profile"
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
          name="Payments"
          component={PaymentHistoryPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Bills"
          component={BillHistory}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}
