import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function LoginScreen({ navigation, onGoToRegister }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);

  function mostrarMensagem(texto, isErro = false) {
    setMensagem(texto);
    setErro(isErro);
    if (Platform.OS !== "web") {
      Alert.alert(isErro ? "Erro" : "Aviso", texto);
    }
  }

  async function entrar() {
    if (!email.trim() || !senha) {
      mostrarMensagem("Preenche email e senha.", true);
      return;
    }
    setMensagem("Tentando entrar...");
    setErro(false);
    setCarregando(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
      setMensagem("Login realizado com sucesso.");
      setErro(false);
    } catch (e) {
      let msg = "Não deu pra entrar. Tenta de novo.";
      if (e.code === "auth/invalid-email") msg = "Email inválido.";
      if (e.code === "auth/user-not-found") msg = "Usuário não encontrado.";
      if (e.code === "auth/wrong-password") msg = "Senha errada.";
      if (e.code === "auth/invalid-credential") msg = "Email ou senha incorretos.";
      if (e.code === "auth/configuration-not-found") msg = "Ative o login por Email/Senha no Firebase Console.";
      if (e.code === "auth/network-request-failed") msg = "Falha de rede. Verifique sua internet.";
      console.error("Erro no login:", e);
      mostrarMensagem(msg, true);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.fundo}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.headerAzul}>
        <Text style={styles.titulo}>Cotação de Moedas</Text>
        <Text style={styles.sub}>Entre para acompanhar as cotações em tempo real</Text>
      </View>

      <View style={styles.cardForm}>
        {!!mensagem && (
          <Text style={[styles.msg, erro ? styles.msgErro : styles.msgOk]}>
            {mensagem}
          </Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94a3b8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Pressable
          style={({ pressed }) => [
            styles.botao,
            carregando && { opacity: 0.6 },
            pressed && { opacity: 0.85 },
          ]}
          onPress={entrar}
          disabled={carregando}
        >
          <Text style={styles.botaoTxt}>{carregando ? "Entrando..." : "Entrar"}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          onPress={() => {
            if (onGoToRegister) {
              onGoToRegister();
              return;
            }
            navigation?.push?.("Cadastro");
          }}
        >
          <Text style={styles.link}>Não tem conta? Cadastra aí</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: "#f2f4f8",
  },
  headerAzul: {
    backgroundColor: "#1a2f57",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 60,
    paddingHorizontal: 22,
    paddingBottom: 34,
  },
  titulo: {
    fontSize: 30,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  sub: {
    color: "#dbe4f2",
    fontSize: 14,
    lineHeight: 20,
  },
  cardForm: {
    marginTop: -20,
    marginHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  msg: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "600",
  },
  msgErro: {
    color: "#b91c1c",
  },
  msgOk: {
    color: "#0f766e",
  },
  botao: {
    backgroundColor: "#14b8a6",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 8,
    cursor: "pointer",
  },
  botaoTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  link: {
    color: "#2563eb",
    textAlign: "center",
    marginTop: 16,
    fontSize: 15,
    fontWeight: "600",
    cursor: "pointer",
  },
});
