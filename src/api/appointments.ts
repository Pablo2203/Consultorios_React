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

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "";

function getBaseUrl(): string {
  // Allow relative paths in dev if env not set
  return API_BASE || "/";
}

export async function createAppointmentRequest(
  data: AppointmentRequestInput
): Promise<AppointmentRequestResponse> {
  const res = await fetch(new URL("api/appointments/requests", getBaseUrl()).toString(), {
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

