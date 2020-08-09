import { Resolver, FieldResolver, Root, Args, Authorized, Ctx } from "type-graphql";

import { Product } from "@api/entity/Product";
import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";
import {
  PaginatedFavoriteResponse,
  PaginatedPurchaseResponse,
} from "@api/modules/shared/types/PaginatedResponse";
import { FavoriteService } from "@api/modules/favorite/favorite/Favorite.service";
import { Roles } from "@api/modules/utils/auth";
import { PurchaseService } from "@api/modules/purchase/purchase/Purchase.service";
import { Author } from "@api/entity/Author";
import { RequestContext } from "@api/modules/shared/types/RequestContext";
import { Publisher } from "@api/entity/Publisher";
import { Category } from "@api/entity/Category";
import { Collection } from "@api/entity/Collection";

@Resolver(() => Product)
export class ProductEntityResolver {
  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly purchaseService: PurchaseService
  ) {}

  @FieldResolver(() => Author)
  author(@Root() { author }: Product, @Ctx() { loaders }: RequestContext): Promise<Author> {
    return loaders.authorLoader.load(author as any);
  }

  @FieldResolver(() => Publisher)
  publisher(@Root() { publisher }: Product, @Ctx() { loaders }: RequestContext): Promise<Publisher> {
    return loaders.publisherLoader.load(publisher as any);
  }

  @FieldResolver(() => [Category])
  async categories(@Root() { categories }: Product, @Ctx() { loaders }: RequestContext): Promise<Category[]> {
    const items = await loaders.categoriesLoader.loadMany(categories as any);
    return items.reduce((cats, item) => (item instanceof Error ? cats : [...cats, item]), [] as Category[]);
  }

  @FieldResolver(() => [Collection])
  async collections(
    @Root() { collections }: Product,
    @Ctx() { loaders }: RequestContext
  ): Promise<Collection[]> {
    const items = await loaders.collectionsLoader.loadMany(collections as any);
    return items.reduce((cats, item) => (item instanceof Error ? cats : [...cats, item]), [] as Collection[]);
  }

  @Authorized(Roles.Admin)
  @FieldResolver(() => PaginatedFavoriteResponse)
  favorites(
    @Root() product: Product,
    @Args() { skip, take }: PagniationArgs
  ): Promise<PaginatedFavoriteResponse> {
    return this.favoriteService.findAll({ skip, take, where: { product } });
  }

  @Authorized(Roles.Admin)
  @FieldResolver(() => PaginatedPurchaseResponse)
  purchases(
    @Root() product: Product,
    @Args() { skip, take }: PagniationArgs
  ): Promise<PaginatedPurchaseResponse> {
    return this.purchaseService.findAll({ skip, take, where: { product } });
  }
}
