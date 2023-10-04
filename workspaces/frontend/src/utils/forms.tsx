export function validateTwitterHandle(handle: string): string | boolean {
  if (!handle) return true;
  const regex = /^@([A-Za-z0-9_]{1,15})$/;
  return regex.test(handle) || "Invalid Twitter handle.";
}

export function validateTelegramHandle(handle: string): string | boolean {
  if (!handle) return true;
  const regex = /^@([A-Za-z0-9_]{5,32})$/;
  return regex.test(handle) || "Invalid Telegram handle.";
}

export function validateDiscordHandle(handle: string): string | boolean {
  if (!handle) return true;
  const regex = /^([A-Za-z0-9_]{2,32})#(\d{4})$/;
  return regex.test(handle) || "Invalid Discord handle.";
}

export function validateDiscourseUsername(username: string): string | boolean {
  if (!username) return true;
  const regex = /^[A-Za-z0-9_]{2,32}$/;
  return regex.test(username) || "Invalid Discourse username.";
}
