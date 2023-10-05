export function truncateAddress(
  str: string,
  frontLength = 6,
  backLength = 4,
): string {
  if (str?.length <= frontLength + backLength) {
    // If the string is short enough, no need to truncate
    return str;
  }

  // Otherwise, truncate
  const start = str.substring(0, frontLength);
  const end = str.substring(str.length - backLength);
  return `${start}...${end}`;
}

export function formatVotesAmount(number: number | null | undefined): string {
  if (number === undefined || number === null) {
    return "0";
  }
  if (number >= 1e9) {
    return `${(number / 1e9).toFixed(1).replace(".0", "")}b`;
  } else if (number >= 1e6) {
    return `${(number / 1e6).toFixed(1).replace(".0", "")}m`;
  } else if (number >= 1e3) {
    return `${(number / 1e3).toFixed(1).replace(".0", "")}k`;
  } else {
    return `${number}`;
  }
}
