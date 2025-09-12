export interface ProfessionalProfile {
  userId: number;
  firstName: string | null;
  lastName: string | null;
  studies: string | null;
  specialty: string | null;
  bio: string | null;
  photoUrl: string | null;
}

export interface ProfessionalProfileRequest {
  firstName?: string;
  lastName?: string;
  studies?: string;
  specialty?: string;
  bio?: string;
  photoUrl?: string;
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

// self-profile functions are defined later in this file

export interface AppointmentItem {
  id: number;
  startsAt: string;
  endsAt: string | null;
  firstName: string;
  lastName: string;
}

export async function getMyAppointments(fromIso: string, toIso: string) {
  const res = await fetch(url(`/api/professional/appointments?from=${encodeURIComponent(fromIso)}&to=${encodeURIComponent(toIso)}`), {
    headers: { ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Error ${res.status} listando agenda`);
  return res.json();
}

export function exportMyAppointmentsCsv(fromIso: string, toIso: string) {
  const u = url(`/api/professional/appointments/export?from=${encodeURIComponent(fromIso)}&to=${encodeURIComponent(toIso)}`);
  window.open(u, "_blank");
}

// Professional self-profile endpoints
export async function getMyProfile(): Promise<ProfessionalProfile> {
  const res = await fetch(url(`/api/professional/me/profile`), {
    headers: { ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Error ${res.status} obteniendo mi perfil`);
  return res.json();
}

export async function updateMyProfile(body: ProfessionalProfileRequest): Promise<ProfessionalProfile> {
  const res = await fetch(url(`/api/professional/me/profile`), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Error ${res.status} actualizando mi perfil`);
  return res.json();
}

export async function uploadMyPhoto(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(url(`/api/professional/me/profile/photo`), {
    method: "POST",
    headers: { ...authHeaders() },
    body: form,
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Error ${res.status} subiendo foto`);
  return res.json();
}

// Admin helpers
export async function getProfileByAdmin(userId: number): Promise<ProfessionalProfile> {
  const res = await fetch(url(`/api/admin/professionals/${userId}/profile`), {
    headers: { ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Error ${res.status} obteniendo perfil`);
  return res.json();
}

export async function updateProfileByAdmin(userId: number, body: ProfessionalProfileRequest): Promise<ProfessionalProfile> {
  const res = await fetch(url(`/api/admin/professionals/${userId}/profile`), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Error ${res.status} actualizando perfil`);
  return res.json();
}

export async function uploadPhotoByAdmin(userId: number, file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(url(`/api/admin/professionals/${userId}/profile/photo`), {
    method: "POST",
    headers: { ...authHeaders() },
    body: form,
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Error ${res.status} subiendo foto`);
  return res.json();
}

export async function getAppointmentsByProfessional(userId: number, fromIso: string, toIso: string) {
  const res = await fetch(url(`/api/admin/professionals/${userId}/appointments?from=${encodeURIComponent(fromIso)}&to=${encodeURIComponent(toIso)}`), {
    headers: { ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Error ${res.status} listando agenda`);
  return res.json();
}

export function exportAppointmentsCsvByAdmin(userId: number, fromIso: string, toIso: string) {
  const u = url(`/api/admin/professionals/${userId}/appointments/export?from=${encodeURIComponent(fromIso)}&to=${encodeURIComponent(toIso)}`);
  window.open(u, "_blank");
}
