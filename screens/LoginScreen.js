import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!email.trim() || !senha) {
      Alert.alert("Atenção", "Preenche email e senha.");
      return;
    }
    setCarregando(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    } catch (e) {
      let msg = "Não deu pra entrar. Tenta de novo.";
      if (e.code === "auth/invalid-email") msg = "Email inválido.";
      if (e.code === "auth/user-not-found") msg = "Usuário não encontrado.";
      if (e.code === "auth/wrong-password") msg = "Senha errada.";
      if (e.code === "auth/invalid-credential") msg = "Email ou senha incorretos.";
      Alert.alert("Erro", msg);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.fundo}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.titulo}>Entrar</Text>
      <Text style={styles.sub}>Usa o mesmo email do cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        style={[styles.botao, carregando && { opacity: 0.6 }]}
        onPress={entrar}
        disabled={carregando}
      >
        <Text style={styles.botaoTxt}>{carregando ? "Entrando..." : "Entrar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
        <Text style={styles.link}>Não tem conta? Cadastra aí</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: "#f2f3f5",
    padding: 24,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a365d",
    marginBottom: 8,
  },
  sub: {
    color: "#64748b",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  botao: {
    backgroundColor: "#0d9488",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  botaoTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  link: {
    color: "#2563eb",
    textAlign: "center",
    marginTop: 20,
    fontSize: 15,
  },
});
