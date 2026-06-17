import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { request } from '@/services/api';

export default function OuvidoriaScreen() {
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!assunto || !mensagem) { Alert.alert('Erro', 'Preencha todos os campos'); return; }
    setSubmitting(true);
    try {
      await request('/aluno/reclamacoes', {
        method: 'POST',
        body: JSON.stringify({ assunto, descricao: mensagem }),
      });
      Alert.alert('Sucesso', 'Mensagem enviada a ouvidoria');
      setAssunto('');
      setMensagem('');
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally { setSubmitting(false); }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={s.card}>
        <Text style={s.title}>Ouvidoria</Text>
        <Text style={s.subtitle}>Envie sua mensagem para a ouvidoria da instituicao</Text>

        <TextInput style={s.input} placeholder="Assunto" value={assunto} onChangeText={setAssunto} />
        <TextInput style={[s.input, s.textArea]} placeholder="Descreva sua mensagem..." value={mensagem} onChangeText={setMensagem} multiline />

        <TouchableOpacity style={s.button} onPress={handleSubmit} disabled={submitting}>
          <Text style={s.buttonText}>{submitting ? 'Enviando...' : 'Enviar'}</Text>
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
