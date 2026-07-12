import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { request } from '@/services/api';

export default function CalendarioScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    (async () => {
      try {
        const r = await request('/aluno/calendario');
        setData(r || []);
      } catch {} finally { setLoading(false); }
    })();
  });

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#00aaff" /></View>;

  return (
    <ScrollView style={s.container}>
      {data.length === 0 ? (
        <Text style={s.empty}>Nenhum evento encontrado</Text>
      ) : data.map((e: any, i: number) => (
        <View key={i} style={s.card}>
          <View style={s.dateBadge}>
            <Text style={s.dateDay}>{new Date(e.data_inicio).getDate()}</Text>
            <Text style={s.dateMonth}>{new Date(e.data_inicio).toLocaleDateString('pt-BR', { month: 'short' }).replace('.','')}</Text>
          </View>
          <View style={s.info}>
            <Text style={s.title}>{e.titulo}</Text>
            {e.descricao ? <Text style={s.desc}>{e.descricao}</Text> : null}
            <Text style={s.date}>
              {new Date(e.data_inicio).toLocaleDateString('pt-BR')}
              {e.data_fim && e.data_fim !== e.data_inicio ? ` — ${new Date(e.data_fim).toLocaleDateString('pt-BR')}` : ''}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fe', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fe' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 10, alignItems: 'center' },
  dateBadge: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  dateDay: { fontSize: 18, fontWeight: '800', color: '#fff' },
  dateMonth: { fontSize: 10, fontWeight: '600', color: '#ffffff80', textTransform: 'uppercase' },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  desc: { fontSize: 12, color: '#666', marginTop: 2, lineHeight: 16 },
  date: { fontSize: 11, color: '#999', marginTop: 4 },
});
