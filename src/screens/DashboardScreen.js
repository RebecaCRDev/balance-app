import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  completarHabito,
  descompletarHabito,
  getHabitos,
  getProgreso,
} from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function DashboardScreen() {
  const { usuario, token, cerrarSesion } = useAuth();
  const [habitos, setHabitos] = useState([]);
  const [progreso, setProgreso] = useState(null);
  const [refrescando, setRefrescando] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      const [listaHabitos, datosProgreso] = await Promise.all([
        getHabitos(token),
        getProgreso(token),
      ]);
      setHabitos(listaHabitos);
      setProgreso(datosProgreso);
    } catch (e) {
      Alert.alert("Balance", e.message);
    }
  }, [token]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const onRefresh = async () => {
    setRefrescando(true);
    await cargarDatos();
    setRefrescando(false);
  };

  const toggleHabito = async (habito) => {
    try {
      const actualizado = habito.completadoHoy
        ? await descompletarHabito(token, habito.id)
        : await completarHabito(token, habito.id);

      setHabitos((prev) =>
        prev.map((h) => (h.id === actualizado.id ? actualizado : h))
      );
      const nuevoProgreso = await getProgreso(token);
      setProgreso(nuevoProgreso);
    } catch (e) {
      Alert.alert("Balance", e.message);
    }
  };

  const saludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos dias";
    if (hora < 20) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <View style={styles.container}>
      <View style={styles.cabecera}>
        <Text style={styles.titulo}>
          {saludo()}, {usuario?.nombre}
        </Text>
        <TouchableOpacity onPress={cerrarSesion}>
          <Text style={styles.salir}>Salir</Text>
        </TouchableOpacity>
      </View>

      {progreso && (
        <View style={styles.tarjetaProgreso}>
          <Text style={styles.progresoTexto}>
            Progreso de hoy: {progreso.completados} de {progreso.total} (
            {progreso.porcentaje}%)
          </Text>
          <View style={styles.barraFondo}>
            <View
              style={[styles.barraRelleno, { width: `${progreso.porcentaje}%` }]}
            />
          </View>
        </View>
      )}

      <FlatList
        data={habitos}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.vacio}>
            Aun no tienes habitos. Crea el primero!
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.habito}
            onPress={() => toggleHabito(item)}
          >
            <View
              style={[
                styles.checkbox,
                item.completadoHoy && styles.checkboxMarcado,
              ]}
            >
              {item.completadoHoy && <Text style={styles.tick}>{"\u2713"}</Text>}
            </View>
            <Text
              style={[
                styles.habitoNombre,
                item.completadoHoy && styles.habitoCompletado,
              ]}
            >
              {item.nombre}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8d5db",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  cabecera: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titulo: { fontSize: 22, fontWeight: "600", color: "#5c4a52" },
  salir: { color: "#8a707c", fontSize: 14 },
  tarjetaProgreso: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  progresoTexto: { color: "#5c4a52", marginBottom: 10, fontWeight: "500" },
  barraFondo: {
    height: 10,
    backgroundColor: "#e8d5db",
    borderRadius: 5,
    overflow: "hidden",
  },
  barraRelleno: {
    height: "100%",
    backgroundColor: "#b98a9b",
    borderRadius: 5,
  },
  habito: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#b98a9b",
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxMarcado: { backgroundColor: "#b98a9b" },
  tick: { color: "#ffffff", fontWeight: "700" },
  habitoNombre: { fontSize: 16, color: "#3d3238" },
  habitoCompletado: {
    textDecorationLine: "line-through",
    color: "#9b8a92",
  },
  vacio: { textAlign: "center", color: "#8a707c", marginTop: 40 },
});
