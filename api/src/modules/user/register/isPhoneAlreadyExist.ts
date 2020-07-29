import { User } from "@api/entity/User";

export async function isPhoneAlreadyExist(phone: string) {
  const user = await User.findOne({ where: { phone } });
  return !!user;
}
