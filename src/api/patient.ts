import type { AppointmentResponse } from "./admin";

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

export async function getMyAppointmentsAsPatient(fromIso: string, toIso: string): Promise<AppointmentResponse[]> {
  const res = await fetch(url(`/api/patient/appointments?from=${encodeURIComponent(fromIso)}&to=${encodeURIComponent(toIso)}`), {
    headers: { ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Error ${res.status} listando mis turnos`);
  return res.json();
}

export function exportMyAppointmentsCsvAsPatient(fromIso: string, toIso: string) {
  const u = url(`/api/patient/appointments/export?from=${encodeURIComponent(fromIso)}&to=${encodeURIComponent(toIso)}`);
  window.open(u, "_blank");
}


export async function cancelMyAppointment(id: number): Promise<void> {
  const res = await fetch(url(`/api/patient/appointments/${id}/cancel`), {
    method: 'PATCH',
    headers: { ...authHeaders() },
    credentials: 'include',
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(t || `No se pudo cancelar (${res.status})`);
  }
}
