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

  const totalAulas = data.reduce((s: number, f: any) => s + f.totalAulas, 0);
  const totalPresencas = data.reduce((s: number, f: any) => s + f.presencas, 0);
  const totalFaltas = data.reduce((s: number, f: any) => s + f.faltas, 0);
  const percGeral = totalAulas > 0 ? Math.round((totalPresencas / totalAulas) * 100) : 0;

  return (
    <ScrollView style={s.container}>
      <View style={s.resumo}>
        <View style={s.resumoItem}>
          <Text style={s.resumoNum}>{totalAulas}</Text>
          <Text style={s.resumoLabel}>Total Aulas</Text>
        </View>
        <View style={s.resumoItem}>
          <Text style={[s.resumoNum, { color: '#27ae60' }]}>{totalPresencas}</Text>
          <Text style={s.resumoLabel}>Presencas</Text>
        </View>
        <View style={s.resumoItem}>
          <Text style={[s.resumoNum, { color: '#e74c3c' }]}>{totalFaltas}</Text>
          <Text style={s.resumoLabel}>Faltas</Text>
        </View>
        <View style={s.resumoItem}>
          <Text style={[s.resumoNum, { color: percGeral >= 75 ? '#27ae60' : '#e74c3c' }]}>{percGeral}%</Text>
          <Text style={s.resumoLabel}>Frequencia</Text>
        </View>
      </View>

      {data.length === 0 ? (
        <Text style={s.empty}>Nenhum registro de frequencia</Text>
      ) : data.map((f: any, i: number) => (
        <View key={i} style={s.card}>
          <View style={{ flex: 1 }}>
            <Text style={s.disc}>{f.disciplina}</Text>
            <Text style={s.detalhe}>{f.totalAulas} aulas · {f.presencas} presencas · {f.faltas} faltas</Text>
          </View>
          <Text style={[s.perc, { color: f.frequenciaPercentual >= 75 ? '#27ae60' : '#e74c3c' }]}>{f.frequenciaPercentual}%</Text>
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
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  disc: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  detalhe: { fontSize: 11, color: '#999', marginTop: 2 },
  perc: { fontSize: 18, fontWeight: '800', marginLeft: 12 },
});
