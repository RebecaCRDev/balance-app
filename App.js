import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import DashboardScreen from "./src/screens/DashboardScreen";
import LoginScreen from "./src/screens/LoginScreen";

const Stack = createNativeStackNavigator();

function Navegacion() {
  const { token, cargando } = useAuth();

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#e8d5db" }}>
        <ActivityIndicator size="large" color="#b98a9b" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Navegacion />
    </AuthProvider>
  );
}
