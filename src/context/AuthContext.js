import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const restaurarSesion = async () => {
      try {
        const guardado = await AsyncStorage.getItem("sesion");
        if (guardado) {
          const sesion = JSON.parse(guardado);
          setToken(sesion.token);
          setUsuario(sesion.usuario);
        }
      } finally {
        setCargando(false);
      }
    };
    restaurarSesion();
  }, []);

  const iniciarSesion = async (data) => {
    const sesion = {
      token: data.token,
      usuario: { id: data.id, nombre: data.nombre, email: data.email },
    };
    await AsyncStorage.setItem("sesion", JSON.stringify(sesion));
    setToken(sesion.token);
    setUsuario(sesion.usuario);
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem("sesion");
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{ usuario, token, cargando, iniciarSesion, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
