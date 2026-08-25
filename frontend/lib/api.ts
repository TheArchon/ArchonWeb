const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export type SessionType = "pyrogram" | "telethon";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

export function startAuth(session_type: SessionType) {
  return request<{ auth_id: string; next_step: "phone" }>("/auth/start", {
    method: "POST",
    body: JSON.stringify({ session_type }),
  });
}

export function submitPhone(auth_id: string, phone: string) {
  return request<{ ok: boolean; next_step: "otp" }>("/auth/phone", {
    method: "POST",
    body: JSON.stringify({ auth_id, phone }),
  });
}

export function cancelAuth(auth_id: string) {
  return request<{ ok: boolean }>(
    `/auth/cancel/${encodeURIComponent(auth_id)}`,
    {
      method: "DELETE",
    }
  );
}

export async function getHealth() {
  return request<{ status: string }>("/health");
}
