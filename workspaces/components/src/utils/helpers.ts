import { format, formatDistanceToNow } from "date-fns";
export function stripHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

type DateInput = Date | number;

export function formatDate(
  input: DateInput,
  dateFormat = "yyyy-MM-dd",
  relative = false
): string {
  let date: Date;

  if (typeof input === "number") {
    // If the input is a timestamp in seconds, convert it to milliseconds and then to a Date object
    date = new Date(input * 1000);
  } else {
    // If the input is a Date object, use it as is
    date = input;
  }

  // If relative is true, format the date relative to now
  if (relative) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  // Otherwise, format the date according to the provided format
  return format(date, dateFormat);
}
