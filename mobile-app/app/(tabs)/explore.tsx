import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { request } from '@/services/api';

export default function ExploreScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');
  const [permChecked, setPermChecked] = useState(false);
  const [hasPerm, setHasPerm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const perms = await request('/cargos/minhas/permissoes');
        setHasPerm(Array.isArray(perms) && perms.includes('catraca.acessar'));
      } catch {
        setHasPerm(false);
      } finally {
        setPermChecked(true);
      }
    })();
  }, []);

  const validar = async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setScanned(true);
    setResult(null);
    try {
      const data = await request('/auth/validar-codigo', {
        method: 'POST',
        body: JSON.stringify({ codigo: code.trim() }),
      });
      setResult(data);
    } catch (e: any) {
      Alert.alert('Acesso Negado', e.message || 'Codigo invalido');
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) validar(data);
  };

  if (!permChecked) {
    return <View style={s.center}><ActivityIndicator size="large" color="#00aaff" /></View>;
  }

  if (!hasPerm) {
    return (
      <View style={s.center}>
        <Ionicons name="lock-closed" size={48} color="#e74c3c" />
        <Text style={s.deniedTitle}>Acesso Restrito</Text>
        <Text style={s.deniedText}>Apenas funcionarios da secretaria podem acessar o autenticador.</Text>
      </View>
    );
  }

  if (!permission) {
    return <View style={s.center}><ActivityIndicator size="large" color="#00aaff" /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={s.center}>
        <Ionicons name="camera-outline" size={48} color="#999" />
        <Text style={s.permissionText}>Permissao da camera necessaria</Text>
        <TouchableOpacity style={s.button} onPress={requestPermission}>
          <Text style={s.buttonText}>Permitir Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.linkBtn} onPress={() => setMode('manual')}>
          <Text style={s.linkText}>Digitar codigo manualmente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      {mode === 'camera' && !result && (
        <View style={s.cameraContainer}>
          <View style={s.cameraWrapper}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            <View style={s.overlay}>
              <View style={s.scanFrame} />
              <Text style={s.scanHint}>Aproxime o QR Code do aluno</Text>
            </View>
          </View>
          <View style={s.cameraFooter}>
            <TouchableOpacity onPress={() => { setScanned(false); setResult(null); }}>
              <Text style={s.linkText}>Escanear novamente</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMode('manual'); setScanned(false); }}>
              <Text style={s.linkText}>Digitar codigo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {mode === 'manual' && !result && (
        <View style={s.manualContainer}>
          <Ionicons name="keypad-outline" size={48} color="#003366" />
          <Text style={s.manualTitle}>Digite o codigo de acesso</Text>
          <TextInput
            style={s.input}
            placeholder="000000"
            value={codigo}
            onChangeText={setCodigo}
            keyboardType="number-pad"
            maxLength={6}
          />
          <TouchableOpacity style={s.button} onPress={() => validar(codigo)} disabled={loading}>
            <Text style={s.buttonText}>{loading ? 'Validando...' : 'Validar'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.linkBtn} onPress={() => { setMode('camera'); setCodigo(''); }}>
            <Text style={s.linkText}>Usar camera</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#00aaff" />
          <Text style={s.loadingText}>Validando acesso...</Text>
        </View>
      )}

      {result && (
        <ScrollView style={s.resultContainer} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={s.resultCard}>
            <Ionicons name="checkmark-circle" size={48} color="#27ae60" />
            <Text style={s.resultTitle}>Acesso Liberado</Text>

            <View style={s.avatar}>
              <Text style={s.avatarText}>
                {(result.usuario?.nome_completo || '?').charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={s.nome}>{result.usuario?.nome_completo || '-'}</Text>

            <View style={s.divider} />

            <InfoRow label="CPF" value={result.usuario?.cpf || '-'} />
            <InfoRow label="Email" value={result.usuario?.email || '-'} />

            {result.matricula && (
              <>
                <InfoRow label="Curso" value={result.matricula.curso || '-'} />
                <InfoRow label="Turma" value={result.matricula.turma || '-'} />
                <InfoRow label="Matricula" value={result.matricula.numero || '-'} />
                <InfoRow
                  label="Status"
                  value={result.matricula.status || '-'}
                  valueColor={result.matricula.status === 'ATIVO' ? '#27ae60' : '#e74c3c'}
                />
              </>
            )}

            <TouchableOpacity
              style={s.novoBtn}
              onPress={() => { setResult(null); setScanned(false); setCodigo(''); }}
            >
              <Text style={s.novoBtnText}>Nova Autenticacao</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.label}>{label}</Text>
      <Text style={[s.value, valueColor ? { color: valueColor } : undefined]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f1f4' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f0f1f4' },

  // Camera
  cameraContainer: { flex: 1 },
  cameraWrapper: { flex: 1, position: 'relative' },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  scanFrame: { width: 220, height: 220, borderWidth: 3, borderColor: '#00aaff', borderRadius: 16, backgroundColor: 'transparent' },
  scanHint: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: 20, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  cameraFooter: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, backgroundColor: '#1a1a1a' },
  linkText: { color: '#00aaff', fontSize: 14, fontWeight: '600' },

  // Manual
  manualContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  manualTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginTop: 12, marginBottom: 24 },
  input: { backgroundColor: '#fff', padding: 16, borderRadius: 12, fontSize: 28, letterSpacing: 8, textAlign: 'center', width: '80%', marginBottom: 16, borderWidth: 1, borderColor: '#d7dee8' },
  button: { backgroundColor: '#003366', padding: 16, borderRadius: 12, width: '80%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkBtn: { marginTop: 16 },
  loadingText: { marginTop: 12, color: '#666', fontSize: 14 },

  // Result
  resultContainer: { flex: 1, padding: 16 },
  resultCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', marginTop: 20 },
  resultTitle: { fontSize: 20, fontWeight: '800', color: '#27ae60', marginTop: 8, marginBottom: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  nome: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  divider: { height: 1, backgroundColor: '#f0f0f0', width: '100%', marginVertical: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  label: { fontSize: 13, color: '#999' },
  value: { fontSize: 13, fontWeight: '600', color: '#333', maxWidth: '55%', textAlign: 'right' },
  novoBtn: { backgroundColor: '#00aaff', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, marginTop: 20 },
  novoBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  permissionText: { fontSize: 14, color: '#666', marginTop: 12, marginBottom: 16, textAlign: 'center' },
  deniedTitle: { fontSize: 20, fontWeight: '800', color: '#e74c3c', marginTop: 12, marginBottom: 8 },
  deniedText: { fontSize: 14, color: '#666', textAlign: 'center', paddingHorizontal: 32, lineHeight: 20 },
});
