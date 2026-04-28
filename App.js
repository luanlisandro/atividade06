import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

import { auth } from "./firebase";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import CotacaoScreen from "./screens/CotacaoScreen";
import ConverterPlaceholderScreen from "./screens/ConverterPlaceholderScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TelasLogin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cadastro" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function TelasPrincipais() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1e3a5f",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#e2e8f0",
          paddingTop: 6,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="CotacoesTab"
        component={CotacaoScreen}
        options={{
          title: "Cotações",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ConverterTab"
        component={ConverterPlaceholderScreen}
        options={{
          title: "Conversor",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="swap-horizontal-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregandoAuth, setCarregandoAuth] = useState(true);

  useEffect(() => {
    const off = onAuthStateChanged(auth, (u) => {
      setUsuario(u);
      setCarregandoAuth(false);
    });
    return () => off();
  }, []);

  if (carregandoAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2f3f5" }}>
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {usuario ? <TelasPrincipais /> : <TelasLogin />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
