import { useSeeding, factory } from "typeorm-seeding";

import { Category } from "@api/entity/Category";
import { CategoryService } from "@api/modules/category/category/Category.service";
import { PaginatedCategoryResponse, PaginatedProductResponse } from "@api/modules/types/PaginatedResponse";
import { OrderType } from "@api/modules/types/FilterArgs";
import { BaseService } from "@api/modules/services/Base.service";
import { Product } from "@api/entity/Product";
import { Author } from "@api/entity/Author";

// Since all services are based on BaseService and the resolvers don't have any logic on them.
// I only have to test BaseService and the custom methods on these services and resolvers if they exist.

beforeAll(async () => {
  await useSeeding();
});

// I'm using the CategoryService to test BaseService but it should work with any entity.
describe("BaseService", () => {
  it("findManyToMany", async () => {
    const category = await factory(Category)().create();
    let products = await BaseService.findManyToMany(Product, {
      childId: category.id,
      relationName: "categories",
    });

    expect(products).toMatchObject({ items: [], total: 0, hasMore: false } as PaginatedProductResponse);
    const author = await Author.create({ name: "hi", image: "bye", overview: "lie" }).save();

    const createProducts = async (amount: number) => {
      const products = [];
      for (let i = 0; i < amount; i++) {
        const product = await Product.create({
          name: "dshflsd",
          image: "fa",
          overview: "ad",
          price: 100,
          author,
          categories: [category],
        }).save();

        products.push(product);
      }

      return products;
    };

    const categoryProducts = await createProducts(3);

    products = await BaseService.findManyToMany(Product, {
      childId: category.id,
      relationName: "categories",
    });

    expect({
      items: categoryProducts,
      hasMore: false,
      total: categoryProducts.length,
    } as PaginatedProductResponse).toMatchObject(products);
  });

  it("findAll", async () => {
    const service = new CategoryService();
    const categories = await factory(Category)().createMany(5);

    let paginatedCategories = await service.findAll({ skip: 0, take: 2 });
    expect(paginatedCategories).toMatchObject({
      items: categories.slice(0, 2),
      hasMore: true,
      total: 5,
    } as PaginatedCategoryResponse);

    paginatedCategories = await service.findAll({ skip: 0, take: 5 });
    expect(paginatedCategories).toMatchObject({
      items: categories,
      hasMore: false,
      total: 5,
    } as PaginatedCategoryResponse);

    paginatedCategories = await service.findAll({
      skip: 0,
      take: 5,
      order: [{ field: "name", order: OrderType.ASC }],
    });

    expect(paginatedCategories).toMatchObject({
      items: categories.sort((a, b) => (a.name < b.name ? -1 : a.name === b.name ? 0 : 1)),
      hasMore: false,
      total: 5,
    } as PaginatedCategoryResponse);
  });

  it("create", async () => {
    const service = new CategoryService();

    let cat = await Category.findOne({ where: { name: "TestCat" } });
    expect(cat).toBeUndefined();

    const category = await service.create({ name: "TestCat" });

    cat = await Category.findOne({ where: { name: "TestCat" } });

    expect(cat).toBeDefined();
    expect(cat).toMatchObject(category);
  });

  it("update", async () => {
    const service = new CategoryService();

    let category = await factory(Category)().create();
    expect(category).toBeDefined();

    const updated = await service.update({ id: category.id, name: "AnotherTestCat" });
    expect(updated).toBeTruthy();

    await category.reload();

    expect(category).toBeDefined();
    expect(category).toMatchObject({ name: "AnotherTestCat" });
  });

  it("delete", async () => {
    const service = new CategoryService();

    const category = await factory(Category)().create();
    expect(category).toBeDefined();

    const deleted = await service.delete(category.id);
    expect(deleted).toBeTruthy();

    const deletedCategory = await Category.findOne(category.id);
    expect(deletedCategory).toBeUndefined();
  });
});
