import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { request } from '@/services/api';

export default function FinanceiroScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    (async () => {
      try {
        const r = await request('/aluno/documentos');
        setData(r || []);
      } catch {} finally { setLoading(false); }
    })();
  });

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#00aaff" /></View>;

  return (
    <ScrollView style={s.container}>
      <View style={s.resumo}>
        <View style={s.resumoItem}>
          <Text style={s.resumoNum}>{data.length}</Text>
          <Text style={s.resumoLabel}>Documentos</Text>
        </View>
        <View style={s.resumoItem}>
          <Text style={[s.resumoNum, { color: '#27ae60' }]}>{data.filter((d: any) => d.status === 'EMITIDO' || d.status === 'VALIDO').length}</Text>
          <Text style={s.resumoLabel}>Emitidos</Text>
        </View>
        <View style={s.resumoItem}>
          <Text style={[s.resumoNum, { color: '#e74c3c' }]}>{data.filter((d: any) => d.status === 'PENDENTE').length}</Text>
          <Text style={s.resumoLabel}>Pendentes</Text>
        </View>
      </View>

      {data.length === 0 ? (
        <Text style={s.empty}>Nenhum documento financeiro</Text>
      ) : data.map((d: any, i: number) => (
        <View key={i} style={s.card}>
          <Text style={s.nome}>{d.tipo_documento || d.nome || 'Documento'}</Text>
          <Text style={s.status}>{d.status || '-'}</Text>
          <Text style={s.data}>{d.data_emissao || d.created_at?.slice(0, 10) || '-'}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fe', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fe' },
  resumo: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  resumoItem: { flex: 1, backgroundColor: '#fff', padding: 14, borderRadius: 14, alignItems: 'center' },
  resumoNum: { fontSize: 22, fontWeight: '800', color: '#1a1a1a' },
  resumoLabel: { fontSize: 11, color: '#999', marginTop: 2 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8 },
  nome: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  status: { fontSize: 12, color: '#666', marginTop: 2 },
  data: { fontSize: 11, color: '#999', marginTop: 2 },
});
