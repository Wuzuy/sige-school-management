import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { request } from '@/services/api';

export default function ApeleScreen() {
  const [protocolo, setProtocolo] = useState('');
  const [assunto, setAssunto] = useState('');
  const [motivo, setMotivo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!protocolo || !assunto || !motivo) { Alert.alert('Erro', 'Preencha todos os campos'); return; }
    setSubmitting(true);
    try {
      await request('/aluno/reclamacoes', {
        method: 'POST',
        body: JSON.stringify({
          categoria: 'APELACAO',
          assunto,
          descricao: 'Protocolo original: ' + protocolo + '\n\nMotivo da apelação:\n' + motivo
        })
      });
      Alert.alert('Sucesso', 'Apelação registrada com sucesso');
      setProtocolo(''); setAssunto(''); setMotivo('');
    } catch (e: any) { Alert.alert('Erro', e.message); }
    finally { setSubmitting(false); }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={s.card}>
        <Text style={s.title}>Apelação</Text>
        <Text style={s.subtitle}>Recorra de uma reclamação que não foi resolvida adequadamente</Text>
        <TextInput style={s.input} placeholder="Protocolo da reclamação original" value={protocolo} onChangeText={setProtocolo} />
        <TextInput style={s.input} placeholder="Assunto" value={assunto} onChangeText={setAssunto} />
        <TextInput style={[s.input, s.textArea]} placeholder="Descreva o motivo da apelação..." value={motivo} onChangeText={setMotivo} multiline />
        <TouchableOpacity style={s.button} onPress={handleSubmit} disabled={submitting}>
          <Text style={s.buttonText}>{submitting ? 'Enviando...' : 'Registrar Apelação'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fe', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  title: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#999', marginBottom: 20 },
  input: { backgroundColor: '#f8f9fe', padding: 14, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  button: { backgroundColor: '#003366', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
