export function firstCharToLowerCase(str: string): string {
  if (!str) return "";
  return str[0].toLowerCase() + str.substring(1);
}
