import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#00aaff" }}>
      <Tabs.Screen
        name="secretaria"
        options={{
          title: "Secretaria",
          tabBarIcon: ({ color }) => (
            <Ionicons name="school" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="carteirinha"
        options={{
          title: "Carteira",
          tabBarIcon: ({ color }) => (
            <Ionicons name="card" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="autenticacao"
        options={{
          title: "Auth",
          tabBarIcon: ({ color }) => (
            <Ionicons name="qr-code" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
