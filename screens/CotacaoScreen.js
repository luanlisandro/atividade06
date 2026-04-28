import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const API_URL = "https://economia.awesomeapi.com.br/json/all";

function parseNumero(str) {
  const n = parseFloat(String(str).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function BandeirasPar({ esquerda, direita }) {
  return (
    <View style={styles.flagWrap}>
      <View style={[styles.flagCirculo, { left: 0, zIndex: 2 }]}>
        <Text style={styles.flagEmoji}>{esquerda}</Text>
      </View>
      <View style={[styles.flagCirculo, { left: 26, zIndex: 1 }]}>
        <Text style={styles.flagEmoji}>{direita}</Text>
      </View>
    </View>
  );
}

export default function CotacaoScreen() {
  const insets = useSafeAreaInsets();
  const [usd, setUsd] = useState(null);
  const [eur, setEur] = useState(null);
  const [ultima, setUltima] = useState("");
  const [carregando, setCarregando] = useState(true);

  const buscar = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const u = data.USD;
      const e = data.EUR;
      if (!u || !e) throw new Error("faltou USD ou EUR na resposta");
      setUsd(u);
      setEur(e);
     
      setUltima(u.create_date || "");
    } catch (err) {
      console.error(err);
      const detalhe = err?.message ? `\n\n(${err.message})` : "";
      Alert.alert(
        "Erro ao obter cotações",
        "Não foi possível carregar os dados. Verifique sua conexão com a internet e tente novamente." + detalhe
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscar();
  }, [buscar]);

  function linhaVariacao(pctChangeStr) {
    const v = parseNumero(pctChangeStr);
    const positivo = v >= 0;
    const cor = positivo ? "#16a34a" : "#dc2626";
    const seta = positivo ? "▲" : "▼";
    const texto = `${Math.abs(v).toFixed(2)}%`;
    return (
      <Text style={[styles.variacao, { color: cor }]}>
        {seta} {texto}
      </Text>
    );
  }

  function cardMoeda(item) {
    const { api, codigoPar, tituloUnidade, bandEsq, bandDir } = item;
    if (!api) return null;
    const valor = parseNumero(api.bid);
    return (
      <View style={styles.cardMoeda} key={codigoPar}>
        <BandeirasPar esquerda={bandEsq} direita={bandDir} />
        <View style={styles.cardMeio}>
          <Text style={styles.paridade}>{codigoPar}</Text>
          <Text style={styles.unidade}>{tituloUnidade}</Text>
        </View>
        <View style={styles.cardDir}>
          <Text style={styles.valorBrl}>
            R$ {valor.toFixed(2).replace(".", ",")}
          </Text>
          {linhaVariacao(api.pctChange)}
        </View>
      </View>
    );
  }

  const itens = [
    {
      api: usd,
      codigoPar: "USD / BRL",
      tituloUnidade: "1 Dólar Americano",
      bandEsq: "🇺🇸",
      bandDir: "🇧🇷",
    },
    {
      api: eur,
      codigoPar: "EUR / BRL",
      tituloUnidade: "1 Euro",
      bandEsq: "🇪🇺",
      bandDir: "🇧🇷",
    },
  ];

  return (
    <View style={styles.root}>
      <View style={[styles.headerAzul, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerLado} onPress={() => signOut(auth)} hitSlop={12}>
            <Text style={styles.sair}>Sair</Text>
          </TouchableOpacity>
          <Text style={styles.tituloApp}>Cotação de Moedas</Text>
          <View style={styles.headerLado} />
        </View>
      </View>

      <View style={styles.cardStatusWrap}>
        <View style={styles.cardStatus}>
          <Text style={styles.statusTitulo}>Cotação atual</Text>
          <Text style={styles.statusSub}>
            Última atualização: {ultima || "—"}
          </Text>
          {carregando && (
            <ActivityIndicator style={{ marginTop: 8 }} color="#0d9488" />
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!carregando &&
          itens.map((it) => cardMoeda(it))}
      </ScrollView>

      <View style={[styles.rodapeBtn, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={[styles.btnAtualizar, carregando && { opacity: 0.7 }]}
          onPress={buscar}
          disabled={carregando}
        >
          <Text style={styles.btnAtualizarTxt}>
            {carregando ? "Atualizando..." : "Atualizar Cotações"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#eef0f4",
  },
  headerAzul: {
    backgroundColor: "#1e3a5f",
    paddingBottom: 48,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  headerLado: {
    width: 56,
  },
  tituloApp: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  sair: {
    color: "#cbd5e1",
    fontSize: 14,
  },
  cardStatusWrap: {
    marginTop: -36,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  cardStatus: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  statusTitulo: {
    fontWeight: "700",
    fontSize: 17,
    color: "#0f172a",
  },
  statusSub: {
    marginTop: 6,
    color: "#64748b",
    fontSize: 14,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  cardMoeda: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  flagWrap: {
    width: 70,
    height: 40,
    marginRight: 8,
  },
  flagCirculo: {
    position: "absolute",
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  flagEmoji: {
    fontSize: 22,
  },
  cardMeio: {
    flex: 1,
    justifyContent: "center",
  },
  paridade: {
    fontWeight: "700",
    fontSize: 16,
    color: "#0f172a",
  },
  unidade: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 13,
  },
  cardDir: {
    alignItems: "flex-end",
  },
  valorBrl: {
    fontWeight: "700",
    fontSize: 17,
    color: "#0f172a",
  },
  variacao: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
  },
  rodapeBtn: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: "#eef0f4",
  },
  btnAtualizar: {
    backgroundColor: "#14b8a6",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  btnAtualizarTxt: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
