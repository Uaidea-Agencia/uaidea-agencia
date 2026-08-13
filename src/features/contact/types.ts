export interface ContactActionState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}
export const CONTACT_IDLE_STATE: ContactActionState = { status: "idle" };
