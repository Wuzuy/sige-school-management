import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { request } from '@/services/api';

let timer: ReturnType<typeof setInterval> | null = null;

export default function AutenticacaoScreen() {
  const [codigo, setCodigo] = useState<string | null>(null);
  const [expiraEm, setExpiraEm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [info, setInfo] = useState<{ curso?: string; turma?: string } | null>(null);

  const iniciarContagem = (expiresAt: string) => {
    if (timer) clearInterval(timer);
    const atualizar = () => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setSegundos(diff);
      if (diff <= 0) {
        if (timer) clearInterval(timer);
        setCodigo(null);
      }
    };
    atualizar();
    timer = setInterval(atualizar, 1000);
  };

  const gerarCodigo = async () => {
    setLoading(true);
    try {
      const data = await request('/auth/gerar-codigo', { method: 'POST' });
      setCodigo(data.codigo);
      setExpiraEm(data.expira_em);
      setInfo({ curso: data.curso, turma: data.turma });
      iniciarContagem(data.expira_em);
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Falha ao gerar codigo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="shield-checkmark" size={48} color="#003366" />
        <Text style={styles.title}>Autenticacao de Acesso</Text>
        <Text style={styles.subtitle}>
          Gere um codigo unico para liberar o acesso na catraca
        </Text>

        <TouchableOpacity style={styles.generateButton} onPress={gerarCodigo} disabled={loading}>
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.generateText}>{loading ? 'Gerando...' : 'Gerar Codigo'}</Text>
        </TouchableOpacity>

        {codigo && (
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Seu codigo de acesso</Text>
            <Text style={styles.codeText}>{codigo}</Text>
            <Text style={styles.timerText}>
              Expira em {segundos}s
            </Text>
            {info?.curso && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>{info.curso}</Text>
                {info.turma && <Text style={styles.infoText}>Turma: {info.turma}</Text>}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f1f4', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 },
  title: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginTop: 12 },
  subtitle: { fontSize: 13, color: '#999', textAlign: 'center', marginTop: 6, marginBottom: 24, lineHeight: 18 },
  generateButton: { flexDirection: 'row', backgroundColor: '#003366', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12, alignItems: 'center', gap: 8 },
  generateText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  codeContainer: { marginTop: 28, alignItems: 'center', backgroundColor: '#f8f9fe', padding: 20, borderRadius: 16, width: '100%' },
  codeLabel: { fontSize: 12, color: '#999', marginBottom: 8 },
  codeText: { fontSize: 42, fontWeight: '800', color: '#003366', letterSpacing: 8, fontVariant: ['tabular-nums'] },
  timerText: { fontSize: 13, color: '#e74c3c', marginTop: 8, fontWeight: '600' },
  infoBox: { marginTop: 12, alignItems: 'center' },
  infoText: { fontSize: 12, color: '#666', marginTop: 2 },
});
