export function truncateAddress(
  str: string,
  frontLength = 6,
  backLength = 4,
): string {
  if (String(str)?.length <= frontLength + backLength) {
    // If the string is short enough, no need to truncate
    return String(str);
  }

  // Otherwise, truncate
  const start = String(str)?.substring(0, frontLength);
  const end = String(str)?.substring(String(str).length - backLength);
  return `${start}...${end}`;
}

export function formatVotesAmount(number: number | bigint | null | undefined): string {
  if (number === undefined || number === null) {
    return "0";
  }

  // Define thresholds as BigInts
  const billion = BigInt(1e9);
  const million = BigInt(1e6);
  const thousand = BigInt(1e3);

  // Handle bigint separately
  if (typeof number === 'bigint') {
    if (number >= billion) {
      return `${(number / billion)}b`;
    } else if (number >= million) {
      return `${(number / million)}m`;
    } else if (number >= thousand) {
      return `${(number / thousand)}k`;
    } else {
      return `${number}`;
    }
  }
  // Handle numbers
  else {
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
}

