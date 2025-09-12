export interface LoginResponse {
  token: string;
  roles: string[];
  expiresAt: string;
}

const API_BASE_RAW = (import.meta as any).env?.VITE_API_BASE_URL ?? "";
const API_BASE = (typeof API_BASE_RAW === "string" ? API_BASE_RAW.trim() : "");

function url(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!API_BASE) return p; // same-origin relative when not set
  const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  return `${base}${p}`;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(url("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    throw new Error("Credenciales inválidas");
  }
  return res.json();
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  roleWanted: 'PATIENT' | 'PROFESSIONAL';
}

export async function register(data: RegisterRequest): Promise<void> {
  const res = await fetch(url('/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Registro falló (${res.status}): ${t}`);
  }
}
