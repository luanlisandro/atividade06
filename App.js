import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

import { auth } from "./firebase";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import CotacaoScreen from "./screens/CotacaoScreen";

const Tab = createBottomTabNavigator();

function TelasLogin() {
  const [telaAuth, setTelaAuth] = useState("Login");

  if (telaAuth === "Cadastro") {
    return <RegisterScreen onGoToLogin={() => setTelaAuth("Login")} />;
  }

  return (
    <LoginScreen onGoToRegister={() => setTelaAuth("Cadastro")} />
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
