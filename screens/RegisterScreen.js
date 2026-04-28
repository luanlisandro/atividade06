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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    if (!email.trim() || !senha) {
      Alert.alert("Atenção", "Preenche tudo.");
      return;
    }
    if (senha !== senha2) {
      Alert.alert("Atenção", "As senhas não batem.");
      return;
    }
    if (senha.length < 6) {
      Alert.alert("Atenção", "A senha precisa ter pelo menos 6 caracteres (é regra do Firebase).");
      return;
    }
    setCarregando(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), senha);
      // quando dá certo o onAuthStateChanged no App.js já manda pra tela principal
    } catch (e) {
      let msg = "Erro no cadastro.";
      if (e.code === "auth/email-already-in-use") msg = "Esse email já tá cadastrado.";
      if (e.code === "auth/invalid-email") msg = "Email inválido.";
      if (e.code === "auth/weak-password") msg = "Senha fraca demais.";
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
      <Text style={styles.titulo}>Cadastro</Text>
      <Text style={styles.sub}>Cria sua conta pra ver as cotações</Text>

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
        placeholder="Senha (mín. 6 caracteres)"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirma a senha"
        secureTextEntry
        value={senha2}
        onChangeText={setSenha2}
      />

      <TouchableOpacity
        style={[styles.botao, carregando && { opacity: 0.6 }]}
        onPress={cadastrar}
        disabled={carregando}
      >
        <Text style={styles.botaoTxt}>{carregando ? "Cadastrando..." : "Cadastrar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Já tenho conta</Text>
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
