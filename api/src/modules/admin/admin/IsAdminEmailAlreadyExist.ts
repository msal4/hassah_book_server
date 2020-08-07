import { registerDecorator, ValidationArguments } from "class-validator";

import { Admin } from "@api/entity/Admin";

export function isAdminEmailAlreadyExist(email: string): Promise<boolean> {
  return Admin.findOne({ where: { email } }).then((admin) => !!admin);
}

export function IsAdminEmailAlreadyExist() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isAdminEmailAlreadyExist",
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return isAdminEmailAlreadyExist(value);
        },
        defaultMessage: () => "email already exist",
      },
    });
  };
}
