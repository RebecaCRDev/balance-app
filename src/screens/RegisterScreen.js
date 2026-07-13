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
import { login, register } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { iniciarSesion } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async () => {
    if (!nombre.trim() || !email.trim() || !password) {
      Alert.alert("Balance", "Rellena todos los campos");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Balance", "La contrasena debe tener al menos 8 caracteres");
      return;
    }
    setCargando(true);
    try {
      await register(nombre.trim(), email.trim(), password);
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
      <Text style={styles.titulo}>Crear cuenta</Text>

      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#9b8a92"
          value={nombre}
          onChangeText={setNombre}
          maxLength={100}
        />
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
          placeholder="Contrasena (minimo 8 caracteres)"
          placeholderTextColor="#9b8a92"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.boton, cargando && styles.botonDeshabilitado]}
          onPress={handleRegistro}
          disabled={cargando}
        >
          <Text style={styles.botonTexto}>
            {cargando ? "Creando cuenta..." : "CREAR CUENTA"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.pie}>Ya tienes cuenta? Inicia sesion</Text>
      </TouchableOpacity>
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
    fontWeight: "600",
    color: "#5c4a52",
    textAlign: "center",
    marginBottom: 32,
  },
  formulario: { gap: 16 },
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
  botonDeshabilitado: { opacity: 0.6 },
  botonTexto: { color: "#ffffff", fontWeight: "700", letterSpacing: 1 },
  pie: { textAlign: "center", color: "#8a707c", marginTop: 40 },
});
