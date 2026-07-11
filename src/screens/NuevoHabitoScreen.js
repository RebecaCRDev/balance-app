import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { crearHabito } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function NuevoHabitoScreen({ navigation }) {
  const { token } = useAuth();
  const [nombre, setNombre] = useState("");
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      Alert.alert("Balance", "Escribe un nombre para el habito");
      return;
    }
    setGuardando(true);
    try {
      await crearHabito(token, nombre.trim());
      navigation.goBack();
    } catch (e) {
      Alert.alert("Balance", e.message);
      setGuardando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.titulo}>Nuevo habito</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del habito"
        placeholderTextColor="#9b8a92"
        value={nombre}
        onChangeText={setNombre}
        autoFocus
        maxLength={100}
      />

      <TouchableOpacity
        style={[styles.boton, guardando && styles.botonDeshabilitado]}
        onPress={handleGuardar}
        disabled={guardando}
      >
        <Text style={styles.botonTexto}>
          {guardando ? "Guardando..." : "GUARDAR HABITO"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancelar}>Cancelar</Text>
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
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#3d3238",
    marginBottom: 16,
  },
  boton: {
    backgroundColor: "#b98a9b",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  botonDeshabilitado: { opacity: 0.6 },
  botonTexto: { color: "#ffffff", fontWeight: "700", letterSpacing: 1 },
  cancelar: { textAlign: "center", color: "#8a707c", marginTop: 24 },
});
