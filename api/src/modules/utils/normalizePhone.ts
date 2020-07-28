export function normalizePhone(value: string): string {
  return value.replace(/^(([0-9][0-9]|\+)964|0)/, "");
}
