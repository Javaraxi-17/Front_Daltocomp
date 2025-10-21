import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Toaster } from 'sonner-native';
import HomeScreen from "./screens/HomeScreen"
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import DaltonismTestScreen from "./screens/DaltonismTestScreen";
import { ThemeProvider } from './hooks/ThemeProvider';
import { AuthProvider, useAuth } from './hooks/useAuth';
import WelcomeScreen from './screens/WelcomeScreen';
import LoadingScreen from './screens/LoadingScreen';
import D15TestScreen from './screens/D15TestScreen';
import ColorDetectIntroScreen from './screens/ColorDetectIntroScreen';
import CameraToolScreen from './screens/CameraToolScreen';

const Stack = createNativeStackNavigator();

function RootStack() {
  const { isLoading, isAuthenticated, isNewUser } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Determinar la ruta inicial
  let initialRoute = "Welcome";
  if (isAuthenticated) {
    initialRoute = isNewUser ? "D15Test" : "Home";
  }

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }} initialRouteName={initialRoute}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="DaltonismTest" component={DaltonismTestScreen} />
      <Stack.Screen name="D15Test" component={D15TestScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ColorDetectIntro" component={ColorDetectIntroScreen} />
      <Stack.Screen name="CameraTool" component={CameraToolScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <AuthProvider>
        <ThemeProvider>
          <Toaster />
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none"
  }
});