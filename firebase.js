import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyC4nmNUBn5Had70mTG6pLa9MuIDtk9xPm0",
  authDomain: "atividade06-fe6fa.firebaseapp.com",
  projectId: "atividade06-fe6fa",
  storageBucket: "atividade06-fe6fa.firebasestorage.app",
  messagingSenderId: "864912959558",
  appId: "1:864912959558:web:4ef73be03247fa23b80247",
};

const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  // No mobile, persiste sessão no AsyncStorage.
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(app);
  }
}

export { auth };
export default app;
