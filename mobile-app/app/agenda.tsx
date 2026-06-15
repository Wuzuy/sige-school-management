import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// Inspirado na sua imagem de grade de horários
const agendaData = [
  {
    id: "1",
    horario: "08:20 - 09:10",
    materia: "Desenvolvimento Web",
    prof: "Prof. Silva",
    sala: "Lab 102",
    cor: "#e6f7ff",
    corBorda: "#00aaff",
  },
  {
    id: "2",
    horario: "09:10 - 10:00",
    materia: "Banco de Dados",
    prof: "Dr. Martinez",
    sala: "Lab 103",
    cor: "#fff0f6",
    corBorda: "#eb2f96",
  },
  {
    id: "3",
    horario: "10:20 - 11:10",
    materia: "Eng. de Software",
    prof: "Sra. Rodriguez",
    sala: "Sala 308",
    cor: "#fffbe6",
    corBorda: "#faad14",
  },
  {
    id: "4",
    horario: "11:10 - 12:00",
    materia: "Lógica de Programação",
    prof: "Mr. Thompson",
    sala: "Lab 205",
    cor: "#f6ffed",
    corBorda: "#52c41a",
  },
];

export default function Agenda() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minha Agenda</Text>
        <Text style={styles.subtitle}>Segunda-feira, 15 de Junho</Text>
      </View>

      <View style={styles.timeline}>
        {agendaData.map((item) => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeText}>
                {item.horario.split(" - ")[0]}
              </Text>
              <Text style={styles.timeTextSmall}>
                {item.horario.split(" - ")[1]}
              </Text>
            </View>

            <View
              style={[
                styles.classCard,
                { backgroundColor: item.cor, borderLeftColor: item.corBorda },
              ]}
            >
              <Text style={styles.materia}>{item.materia}</Text>
              <Text style={styles.prof}>{item.prof}</Text>
              <Text style={styles.sala}>{item.sala}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fe", padding: 20 },
  header: { marginBottom: 30, marginTop: 10 },
  title: { fontSize: 28, fontWeight: "800", color: "#1a1a1a" },
  subtitle: { fontSize: 16, color: "#7a7a7a" },
  timeline: { paddingLeft: 10 },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  timeColumn: {
    width: 60,
    alignItems: "center",
    marginRight: 15,
    marginTop: 5,
  },
  timeText: { fontSize: 14, fontWeight: "bold", color: "#333" },
  timeTextSmall: { fontSize: 11, color: "#999" },
  classCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  materia: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 },
  prof: { fontSize: 14, color: "#666", marginBottom: 8 },
  sala: { fontSize: 12, color: "#999", fontWeight: "500" },
});
