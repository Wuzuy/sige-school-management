import { useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { request } from '@/services/api';

export default function ReclamacoesScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    try {
      const r = await request('/aluno/reclamacoes');
      setData(r || []);
    } catch {} finally { setLoading(false); setRefreshing(false); }
  };

  useState(() => { load(); });

  const handleSubmit = async () => {
    if (!assunto || !mensagem) { Alert.alert('Erro', 'Preencha todos os campos'); return; }
    setSubmitting(true);
    try {
      await request('/aluno/reclamacoes', {
        method: 'POST',
        body: JSON.stringify({ assunto, descricao: mensagem }),
      });
      Alert.alert('Sucesso', 'Reclamacao enviada');
      setAssunto('');
      setMensagem('');
      setShowForm(false);
      load();
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally { setSubmitting(false); }
  };

  const ab3 = data.filter((r: any) => r.status === 'ABERTO' || r.status === 'PENDENTE').length;
  const res = data.filter((r: any) => r.status === 'RESOLVIDO' || r.status === 'FECHADO').length;

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#00aaff" /></View>;

  return (
    <ScrollView style={s.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
      <View style={s.stats}>
        <View style={s.statBox}><Text style={s.statNum}>{data.length}</Text><Text style={s.statLabel}>Total</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#e67e22' }]}>{ab3}</Text><Text style={s.statLabel}>Abertas</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#27ae60' }]}>{res}</Text><Text style={s.statLabel}>Resolvidas</Text></View>
      </View>

      <TouchableOpacity style={s.btnNova} onPress={() => setShowForm(!showForm)}>
        <Text style={s.btnNovaText}>{showForm ? 'Cancelar' : 'Nova Reclamacao'}</Text>
      </TouchableOpacity>

      {showForm && (
        <View style={s.form}>
          <TextInput style={s.input} placeholder="Assunto" value={assunto} onChangeText={setAssunto} />
          <TextInput style={[s.input, s.textArea]} placeholder="Descreva sua reclamacao..." value={mensagem} onChangeText={setMensagem} multiline />
          <TouchableOpacity style={s.btnEnviar} onPress={handleSubmit} disabled={submitting}>
            <Text style={s.btnEnviarText}>{submitting ? 'Enviando...' : 'Enviar'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {data.length === 0 ? (
        <Text style={s.empty}>Nenhuma reclamacao</Text>
      ) : data.map((r: any, i: number) => (
        <View key={i} style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.assunto}>{r.assunto || 'Reclamacao'}</Text>
            <Text style={[s.status, { color: r.status === 'ABERTO' || r.status === 'PENDENTE' ? '#e67e22' : '#27ae60' }]}>{r.status || '-'}</Text>
          </View>
          <Text style={s.data}>{r.created_at?.slice(0, 10) || r.data?.slice(0, 10) || '-'}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fe', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fe' },
  stats: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: '#fff', padding: 14, borderRadius: 14, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: '#1a1a1a' },
  statLabel: { fontSize: 11, color: '#999', marginTop: 2 },
  btnNova: { backgroundColor: '#003366', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  btnNovaText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  form: { backgroundColor: '#fff', padding: 16, borderRadius: 14, marginBottom: 16 },
  input: { backgroundColor: '#f8f9fe', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  btnEnviar: { backgroundColor: '#00aaff', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnEnviarText: { color: '#fff', fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  assunto: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', flex: 1 },
  status: { fontSize: 11, fontWeight: '700' },
  data: { fontSize: 11, color: '#999', marginTop: 4 },
});
