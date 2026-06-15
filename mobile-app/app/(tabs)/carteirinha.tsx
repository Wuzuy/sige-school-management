import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function Carteirinha() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carteirinha Digital</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.headerText}>Firjan SENAI</Text>
          <Ionicons name="school" size={24} color="#fff" />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Aluno</Text>
              <Text style={styles.value}>Lucas Matheus Lima Sandin</Text>
            </View>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={32} color="#003366" />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Matrícula</Text>
            <Text style={styles.value}>00470472</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Curso</Text>
            <Text style={styles.value}>
              Técnico em Desenvolvimento de Sistemas
            </Text>
          </View>

          <View style={styles.footerRow}>
            <View>
              <Text style={styles.label}>Validade</Text>
              <Text style={styles.valueHighlight}>17/07/2026</Text>
            </View>
            <Text style={styles.status}>ATIVO</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fe",
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    backgroundColor: "#003366",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  cardContent: { padding: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  field: { marginBottom: 15 },
  label: { fontSize: 12, color: "#999", marginBottom: 2 },
  value: { fontSize: 16, fontWeight: "600", color: "#333" },
  valueHighlight: { fontSize: 16, fontWeight: "800", color: "#00aaff" },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  status: {
    backgroundColor: "#e6f7ff",
    color: "#00aaff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontWeight: "bold",
  },
});
