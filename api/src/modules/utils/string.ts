import dayjs from "dayjs";
import tsquery from "pg-tsquery";
import url from "url";

export function lowerCamelCase(str: string): string {
  if (!str) return "";
  return str[0].toLowerCase() + str.substring(1);
}

export function formatUrlToPath(value: string): string | undefined {
  return url.parse(value).pathname?.replace(new RegExp("^/+"), "");
}

export function formatFileName(filename: string): string {
  const date = dayjs().format("YYYYMMDDHH");
  const randomStr = Math.random().toString(36).substr(2, 5);
  const cleanName = filename
    .toLowerCase()
    .substring(0, filename.lastIndexOf("."))
    .replace(/[^a-z0-9]/g, "-")
    .substring(0, 10);
  return `${date}-${randomStr}-${cleanName}${filename.substring(filename.lastIndexOf("."))}`;
}

const query = tsquery();

// tsQuery turns user input into a valid postgres to_tsquery argument.
export function tsQuery(str: string): string {
  if (!str) return "";
  return query(str)
    .split("&")
    .map((word) => (word.endsWith(":*") ? word : word + ":*"))
    .join("&");
}
