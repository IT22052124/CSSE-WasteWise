import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { signInCollector } from '../controller/collectorController';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage


 
const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fadeAnim] = useState(new Animated.Value(0));

  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);


  

  const handleLogin = async () => {
    const response = await signInCollector(email, password);
//console.log(email)
    //console.log(password)
    if (response.success) {
      // Save user details to AsyncStorage
      try {
        await AsyncStorage.setItem("collector", JSON.stringify(response.collector));
      } catch (error) {
        console.error("Error saving user data: ", error);
      }

      Toast.show({
        type: "success",
        text1: "Welcome!",
        text2: `Hello, ${
        response.collector.email || "collector"
        }! Sign in successful.`,
      });
      navigation.navigate("MainTabs");
    } else {
      console.log(response)
      Toast.show({
        type: "error",
        text1: "Sign In Error",
        text2: response.message,
      });
    }
  };

  

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={100} // Adjust this offset based on your layout
  >

<ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled" // Allow taps while keyboard is open
      >

<Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Image source={require("../assets/loge.jpg")} style={styles.image} />
          <Text style={styles.header}>Welcome Back</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={24}
              color="#007AFF"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#a0a0a0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color="#007AFF"
              style={styles.icon}
            />

          <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#a0a0a0"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#4CAF50"
              />
            </TouchableOpacity>
          

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          </Animated.View>
          </ScrollView>
              </KeyboardAvoidingView>



     
    
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  eyeIcon: {
    padding: 4,
  },
  content: {
    alignItems: "center",
  },
  image: {
    width: width * 0.8,
    height: width * 0.6,
    resizeMode: "contain",
    marginBottom: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#007AFF",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    backgroundColor: "rgba(255,255,255,0.8)",
    textShadowRadius: 3,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333333",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
 
});
