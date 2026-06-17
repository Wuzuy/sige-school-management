import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { request } from '@/services/api';

export default function CurriculoScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    (async () => {
      try {
        const r = await request('/aluno/curriculo');
        setData(r || []);
      } catch {} finally { setLoading(false); }
    })();
  });

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#00aaff" /></View>;

  const semestres = [...new Set(data.map((d: any) => d.semestre || 1))].sort();

  return (
    <ScrollView style={s.container}>
      {data.length === 0 ? (
        <Text style={s.empty}>Nenhuma disciplina encontrada</Text>
      ) : semestres.map((sem) => (
        <View key={String(sem)} style={s.semestre}>
          <Text style={s.semTitle}>{sem}o Semestre</Text>
          {data.filter((d: any) => (d.semestre || 1) === sem).map((d: any, i: number) => (
            <View key={i} style={s.card}>
              <View style={{ flex: 1 }}>
                <Text style={s.disc}>{d.nome || '-'}</Text>
                <Text style={s.tipo}>{d.obrigatoria ? 'Obrigatoria' : 'Optativa'}</Text>
              </View>
              {d.carga_horaria && <Text style={s.ch}>{d.carga_horaria}h</Text>}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fe', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fe' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
  semestre: { marginBottom: 20 },
  semTitle: { fontSize: 16, fontWeight: '700', color: '#003366', marginBottom: 8, paddingLeft: 4 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 6, flexDirection: 'row', alignItems: 'center' },
  disc: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  tipo: { fontSize: 11, color: '#999', marginTop: 2 },
  ch: { fontSize: 13, color: '#666', fontWeight: '600', marginLeft: 8 },
});
