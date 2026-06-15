import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function Autenticacao() {
  // Simulação de um token que seria assinado pelo seu Backend/Supabase
  const [token, setToken] = useState("sige-token-" + Date.now());
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Em produção, aqui você buscaria um novo token no Supabase
          setToken("sige-token-" + Date.now());
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Autenticação</Text>
      <Text style={styles.subtitle}>Aproxime seu dispositivo do leitor</Text>

      <View style={styles.qrCard}>
        <QRCode
          value={token}
          size={220}
          backgroundColor="white"
          color="#003366" // Cor do logo SENAI
        />
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Código renova em</Text>
        <Text style={styles.timerValue}>{timer}s</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fe",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#1a1a1a", marginBottom: 8 },
  subtitle: {
    fontSize: 16,
    color: "#7a7a7a",
    marginBottom: 40,
    textAlign: "center",
  },
  qrCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  timerContainer: { marginTop: 40, alignItems: "center" },
  timerLabel: { fontSize: 14, color: "#999", marginBottom: 4 },
  timerValue: { fontSize: 24, fontWeight: "bold", color: "#00aaff" },
});
