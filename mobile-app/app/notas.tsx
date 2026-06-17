import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { request } from '@/services/api';

export default function NotasScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    (async () => {
      try {
        const r = await request('/aluno/historico');
        setData(r || []);
      } catch {} finally { setLoading(false); }
    })();
  });

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#00aaff" /></View>;

  return (
    <ScrollView style={s.container}>
      {data.length === 0 ? (
        <Text style={s.empty}>Nenhuma nota encontrada</Text>
      ) : data.map((item: any, i: number) => (
        <View key={i} style={s.card}>
          <Text style={s.disc}>{item.id_disciplina?.nome || `Disciplina #${item.id_disciplina}`}</Text>
          <View style={s.row}>
            <Text style={s.label}>Nota:</Text>
            <Text style={[s.value, { color: (item.nota || 0) >= 6 ? '#27ae60' : '#e74c3c' }]}>{item.nota ?? '-'}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Situacao:</Text>
            <Text style={s.value}>{item.status || (item.nota >= 6 ? 'Aprovado' : 'Reprovado')}</Text>
          </View>
          {item.ano && <View style={s.row}><Text style={s.label}>Ano:</Text><Text style={s.value}>{item.ano}</Text></View>}
          {item.semestre && <View style={s.row}><Text style={s.label}>Semestre:</Text><Text style={s.value}>{item.semestre}</Text></View>}
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fe', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fe' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12 },
  disc: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  label: { fontSize: 13, color: '#999' },
  value: { fontSize: 13, fontWeight: '600', color: '#333' },
});
