import { define } from "typeorm-seeding";

import { UserRequest, UserRequestStatus } from "@api/entity/UserRequest";
import { UserRequestFactoryContext } from "@api/factories/types/FactoryContext";
import { enumToList } from "@api/factories/utils/enumToList";

define(UserRequest, (faker, context?: UserRequestFactoryContext) => {
  const userRequest = new UserRequest();
  userRequest.content = faker.lorem.paragraphs();
  userRequest.user = Promise.resolve(context!.user);
  userRequest.status = faker.random.arrayElement(enumToList(UserRequestStatus));
  return userRequest;
});
