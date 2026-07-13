const API_URL = "https://balance-api-blau.onrender.com/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "Error de conexion con el servidor");
  }
  return data;
}

function conToken(token) {
  return { Authorization: `Bearer ${token}` };
}

export function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(nombre, email, password) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ nombre, email, password }),
  });
}

export function getHabitos(token) {
  return request("/habitos", { headers: conToken(token) });
}

export function getProgreso(token) {
  return request("/habitos/progreso", { headers: conToken(token) });
}

export function crearHabito(token, nombre) {
  return request("/habitos", {
    method: "POST",
    headers: conToken(token),
    body: JSON.stringify({ nombre }),
  });
}

export function completarHabito(token, id) {
  return request(`/habitos/${id}/completar`, {
    method: "POST",
    headers: conToken(token),
  });
}

export function descompletarHabito(token, id) {
  return request(`/habitos/${id}/completar`, {
    method: "DELETE",
    headers: conToken(token),
  });
}
