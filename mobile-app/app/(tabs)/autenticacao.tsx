import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { request } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

let timer: ReturnType<typeof setInterval> | null = null;

export default function AutenticacaoScreen() {
  const { user } = useAuth();
  const [codigo, setCodigo] = useState<string | null>(null);
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
        setInfo(null);
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
        <Ionicons name="shield-checkmark" size={40} color="#003366" />
        <Text style={styles.title}>Acesso a Catraca</Text>
        <Text style={styles.subtitle}>
          Gere um QR Code para liberar seu acesso
        </Text>

        <TouchableOpacity style={styles.generateButton} onPress={gerarCodigo} disabled={loading}>
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.generateText}>{loading ? 'Gerando...' : 'Gerar QR Code'}</Text>
        </TouchableOpacity>

        {codigo && (
          <View style={styles.qrContainer}>
            <QRCode
              value={codigo}
              size={200}
              backgroundColor="#fff"
              color="#003366"
            />
            <Text style={styles.codeLabel}>Ou digite o codigo:</Text>
            <Text style={styles.codeText}>{codigo}</Text>

            <View style={styles.timerRow}>
              <Ionicons name="time-outline" size={16} color={segundos <= 10 ? '#e74c3c' : '#999'} />
              <Text style={[styles.timerText, segundos <= 10 && { color: '#e74c3c' }]}>
                Expira em {segundos}s
              </Text>
            </View>

            {info?.curso && (
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Acesso liberado para:</Text>
                <Text style={styles.infoValue}>{user?.nomeCompleto}</Text>
                <Text style={styles.infoSub}>{info.curso}</Text>
                {info.turma && <Text style={styles.infoSub}>Turma: {info.turma}</Text>}
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
  title: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginTop: 10 },
  subtitle: { fontSize: 13, color: '#999', textAlign: 'center', marginTop: 4, marginBottom: 24, lineHeight: 18 },
  generateButton: { flexDirection: 'row', backgroundColor: '#003366', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12, alignItems: 'center', gap: 8 },
  generateText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  qrContainer: { marginTop: 24, alignItems: 'center', backgroundColor: '#f8f9fe', padding: 20, borderRadius: 16, width: '100%' },
  codeLabel: { fontSize: 12, color: '#999', marginTop: 16, marginBottom: 4 },
  codeText: { fontSize: 28, fontWeight: '800', color: '#003366', letterSpacing: 6, fontVariant: ['tabular-nums'] },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 },
  timerText: { fontSize: 13, color: '#999', fontWeight: '600' },
  infoBox: { marginTop: 16, alignItems: 'center', backgroundColor: '#e8f4fd', padding: 14, borderRadius: 12, width: '100%' },
  infoLabel: { fontSize: 11, color: '#666', marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#003366' },
  infoSub: { fontSize: 11, color: '#666', marginTop: 2 },
});
