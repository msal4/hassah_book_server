import fs from "fs";
import path from "path";
import faker from "faker";
import { useSeeding, factory } from "typeorm-seeding";

import { gCall } from "@api/test-utils/gCall";
import { Category } from "@api/entity/Category";
import { Collection } from "@api/entity/Collection";
import { Author } from "@api/entity/Author";
import { Publisher } from "@api/entity/Publisher";
import { Product, ProductStatus } from "@api/entity/Product";
import { mockRequestContext } from "@api/test-utils/mockRequestContext";
import { Admin } from "@api/entity/Admin";
import { createMockRequest } from "@api/test-utils/createMockRequest";
import { Lazy } from "@api/modules/types/Lazy";

beforeAll(async () => {
  await useSeeding();
  jest.setTimeout(100000);
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

const updateProductMutation = `
mutation UpdateProduct($data: UpdateProductInput!, $imageFile: Upload!) {
  updateProduct(data: $data, imageFile: $imageFile)
}
`;

const deleteProductMutation = `
mutation deleteProduct($id: ID!) {
  deleteProduct(id: $id)
}
`;

const transform = (obj: Category | Collection | Author | Publisher) => {
  return { ...obj, createdAt: obj.createdAt.toISOString(), updatedAt: obj.updatedAt.toISOString() };
};

const getIdOnly = async <T extends { id: string }>(item: Lazy<T>) => ({ id: (await item).id });

const getIdsOnly = async <T extends { id: string }>(collection: Lazy<T[]>) =>
  (await collection).map((item) => ({ id: item.id }));

describe("Product", () => {
  const imageFileName = "test_image.jpg";
  const imageFile = fs.createReadStream(path.resolve(__dirname, "../../../test-utils/data/", imageFileName));
  const createDependencies = async () => {
    const admin = await factory(Admin)().create();
    const category = await factory(Category)().create();
    const collection = await factory(Collection)().create();
    const author = await factory(Author)().create();
    const publisher = await factory(Publisher)().create();
    return { admin, category, collection, author, publisher };
  };

  it("create product", async () => {
    const { admin, author, publisher, category, collection } = await createDependencies();

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

  it("update product", async () => {
    const { admin, author, category, collection } = await createDependencies();

    const product = await Product.create({
      name: "Whatever",
      price: 100.5,
      overview: "Whatever",
      pages: 100,
      status: ProductStatus.Available,
      image: "http://example.com/example.png",
      categories: [category],
      collections: [collection],
      author,
    }).save();

    // @ts-ignore
    delete product.image;
    // @ts-ignore
    delete product.createdAt;
    // @ts-ignore
    delete product.updatedAt;

    product.categories = (await getIdsOnly(product.categories)) as any;
    product.collections = (await getIdsOnly(product.collections)) as any;
    product.author = (await getIdOnly(product.author)) as any;

    const response = await gCall({
      source: updateProductMutation,
      variableValues: {
        data: { ...product, name: "hmmmm" },
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
        updateProduct: true,
      },
    });
  });

  it("delete product", async () => {
    const { admin, author, category, collection } = await createDependencies();

    const product = await Product.create({
      name: "Whatever",
      price: 100.5,
      overview: "Whatever",
      pages: 100,
      status: ProductStatus.Available,
      image: "http://example.com/example.png",
      categories: [category],
      collections: [collection],
      author,
    }).save();

    const response = await gCall({
      source: deleteProductMutation,
      variableValues: {
        id: product.id,
      },
      contextValue: mockRequestContext({ req: createMockRequest(admin) }),
    });

    expect(response).toMatchObject({
      data: {
        deleteProduct: true,
      },
    });
  });
});
