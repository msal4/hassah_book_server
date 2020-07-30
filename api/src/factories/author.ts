import { define } from "typeorm-seeding";

import { Author } from "@api/entity/Author";

define(Author, faker => {
  const author = new Author();
  author.name = faker.name.findName();
  author.image = faker.image.avatar();
  author.overview = faker.lorem.paragraph();
  return author;
});
