import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const faltasData = [
  {
    id: "1",
    disciplina: "Lógica de Programação",
    faltas: 2,
    limite: 20,
    percentual: 10,
  },
  {
    id: "2",
    disciplina: "Banco de Dados",
    faltas: 15,
    limite: 20,
    percentual: 75,
  },
  {
    id: "3",
    disciplina: "Desenvolvimento Web",
    faltas: 0,
    limite: 20,
    percentual: 0,
  },
];

export default function Faltas() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Frequência</Text>
        <Text style={styles.subtitle}>Acompanhe suas faltas</Text>
      </View>

      <View style={styles.summaryCard}>
        <Ionicons name="warning-outline" size={32} color="#faad14" />
        <View style={styles.summaryTextContainer}>
          <Text style={styles.summaryTitle}>Atenção à frequência!</Text>
          <Text style={styles.summaryDesc}>
            O limite máximo de faltas para aprovação é de 25% da carga horária.
          </Text>
        </View>
      </View>

      {faltasData.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.disciplina}>{item.disciplina}</Text>

          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statLabel}>Faltas Registradas</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: item.percentual > 70 ? "#e53935" : "#333" },
                ]}
              >
                {item.faltas}{" "}
                <Text style={styles.statLimit}>/ {item.limite}</Text>
              </Text>
            </View>
            <View style={styles.percentContainer}>
              <Text
                style={[
                  styles.percentText,
                  { color: item.percentual > 70 ? "#e53935" : "#00aaff" },
                ]}
              >
                {item.percentual}%
              </Text>
            </View>
          </View>

          {/* Barra de progresso visual */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${item.percentual}%`,
                  backgroundColor:
                    item.percentual > 70
                      ? "#e53935"
                      : item.percentual > 40
                        ? "#faad14"
                        : "#52c41a",
                },
              ]}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fe", padding: 20 },
  header: { marginBottom: 20, marginTop: 10 },
  title: { fontSize: 28, fontWeight: "800", color: "#1a1a1a" },
  subtitle: { fontSize: 16, color: "#7a7a7a" },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#fffbe6",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffe58f",
  },
  summaryTextContainer: { marginLeft: 15, flex: 1 },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d48806",
    marginBottom: 4,
  },
  summaryDesc: { fontSize: 12, color: "#666" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  disciplina: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  statLabel: { fontSize: 12, color: "#999", marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: "bold" },
  statLimit: { fontSize: 14, color: "#999", fontWeight: "normal" },
  percentContainer: {
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  percentText: { fontSize: 14, fontWeight: "bold" },
  progressBarBg: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 4 },
});
