import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const notasData = [
  {
    id: "1",
    disciplina: "Lógica de Programação",
    nota1: 8.5,
    nota2: 9.0,
    media: 8.75,
    status: "Aprovado",
  },
  {
    id: "2",
    disciplina: "Banco de Dados",
    nota1: 7.0,
    nota2: 6.5,
    media: 6.75,
    status: "Em Exame",
  },
  {
    id: "3",
    disciplina: "Desenvolvimento Web",
    nota1: 9.5,
    nota2: 9.5,
    media: 9.5,
    status: "Aprovado",
  },
  {
    id: "4",
    disciplina: "Engenharia de Software",
    nota1: 8.0,
    nota2: "-",
    media: 8.0,
    status: "Cursando",
  },
];

export default function Notas() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Boletim Escolar</Text>
        <Text style={styles.subtitle}>Semestre Atual: 2026.1</Text>
      </View>

      {notasData.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.disciplina}>{item.disciplina}</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.status === "Aprovado"
                      ? "#e6f7ea"
                      : item.status === "Em Exame"
                        ? "#fff3cd"
                        : "#e6f7ff",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      item.status === "Aprovado"
                        ? "#28a745"
                        : item.status === "Em Exame"
                          ? "#856404"
                          : "#00aaff",
                  },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>

          <View style={styles.notasRow}>
            <View style={styles.notaItem}>
              <Text style={styles.notaLabel}>N1</Text>
              <Text style={styles.notaValue}>{item.nota1}</Text>
            </View>
            <View style={styles.notaItem}>
              <Text style={styles.notaLabel}>N2</Text>
              <Text style={styles.notaValue}>{item.nota2}</Text>
            </View>
            <View style={styles.notaItemHighlight}>
              <Text style={styles.notaLabelHighlight}>Média</Text>
              <Text style={styles.notaValueHighlight}>{item.media}</Text>
            </View>
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  disciplina: { fontSize: 16, fontWeight: "700", color: "#333", flex: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: "600" },
  notasRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 15,
  },
  notaItem: { alignItems: "center", flex: 1 },
  notaLabel: { fontSize: 12, color: "#999", marginBottom: 4 },
  notaValue: { fontSize: 18, fontWeight: "600", color: "#555" },
  notaItemHighlight: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    paddingVertical: 5,
  },
  notaLabelHighlight: {
    fontSize: 12,
    color: "#00aaff",
    marginBottom: 4,
    fontWeight: "600",
  },
  notaValueHighlight: { fontSize: 18, fontWeight: "bold", color: "#003366" },
});
