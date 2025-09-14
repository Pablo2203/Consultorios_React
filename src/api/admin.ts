import type { CoverageType, Specialty } from "./appointments";

export interface AppointmentResponse {
  id: number;
  professionalId: number | null;
  specialty: Specialty;
  startsAt: string | null;
  endsAt: string | null;
  status: "REQUESTED" | "SCHEDULED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  coverageType: CoverageType | null;
  healthInsurance: string | null;
  preferredProfessional: string | null;
  subject: string | null;
  message: string | null;
}

export interface ScheduleAppointmentRequest {
  professionalId: number;
  startsAt: string; // LocalDateTime ISO, e.g. 2025-09-05T13:00:00
  endsAt?: string | null; // optional; backend computes if null
}

export interface WhatsAppTemplateResponse {
  text: string;
  waLink: string;
}

const API_BASE_RAW = (import.meta as any).env?.VITE_API_BASE_URL ?? "";
const API_BASE = (typeof API_BASE_RAW === "string" ? API_BASE_RAW.trim() : "");

function authHeaders(): HeadersInit {
  const token = (typeof localStorage !== "undefined" && localStorage.getItem("ADMIN_TOKEN")) || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function url(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!API_BASE) return p;
  const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  return `${base}${p}`;
}

export async function getRequestedAppointments(): Promise<AppointmentResponse[]> {
  const res = await fetch(url("/api/admin/appointments/requests"), {
    credentials: "include",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Error ${res.status} al listar solicitudes`);
  return res.json();
}

export async function scheduleAppointment(
  id: number,
  body: ScheduleAppointmentRequest
): Promise<AppointmentResponse> {
  const res = await fetch(url(`/api/admin/appointments/${id}/schedule`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Error ${res.status} al agendar`);
  return res.json();
}

export async function getWhatsAppTemplate(id: number): Promise<WhatsAppTemplateResponse> {
  const res = await fetch(url(`/api/admin/appointments/${id}/whatsapp-template`), {
    credentials: "include",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Error ${res.status} obteniendo plantilla`);
  return res.json();
}

export interface ProfessionalSummary {
  id: number;
  username: string;
  email?: string;
}

export async function getProfessionals(specialty?: string): Promise<ProfessionalSummary[]> {
  const path = specialty ? `/api/admin/professionals?specialty=${encodeURIComponent(specialty)}` : "/api/admin/professionals";
  const res = await fetch(url(path), {
    credentials: "include",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Error ${res.status} listando profesionales`);
  return res.json();
}

export async function getAppointmentsByProfessional(
  userId: number,
  fromIso: string,
  toIso: string
) {
  const res = await fetch(url(`/api/admin/professionals/${userId}/appointments?from=${encodeURIComponent(fromIso)}&to=${encodeURIComponent(toIso)}`), {
    credentials: "include",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Error ${res.status} listando agenda`);
  return res.json();
}

export function exportAppointmentsCsvByAdmin(userId: number, fromIso: string, toIso: string) {
  const u = url(`/api/admin/professionals/${userId}/appointments/export?from=${encodeURIComponent(fromIso)}&to=${encodeURIComponent(toIso)}`);
  window.open(u, "_blank");
}

// Crear/actualizar/cancelar (admin)
export async function createAppointmentDirect(body: {
  professionalId: number;
  specialty: string;
  startsAt: string;
  endsAt?: string | null;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  coverageType?: string;
  healthInsurance?: string;
  healthPlan?: string;
  affiliateNumber?: string;
  subject?: string;
  message?: string;
}) {
  const res = await fetch(url('/api/admin/appointments'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Error ${res.status} creando turno`);
  return res.json();
}

export async function updateAppointmentByAdmin(id: number, body: { startsAt: string; endsAt?: string | null; status: string; notes?: string; email?: string }) {
  const res = await fetch(url(`/api/admin/appointments/${id}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Error ${res.status} actualizando turno`);
  return res.json();
}

export async function cancelAppointmentByAdmin(id: number) {
  const res = await fetch(url(`/api/admin/appointments/${id}/cancel`), {
    method: 'PATCH',
    headers: { ...authHeaders() },
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Error ${res.status} cancelando turno`);
}

// Usuarios (admin)
export type UserSummary = { id: number; username: string; email?: string; enabled: boolean; role: string };

export async function getAllUsers(): Promise<UserSummary[]> {
  const res = await fetch(url('/api/admin/users'), { credentials: 'include', headers: { ...authHeaders() } });
  if (!res.ok) throw new Error(`Error ${res.status} listando usuarios`);
  return res.json();
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(url(`/api/admin/users/${id}`), { method: 'DELETE', credentials: 'include', headers: { ...authHeaders() } });
  if (!res.ok && res.status !== 204) throw new Error(`Error ${res.status} eliminando usuario`);
}
