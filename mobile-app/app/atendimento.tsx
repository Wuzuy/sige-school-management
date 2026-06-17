import { useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { request } from '@/services/api';

export default function AtendimentoScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [assunto, setAssunto] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const r = await request('/aluno/atendimentos');
      setData(r || []);
    } catch {} finally { setLoading(false); }
  };

  useState(() => { load(); });

  const handleSubmit = async () => {
    if (!assunto || !dataHora) { Alert.alert('Erro', 'Preencha todos os campos'); return; }
    setSubmitting(true);
    try {
      await request('/aluno/atendimentos', {
        method: 'POST',
        body: JSON.stringify({ assunto, data_hora: dataHora }),
      });
      Alert.alert('Sucesso', 'Atendimento agendado');
      setAssunto('');
      setDataHora('');
      setShowForm(false);
      load();
    } catch (e: any) { Alert.alert('Erro', e.message); }
    finally { setSubmitting(false); }
  };

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#00aaff" /></View>;

  const proximo = data.filter((a: any) => a.status === 'AGENDADO' || a.status === 'CONFIRMADO').sort((a: any, b: any) => new Date(a.data_hora || a.data).getTime() - new Date(b.data_hora || b.data).getTime())[0];

  return (
    <ScrollView style={s.container}>
      {proximo && (
        <View style={s.proximoCard}>
          <Text style={s.proximoLabel}>Proximo Atendimento</Text>
          <Text style={s.proximoAssunto}>{proximo.assunto}</Text>
          <Text style={s.proximoData}>{proximo.data_hora?.slice(0, 16).replace('T', ' ') || proximo.data?.slice(0, 10) || '-'}</Text>
        </View>
      )}

      <TouchableOpacity style={s.btnNovo} onPress={() => setShowForm(!showForm)}>
        <Text style={s.btnNovoText}>{showForm ? 'Cancelar' : 'Agendar Atendimento'}</Text>
      </TouchableOpacity>

      {showForm && (
        <View style={s.form}>
          <TextInput style={s.input} placeholder="Assunto" value={assunto} onChangeText={setAssunto} />
          <TextInput style={s.input} placeholder="Data e Hora (ex: 2026-06-20 14:30)" value={dataHora} onChangeText={setDataHora} />
          <TouchableOpacity style={s.btnEnviar} onPress={handleSubmit} disabled={submitting}>
            <Text style={s.btnEnviarText}>{submitting ? 'Agendando...' : 'Agendar'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={s.sectionTitle}>Historico</Text>
      {data.length === 0 ? (
        <Text style={s.empty}>Nenhum atendimento</Text>
      ) : data.map((a: any, i: number) => (
        <View key={i} style={s.card}>
          <Text style={s.assunto}>{a.assunto}</Text>
          <Text style={s.dataHora}>{a.data_hora?.slice(0, 16).replace('T', ' ') || a.data?.slice(0, 10) || '-'}</Text>
          <Text style={[s.status, { color: a.status === 'AGENDADO' || a.status === 'CONFIRMADO' ? '#e67e22' : a.status === 'REALIZADO' ? '#27ae60' : '#999' }]}>{a.status || '-'}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fe', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fe' },
  proximoCard: { backgroundColor: '#003366', padding: 18, borderRadius: 16, marginBottom: 16 },
  proximoLabel: { color: '#ffffff80', fontSize: 12 },
  proximoAssunto: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 4 },
  proximoData: { color: '#ffffff99', fontSize: 13, marginTop: 4 },
  btnNovo: { backgroundColor: '#00aaff', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  btnNovoText: { color: '#fff', fontWeight: 'bold' },
  form: { backgroundColor: '#fff', padding: 16, borderRadius: 14, marginBottom: 16 },
  input: { backgroundColor: '#f8f9fe', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  btnEnviar: { backgroundColor: '#003366', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnEnviarText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 10, marginTop: 8 },
  empty: { textAlign: 'center', color: '#999', marginTop: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8 },
  assunto: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  dataHora: { fontSize: 12, color: '#666', marginTop: 2 },
  status: { fontSize: 11, fontWeight: '700', marginTop: 2 },
});
