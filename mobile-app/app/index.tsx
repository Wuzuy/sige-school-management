import { router } from "expo-router"; // <--- Importante: importamos o roteador aqui
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Validação mockada rápida
    if (email !== "" && password !== "") {
      // Redireciona para a tela de secretaria dentro das abas
      router.replace("/(tabs)/secretaria");
    } else {
      Alert.alert("Erro", "Preencha os campos!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIGE</Text>
      <Text style={styles.subtitle}>Acesso ao Portal</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (seus estilos continuam iguais)
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f0f1f4",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#003366",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d7dee8",
  },
  button: {
    backgroundColor: "#00aaff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
