import React from "react";
import { View, Text, StyleSheet } from "react-native";

// segunda aba da barra inferior — só pra bater com o layout do professor
export default function ConverterPlaceholderScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.txt}>Conversor</Text>
      <Text style={styles.sub}>Aqui podia ter outra tela, mas na atividade o foco é a cotação mesmo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#f2f3f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  txt: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a365d",
    marginBottom: 8,
  },
  sub: {
    color: "#64748b",
    textAlign: "center",
  },
});
