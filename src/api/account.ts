export interface MyAccountResponse {
  username: string;
  email: string;
  role: string;
}

export interface UpdateAccountRequest {
  username: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

const API_BASE_RAW = (import.meta as any).env?.VITE_API_BASE_URL ?? "";
const API_BASE = (typeof API_BASE_RAW === "string" ? API_BASE_RAW.trim() : "");

function url(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!API_BASE) return p;
  const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  return `${base}${p}`;
}

function authHeaders(): HeadersInit {
  const token = (typeof localStorage !== "undefined" && localStorage.getItem("ADMIN_TOKEN")) || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getMyAccount(): Promise<MyAccountResponse> {
  const res = await fetch(url('/api/me'), { headers: { ...authHeaders() }, credentials: 'include' });
  if (!res.ok) throw new Error(`Error ${res.status} obteniendo mi cuenta`);
  return res.json();
}

export async function updateMyAccount(body: UpdateAccountRequest): Promise<MyAccountResponse> {
  const res = await fetch(url('/api/me'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(t || `Error ${res.status} actualizando mi cuenta`);
  }
  return res.json();
}

export async function changeMyPassword(body: ChangePasswordRequest): Promise<void> {
  const res = await fetch(url('/api/me/password'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(t || `Error ${res.status} cambiando contraseña`);
  }
}
