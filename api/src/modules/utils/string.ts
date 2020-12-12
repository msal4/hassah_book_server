import tsquery from "pg-tsquery";

export function lowerCamelCase(str: string): string {
  if (!str) return "";
  return str[0].toLowerCase() + str.substring(1);
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
