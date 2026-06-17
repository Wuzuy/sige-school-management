import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { request } from '@/services/api';

export default function FaltasScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    (async () => {
      try {
        const r = await request('/aluno/frequencia');
        setData(r || []);
      } catch {} finally { setLoading(false); }
    })();
  });

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#00aaff" /></View>;

  const presencas = data.filter((f: any) => f.presente).length;
  const total = data.length || 1;
  const perc = Math.round((presencas / total) * 100);

  return (
    <ScrollView style={s.container}>
      <View style={s.resumo}>
        <View style={s.resumoItem}>
          <Text style={s.resumoNum}>{total}</Text>
          <Text style={s.resumoLabel}>Total Aulas</Text>
        </View>
        <View style={s.resumoItem}>
          <Text style={[s.resumoNum, { color: '#27ae60' }]}>{presencas}</Text>
          <Text style={s.resumoLabel}>Presencas</Text>
        </View>
        <View style={s.resumoItem}>
          <Text style={[s.resumoNum, { color: '#e74c3c' }]}>{total - presencas}</Text>
          <Text style={s.resumoLabel}>Faltas</Text>
        </View>
        <View style={s.resumoItem}>
          <Text style={[s.resumoNum, { color: perc >= 75 ? '#27ae60' : '#e74c3c' }]}>{perc}%</Text>
          <Text style={s.resumoLabel}>Frequencia</Text>
        </View>
      </View>

      {data.length === 0 ? (
        <Text style={s.empty}>Nenhum registro de frequencia</Text>
      ) : data.map((f: any, i: number) => (
        <View key={i} style={s.card}>
          <Text style={s.data}>{f.data_aula || '-'}</Text>
          <Text style={s.disc}>{f.disciplina_nome || f.id_disciplina || '-'}</Text>
          <Text style={[s.status, { color: f.presente ? '#27ae60' : '#e74c3c' }]}>
            {f.presente ? 'Presente' : 'Ausente'}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fe', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fe' },
  resumo: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  resumoItem: { flex: 1, minWidth: '45%', backgroundColor: '#fff', padding: 14, borderRadius: 14, alignItems: 'center' },
  resumoNum: { fontSize: 24, fontWeight: '800', color: '#1a1a1a' },
  resumoLabel: { fontSize: 11, color: '#999', marginTop: 2 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  data: { fontSize: 12, color: '#999', flex: 1 },
  disc: { fontSize: 13, color: '#333', fontWeight: '600', flex: 2 },
  status: { fontSize: 12, fontWeight: '700', flex: 1, textAlign: 'right' },
});
