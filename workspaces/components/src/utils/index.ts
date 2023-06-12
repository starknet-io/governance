export function truncateAddress(
  str: string,
  frontLength = 6,
  backLength = 4
): string {
  if (str.length <= frontLength + backLength) {
    // If the string is short enough, no need to truncate
    return str;
  }

  // Otherwise, truncate
  const start = str.substring(0, frontLength);
  const end = str.substring(str.length - backLength);
  return `${start}...${end}`;
}
