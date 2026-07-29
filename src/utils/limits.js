export const MAX_CHAT_LENGTH = 2000;
export const MAX_ESCALATE_FIELD = 500;
export const MAX_ESCALATE_NOTE = 2000;

export function safeString(value) {
  if (value == null) return '';
  return String(value);
}

export function clampText(value, max) {
  const text = safeString(value);
  if (text.length <= max) {
    return { text, truncated: false };
  }
  return { text: text.slice(0, max), truncated: true };
}
