export type CoverageType = "INSURANCE" | "PRIVATE";

export type Specialty =
  | "PSIQUIATRIA"
  | "PSICOLOGIA"
  | "CARDIOLOGIA";

export interface AppointmentRequestInput {
  coverageType: CoverageType;
  healthInsurance?: string | null;
  specialty?: Specialty | null;
  preferredProfessional?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject?: string | null;
  message?: string | null;
}

export interface AppointmentRequestResponse {
  id: string | number;
}

const API_BASE_RAW = (import.meta as any).env?.VITE_API_BASE_URL ?? "";
const API_BASE = (typeof API_BASE_RAW === "string" ? API_BASE_RAW.trim() : "");

function url(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!API_BASE) return p;
  const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  return `${base}${p}`;
}

export async function createAppointmentRequest(
  data: AppointmentRequestInput
): Promise<AppointmentRequestResponse> {
  const res = await fetch(url("/api/appointments/requests"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error ${res.status} creando solicitud: ${text}`);
  }

  const location = res.headers.get("Location");
  try {
    const json = (await res.json()) as any;
    if (json && (json.id || json.identifier)) {
      return { id: json.id ?? json.identifier };
    }
  } catch (_) {
    // ignore parse errors; fall back to Location header
  }
  // Fallback: extract id from Location if present
  if (location) {
    const id = location.split("/").pop() || "";
    return { id };
  }
  // Last resort: return dummy; caller can still proceed
  return { id: "unknown" };
}

export function mapEspecialidadToEnum(value?: string | null): Specialty | null {
  if (!value) return null;
  const norm = value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  switch (norm) {
    case "psiquiatria":
      return "PSIQUIATRIA";
    case "psicologia":
      return "PSICOLOGIA";
    case "cardiologia":
      return "CARDIOLOGIA";
    default:
      return null;
  }
}
