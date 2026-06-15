import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const faturasData = [
  {
    id: "1",
    mes: "Junho/2026",
    valor: "R$ 450,00",
    vencimento: "10/06/2026",
    status: "Pago",
  },
  {
    id: "2",
    mes: "Julho/2026",
    valor: "R$ 450,00",
    vencimento: "10/07/2026",
    status: "Em Aberto",
  },
  {
    id: "3",
    mes: "Agosto/2026",
    valor: "R$ 450,00",
    vencimento: "10/08/2026",
    status: "Em Aberto",
  },
];

export default function Financeiro() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financeiro</Text>
        <Text style={styles.subtitle}>Gerencie suas mensalidades</Text>
      </View>

      {faturasData.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.mesText}>{item.mes}</Text>
              <Text style={styles.vencimentoText}>
                Vence em: {item.vencimento}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.status === "Pago" ? "#e6f7ea" : "#fff3cd",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: item.status === "Pago" ? "#28a745" : "#856404" },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.valorText}>{item.valor}</Text>

            {item.status === "Em Aberto" && (
              <TouchableOpacity style={styles.payButton}>
                <Ionicons name="barcode-outline" size={20} color="#fff" />
                <Text style={styles.payButtonText}>Pagar</Text>
              </TouchableOpacity>
            )}
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
    alignItems: "flex-start",
    marginBottom: 20,
  },
  mesText: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 4 },
  vencimentoText: { fontSize: 14, color: "#999" },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: "bold" },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 15,
  },
  valorText: { fontSize: 24, fontWeight: "800", color: "#003366" },
  payButton: {
    flexDirection: "row",
    backgroundColor: "#00aaff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  payButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
});
