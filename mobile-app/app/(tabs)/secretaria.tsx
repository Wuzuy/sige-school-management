import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { request } from '@/services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [matriculas, frequencia, horarios, documentos, historico] = await Promise.all([
        request('/aluno/matriculas').catch(() => []),
        request('/aluno/frequencia').catch(() => []),
        request('/aluno/horarios').catch(() => []),
        request('/aluno/documentos').catch(() => []),
        request('/aluno/historico').catch(() => []),
      ]);
      setData({ matriculas, frequencia, horarios, documentos, historico });
    } catch {} finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useState(() => { fetchData(); });

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const m = data?.matriculas?.[0];
  const cursoNome = m?.id_curso?.nome_curso || 'Curso nao encontrado';
  const turmaNome = m?.id_turma?.nome || '';
  const statusMat = m?.status || 'ATIVO';
  const freq = data?.frequencia || [];
  const totalAulas = freq.reduce((s: number, f: any) => s + f.totalAulas, 0);
  const totalPresencas = freq.reduce((s: number, f: any) => s + f.presencas, 0);
  const percFreq = totalAulas > 0 ? Math.round((totalPresencas / totalAulas) * 100) : 0;
  const qtdDocs = data?.documentos?.length || 0;
  const qtdNotas = data?.historico?.length || 0;

  if (loading) {
    return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color="#00aaff" /></View>;
  }

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Ola, {user?.nomeCompleto?.split(' ')[0] || 'Aluno'}!</Text>
          <Text style={styles.subGreeting}>Bem-vindo ao seu portal</Text>
        </View>
        <TouchableOpacity onPress={() => { logout(); router.replace('/'); }}>
          <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      <View style={styles.highlightCard}>
        <Text style={styles.cardLabel}>Status do Curso</Text>
        <Text style={styles.cardStatus}>{statusMat === 'ATIVO' ? 'Ativo' : statusMat}</Text>
        <View style={styles.divider} />
        <Text style={styles.cardTitle}>{cursoNome}</Text>
        {turmaNome ? <Text style={styles.cardSmall}>Turma: {turmaNome}</Text> : null}
        {m?.numero_matricula ? <Text style={styles.cardSmall}>Matricula: {m.numero_matricula}</Text> : null}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalAulas}</Text>
          <Text style={styles.statLabel}>Aulas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: percFreq >= 75 ? '#27ae60' : '#e74c3c' }]}>{percFreq}%</Text>
          <Text style={styles.statLabel}>Frequencia</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{qtdDocs}</Text>
          <Text style={styles.statLabel}>Documentos</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Academico</Text>
      <View style={styles.grid}><Menu icon="book-outline" title="Notas" route="/notas" /><Menu icon="calendar-outline" title="Agenda" route="/agenda" /><Menu icon="calendar" title="Calendario" route="/calendario" /><Menu icon="checkmark-circle-outline" title="Frequencia" route="/faltas" /><Menu icon="layers-outline" title="Curriculo" route="/curriculo" /><Menu icon="wallet-outline" title="Financeiro" route="/financeiro" /><Menu icon="chatbubble-ellipses-outline" title="Reclamacoes" route="/reclamacoes" /><Menu icon="alert-circle-outline" title="Apele" route="/ouvidoria" /><Menu icon="time-outline" title="Atendimento" route="/atendimento" /></View>
    </ScrollView>
  );
}

function Menu({ icon, title, route }: { icon: any; title: string; route: string }) {
  return (
    <TouchableOpacity style={styles.itemCard} onPress={() => router.push(route as any)}>
      <Ionicons name={icon} size={28} color="#00aaff" />
      <Text style={styles.itemTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fe', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  greeting: { fontSize: 24, fontWeight: '800', color: '#1a1a1a' },
  subGreeting: { fontSize: 13, color: '#999', marginTop: 2 },
  highlightCard: { backgroundColor: '#003366', padding: 20, borderRadius: 20, marginBottom: 20 },
  cardLabel: { color: '#ffffff80', fontSize: 12, marginBottom: 4 },
  cardStatus: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#ffffff20', marginBottom: 12 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cardSmall: { color: '#ffffff80', fontSize: 12, marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statBox: { flex: 1, backgroundColor: '#fff', padding: 14, borderRadius: 14, marginHorizontal: 4, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#1a1a1a' },
  statLabel: { fontSize: 11, color: '#999', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  itemCard: { width: '47%', backgroundColor: '#fff', padding: 18, borderRadius: 16, marginBottom: 14, alignItems: 'center' },
  itemTitle: { fontSize: 13, fontWeight: '700', color: '#333', marginTop: 8 },
});
