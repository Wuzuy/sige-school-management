import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#00aaff', tabBarStyle: { paddingBottom: 4 } }}>
      <Tabs.Screen
        name="secretaria"
        options={{
          title: 'Inicio',
          headerTitle: 'SIGE',
          headerTintColor: '#003366',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="carteirinha"
        options={{
          title: 'Carteirinha',
          headerTitle: 'Carteirinha Digital',
          headerTintColor: '#003366',
          tabBarIcon: ({ color }) => <Ionicons name="card" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="autenticacao"
        options={{
          title: 'Acesso',
          headerTitle: 'Meu Acesso',
          headerTintColor: '#003366',
          tabBarIcon: ({ color }) => <Ionicons name="qr-code" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Catraca',
          headerTitle: 'Autenticador',
          headerTintColor: '#003366',
          tabBarIcon: ({ color }) => <Ionicons name="scan-outline" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
