import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="notas" options={{ headerShown: true, title: 'Notas', headerTintColor: '#003366' }} />
        <Stack.Screen name="faltas" options={{ headerShown: true, title: 'Frequencia', headerTintColor: '#003366' }} />
        <Stack.Screen name="agenda" options={{ headerShown: true, title: 'Agenda', headerTintColor: '#003366' }} />
        <Stack.Screen name="financeiro" options={{ headerShown: true, title: 'Financeiro', headerTintColor: '#003366' }} />
        <Stack.Screen name="curriculo" options={{ headerShown: true, title: 'Estrutura Curricular', headerTintColor: '#003366' }} />
        <Stack.Screen name="reclamacoes" options={{ headerShown: true, title: 'Reclamacoes', headerTintColor: '#003366' }} />
        <Stack.Screen name="ouvidoria" options={{ headerShown: true, title: 'Apele', headerTintColor: '#003366' }} />
        <Stack.Screen name="atendimento" options={{ headerShown: true, title: 'Atendimento Agendado', headerTintColor: '#003366' }} />
        <Stack.Screen name="calendario" options={{ headerShown: true, title: 'Calendario Escolar', headerTintColor: '#003366' }} />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
