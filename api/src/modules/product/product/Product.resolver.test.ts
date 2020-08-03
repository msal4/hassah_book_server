import faker from "faker";
import { Connection } from "typeorm";
import { useSeeding, runSeeder } from "typeorm-seeding";

import { gCall } from "@api/test-utils/gCall";
import { Category } from "@api/entity/Category";
import { Collection } from "@api/entity/Collection";
import { Author } from "@api/entity/Author";
import { Publisher } from "@api/entity/Publisher";
import { ProductStatus } from "@api/entity/Product";
import { ApiSeeder } from "@api/seeds/ApiSeeder";
import { testConn } from "@api/test-utils/testConn";

let conn: Connection;

beforeAll(async () => {
  conn = await testConn();
  await useSeeding();
  await runSeeder(ApiSeeder);
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
});

const createProductMutation = `
mutation CreateProduct($data: CreateProductInput!) {
  createProduct(data: $data) {
    id
    name
    overview
    pages
    image
    status
    publishedAt
    author {
      id
      name
      overview
      image
      createdAt
      updatedAt
    }
    publisher {
      id
      name
      createdAt
      updatedAt
    }
    categories {
      id
      name
      createdAt
      updatedAt
    }
    collections {
      id
      name
      image
      createdAt
      updatedAt
    }
  }
}
`;

const transform = (obj: Category | Collection | Author | Publisher) => {
  return { ...obj, createdAt: obj.createdAt.toISOString(), updatedAt: obj.updatedAt.toISOString() };
};

describe("Product", () => {
  it("create a product", async () => {
    const category = await Category.findOne();
    const collection = await Collection.findOne();
    const author = await Author.findOne();
    const publisher = await Publisher.findOne();

    const data = {
      name: faker.name.findName(),
      overview: faker.lorem.paragraph(),
      image: faker.image.city(),
      pages: 100,
      status: ProductStatus.Available,
      publishedAt: new Date(),
      author: { id: author!.id },
      publisher: { id: publisher!.id },
      categories: [{ id: category!.id }],
      collections: [{ id: collection!.id }],
    };

    const response = await gCall({ source: createProductMutation, variableValues: { data } });
    expect(response).toMatchObject({
      data: {
        createProduct: {
          name: data.name,
          overview: data.overview,
          pages: data.pages,
          image: data.image,
          status: data.status,
          publishedAt: data.publishedAt.toISOString(),
          author: transform(author!),
          publisher: transform(publisher!),
          categories: [transform(category!)],
          collections: [transform(collection!)],
        },
      },
    });
  });
});
