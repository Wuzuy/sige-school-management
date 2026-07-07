import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { request } from '@/services/api';

export default function TabLayout() {
  const [hasCatraca, setHasCatraca] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const perms = await request('/cargos/minhas/permissoes');
        setHasCatraca(Array.isArray(perms) && perms.includes('catraca.acessar'));
      } catch {
        setHasCatraca(false);
      }
    })();
  }, []);

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
      {hasCatraca && (
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Catraca',
            headerTitle: 'Autenticador',
            headerTintColor: '#003366',
            tabBarIcon: ({ color }) => <Ionicons name="scan-outline" size={22} color={color} />,
          }}
        />
      )}
    </Tabs>
  );
}
