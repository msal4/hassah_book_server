import { Resolver, FieldResolver, Root, Ctx } from "type-graphql";

import { Product } from "@api/entity/Product";
import { RequestContext } from "@api/modules/types/RequestContext";
import { Purchase } from "@api/entity/Purchase";

@Resolver(() => Purchase)
export class PurchaseEntityResolver {
  @FieldResolver(() => Product)
  product(@Root() { product }: Purchase, @Ctx() { loaders }: RequestContext): Promise<Product> {
    return loaders.productLoader.load(product as any);
  }
}
