import { Resolver, FieldResolver, Root, Args, Authorized, Ctx } from "type-graphql";

import { Product } from "@api/entity/Product";
import { FilterArgs } from "@api/modules/types/FilterArgs";
import { PaginatedFavoriteResponse, PaginatedPurchaseResponse } from "@api/modules/types/PaginatedResponse";
import { FavoriteService } from "@api/modules/favorite/favorite/Favorite.service";
import { Roles } from "@api/modules/utils/auth";
import { PurchaseService } from "@api/modules/purchase/Purchase.service";
import { Author } from "@api/entity/Author";
import { RequestContext } from "@api/modules/types/RequestContext";
import { Publisher } from "@api/entity/Publisher";
import { Category } from "@api/entity/Category";
import { Collection } from "@api/entity/Collection";
import { PAGINATED_RESPONSE_COMPLEXITY } from "@api/modules/constants/query";

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

  @FieldResolver(() => Boolean, { complexity: ({ childComplexity }) => childComplexity + 1 })
  async isFavorite(@Root() { id }: Product, @Ctx() { payload }: RequestContext): Promise<boolean> {
    if (!payload?.userId) return false;

    const favorite = await this.favoriteService.findOne({
      where: { user: { id: payload?.userId }, product: { id } },
    });

    return !!favorite;
  }

  @FieldResolver(() => Publisher)
  publisher(@Root() { publisher }: Product, @Ctx() { loaders }: RequestContext): Promise<Publisher> {
    return loaders.publisherLoader.load(publisher as any);
  }

  @FieldResolver(() => [Category])
  async categories(@Root() { categories }: Product, @Ctx() { loaders }: RequestContext): Promise<Category[]> {
    const items = await loaders.categoryLoader.loadMany(categories as any);
    return items.reduce((cats, item) => (item instanceof Error ? cats : [...cats, item]), [] as Category[]);
  }

  @FieldResolver(() => [Collection])
  async collections(
    @Root() { collections }: Product,
    @Ctx() { loaders }: RequestContext
  ): Promise<Collection[]> {
    const items = await loaders.collectionLoader.loadMany(collections as any);
    return items.reduce((cats, item) => (item instanceof Error ? cats : [...cats, item]), [] as Collection[]);
  }

  @Authorized(Roles.Admin)
  @FieldResolver(() => PaginatedFavoriteResponse, { complexity: PAGINATED_RESPONSE_COMPLEXITY })
  favorites(@Root() product: Product, @Args() args: FilterArgs): Promise<PaginatedFavoriteResponse> {
    return this.favoriteService.findAll({ ...args, where: { product } });
  }

  @Authorized(Roles.Admin)
  @FieldResolver(() => PaginatedPurchaseResponse, { complexity: PAGINATED_RESPONSE_COMPLEXITY })
  purchases(@Root() product: Product, @Args() args: FilterArgs): Promise<PaginatedPurchaseResponse> {
    return this.purchaseService.findAll({ ...args, where: { product } });
  }
}
