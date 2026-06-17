import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { request } from '@/services/api';

export default function AgendaScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    (async () => {
      try {
        const [horarios, calendario] = await Promise.all([
          request('/aluno/horarios').catch(() => []),
          request('/aluno/calendario').catch(() => []),
        ]);
        setData(horarios || []);
      } catch {} finally { setLoading(false); }
    })();
  });

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#00aaff" /></View>;

  const diasSemana = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];

  return (
    <ScrollView style={s.container}>
      {data.length === 0 ? (
        <Text style={s.empty}>Nenhum horario encontrado</Text>
      ) : data.map((h: any, i: number) => (
        <View key={i} style={s.card}>
          <View style={s.diaBadge}>
            <Text style={s.diaText}>{diasSemana[(h.dia_semana || 1) - 1] || `Dia ${h.dia_semana}`}</Text>
          </View>
          <Text style={s.hora}>{h.hora_inicio?.slice(0, 5) || '-'} - {h.hora_fim?.slice(0, 5) || '-'}</Text>
          <Text style={s.disc}>{h.id_disciplina?.nome_disciplina || h.disciplina_nome || '-'}</Text>
          {h.local && <Text style={s.local}>{h.local}</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fe', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fe' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#00aaff' },
  diaBadge: { marginBottom: 4 },
  diaText: { fontSize: 12, fontWeight: '700', color: '#003366', textTransform: 'uppercase' },
  hora: { fontSize: 13, color: '#666', marginTop: 2 },
  disc: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginTop: 2 },
  local: { fontSize: 12, color: '#999', marginTop: 2 },
});
