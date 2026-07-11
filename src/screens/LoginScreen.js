import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { login } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { iniciarSesion } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Balance", "Rellena email y contrasena");
      return;
    }
    setCargando(true);
    try {
      const data = await login(email.trim(), password);
      await iniciarSesion(data);
    } catch (e) {
      Alert.alert("Balance", e.message);
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.titulo}>BIENVENIDA A BALANCE</Text>

      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9b8a92"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Contrasena"
          placeholderTextColor="#9b8a92"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.boton, cargando && styles.botonDeshabilitado]}
          onPress={handleLogin}
          disabled={cargando}
        >
          <Text style={styles.botonTexto}>
            {cargando ? "Entrando..." : "ENTRAR"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.pie}>No tienes cuenta? Registrate</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8d5db",
    justifyContent: "center",
    padding: 32,
  },
  titulo: {
    fontSize: 22,
    fontStyle: "italic",
    letterSpacing: 2,
    color: "#5c4a52",
    textAlign: "center",
    marginBottom: 48,
  },
  formulario: {
    gap: 16,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#3d3238",
  },
  boton: {
    backgroundColor: "#b98a9b",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  botonTexto: {
    color: "#ffffff",
    fontWeight: "700",
    letterSpacing: 1,
  },
  pie: {
    textAlign: "center",
    color: "#8a707c",
    marginTop: 40,
  },
});
