import { User } from "src/entity/User";

export async function isPhoneAlreadyExist(phone: string) {
  const user = await User.findOne({ where: { phone } });
  console.log(!!user);
  return !!user;
}
