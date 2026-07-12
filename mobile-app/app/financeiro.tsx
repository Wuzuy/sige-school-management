import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { request } from '@/services/api';

export default function FinanceiroScreen() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useState(() => {
    (async () => {
      try {
        const r = await request('/aluno/financeiro');
        if (r && r.length) setData(r);
        else setError(false);
      } catch {
        setError(true);
      } finally { setLoading(false); }
    })();
  });

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#00aaff" /></View>;

  if (error) {
    return (
      <ScrollView style={s.container} contentContainerStyle={s.center}>
        <View style={s.emptyCard}>
          <Text style={{ fontSize: 48, textAlign: 'center', opacity: 0.3 }}>💳</Text>
          <Text style={s.emptyTitle}>Modulo Financeiro</Text>
          <Text style={s.emptyText}>
            Em breve voce podera consultar boletos, mensalidades e situacao financeira aqui.
          </Text>
        </View>
      </ScrollView>
    );
  }

  const pendentes = data.filter((d: any) => d.status === 'PENDENTE' || d.status === 'VENCIDO').length;
  const pagas = data.filter((d: any) => d.status === 'PAGO').length;

  return (
    <ScrollView style={s.container}>
      <View style={s.resumo}>
        <View style={s.resumoItem}>
          <Text style={s.resumoNum}>{data.length}</Text>
          <Text style={s.resumoLabel}>Total</Text>
        </View>
        <View style={s.resumoItem}>
          <Text style={[s.resumoNum, { color: '#27ae60' }]}>{pagas}</Text>
          <Text style={s.resumoLabel}>Pagas</Text>
        </View>
        <View style={s.resumoItem}>
          <Text style={[s.resumoNum, { color: '#e74c3c' }]}>{pendentes}</Text>
          <Text style={s.resumoLabel}>Pendentes</Text>
        </View>
      </View>

      {data.length === 0 ? (
        <Text style={s.empty}>Nenhum registro financeiro</Text>
      ) : data.map((d: any, i: number) => (
        <View key={i} style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.nome}>{d.descricao || 'Mensalidade'}</Text>
            <Text style={[s.statusBadge, { color: d.status === 'PAGO' ? '#27ae60' : d.status === 'VENCIDO' ? '#e74c3c' : '#f39c12' }]}>{d.status || 'PENDENTE'}</Text>
          </View>
          <Text style={s.valor}>{d.valor ? 'R$ ' + parseFloat(d.valor).toFixed(2) : '-'}</Text>
          <Text style={s.data}>{d.vencimento ? 'Vencimento: ' + d.vencimento?.slice(0, 10) : '-'}</Text>
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
  emptyCard: { alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nome: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  statusBadge: { fontSize: 12, fontWeight: '600' },
  valor: { fontSize: 18, fontWeight: '800', color: '#003366', marginTop: 6 },
  data: { fontSize: 11, color: '#999', marginTop: 2 }
});
