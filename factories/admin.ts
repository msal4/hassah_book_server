import { define } from "typeorm-seeding";

import { Admin } from "@api/entity/Admin";

define(Admin, (faker) => {
  const admin = new Admin();
  admin.name = faker.name.findName();
  admin.email = faker.internet.email();
  admin.password = faker.lorem.sentence();
  return admin;
});
