import { IQ_CODE } from "@api/modules/constants/phone";

export function normalizePhone(value: string, code = IQ_CODE): string {
  const search = new RegExp(`^((0.|\\+)${code}|0)`);
  return `+${code}${value.replace(search, "")}`;
}
