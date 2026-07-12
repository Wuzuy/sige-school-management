import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { request, setAuth, getApiBase, setApiBase, resetApiBase } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [apiUrl, setApiUrl] = useState(getApiBase());
  const { login, logout } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      const data = await request('/usuarios/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha: password }),
      });
      login(data.token, data.usuario);
      // Verifica se o usuario tem acesso ao portal escolar (aluno)
      const perms = await request('/cargos/minhas/permissoes');
      const hasEscolar = Array.isArray(perms) && perms.includes('portal.escolar');
      if (!hasEscolar) {
        logout();
        Alert.alert('Acesso Negado', 'Apenas alunos podem acessar o aplicativo.');
        setLoading(false);
        return;
      }
      router.replace('/(tabs)/secretaria');
    } catch (e: any) {
      Alert.alert('Erro de conexao', e.message || 'Network request failed');
    } finally {
      setLoading(false);
    }
  };

  const saveApiUrl = () => {
    if (apiUrl.trim()) {
      setApiBase(apiUrl.trim().replace(/\/$/, ''));
      setShowConfig(false);
    }
  };

  const resetUrl = () => {
    resetApiBase();
    setApiUrl(getApiBase());
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.configBtn} onPress={() => setShowConfig(true)}>
          <Text style={styles.configBtnText}>Configurar API</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>SIGE</Text>
        <Text style={styles.subtitle}>Portal do Aluno</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
        </TouchableOpacity>

      </View>

      <Modal visible={showConfig} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configurar API</Text>
            <Text style={styles.modalSub}>
              Digite o endereco IP do computador que roda o backend.{"\n"}
              Ex: http://192.168.1.100:8080/api
            </Text>
            <TextInput
              style={styles.input}
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholder="http://IP:8080/api"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={saveApiUrl}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetBtn} onPress={resetUrl}>
              <Text style={styles.resetText}>Restaurar padrao</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfig(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f1f4' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  configBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  configBtnText: { color: '#00aaff', fontSize: 13, fontWeight: '600' },
  logo: { fontSize: 36, fontWeight: 'bold', color: '#003366', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 32 },
  input: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#d7dee8' },
  button: { backgroundColor: '#00aaff', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  guestBtn: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#f3f4f6' },
  guestBtnText: { color: '#222', fontWeight: '600', fontSize: 15 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 24 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#666', marginBottom: 20, lineHeight: 18 },
  resetBtn: { alignItems: 'center', marginTop: 12 },
  resetText: { color: '#e74c3c', fontSize: 13 },
  cancelBtn: { alignItems: 'center', marginTop: 8 },
  cancelText: { color: '#999', fontSize: 13 },
});
