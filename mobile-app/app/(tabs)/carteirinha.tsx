import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { request } from '@/services/api';

export default function CarteirinhaScreen() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useState(() => {
    (async () => {
      try {
        const mats = await request('/aluno/matriculas');
        setData(mats?.[0] || null);
      } catch {} finally { setLoading(false); }
    })();
  });

  if (loading) {
    return <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color="#00aaff" /></View>;
  }

  const curso = data?.id_curso?.nome_curso || '---';
  const turma = data?.id_turma?.nome || '---';
  const matNum = data?.numero_matricula || '---';

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={s.card}>
        <View style={s.topBar}>
          <Text style={s.senaiText}>SIGE</Text>
          <Text style={s.senaiSub}>Sistema Integrado de Gestao Escolar</Text>
        </View>
        <View style={s.photoArea}>
          <View style={s.photoPlaceholder}>
            <Text style={s.photoText}>{user?.nomeCompleto?.charAt(0) || 'A'}</Text>
          </View>
        </View>
        <Text style={s.nome}>{user?.nomeCompleto || '---'}</Text>
        <IR label="CPF" value={user?.cpf || '---'} />
        <IR label="Matricula" value={matNum} />
        <IR label="Curso" value={curso} />
        <IR label="Turma" value={turma} />
        <IR label="Email" value={user?.email || '---'} />
      </View>
    </ScrollView>
  );
}

function IR({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f1f4', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  topBar: { marginBottom: 20 },
  senaiText: { fontSize: 22, fontWeight: '800', color: '#003366' },
  senaiSub: { fontSize: 10, color: '#999', marginTop: 2 },
  photoArea: { alignItems: 'center', marginBottom: 16 },
  photoPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center' },
  photoText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  nome: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', textAlign: 'center', marginBottom: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  label: { fontSize: 13, color: '#999', fontWeight: '500' },
  value: { fontSize: 13, color: '#333', fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
});
