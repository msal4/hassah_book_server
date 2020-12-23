import { registerDecorator, ValidationArguments } from "class-validator";

import { Admin } from "@api/entity/Admin";

export function isAdminEmailNotUsed(email: string): Promise<boolean> {
  return Admin.findOne({ where: { email } }).then((admin) => !admin);
}

export function IsAdminEmailNotUsed() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isAdminEmailNotUsed",
      target: object.constructor,
      propertyName,
      validator: {
        async validate(value: any, _args: ValidationArguments) {
          return isAdminEmailNotUsed(value);
        },
        defaultMessage: () => "email already exist",
      },
    });
  };
}
