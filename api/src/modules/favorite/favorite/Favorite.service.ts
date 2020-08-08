import { Service } from "typedi";

import { Favorite } from "@api/entity/Favorite";
import { BaseService } from "@api/modules/shared/services/Base.service";

interface FavoriteData {
  userId: string;
  productId: string;
}

interface RemoveFavoriteData {
  userId: string;
  productId?: string;
  favoriteId?: string;
}

@Service()
export class FavoriteService extends BaseService<Favorite> {
  async add({ userId, productId }: FavoriteData): Promise<boolean> {
    try {
      await this.create({ user: { id: userId }, product: { id: productId } });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async remove({ userId, productId, favoriteId }: RemoveFavoriteData): Promise<boolean> {
    if (!favoriteId && !productId) {
      return false;
    }

    try {
      const favorite = await this.repository.findOne({
        where: { user: { id: userId }, product: { id: productId } },
      });
      await this.delete(favorite!.id);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
