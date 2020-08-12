import faker from "faker";
import { useSeeding, factory } from "typeorm-seeding";

import { gCall } from "@api/test-utils/gCall";
import { Category } from "@api/entity/Category";
import { Collection } from "@api/entity/Collection";
import { Author } from "@api/entity/Author";
import { Publisher } from "@api/entity/Publisher";
import { ProductStatus } from "@api/entity/Product";
import { mockRequestContext } from "@api/test-utils/mockRequestContext";
import { Admin } from "@api/entity/Admin";
import { createMockRequest } from "@api/test-utils/createMockRequest";

beforeAll(async () => {
  await useSeeding();
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
  it("create product", async () => {
    const admin = await factory(Admin)().create();
    const category = await factory(Category)().create();
    const collection = await factory(Collection)().create();
    const author = await factory(Author)().create();
    const publisher = await factory(Publisher)().create();

    const data = {
      name: faker.name.findName(),
      overview: faker.lorem.paragraph(),
      image: faker.image.city(),
      pages: 100,
      price: 1000,
      status: ProductStatus.Available,
      publishedAt: new Date(),
      author: { id: author!.id },
      publisher: { id: publisher!.id },
      categories: [{ id: category!.id }],
      collections: [{ id: collection!.id }],
    };

    const response = await gCall({
      source: createProductMutation,
      variableValues: { data },
      contextValue: mockRequestContext({ req: createMockRequest(admin) }),
    });

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
