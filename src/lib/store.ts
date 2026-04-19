export type FormData = {
  fullName: string;
  designation: string;
  workspace: string;
  mobile: string;
  email: string;
};

const KEY = "tfiber_certify_state_v1";

export type AppState = {
  answers: Record<number, number>;
  form?: FormData;
};

export function loadState(): AppState {
  if (typeof window === "undefined") return { answers: {} };
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return { answers: {} };
    return JSON.parse(raw) as AppState;
  } catch {
    return { answers: {} };
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(state));
}

export function clearState() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
