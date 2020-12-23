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
import * as fs from "fs";
import path from "path";

beforeAll(async () => {
  await useSeeding();
});

const createProductMutation = `
mutation CreateProduct($data: CreateProductInput!, $imageFile: Upload!) {
  createProduct(data: $data, imageFile: $imageFile) {
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
      pages: 100,
      price: 1000,
      status: ProductStatus.Available,
      publishedAt: new Date(),
      author: { id: author!.id },
      publisher: { id: publisher!.id },
      categories: [{ id: category!.id }],
      collections: [{ id: collection!.id }],
    };

    const imageFileName = "test_image.jpg";
    const imageFile = fs.createReadStream(
      path.resolve(__dirname, "../../../test-utils/data/", imageFileName)
    );

    const response = await gCall({
      source: createProductMutation,
      variableValues: {
        data,
        imageFile: new Promise((resolve) => {
          resolve({
            createReadStream: () => imageFile,
            stream: imageFile,
            filename: imageFileName,
            mimetype: "image/jpg",
          });
        }),
      },
      contextValue: mockRequestContext({ req: createMockRequest(admin) }),
    });

    expect(response).toMatchObject({
      data: {
        createProduct: {
          name: data.name,
          overview: data.overview,
          pages: data.pages,
          status: data.status,
          publishedAt: data.publishedAt.toISOString(),
          author: transform(author!),
          publisher: transform(publisher!),
          categories: [transform(category!)],
          collections: [transform(collection!)],
        },
      },
    });

    expect(response.data?.createProduct.image).toContain(imageFileName.replace("_", "-"));
  });
});
