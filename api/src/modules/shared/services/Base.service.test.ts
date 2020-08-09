// Since all services are based on BaseService and the resolvers don't have any logic on them.
// I only have to test BaseService and the custom methods on these services and resolvers if they exist.

// import { BaseService } from "@api/modules/shared/services/Base.service";
// import { Product } from "@api/entity/Product";

// I'm using the Product entity to test the service but it should work with any entity.
// class ProductService extends BaseService<Product> {

// }

describe("BaseService", () => {
  it("test", () => {
    expect(true).toBeTruthy();
  });
});
