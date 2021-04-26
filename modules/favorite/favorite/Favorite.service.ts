import { Service } from "typedi";

import { Favorite } from "@api/entity/Favorite";
import { BaseService } from "@api/modules/services/Base.service";

interface FavoriteData {
  userId: string;
  productId: string;
}

interface RemoveFavoriteData {
  userId: string;
  productId?: string;
}

@Service()
export class FavoriteService extends BaseService<Favorite> {
  relations = ["user", "product"];

  async add({ userId, productId }: FavoriteData): Promise<boolean> {
    try {
      await this.create({ user: { id: userId }, product: { id: productId } });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async remove({ userId, productId }: RemoveFavoriteData): Promise<boolean> {
    if (!productId || userId) {
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
