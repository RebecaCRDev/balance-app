const API_URL = "http://192.168.1.158:8080/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "Error de conexión con el servidor");
  }
  return data;
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
