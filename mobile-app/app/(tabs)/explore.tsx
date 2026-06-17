import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { request } from '@/services/api';

export default function ExploreScreen() {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const validar = async () => {
    if (!codigo.trim()) { Alert.alert('Erro', 'Digite o codigo'); return; }
    setLoading(true);
    setResult(null);
    try {
      const data = await request('/auth/validar-codigo', {
        method: 'POST',
        body: JSON.stringify({ codigo: codigo.trim() }),
      });
      setResult(data);
    } catch (e: any) {
      Alert.alert('Acesso Negado', e.message || 'Codigo invalido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.inner}>
        <Ionicons name="scan-outline" size={56} color="#003366" />
        <Text style={s.title}>Autenticacao de Acesso</Text>
        <Text style={s.subtitle}>Digite o codigo gerado no app do aluno</Text>

        <TextInput
          style={s.input}
          placeholder="Codigo de 6 digitos"
          value={codigo}
          onChangeText={setCodigo}
          keyboardType="number-pad"
          maxLength={6}
        />
        <TouchableOpacity style={s.button} onPress={validar} disabled={loading}>
          <Text style={s.buttonText}>{loading ? 'Validando...' : 'Validar Acesso'}</Text>
        </TouchableOpacity>

        {result && (
          <View style={s.resultCard}>
            <Ionicons name="checkmark-circle" size={32} color="#27ae60" />
            <Text style={s.resultTitle}>Acesso Liberado</Text>
            <View style={s.infoRow}>
              <Text style={s.label}>Aluno:</Text>
              <Text style={s.value}>{result.usuario?.nome_completo || '-'}</Text>
            </View>
            <View style={s.infoRow}>
              <Text style={s.label}>CPF:</Text>
              <Text style={s.value}>{result.usuario?.cpf || '-'}</Text>
            </View>
            {result.matricula && (
              <>
                <View style={s.infoRow}>
                  <Text style={s.label}>Curso:</Text>
                  <Text style={s.value}>{result.matricula.curso || '-'}</Text>
                </View>
                <View style={s.infoRow}>
                  <Text style={s.label}>Turma:</Text>
                  <Text style={s.value}>{result.matricula.turma || '-'}</Text>
                </View>
                <View style={s.infoRow}>
                  <Text style={s.label}>Matricula:</Text>
                  <Text style={s.value}>{result.matricula.numero || '-'}</Text>
                </View>
                <View style={s.infoRow}>
                  <Text style={s.label}>Status:</Text>
                  <Text style={[s.value, { color: result.matricula.status === 'ATIVO' ? '#27ae60' : '#e74c3c' }]}>{result.matricula.status}</Text>
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f1f4' },
  inner: { padding: 24, alignItems: 'center', paddingTop: 40 },
  title: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginTop: 12 },
  subtitle: { fontSize: 13, color: '#999', textAlign: 'center', marginTop: 4, marginBottom: 28 },
  input: { backgroundColor: '#fff', padding: 16, borderRadius: 12, fontSize: 24, letterSpacing: 6, textAlign: 'center', width: '100%', marginBottom: 16, borderWidth: 1, borderColor: '#d7dee8' },
  button: { backgroundColor: '#003366', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '100%', marginTop: 24, alignItems: 'center' },
  resultTitle: { fontSize: 18, fontWeight: '700', color: '#27ae60', marginTop: 8, marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  label: { fontSize: 13, color: '#999' },
  value: { fontSize: 13, fontWeight: '600', color: '#333', maxWidth: '60%', textAlign: 'right' },
});
