import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Secretaria() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Lucas!</Text>
        <Text style={styles.subGreeting}>
          Bem-vindo ao seu portal acadêmico.
        </Text>
      </View>

      {/* Card de Status (Destaque) */}
      <View style={styles.highlightCard}>
        <Text style={styles.cardTitle}>Status do Curso</Text>
        <Text style={styles.cardStatus}>Ativo</Text>
        <View style={styles.divider} />
        <Text style={styles.cardInfo}>
          Técnico em Desenvolvimento de Sistemas
        </Text>
        <Text style={styles.cardSmall}>Turma: TEC00412025</Text>
      </View>

      {/* Seção de Ações Rápidas */}
      <Text style={styles.sectionTitle}>Acadêmico</Text>
      <View style={styles.grid}>
        <DashboardItem
          icon="book-outline"
          title="Notas"
          subtitle="Consulte aqui"
          route="/notas"
        />
        <DashboardItem
          icon="calendar-outline"
          title="Agenda"
          subtitle="Suas aulas"
          route="/agenda"
        />
        <DashboardItem
          icon="checkmark-circle-outline"
          title="Faltas"
          subtitle="Presença"
          route="/faltas"
        />
        <DashboardItem
          icon="wallet-outline"
          title="Financeiro"
          subtitle="Boletos"
          route="/financeiro"
        />
      </View>

      {/* Rodapé de Contato */}
      <TouchableOpacity style={styles.contactButton}>
        <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
        <Text style={styles.contactText}>Falar com a Secretaria</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Componente helper para os cards pequenos atualizado
function DashboardItem({
  icon,
  title,
  subtitle,
  route,
}: {
  icon: any;
  title: string;
  subtitle: string;
  route: any;
}) {
  return (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => router.push(route)}
    >
      <Ionicons name={icon} size={28} color="#00aaff" />
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fe", padding: 20 },
  header: { marginBottom: 25, marginTop: 10 },
  greeting: { fontSize: 28, fontWeight: "800", color: "#1a1a1a" },
  subGreeting: { fontSize: 16, color: "#7a7a7a" },

  highlightCard: {
    backgroundColor: "#003366",
    padding: 24,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: "#003366",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: { color: "#ffffff80", fontSize: 14, marginBottom: 5 },
  cardStatus: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  divider: { height: 1, backgroundColor: "#ffffff20", marginBottom: 15 },
  cardInfo: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cardSmall: { color: "#ffffff80", fontSize: 12, marginTop: 5 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemCard: {
    width: "47%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: { fontSize: 14, fontWeight: "700", color: "#333", marginTop: 10 },
  itemSubtitle: { fontSize: 11, color: "#999", marginTop: 2 },

  contactButton: {
    flexDirection: "row",
    backgroundColor: "#00aaff",
    padding: 18,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  contactText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
});
