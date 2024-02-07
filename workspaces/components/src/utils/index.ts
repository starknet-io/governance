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

export function formatVotesAmount(number: bigint | number | undefined | null) {
  if (number === undefined || number === null) {
    return "0";
  }

  // For bigint calculations, explicitly define thresholds
  const billion = BigInt(1e9);
  const million = BigInt(1e6);
  const thousand = BigInt(1e3);

  if (typeof number === "bigint") {
    // Determine if the number is a multiple of thousand, million, or billion
    const isMultipleOfBillion = number % billion === BigInt(0);
    const isMultipleOfMillion = number % million === BigInt(0);
    const isMultipleOfThousand = number % thousand === BigInt(0);

    if (number >= billion) {
      return isMultipleOfBillion
        ? `${number / billion}b`
        : `${(Number(number) / 1e9).toFixed(1).replace(/\.0$/, "")}b`;
    } else if (number >= million) {
      return isMultipleOfMillion
        ? `${number / million}m`
        : `${(Number(number) / 1e6).toFixed(1).replace(/\.0$/, "")}m`;
    } else if (number >= thousand) {
      return isMultipleOfThousand
        ? `${number / thousand}k`
        : `${(Number(number) / 1e3).toFixed(1).replace(/\.0$/, "")}k`;
    } else {
      return `${number}`;
    }
  } else {
    // For non-bigint numbers, the logic remains unchanged
    if (number >= 1e9) {
      return number % 1e9 === 0
        ? `${number / 1e9}b`
        : `${(number / 1e9).toFixed(1).replace(/\.0$/, "")}b`;
    } else if (number >= 1e6) {
      return number % 1e6 === 0
        ? `${number / 1e6}m`
        : `${(number / 1e6).toFixed(1).replace(/\.0$/, "")}m`;
    } else if (number >= 1e3) {
      return number % 1e3 === 0
        ? `${number / 1e3}k`
        : `${(number / 1e3).toFixed(1).replace(/\.0$/, "")}k`;
    } else {
      return `${number}`;
    }
  }
}
