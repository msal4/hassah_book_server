import { User } from "@api/entity/User";

export function isPhoneAlreadyExist(phone: string): Promise<boolean> {
  return User.findOne({ where: { phone } }).then(user => !!user);
}
