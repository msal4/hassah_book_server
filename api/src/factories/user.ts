import { define } from "typeorm-seeding";

import { User } from "@api/entity/User";

define(User, (faker) => {
  const user = new User();
  user.name = faker.name.findName();
  user.phone = faker.phone.phoneNumber("077########");
  user.confirmed = faker.random.boolean();
  user.address = faker.address.streetAddress(true);
  user.password = faker.lorem.sentence();
  return user;
});
