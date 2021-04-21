import { define } from "typeorm-seeding";

import { Publisher } from "@api/entity/Publisher";

define(Publisher, (faker) => {
  const publisher = new Publisher();
  publisher.name = faker.name.findName();
  return publisher;
});
